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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FEE_RECEIVER = exports.CONFIG_ACCOUNT = exports.PROGRAM_ID = exports.walletKeypair = exports.KEYPAIR_PATH = exports.RPC_URL = exports.SOLANA_CHAIN_ID = void 0;
const web3_js_1 = require("@solana/web3.js");
const fs_1 = __importDefault(require("fs"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
exports.SOLANA_CHAIN_ID = 20001;
// Load environment variables
exports.RPC_URL = process.env.SOLANA_RPC_URL;
exports.KEYPAIR_PATH = process.env.KEYPAIR_PATH;
// Load wallet keypair
exports.walletKeypair = web3_js_1.Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs_1.default.readFileSync(exports.KEYPAIR_PATH, "utf-8"))));
exports.PROGRAM_ID = new web3_js_1.PublicKey(process.env.PROGRAM_ID);
exports.CONFIG_ACCOUNT = new web3_js_1.PublicKey(process.env.CONFIG_ACCOUNT);
exports.FEE_RECEIVER = new web3_js_1.PublicKey("C6DuM7pcwodHEwp3T3w4NTJ6NNbXDaLyhuRh3zAWecy1");
