"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeSolDepositTransaction = exports.decodeBridgeData = void 0;
const web3_js_1 = require("@solana/web3.js");
const solana_1 = require("../web3/solana");
const anchor_1 = require("@coral-xyz/anchor");
const decodeBridgeData = (event, web3) => {
    const rawData = event.raw.data;
    const data = web3.eth.abi.decodeParameters(["address", "string", "address", "uint256", "uint256", "uint256"], rawData);
    const sender = data[0];
    const receiver = data[1];
    const amount = data[3];
    const fee = data[4];
    const inputTxHash = event.transactionHash;
    const inputBlockNumber = event.blockNumber;
    const toChainId = data[5];
    const inputTokenAddress = data[2];
    const decodeData = {
        sender,
        receiver,
        inputTokenAddress,
        amount,
        fee,
        toChainId,
        inputTxHash,
        inputBlockNumber,
    };
    return decodeData;
};
exports.decodeBridgeData = decodeBridgeData;
const decodeSolDepositTransaction = (tx, hash, inputBlockNumber) => {
    if (!tx.meta || !tx.meta.logMessages)
        return null;
    const logMessages = tx.meta.logMessages;
    let sender = null;
    let receiver = null;
    let token = null;
    let toChainId = null;
    let amount = null;
    let fee = null;
    for (let log of logMessages) {
        if (log.startsWith("Program data:")) {
            console.log("📜 Found program data log:", log);
            // Extract base64 data from the log message
            const base64Data = log.split("Program data: ")[1].trim();
            try {
                // Deserialize using Anchor's BorshAccountsCoder
                const event = solana_1.program.coder.events.decode(base64Data);
                if (event && event.name === 'depositEvent') {
                    sender = event.data['sender'];
                    receiver = event.data['receiver'];
                    token = new web3_js_1.PublicKey(event.data['token']);
                    toChainId = new anchor_1.BN(event.data['destChainId']);
                    amount = new anchor_1.BN(event.data['amount']);
                    fee = new anchor_1.BN(event.data['fee']);
                    const decodeData = {
                        sender: sender.toString(),
                        receiver: receiver.toString(),
                        inputTokenAddress: token.toString(),
                        amount: Number(amount),
                        fee: Number(fee),
                        toChainId: Number(toChainId),
                        inputTxHash: hash,
                        inputBlockNumber,
                    };
                    return decodeData;
                }
            }
            catch (err) {
                console.error("❌ Failed to decode deposit event:", err);
            }
        }
    }
    return null;
};
exports.decodeSolDepositTransaction = decodeSolDepositTransaction;
