import { EState } from "../database/types";
import { findTxs, updateTx } from "../database/wrapper";
import { getChain } from "../helpers";
import { logError } from "../helpers/utils";
import { web3ByChain } from "../web3/provider";
import { getPortalContract, getTokenContract } from "../web3/contract";
import { dummyToken, PADDED_DECIMALS } from "../config";
import { SOLANA_CHAIN_ID } from "../config/solana";
import BigNumber from "bignumber.js";

const validateDeposits = async (chainId: number) => {
  try {
    const toChain = getChain(chainId);
    if (!toChain) return;
    if (!toChain.isActive) return;

    const portalContract = getPortalContract(
      web3ByChain(toChain),
      toChain.portalAddress
    );

    const txs = await findTxs({
      to_chain_id: chainId,
      state: EState.validating,
    });

    for (let index = 0; index < txs.length; index++) {
      const tx = txs[index];
      const inputBlockNumber = tx.input_block_number;
      const fromChain = getChain(tx.from_chain_id);
      if (!fromChain) continue;
      if (!fromChain.isActive) continue;

      if (fromChain.chainId !== SOLANA_CHAIN_ID) {
        const web3 = web3ByChain(fromChain);
        const latestBlock = await web3.eth.getBlockNumber();
        if (latestBlock - inputBlockNumber < fromChain.requiredBlocks) continue;
      }

      try {
        const onChainHash = await portalContract.methods
          .getTxHash(tx.bridge_data_hash)
          .call();

        if (onChainHash) {
          await updateTx(tx.input_hash, {
            state: EState.released,
          });
          continue;
        }

        if (tx.output_token === dummyToken.address) {
          continue;
        }

        // check balance/mintable
        const tokenContract = getTokenContract(
          web3ByChain(toChain),
          tx.output_token
        );

        const balance = await tokenContract.methods
          .balanceOf(toChain.portalAddress)
          .call();
        const tokenData = await portalContract.methods
          .getTokenData(tx.output_token)
          .call();
        const mintable = !tokenData?.isOriginChain;
        const txAmountOut = new BigNumber(tx.amountOut).div(10 ** PADDED_DECIMALS).times(10 ** tx.output_token_decimals)
        if (new BigNumber(balance).lt(txAmountOut) && !mintable) continue;

        await updateTx(tx.input_hash, {
          state: EState.processing,
        });
      } catch (error: any) {
        logError(`Validating ${error.toString()}`);
      }
    }
  } catch (error: any) {
    logError(error);
  }
};

export default validateDeposits;