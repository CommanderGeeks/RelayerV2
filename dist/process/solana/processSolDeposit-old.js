"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processSolDeposit = void 0;
const bignumber_js_1 = require("bignumber.js");
const dotenv = __importStar(require("dotenv"));
const config_1 = require("../../config");
const solana_1 = require("../../web3/solana");
const wrapper_1 = require("../../database/wrapper");
const helpers_1 = require("../../helpers");
const types_1 = require("../../database/types");
const decodeData_1 = require("../../helpers/decodeData");
const hashing_1 = require("../../helpers/hashing");
const solana_2 = require("../../config/solana");
dotenv.config();
/**
 * Listen for new deposit transactions
 */
async function processSolDeposit() {
    console.log(`Listening for deposits on program: ${solana_2.PROGRAM_ID.toBase58()}`);
    solana_1.connection.onLogs(solana_2.PROGRAM_ID, async (logs, context) => {
        try {
            console.log("\n🔍 New transaction detected:", logs.signature);
            // Fetch transaction details
            const tx = await solana_1.connection.getTransaction(logs.signature, {
                commitment: "confirmed",
                maxSupportedTransactionVersion: 0,
            });
            if (!tx || !tx.meta) {
                console.log("⚠️ Transaction not found or not confirmed yet.");
                return;
            }
            if (await (0, wrapper_1.getTxByHash)(logs.signature))
                return;
            // Decode logs to extract deposit details // tx.blockTime, logs.signature
            const depositData = (0, decodeData_1.decodeSolDepositTransaction)(tx, logs.signature, tx.blockTime);
            if (depositData) {
                const hash = (0, hashing_1.hashBridgeData)(depositData);
                console.log("✅ Deposit detected:");
                const inputToken = (0, helpers_1.getToken)(depositData.inputTokenAddress, solana_2.SOLANA_CHAIN_ID) || config_1.dummyToken;
                const outputToken = (0, helpers_1.getTokenByKey)(inputToken.key, depositData.toChainId) || config_1.dummyToken;
                if (outputToken.address === config_1.dummyToken.address)
                    throw new Error("Can't find matching token");
                if (inputToken.decimals !== outputToken.decimals)
                    if (!inputToken?.diffDecimals && !outputToken?.diffDecimals)
                        throw new Error("Decimials mismatch");
                const amount = new bignumber_js_1.BigNumber(depositData.amount).plus(depositData.fee);
                const amountIn = amount.div(10 ** inputToken.decimals);
                const amountOut = new bignumber_js_1.BigNumber(depositData.amount)
                    .div(10 ** inputToken.decimals).times(config_1.PADDED_DECIMALS)
                    .toNumber();
                const fee = new bignumber_js_1.BigNumber(depositData.fee)
                    .div(10 ** inputToken.decimals).times(config_1.PADDED_DECIMALS)
                    .toNumber();
                const txData = {
                    bridge_data_hash: hash,
                    sender: depositData.sender,
                    receiver: depositData.receiver,
                    amountIn: amountIn.times(config_1.PADDED_DECIMALS).toNumber(),
                    amountOut,
                    fee,
                    input_token: inputToken.address,
                    input_token_decimals: inputToken.decimals,
                    output_token: outputToken.address,
                    output_token_decimals: outputToken.decimals,
                    from_chain_id: solana_2.SOLANA_CHAIN_ID,
                    to_chain_id: depositData.toChainId,
                    input_hash: depositData.inputTxHash,
                    input_block_number: depositData.inputBlockNumber,
                    state: types_1.EState.validating,
                };
                await (0, wrapper_1.saveTx)(txData);
            }
            else {
                console.log("❌ Failed to decode deposit transaction.");
            }
        }
        catch (error) {
            console.error("❌ Error processing transaction:", error);
        }
    }, "confirmed");
}
exports.processSolDeposit = processSolDeposit;
