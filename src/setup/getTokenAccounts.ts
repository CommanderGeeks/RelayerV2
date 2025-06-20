import { PublicKey } from '@solana/web3.js';
import { CONFIG_ACCOUNT, PROGRAM_ID } from '../config/solana';
import { connection } from '../web3/solana';


async function getTokenAccounts() {
    try {
        console.log("🚀 Generating tokens account for solana portal vault authority...");
        console.log(`🔑 Config account: ${CONFIG_ACCOUNT.toBase58()}`);

        const accountPubkey = new PublicKey(CONFIG_ACCOUNT);
        const accountInfo = await connection.getAccountInfo(accountPubkey);

        if (!accountInfo || !accountInfo.data) {
            console.error("Config account not found");
            return;
        }
        const [vaultAuthorityPDA] = PublicKey.findProgramAddressSync(
            [Buffer.from("vault_authority")],
            PROGRAM_ID
        );
        console.log('You can send all tokens to this account:', vaultAuthorityPDA.toString());

        // tokens.forEach(async token => {
        //     const vaultTokenAccount = await getOrCreateAssociatedTokenAccount(connection, walletKeypair, new PublicKey(token.address), vaultAuthorityPDA, true)
        //     console.log(`${token.name} ==> ${vaultTokenAccount.address.toString()}`);

        // })

    } catch (error) {
        console.error("❌ Error adding token:", error);
    }
}

// Run the function
getTokenAccounts();