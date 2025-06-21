"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatMoney = exports.getChainName = exports.getChain = exports.getTokenByKey = exports.getToken = void 0;
const chains_1 = __importDefault(require("../config/chains"));
const address_1 = require("./address");
const getToken = (address, chainId) => {
    const chain = (0, exports.getChain)(chainId);
    if (!chain)
        return undefined;
    return chain.tokens.find((t) => (0, address_1.Address)(address) === (0, address_1.Address)(t.address));
};
exports.getToken = getToken;
const getTokenByKey = (tokenKey, chainId) => {
    const chain = (0, exports.getChain)(chainId);
    if (!chain)
        return undefined;
    return chain.tokens.find((t) => t.key.toLowerCase() === tokenKey.toLowerCase());
};
exports.getTokenByKey = getTokenByKey;
const getChain = (chainId) => {
    return chains_1.default.find((c) => Number(chainId) === Number(c.chainId));
};
exports.getChain = getChain;
const getChainName = (chainId) => {
    return (0, exports.getChain)(chainId)?.name;
};
exports.getChainName = getChainName;
const formatMoney = (amount) => {
    return new Intl.NumberFormat("en-US").format(Number(amount));
};
exports.formatMoney = formatMoney;
