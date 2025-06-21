"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FEE_RECEIVER = exports.CONFIG_ACCOUNT = exports.PROGRAM_ID = exports.walletKeypair = exports.RPC_URL = exports.SOLANA_CHAIN_ID = void 0;
const web3_js_1 = require("@solana/web3.js");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const { SOLANA_PRIVATE_KEY_JSON } = process.env;
exports.SOLANA_CHAIN_ID = 20001;
// Load environment variables
exports.RPC_URL = process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com";
// Load wallet keypair
exports.walletKeypair = (() => {
    try {
        console.log("🔑 Loading wallet keypair...");
        if (!SOLANA_PRIVATE_KEY_JSON) {
            throw new Error("❌ SOLANA_PRIVATE_KEY_JSON environment variable not found");
        }
        // Parse the JSON string array from environment variable
        const privateKeyArray = JSON.parse(SOLANA_PRIVATE_KEY_JSON);
        const keypair = web3_js_1.Keypair.fromSecretKey(Uint8Array.from(privateKeyArray));
        console.log(`✅ Wallet loaded successfully: ${keypair.publicKey.toString()}`);
        return keypair;
    }
    catch (error) {
        console.error("❌ Failed to load wallet:", error);
        throw error;
    }
})();
exports.PROGRAM_ID = new web3_js_1.PublicKey(process.env.PROGRAM_ID);
exports.CONFIG_ACCOUNT = new web3_js_1.PublicKey(process.env.CONFIG_ACCOUNT);
exports.FEE_RECEIVER = new web3_js_1.PublicKey("C6DuM7pcwodHEwp3T3w4NTJ6NNbXDaLyhuRh3zAWecy1");
