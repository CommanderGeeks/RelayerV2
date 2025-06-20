import { Keypair, PublicKey } from "@solana/web3.js";
import fs from "fs";
import * as dotenv from "dotenv";
dotenv.config();

export const SOLANA_CHAIN_ID = 20001

// Load environment variables
export const RPC_URL = process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com";
export const KEYPAIR_PATH = process.env.KEYPAIR_PATH || "./wallet/id.json";

// Load wallet keypair with multiple fallback options
export const walletKeypair = (() => {
    try {
        console.log("🔑 Loading wallet keypair...");
        
        // Option 1: Try JSON array from environment  
        if (process.env.SOLANA_PRIVATE_KEY_JSON) {
            console.log("📄 Using SOLANA_PRIVATE_KEY_JSON from environment");
            const privateKeyArray = JSON.parse(process.env.SOLANA_PRIVATE_KEY_JSON);
            return Keypair.fromSecretKey(Uint8Array.from(privateKeyArray));
        }
        
        // Option 2: Try base64 encoded keypair from environment
        if (process.env.SOLANA_PRIVATE_KEY_BASE64) {
            console.log("🔐 Using SOLANA_PRIVATE_KEY_BASE64 from environment");
            const privateKeyBytes = Buffer.from(process.env.SOLANA_PRIVATE_KEY_BASE64, 'base64');
            return Keypair.fromSecretKey(privateKeyBytes);
        }
        
        // Option 3: Try reading from file (fallback for local development)
        if (fs.existsSync(KEYPAIR_PATH)) {
            console.log(`📁 Using wallet file: ${KEYPAIR_PATH}`);
            return Keypair.fromSecretKey(
                Uint8Array.from(JSON.parse(fs.readFileSync(KEYPAIR_PATH, "utf-8")))
            );
        }
        
        throw new Error(`❌ No wallet found. Set SOLANA_PRIVATE_KEY_JSON, SOLANA_PRIVATE_KEY_BASE64, or ensure ${KEYPAIR_PATH} exists.`);
        
    } catch (error) {
        console.error("❌ Failed to load wallet:", error);
        throw error;
    }
})();

console.log(`✅ Wallet loaded successfully: ${walletKeypair.publicKey.toString()}`);

export const PROGRAM_ID = new PublicKey(process.env.PROGRAM_ID!);
export const CONFIG_ACCOUNT = new PublicKey(process.env.CONFIG_ACCOUNT!);
export const FEE_RECEIVER = new PublicKey("C6DuM7pcwodHEwp3T3w4NTJ6NNbXDaLyhuRh3zAWecy1");