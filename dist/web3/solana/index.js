"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.program = exports.provider = exports.connection = void 0;
const web3_js_1 = require("@solana/web3.js");
const anchor_1 = require("@coral-xyz/anchor");
const idl_1 = require("../../config/solana/idl");
const solana_1 = require("../../config/solana");
// Initialize Solana connection
exports.connection = new web3_js_1.Connection(solana_1.RPC_URL, "confirmed");
exports.provider = new anchor_1.AnchorProvider(exports.connection, new anchor_1.Wallet(solana_1.walletKeypair), {
    preflightCommitment: "confirmed",
});
// Load Anchor program 
exports.program = new anchor_1.Program({ ...idl_1.IDL, address: solana_1.PROGRAM_ID.toBase58() }, exports.provider);
