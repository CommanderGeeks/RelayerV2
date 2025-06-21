"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const anchor_1 = require("@coral-xyz/anchor");
const solana_1 = require("../config/solana");
const solana_2 = require("../web3/solana");
const chains_1 = __importDefault(require("../config/chains"));
async function addChain() {
    console.log("🚀 Adding chain to Solana program...");
    console.log(`🔑 Config Account: ${solana_1.CONFIG_ACCOUNT.toBase58()}`);
    for (let index = 0; index < chains_1.default.length; index++) {
        try {
            const chain = chains_1.default[index];
            if (chain.chainId === 2001)
                continue;
            // Call the initialize function
            const tx = await solana_2.program.methods
                .addChain(new anchor_1.BN(chain.chainId))
                .accounts({
                config: solana_1.CONFIG_ACCOUNT,
                authority: solana_1.walletKeypair.publicKey,
            })
                .signers([solana_1.walletKeypair])
                .rpc();
            console.log(`✅ Add chain ${chain.name}: ${chain.chainId} transaction successful! Signature: ${tx}`);
        }
        catch (error) {
            console.error("❌ Error adding chain:", error);
        }
    }
}
// Run the function
addChain();
