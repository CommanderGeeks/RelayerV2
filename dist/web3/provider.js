"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.web3ByChain = exports.web3ByChainId = void 0;
const web3_1 = __importDefault(require("web3"));
const chains_1 = __importDefault(require("../config/chains"));
const web3ByChainId = (chainId) => {
    const chain = chains_1.default.find((chain) => Number(chain.chainId) === Number(chainId));
    if (chain === undefined)
        throw new Error(`Chain with id:${chainId} not found!!!`);
    return new web3_1.default(chain.rpc);
};
exports.web3ByChainId = web3ByChainId;
const web3ByChain = (chain) => {
    return new web3_1.default(chain.rpc);
};
exports.web3ByChain = web3ByChain;
