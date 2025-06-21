"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notifyDev_1 = __importDefault(require("../bot/messages/notifyDev"));
const wrapper_1 = require("../database/wrapper");
const helpers_1 = require("../helpers");
const utils_1 = require("../helpers/utils");
const Notify = async (tx) => {
    const checkTx = await (0, wrapper_1.getTxByHash)(tx.input_hash);
    if (checkTx?.notified === true)
        return;
    const fromChain = (0, helpers_1.getChain)(tx.from_chain_id);
    const toChain = (0, helpers_1.getChain)(tx.to_chain_id);
    const inputToken = (0, helpers_1.getToken)(tx.input_token, fromChain.chainId);
    const outPutToken = (0, helpers_1.getToken)(tx.output_token, toChain.chainId);
    try {
        await (0, notifyDev_1.default)(tx, inputToken, fromChain, toChain);
        await (0, wrapper_1.updateTx)(tx.input_hash, {
            notified: true,
        });
    }
    catch (error) {
        (0, utils_1.logError)(error.toString());
    }
};
exports.default = Notify;
