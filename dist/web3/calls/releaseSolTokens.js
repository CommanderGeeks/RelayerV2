"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.releaseSolTokens = void 0;
const anchor_1 = require("@coral-xyz/anchor");
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const solana_1 = require("../../config/solana");
const solana_2 = require("../solana");
async function releaseSolTokens(fromChainId, data, token, hash) {
    const tokenAddress = new web3_js_1.PublicKey(token.address);
    // Derive the PDA Vault Authority
    const [vaultAuthorityPDA] = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("vault_authority")], solana_1.PROGRAM_ID);
    const depositorTokenAccount = await (0, spl_token_1.getOrCreateAssociatedTokenAccount)(solana_2.connection, solana_1.walletKeypair, tokenAddress, new web3_js_1.PublicKey(data.receiver));
    const vaultTokenAccount = await (0, spl_token_1.getOrCreateAssociatedTokenAccount)(solana_2.connection, solana_1.walletKeypair, tokenAddress, vaultAuthorityPDA, true);
    // Call the initialize function
    const tx = await solana_2.program.methods
        .withdraw(depositorTokenAccount.address, new anchor_1.BN(data.amount), tokenAddress, new anchor_1.BN(fromChainId), hash)
        .accounts({
        receiverTokenAccount: depositorTokenAccount.address,
        vaultTokenAccount: vaultTokenAccount.address,
        mintAccount: tokenAddress,
    })
        .signers([solana_1.walletKeypair])
        .rpc();
    console.log(`✅ Withdraw transaction successful! Signature: ${tx}`);
    return tx;
}
exports.releaseSolTokens = releaseSolTokens;
