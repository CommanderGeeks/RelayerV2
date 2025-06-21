"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
const config_1 = require("../../config");
const solana_1 = require("../../config/solana");
const types_1 = require("../../database/types");
const wrapper_1 = require("../../database/wrapper");
const helpers_1 = require("../../helpers");
const solana_2 = require("../../helpers/solana");
const solana_3 = require("../../web3/solana");
const utils_1 = require("../../helpers/utils");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const validateSolDeposits = async (chainId) => {
    try {
        const txs = await (0, wrapper_1.findTxs)({
            to_chain_id: chainId,
            state: types_1.EState.validating,
        });
        if (txs.length === 0)
            return;
        for (let index = 0; index < txs.length; index++) {
            const tx = txs[index];
            const fromnChain = (0, helpers_1.getChain)(tx.from_chain_id);
            if (!fromnChain)
                continue;
            if (!fromnChain.isActive)
                continue;
            try {
                const txHashExists = await solana_3.program.account.config.fetch(solana_1.CONFIG_ACCOUNT)
                    .then((config) => config.txHashes.includes(tx.bridge_data_hash))
                    .catch(() => false);
                if (txHashExists) {
                    await (0, wrapper_1.updateTx)(tx.input_hash, {
                        state: types_1.EState.released,
                    });
                    continue;
                }
                if (tx.output_token === config_1.dummyToken.address) {
                    continue;
                }
                const mintAddress = new web3_js_1.PublicKey(tx.output_token);
                // check balance/mintable 
                const vaultBalance = await (0, solana_2.getTokenAccountBalance)((await (0, solana_2.vaultTokenAccount)(mintAddress)).address);
                const tokenData = await solana_3.program.account.config.fetch(solana_1.CONFIG_ACCOUNT)
                    .then(config => config.tokens.find(t => t.mint.toString() === tx.output_token))
                    .catch(() => null);
                if (!tokenData) {
                    console.warn(`⚠️ Token data not found for ${tx.output_token}`);
                    continue;
                }
                const isMintable = !tokenData.isOriginChain;
                const txAmountOut = new bignumber_js_1.default(tx.amountOut).div(10 ** config_1.PADDED_DECIMALS).times(10 ** tx.output_token_decimals);
                if (new bignumber_js_1.default(vaultBalance).lt(txAmountOut) && !isMintable) {
                    console.log(`⏳ Insufficient funds for Tx ${tx.input_hash}.`);
                    continue;
                }
                console.log(`✅ Valid Tx: ${tx.input_hash}, moving to processing.`);
                await (0, wrapper_1.updateTx)(tx.input_hash, {
                    state: types_1.EState.processing,
                });
            }
            catch (error) {
                (0, utils_1.logError)(`Validating Sol ${error.toString()}`);
            }
        }
    }
    catch (error) {
        (0, utils_1.logError)(error);
    }
};
exports.default = validateSolDeposits;
