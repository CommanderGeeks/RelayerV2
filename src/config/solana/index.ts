import { Keypair, PublicKey } from "@solana/web3.js";
import fs from "fs";
import * as dotenv from "dotenv";
dotenv.config();

const { SOLANA_PRIVATE_KEY_JSON } = process.env;

export const SOLANA_CHAIN_ID = 20001;

// Load environment variables
export const RPC_URL = process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com";

// Load wallet keypair
export const walletKeypair = (() => {
    try {
        console.log("🔑 Loading wallet keypair...");
        
        if (!SOLANA_PRIVATE_KEY_JSON) {
            throw new Error("❌ SOLANA_PRIVATE_KEY_JSON environment variable not found");
        }
        
        // Parse the JSON string array from environment variable
        const privateKeyArray = JSON.parse(SOLANA_PRIVATE_KEY_JSON);
        const keypair = Keypair.fromSecretKey(Uint8Array.from(privateKeyArray));
        
        console.log(`✅ Wallet loaded successfully: ${keypair.publicKey.toString()}`);
        return keypair;
        
    } catch (error) {
        console.error("❌ Failed to load wallet:", error);
        throw error;
    }
})();

export const PROGRAM_ID = new PublicKey(process.env.PROGRAM_ID!);
export const CONFIG_ACCOUNT = new PublicKey(process.env.CONFIG_ACCOUNT!);
export const FEE_RECEIVER = new PublicKey("C6DuM7pcwodHEwp3T3w4NTJ6NNbXDaLyhuRh3zAWecy1");