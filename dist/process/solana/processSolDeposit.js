"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const wrapper_1 = require("../../database/wrapper");
const utils_1 = require("../../helpers/utils");
const decodeData_1 = require("../../helpers/decodeData");
const config_1 = require("../../config");
const hashing_1 = require("../../helpers/hashing");
const helpers_1 = require("../../helpers");
const solana_1 = require("../../web3/solana");
const solana_2 = require("../../config/solana");
const types_1 = require("../../database/types");
const processSolDeposit = async (chainId) => {
    let lastSlot, targetSlot, latestSlot = 0;
    let toSlot = 0;
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
        latestSlot = await solana_1.connection.getSlot();
        lastSlot = await (0, wrapper_1.getLastBlock)(Number(chainId));
        if (!lastSlot || lastSlot === null) {
            lastSlot = chain.startBlock;
            await (0, wrapper_1.createOrUpdateGlobal)(Number(chainId), lastSlot);
        }
        console.log(`Last Slot: ${lastSlot}`);
        console.log(`Latest Slot: ${latestSlot}`);
        const isSynced = latestSlot - lastSlot <= 5;
        if (isSynced) {
            console.log("Synced--------", chainId);
            await (0, wrapper_1.updateWorker)(chainId, false);
            return;
        }
        const chunkSize = 1000;
        targetSlot = lastSlot + chunkSize;
        toSlot = Math.min(targetSlot, latestSlot);
        console.log(`CHAIN ID: ${chainId}`);
        console.log(`Processing from Slot: ${lastSlot} to Slot: ${toSlot}`);
        const signatures = await solana_1.connection.getSignaturesForAddress(solana_2.PROGRAM_ID, {
            limit: toSlot - lastSlot,
            minContextSlot: lastSlot
        });
        for (const sig of signatures) {
            const tx = await solana_1.connection.getTransaction(sig.signature, {
                commitment: "confirmed",
                maxSupportedTransactionVersion: 0,
            });
            if (!tx)
                continue;
            const txHash = tx.transaction.signatures[0];
            const slot = tx.slot;
            // Check for duplicate transaction hash
            if (await (0, wrapper_1.getTxByHash)(txHash))
                continue;
            // Decode logs to extract deposit details // tx.blockTime, logs.signature
            const data = (0, decodeData_1.decodeSolDepositTransaction)(tx, txHash, slot);
            if (!data)
                continue;
            console.log("✅ Deposit detected:", txHash);
            const hash = (0, hashing_1.hashBridgeData)(data);
            const sender = data.sender;
            const receiver = data.receiver;
            const toChainId = data.toChainId;
            const inputToken = (0, helpers_1.getToken)(data.inputTokenAddress, chainId) || config_1.dummyToken;
            const outputToken = (0, helpers_1.getTokenByKey)(inputToken.key, toChainId) || config_1.dummyToken;
            console.log(data, hash);
            if (outputToken.address === config_1.dummyToken.address)
                throw new Error("Can't find matching token");
            const amount = new bignumber_js_1.default(data.amount).plus(data.fee);
            const amountIn = amount.div(10 ** inputToken.decimals);
            const amountOut = new bignumber_js_1.default(data.amount)
                .div(10 ** inputToken.decimals)
                .times(config_1.PADDED_DECIMALS)
                .toNumber();
            const fee = new bignumber_js_1.default(data.fee)
                .div(10 ** inputToken.decimals)
                .times(config_1.PADDED_DECIMALS)
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
                from_chain_id: solana_2.SOLANA_CHAIN_ID,
                to_chain_id: data.toChainId,
                input_hash: data.inputTxHash,
                input_block_number: data.inputBlockNumber,
                state: types_1.EState.validating,
            };
            await (0, wrapper_1.saveTx)(txData);
        }
    }
    catch (error) {
        let err = `- Chain ID: ${chainId}\n`;
        if (lastSlot)
            err += `- Last Slot: ${lastSlot}\n`;
        if (toSlot)
            err += `- Target Slot: ${toSlot}\n`;
        if (latestSlot)
            err += `- Latest Slot: ${latestSlot}\n`;
        err += `\n${error}`;
        (0, utils_1.logError)(err);
    }
    finally {
        await (0, wrapper_1.createOrUpdateGlobal)(Number(chainId), toSlot);
        await (0, wrapper_1.updateWorker)(chainId, false);
    }
};
exports.default = processSolDeposit;
