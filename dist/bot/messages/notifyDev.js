"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../helpers/utils");
const __1 = require("..");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const config_1 = require("../../config");
const notifyDev = async (tx, token, fromChain, toChain) => {
    try {
        const amountIn = new bignumber_js_1.default(tx.amountIn).div(config_1.PADDED_DECIMALS);
        const amountOut = new bignumber_js_1.default(tx.amountOut).div(config_1.PADDED_DECIMALS);
        const data = {
            // status: "Released",
            deposited: `${amountIn.toFixed()} ${token.symbol}`,
            received: `${amountOut.toFixed()} ${token.symbol}`,
            fromChainName: fromChain.name,
            toChainName: toChain.name,
            // message: "Transaction Completed",
            inputTx: `[Input Tx](${fromChain.explorer}/tx/${tx.input_hash})`,
            outputTx: `[Output Tx](${toChain.explorer}/tx/${tx?.output_hash})`,
        };
        await (0, __1.sendMessage)("bridge", data);
    }
    catch (error) {
        (0, utils_1.logError)(error);
    }
};
exports.default = notifyDev;
