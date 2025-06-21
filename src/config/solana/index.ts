import { Keypair, PublicKey } from "@solana/web3.js";
import fs from "fs";
import * as dotenv from "dotenv";
dotenv.config();

const { SOLANA_PRIVATE_KEY_JSON } = process.env;

export const SOLANA_CHAIN_ID = 20001

// Load environment variables
export const RPC_URL = process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com";

// Load wallet keypair with multiple fallback options
export const walletKeypair = (() => {
    try {
        console.log("🔑 Loading wallet keypair...");
        
        if (SOLANA_PRIVATE_KEY_JSON) {
            console.log("📄 Using SOLANA_PRIVATE_KEY_JSON");
            const arr = JSON.parse(SOLANA_PRIVATE_KEY_JSON);
            return Keypair.fromSecretKey(Uint8Array.from(arr));
            }
        
        throw new Error(`❌ No wallet found. Set SOLANA_PRIVATE_KEY_JSON, SOLANA_PRIVATE_KEY_BASE64, or ensure ${ SOLANA_PRIVATE_KEY_JSON } = process.env;
} exists.`);
        
    } catch (error) {
        console.error("❌ Failed to load wallet:", error);
        throw error;
    }
})();

console.log(`✅ Wallet loaded successfully: ${walletKeypair.publicKey.toString()}`);

export const PROGRAM_ID = new PublicKey(process.env.PROGRAM_ID!);
export const CONFIG_ACCOUNT = new PublicKey(process.env.CONFIG_ACCOUNT!);
export const FEE_RECEIVER = new PublicKey("C6DuM7pcwodHEwp3T3w4NTJ6NNbXDaLyhuRh3zAWecy1");