"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
const anchor_1 = require("@coral-xyz/anchor");
const solana_1 = require("../config/solana");
const solana_2 = require("../web3/solana");
async function initializeProgram() {
    try {
        console.log("🚀 Initializing Solana program...");
        // Generate config account PDA
        const [configPDA] = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("config")], solana_1.PROGRAM_ID);
        // Define initialization parameters
        const feeReceiver = solana_1.FEE_RECEIVER; // Fee receiver address
        const defaultFee = new anchor_1.BN(50); // Default fee
        console.log(`🔑 Config Account: ${configPDA.toBase58()}`);
        // Call the initialize function
        const tx = await solana_2.program.methods
            .initialize(feeReceiver, defaultFee)
            .accounts({
            admin: solana_1.walletKeypair.publicKey
        })
            .signers([solana_1.walletKeypair])
            .rpc();
        console.log(`✅ Initialize transaction successful! Signature: ${tx}`);
    }
    catch (error) {
        console.error("❌ Error initializing program:", error);
    }
}
// Run the function
initializeProgram();
