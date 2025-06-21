"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const types_1 = require("../database/types");
const wrapper_1 = require("../database/wrapper");
const helpers_1 = require("../helpers");
const notify_1 = __importDefault(require("../helpers/notify"));
const utils_1 = require("../helpers/utils");
const releaseTokens_1 = __importDefault(require("../web3/calls/releaseTokens"));
const contract_1 = require("../web3/contract");
const provider_1 = require("../web3/provider");
const config_1 = require("../config");
const processPayouts = async (chainId) => {
    try {
        const worker = await (0, wrapper_1.getWorker)(chainId);
        if (worker)
            return;
        await (0, wrapper_1.updateWorker)(chainId, true);
        const txs = await (0, wrapper_1.findTxs)({
            to_chain_id: chainId,
            state: types_1.EState.processing,
        });
        const toChain = (0, helpers_1.getChain)(chainId);
        if (!toChain)
            return;
        if (!toChain.isActive) {
            await (0, wrapper_1.updateWorker)(chainId, false);
            return;
        }
        for (let index = 0; index < txs.length; index++) {
            const tx = txs[index];
            const token = (0, helpers_1.getToken)(tx.output_token, toChain.chainId);
            if (!token)
                continue;
            const outPutDecimals = 10 ** tx.output_token_decimals;
            const amount = new bignumber_js_1.default(tx.amountOut).div(config_1.PADDED_DECIMALS);
            const data = {
                sender: tx.sender,
                receiver: tx.receiver,
                inputTokenAddress: tx.input_token,
                amount: amount.times(outPutDecimals).toNumber(),
                fee: tx.fee,
                toChainId: tx.to_chain_id,
                inputTxHash: tx.input_hash,
                inputBlockNumber: tx.input_block_number,
            };
            try {
                const portalContract = (0, contract_1.getPortalContract)((0, provider_1.web3ByChain)(toChain), toChain.portalAddress);
                const onChainHash = await portalContract.methods
                    .getTxHash(tx.bridge_data_hash)
                    .call();
                if (onChainHash) {
                    await (0, wrapper_1.updateTx)(tx.input_hash, {
                        state: types_1.EState.released,
                    });
                    continue;
                }
                const payoutTxHash = await (0, releaseTokens_1.default)(tx.from_chain_id, data, token, tx.bridge_data_hash);
                const newTx = await (0, wrapper_1.updateTx)(tx.input_hash, {
                    output_hash: payoutTxHash,
                    state: types_1.EState.released,
                });
                await (0, notify_1.default)(newTx);
            }
            catch (error) {
                // await updateTx(tx.input_hash, {
                //   state: EState.failed,
                // });
                (0, utils_1.logError)(`Processing payout ${error.toString()}`);
            }
            finally {
                await (0, wrapper_1.updateWorker)(chainId, false);
            }
        }
    }
    catch (error) {
        (0, utils_1.logError)(error);
    }
    finally {
        await (0, wrapper_1.updateWorker)(chainId, false);
    }
};
exports.default = processPayouts;
