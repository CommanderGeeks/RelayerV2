"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
async function generateWallet() {
    try {
        const wallet = new web3_js_1.Keypair();
        console.log(wallet.publicKey.toString());
        console.log(wallet.secretKey);
    }
    catch (error) {
        console.error("❌ Error generating:", error);
    }
}
// Run the function
generateWallet();
