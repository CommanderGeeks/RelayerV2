"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const helpers_1 = require("../../helpers");
const contract_1 = require("../contract");
const provider_1 = require("../provider");
const index_1 = require("../../config/index");
const releaseTokens = async (fromChainId, bridgeData, token, hash) => {
    let receipt;
    const { amount, receiver, toChainId } = bridgeData;
    const toChain = (0, helpers_1.getChain)(toChainId);
    const web3 = (0, provider_1.web3ByChain)(toChain);
    const contract = (0, contract_1.getPortalContract)(web3, toChain.portalAddress);
    const trx = contract.methods.withdraw(receiver, new bignumber_js_1.default(amount), token.address, fromChainId, hash);
    const gas = await trx.estimateGas({ from: index_1.RELAYER_ADDRESS });
    console.log("gas :>> ", gas);
    const gasPrice = await web3.eth.getGasPrice();
    console.log("gasPrice :>> ", gasPrice);
    const data = trx.encodeABI();
    console.log("data :>> ", data);
    const nonce = await web3.eth.getTransactionCount(index_1.RELAYER_ADDRESS, "pending");
    console.log("nonce :>> ", nonce);
    const trxData = {
        from: index_1.RELAYER_ADDRESS,
        to: toChain.portalAddress,
        data,
        gas,
        gasPrice,
        nonce,
    };
    const signedTrx = await web3.eth.accounts.signTransaction(trxData, index_1.RELAYER_KEY);
    console.log("Transaction ready to be sent");
    receipt = await web3.eth.sendSignedTransaction(signedTrx.rawTransaction);
    console.log(`Transaction sent, hash is ${receipt.transactionHash}`);
    return receipt.transactionHash;
};
exports.default = releaseTokens;
