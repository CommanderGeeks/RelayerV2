import BigNumber from "bignumber.js";
import { DEPOSIT_KECCAK, dummyToken, PADDED_DECIMALS } from "../config";
import { EState, ITxData } from "../database/types";
import {
  createOrUpdateGlobal,
  getLastBlock,
  getTxByHash,
  getWorker,
  saveTx,
  updateWorker,
} from "../database/wrapper";
import { getChain, getToken, getTokenByKey } from "../helpers";
import { Address } from "../helpers/address";
import { decodeBridgeData } from "../helpers/decodeData";
import { hashBridgeData } from "../helpers/hashing";
import { logError } from "../helpers/utils";
import { getPortalContract } from "../web3/contract";
import { web3ByChain } from "../web3/provider";
import { chunkBlocks } from "../helpers/chunkBlock";

const processDeposits = async (chainId: number) => {
  let lastBlock,
    toBlock,
    targetBlock,
    latestBlock = 0;
  const chain = getChain(chainId);

  try {
    const worker = await getWorker(chainId);
    if (worker) return;
    await updateWorker(chainId, true);

    if (!chain?.isActive) {
      await updateWorker(chainId, false);
      return;
    }

    const web3 = web3ByChain(chain);
    latestBlock = await web3.eth.getBlockNumber();

    lastBlock = await getLastBlock(Number(chainId));
    if (!lastBlock || lastBlock === null) {
      lastBlock = chain.startBlock;
      await createOrUpdateGlobal(Number(chainId), lastBlock);
    }

    const chainIsSync = latestBlock - lastBlock <= 5;
    if (chainIsSync) {
      // console.log("Synced--------", chainId);
      await updateWorker(chainId, false);
      return;
    }

    const chunkSize = chunkBlocks(latestBlock, lastBlock, chain.rpcBlockLimit);
    targetBlock = lastBlock + chunkSize;
    toBlock = Math.min(targetBlock, latestBlock);

    console.log(`CHAIN ID: ${chainId}`);
    console.log(`Last Block: ${toBlock}`);

    const contract = getPortalContract(web3, chain.portalAddress);
    const options = {
      fromBlock: lastBlock,
      toBlock,
      topics: [DEPOSIT_KECCAK],
    };

    // validate input data
    if (!lastBlock || !toBlock || !DEPOSIT_KECCAK) {
      throw new Error("Invalid input parameters");
    }

    const events = await contract.getPastEvents("Deposit", options);
    console.log(`Found ${events.length} event(s)`);

    try {
      for (let index = 0; index < events.length; index++) {
        const event = events[index];
        // check for duplicate transaction hash
        if (await getTxByHash(event.transactionHash)) continue;

        // validate event before moving forward
        if (Address(event.address) !== Address(chain.portalAddress)) continue;
        if (event.event != "Deposit") continue;
        if (event.signature != DEPOSIT_KECCAK) continue;

        const data = await decodeBridgeData(event, web3);
        const hash = hashBridgeData(data);
        const sender = data.sender;
        const receiver = data.receiver;
        const fromChainId = chainId;
        const toChainId = data.toChainId;
        const inputToken =
          getToken(data.inputTokenAddress, fromChainId) || dummyToken;
        const outputToken =
          getTokenByKey(inputToken.key, toChainId) || dummyToken;
        console.log(data, hash);

        if (outputToken.address === dummyToken.address)
          throw new Error("Can't find matching token");

        if (inputToken.decimals !== outputToken.decimals)
          if (!inputToken?.diffDecimals && !outputToken?.diffDecimals)
            throw new Error("Decimials mismatch");

        const amount = new BigNumber(data.amount).plus(data.fee);
        const amountIn = amount.div(10 ** inputToken.decimals)
        const amountOut = new BigNumber(data.amount)
          .div(10 ** inputToken.decimals).times(PADDED_DECIMALS)
          .toNumber();
        const fee = new BigNumber(data.fee)
          .div(10 ** inputToken.decimals).times(PADDED_DECIMALS)
          .toNumber();

        const txData: ITxData = {
          bridge_data_hash: hash,
          sender,
          receiver,
          amountIn: amountIn.times(PADDED_DECIMALS).toNumber(),
          amountOut,
          fee,
          input_token: inputToken.address,
          input_token_decimals: inputToken.decimals,
          output_token: outputToken.address,
          output_token_decimals: outputToken.decimals,
          from_chain_id: fromChainId,
          to_chain_id: toChainId,
          input_hash: data.inputTxHash,
          input_block_number: data.inputBlockNumber,
          state: EState.validating,
        };
        console.log(txData);

        await saveTx(txData);
      }
    } catch (error: any) {
      let err: string = `- Chain: ${chain?.name} 
      - rpc: ${chain?.rpc}
      `;

      if (lastBlock)
        err += `  
      - last block: ${lastBlock},`;
      if (toBlock)
        err += `  
      - target block: ${toBlock},`;
      if (latestBlock)
        err += `  
      - latest block: ${latestBlock}`;

      err += `
      ${error}`;
      logError(`Process deposit ${err}`);
    } finally {
      await createOrUpdateGlobal(Number(chainId), toBlock);
      await updateWorker(chainId, false);
    }
  } catch (error: any) {
    let err: string = `- Chain: ${chain?.name} 
- rpc: ${chain?.rpc}
`;

    if (lastBlock)
      err += `  
- last block: ${lastBlock},`;
    if (toBlock)
      err += `  
- target block: ${toBlock},`;
    if (latestBlock)
      err += `  
- latest block: ${latestBlock}`;

    err += `
${error}`;
    logError(err);
  } finally {
    await updateWorker(chainId, false);
  }
};

export default processDeposits;