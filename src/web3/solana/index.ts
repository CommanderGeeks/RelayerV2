import { Connection } from "@solana/web3.js";
import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor"; 
import { IDL, Portal } from "../../config/solana/idl";
import { PROGRAM_ID, RPC_URL, walletKeypair } from "../../config/solana";

// Initialize Solana connection
export const connection = new Connection(RPC_URL, "confirmed");
export const provider = new AnchorProvider(connection, new Wallet(walletKeypair), {
    preflightCommitment: "confirmed",
});

// Load Anchor program 
export const program = new Program({ ...IDL, address: PROGRAM_ID.toBase58() } as Portal, provider);