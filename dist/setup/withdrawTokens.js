"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const anchor_1 = require("@coral-xyz/anchor");
const solana_1 = require("../config/solana");
const solana_2 = require("../web3/solana");
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const solana_3 = __importDefault(require("../config/tokens/solana"));
const withdrawTokensList = [{ key: 'Yafa', amount: 2 }];
async function withdrawTokens() {
    try {
        console.log("🚀 Withdrawing from portal...");
        console.log(`🔑 Config Account: ${solana_1.CONFIG_ACCOUNT.toBase58()}`);
        // Derive the PDA Vault Authority
        const [vaultAuthorityPDA] = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("vault_authority")], solana_1.PROGRAM_ID);
        withdrawTokensList.map(async (wt) => {
            const token = solana_3.default.find(t => t.key === wt.key);
            if (!token)
                return;
            const mintPubKey = new web3_js_1.PublicKey(token.address);
            const adminTokenAccount = await (0, spl_token_1.getOrCreateAssociatedTokenAccount)(solana_2.connection, solana_1.walletKeypair, mintPubKey, solana_1.walletKeypair.publicKey);
            const vaultTokenAccount = await (0, spl_token_1.getOrCreateAssociatedTokenAccount)(solana_2.connection, solana_1.walletKeypair, mintPubKey, vaultAuthorityPDA, true);
            // Call the initialize function
            const tx = await solana_2.program.methods
                .withdrawTokens(adminTokenAccount.address, new anchor_1.BN(wt.amount).mul(new anchor_1.BN(10 ** token.decimals)), mintPubKey)
                .accounts({
                mintAccount: mintPubKey,
                receiverTokenAccount: adminTokenAccount.address,
                vaultTokenAccount: vaultTokenAccount.address,
            })
                .signers([solana_1.walletKeypair])
                .rpc();
            console.log(`✅ Withdraw transaction successful! Signature: ${tx}`);
        });
    }
    catch (error) {
        console.error("❌ Error withdraw failed:", error);
    }
}
// Run the function
withdrawTokens();
