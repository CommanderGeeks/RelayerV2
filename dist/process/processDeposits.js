"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const config_1 = require("../config");
const types_1 = require("../database/types");
const wrapper_1 = require("../database/wrapper");
const helpers_1 = require("../helpers");
const address_1 = require("../helpers/address");
const decodeData_1 = require("../helpers/decodeData");
const hashing_1 = require("../helpers/hashing");
const utils_1 = require("../helpers/utils");
const contract_1 = require("../web3/contract");
const provider_1 = require("../web3/provider");
const chunkBlock_1 = require("../helpers/chunkBlock");
const processDeposits = async (chainId) => {
    let lastBlock, toBlock, targetBlock, latestBlock = 0;
    const chain = (0, helpers_1.getChain)(chainId);
    try {
        const worker = await (0, wrapper_1.getWorker)(chainId);
        if (worker)
            return;
        await (0, wrapper_1.updateWorker)(chainId, true);
        if (!chain?.isActive) {
            await (0, wrapper_1.updateWorker)(chainId, false);
            return;
        }
        const web3 = (0, provider_1.web3ByChain)(chain);
        latestBlock = await web3.eth.getBlockNumber();
        lastBlock = await (0, wrapper_1.getLastBlock)(Number(chainId));
        if (!lastBlock || lastBlock === null) {
            lastBlock = chain.startBlock;
            await (0, wrapper_1.createOrUpdateGlobal)(Number(chainId), lastBlock);
        }
        const chainIsSync = latestBlock - lastBlock <= 5;
        if (chainIsSync) {
            // console.log("Synced--------", chainId);
            await (0, wrapper_1.updateWorker)(chainId, false);
            return;
        }
        const chunkSize = (0, chunkBlock_1.chunkBlocks)(latestBlock, lastBlock, chain.rpcBlockLimit);
        targetBlock = lastBlock + chunkSize;
        toBlock = Math.min(targetBlock, latestBlock);
        console.log(`CHAIN ID: ${chainId}`);
        console.log(`Last Block: ${toBlock}`);
        const contract = (0, contract_1.getPortalContract)(web3, chain.portalAddress);
        const options = {
            fromBlock: lastBlock,
            toBlock,
            topics: [config_1.DEPOSIT_KECCAK],
        };
        // validate input data
        if (!lastBlock || !toBlock || !config_1.DEPOSIT_KECCAK) {
            throw new Error("Invalid input parameters");
        }
        const events = await contract.getPastEvents("Deposit", options);
        console.log(`Found ${events.length} event(s)`);
        try {
            for (let index = 0; index < events.length; index++) {
                const event = events[index];
                // check for duplicate transaction hash
                if (await (0, wrapper_1.getTxByHash)(event.transactionHash))
                    continue;
                // validate event before moving forward
                if ((0, address_1.Address)(event.address) !== (0, address_1.Address)(chain.portalAddress))
                    continue;
                if (event.event != "Deposit")
                    continue;
                if (event.signature != config_1.DEPOSIT_KECCAK)
                    continue;
                const data = await (0, decodeData_1.decodeBridgeData)(event, web3);
                const hash = (0, hashing_1.hashBridgeData)(data);
                const sender = data.sender;
                const receiver = data.receiver;
                const fromChainId = chainId;
                const toChainId = data.toChainId;
                const inputToken = (0, helpers_1.getToken)(data.inputTokenAddress, fromChainId) || config_1.dummyToken;
                const outputToken = (0, helpers_1.getTokenByKey)(inputToken.key, toChainId) || config_1.dummyToken;
                console.log(data, hash);
                if (outputToken.address === config_1.dummyToken.address)
                    throw new Error("Can't find matching token");
                if (inputToken.decimals !== outputToken.decimals)
                    if (!inputToken?.diffDecimals && !outputToken?.diffDecimals)
                        throw new Error("Decimials mismatch");
                const amount = new bignumber_js_1.default(data.amount).plus(data.fee);
                const amountIn = amount.div(10 ** inputToken.decimals);
                const amountOut = new bignumber_js_1.default(data.amount)
                    .div(10 ** inputToken.decimals).times(config_1.PADDED_DECIMALS)
                    .toNumber();
                const fee = new bignumber_js_1.default(data.fee)
                    .div(10 ** inputToken.decimals).times(config_1.PADDED_DECIMALS)
                    .toNumber();
                const txData = {
                    bridge_data_hash: hash,
                    sender,
                    receiver,
                    amountIn: amountIn.times(config_1.PADDED_DECIMALS).toNumber(),
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
                    state: types_1.EState.validating,
                };
                console.log(txData);
                await (0, wrapper_1.saveTx)(txData);
            }
        }
        catch (error) {
            let err = `- Chain: ${chain?.name} 
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
            (0, utils_1.logError)(`Process deposit ${err}`);
        }
        finally {
            await (0, wrapper_1.createOrUpdateGlobal)(Number(chainId), toBlock);
            await (0, wrapper_1.updateWorker)(chainId, false);
        }
    }
    catch (error) {
        let err = `- Chain: ${chain?.name} 
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
        (0, utils_1.logError)(err);
    }
    finally {
        await (0, wrapper_1.updateWorker)(chainId, false);
    }
};
exports.default = processDeposits;
