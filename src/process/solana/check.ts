import { PROGRAM_ID } from "../../config/solana";
import { connection } from "../../web3/solana";
// Get recent transactions for the program
export async function getTransactions() {
    const signatures = await connection.getSignaturesForAddress(PROGRAM_ID, { limit: 1000, minContextSlot: 0 });

    for (const sig of signatures) {
        const tx = await connection.getTransaction(sig.signature, {
            commitment: "confirmed",
            maxSupportedTransactionVersion: 0,
        });
        console.log('Transaction:', tx);
    }
}