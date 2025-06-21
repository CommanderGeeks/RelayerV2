"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccountBalance = exports.getTokenAccountBalance = exports.vaultTokenAccount = exports.vaultAccount = void 0;
const web3_js_1 = require("@solana/web3.js");
const solana_1 = require("../config/solana");
const spl_token_1 = require("@solana/spl-token");
const solana_2 = require("../web3/solana");
const vaultAccount = async () => {
    const [vaultAuthorityPDA] = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("vault_authority"), solana_1.CONFIG_ACCOUNT.toBuffer()], solana_1.PROGRAM_ID);
    return vaultAuthorityPDA;
};
exports.vaultAccount = vaultAccount;
const vaultTokenAccount = async (mintAddress) => {
    const [vaultAuthorityPDA] = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("vault_authority"), solana_1.CONFIG_ACCOUNT.toBuffer()], solana_1.PROGRAM_ID);
    return await (0, spl_token_1.getOrCreateAssociatedTokenAccount)(solana_2.connection, solana_1.walletKeypair, mintAddress, vaultAuthorityPDA, true);
};
exports.vaultTokenAccount = vaultTokenAccount;
const getTokenAccountBalance = async (tokenAccount) => {
    try {
        const balanceInfo = await solana_2.connection.getTokenAccountBalance(tokenAccount);
        return parseFloat(balanceInfo.value.amount);
    }
    catch (error) {
        console.error(`⚠️ Failed to fetch balance for ${tokenAccount.toBase58()}: ${error}`);
        return 0;
    }
};
exports.getTokenAccountBalance = getTokenAccountBalance;
const getAccountBalance = async (account) => {
    try {
        const balanceInfo = await solana_2.connection.getBalance(account);
        return balanceInfo;
    }
    catch (error) {
        console.error(`⚠️ Failed to fetch balance for ${account.toBase58()}: ${error}`);
        return 0;
    }
};
exports.getAccountBalance = getAccountBalance;
