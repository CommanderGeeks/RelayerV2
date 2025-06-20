import { Keypair, PublicKey } from "@solana/web3.js";
import fs from "fs";
import * as dotenv from "dotenv";
dotenv.config();

export const SOLANA_CHAIN_ID = 20001

// Load environment variables
export const RPC_URL = process.env.SOLANA_RPC_URL || "https://wandering-chaotic-mountain.solana-mainnet.quiknode.pro/6b231d609d55dfb71fa84b7494aa05a36138ec43";
export const KEYPAIR_PATH = process.env.KEYPAIR_PATH || "./wallet/id.json";

// Load wallet keypair
export const walletKeypair = Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(fs.readFileSync(KEYPAIR_PATH, "utf-8")))
);

export const PROGRAM_ID = new PublicKey(process.env.PROGRAM_ID || "qLbS4ESAAgJPUVFn6Jiu7HGEPEPT7ZrxPLu9DLJsGoE");
export const CONFIG_ACCOUNT = new PublicKey(process.env.CONFIG_ACCOUNT || "6497k38egVaN189EhAWcL3v8deBNWa7zWowwv9t1V7R7");
export const FEE_RECEIVER = new PublicKey("C6DuM7pcwodHEwp3T3w4NTJ6NNbXDaLyhuRh3zAWecy1");


