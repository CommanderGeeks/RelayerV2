"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactions = void 0;
const solana_1 = require("../../config/solana");
const solana_2 = require("../../web3/solana");
// Get recent transactions for the program
async function getTransactions() {
    const signatures = await solana_2.connection.getSignaturesForAddress(solana_1.PROGRAM_ID, { limit: 1000, minContextSlot: 0 });
    for (const sig of signatures) {
        const tx = await solana_2.connection.getTransaction(sig.signature, {
            commitment: "confirmed",
            maxSupportedTransactionVersion: 0,
        });
        console.log('Transaction:', tx);
    }
}
exports.getTransactions = getTransactions;
