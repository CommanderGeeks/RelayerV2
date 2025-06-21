"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../../config");
const releaseGas = async (nonce, receiver, gas, gasPrice, bridgeProvider) => {
    const balance = await bridgeProvider.eth.getBalance(receiver);
    if (Number(balance) > 0.01)
        return;
    const rawTransaction = {
        from: config_1.RELAYER_ADDRESS,
        nonce,
        gasPrice,
        gas,
        to: receiver,
        value: bridgeProvider.utils.toWei("0.01", "ether"),
        chainId: 10201,
    };
    const signedTx = await bridgeProvider.eth.accounts.signTransaction(rawTransaction, config_1.RELAYER_KEY);
    return bridgeProvider.eth.sendSignedTransaction(signedTx.rawTransaction);
};
exports.default = releaseGas;
