"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const anchor_1 = require("@coral-xyz/anchor");
const web3_js_1 = require("@solana/web3.js");
const solana_1 = require("../config/solana");
const solana_2 = require("../web3/solana");
const solana_3 = __importDefault(require("../config/tokens/solana"));
const spl_token_1 = require("@solana/spl-token");
async function setupTokens() {
    try {
        console.log("🚀 Setting up tokens on solana portal...");
        console.log(`🔑 Config account: ${solana_1.CONFIG_ACCOUNT.toBase58()}`);
        for (let index = 0; index < solana_3.default.length; index++) {
            const token = solana_3.default[index];
            const MINT_ADDRESS = new web3_js_1.PublicKey(token.address);
            const tokenMinTx = new anchor_1.BN(token.minTx).mul(new anchor_1.BN(10 ** token.decimals));
            const tokenMaxTx = new anchor_1.BN(token.maxTx).mul(new anchor_1.BN(10 ** token.decimals));
            if (token.isActive) {
                try {
                    await (0, spl_token_1.getOrCreateAssociatedTokenAccount)(solana_2.connection, solana_1.walletKeypair, new web3_js_1.PublicKey(token.address), solana_1.CONFIG_ACCOUNT, true);
                    const tx = await solana_2.program.methods
                        .addToken(MINT_ADDRESS, tokenMinTx, tokenMaxTx, !token.isMintable)
                        .accounts({
                        config: solana_1.CONFIG_ACCOUNT,
                        authority: solana_1.walletKeypair.publicKey,
                    })
                        .signers([solana_1.walletKeypair])
                        .rpc();
                    console.log(`✅ Add ${token.name} token transaction successful! Signature: ${tx}`);
                }
                catch (error) {
                    //console.log(error);
                }
                await solana_2.program.methods
                    .changeTxLowerLimit(MINT_ADDRESS, tokenMinTx)
                    .accounts({
                    config: solana_1.CONFIG_ACCOUNT,
                    authority: solana_1.walletKeypair.publicKey,
                })
                    .signers([solana_1.walletKeypair])
                    .rpc();
                console.log(`✅ Change token lower limit ${token.name}`);
                await solana_2.program.methods
                    .changeTxUpperLimit(MINT_ADDRESS, tokenMaxTx)
                    .accounts({
                    config: solana_1.CONFIG_ACCOUNT,
                    authority: solana_1.walletKeypair.publicKey,
                })
                    .signers([solana_1.walletKeypair])
                    .rpc();
                console.log(`✅ Change token upper limit ${token.name}`);
                await solana_2.program.methods
                    .changeIsOriginChain(MINT_ADDRESS, !token.isMintable)
                    .accounts({
                    config: solana_1.CONFIG_ACCOUNT,
                    authority: solana_1.walletKeypair.publicKey,
                })
                    .signers([solana_1.walletKeypair])
                    .rpc();
                console.log(`✅ Change token mintable status ${token.name}`);
            }
            else {
                await solana_2.program.methods
                    .removeToken(MINT_ADDRESS)
                    .accounts({
                    config: solana_1.CONFIG_ACCOUNT,
                    authority: solana_1.walletKeypair.publicKey,
                })
                    .signers([solana_1.walletKeypair])
                    .rpc();
                console.log(`✅ remove ${token.name} token transaction successful!`);
            }
        }
    }
    catch (error) {
        console.error("❌ Error adding token:", error);
    }
}
// Run the function
setupTokens();
