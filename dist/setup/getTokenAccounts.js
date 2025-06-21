"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
const solana_1 = require("../config/solana");
const solana_2 = require("../web3/solana");
async function getTokenAccounts() {
    try {
        console.log("🚀 Generating tokens account for solana portal vault authority...");
        console.log(`🔑 Config account: ${solana_1.CONFIG_ACCOUNT.toBase58()}`);
        const accountPubkey = new web3_js_1.PublicKey(solana_1.CONFIG_ACCOUNT);
        const accountInfo = await solana_2.connection.getAccountInfo(accountPubkey);
        if (!accountInfo || !accountInfo.data) {
            console.error("Config account not found");
            return;
        }
        const [vaultAuthorityPDA] = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("vault_authority")], solana_1.PROGRAM_ID);
        console.log('You can send all tokens to this account:', vaultAuthorityPDA.toString());
        // tokens.forEach(async token => {
        //     const vaultTokenAccount = await getOrCreateAssociatedTokenAccount(connection, walletKeypair, new PublicKey(token.address), vaultAuthorityPDA, true)
        //     console.log(`${token.name} ==> ${vaultTokenAccount.address.toString()}`);
        // })
    }
    catch (error) {
        console.error("❌ Error adding token:", error);
    }
}
// Run the function
getTokenAccounts();
