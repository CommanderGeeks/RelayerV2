"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../database/types");
const wrapper_1 = require("../database/wrapper");
const helpers_1 = require("../helpers");
const utils_1 = require("../helpers/utils");
const provider_1 = require("../web3/provider");
const contract_1 = require("../web3/contract");
const config_1 = require("../config");
const solana_1 = require("../config/solana");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const validateDeposits = async (chainId) => {
    try {
        const toChain = (0, helpers_1.getChain)(chainId);
        if (!toChain)
            return;
        if (!toChain.isActive)
            return;
        const portalContract = (0, contract_1.getPortalContract)((0, provider_1.web3ByChain)(toChain), toChain.portalAddress);
        const txs = await (0, wrapper_1.findTxs)({
            to_chain_id: chainId,
            state: types_1.EState.validating,
        });
        for (let index = 0; index < txs.length; index++) {
            const tx = txs[index];
            const inputBlockNumber = tx.input_block_number;
            const fromChain = (0, helpers_1.getChain)(tx.from_chain_id);
            if (!fromChain)
                continue;
            if (!fromChain.isActive)
                continue;
            if (fromChain.chainId !== solana_1.SOLANA_CHAIN_ID) {
                const web3 = (0, provider_1.web3ByChain)(fromChain);
                const latestBlock = await web3.eth.getBlockNumber();
                if (latestBlock - inputBlockNumber < fromChain.requiredBlocks)
                    continue;
            }
            try {
                const onChainHash = await portalContract.methods
                    .getTxHash(tx.bridge_data_hash)
                    .call();
                if (onChainHash) {
                    await (0, wrapper_1.updateTx)(tx.input_hash, {
                        state: types_1.EState.released,
                    });
                    continue;
                }
                if (tx.output_token === config_1.dummyToken.address) {
                    continue;
                }
                // check balance/mintable
                const tokenContract = (0, contract_1.getTokenContract)((0, provider_1.web3ByChain)(toChain), tx.output_token);
                const balance = await tokenContract.methods
                    .balanceOf(toChain.portalAddress)
                    .call();
                const tokenData = await portalContract.methods
                    .getTokenData(tx.output_token)
                    .call();
                const mintable = !tokenData?.isOriginChain;
                const txAmountOut = new bignumber_js_1.default(tx.amountOut).div(10 ** config_1.PADDED_DECIMALS).times(10 ** tx.output_token_decimals);
                if (new bignumber_js_1.default(balance).lt(txAmountOut) && !mintable)
                    continue;
                await (0, wrapper_1.updateTx)(tx.input_hash, {
                    state: types_1.EState.processing,
                });
            }
            catch (error) {
                (0, utils_1.logError)(`Validating ${error.toString()}`);
            }
        }
    }
    catch (error) {
        (0, utils_1.logError)(error);
    }
};
exports.default = validateDeposits;
