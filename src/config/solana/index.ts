import { Keypair, PublicKey } from "@solana/web3.js";
import fs from "fs";
import * as dotenv from "dotenv";
dotenv.config();

export const SOLANA_CHAIN_ID = 20001

// Load environment variables
export const RPC_URL = process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com";
export const KEYPAIR_PATH = process.env.KEYPAIR_PATH || "./wallet/id.json";

// Load wallet keypair
export const walletKeypair = Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(fs.readFileSync(KEYPAIR_PATH, "utf-8")))
);

export const PROGRAM_ID = new PublicKey(process.env.PROGRAM_ID);
export const CONFIG_ACCOUNT = new PublicKey(process.env.CONFIG_ACCOUNT);
export const FEE_RECEIVER = new PublicKey("C6DuM7pcwodHEwp3T3w4NTJ6NNbXDaLyhuRh3zAWecy1");


