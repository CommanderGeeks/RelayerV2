import { BN } from '@coral-xyz/anchor';
import { CONFIG_ACCOUNT, PROGRAM_ID, walletKeypair } from '../config/solana';
import { connection, program } from '../web3/solana';
import { getOrCreateAssociatedTokenAccount } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';
import tokens from '../config/tokens/solana';

const withdrawTokensList = [{ key: 'Yafa', amount: 2 }]

async function withdrawTokens() {
    try {
        console.log("🚀 Withdrawing from portal...");
        console.log(`🔑 Config Account: ${CONFIG_ACCOUNT.toBase58()}`);

        // Derive the PDA Vault Authority
        const [vaultAuthorityPDA] = PublicKey.findProgramAddressSync(
            [Buffer.from("vault_authority")],
            PROGRAM_ID
        );

        withdrawTokensList.map(async wt => {
            const token = tokens.find(t => t.key === wt.key)
            if (!token) return
            const mintPubKey = new PublicKey(token.address)
            const adminTokenAccount = await getOrCreateAssociatedTokenAccount(connection, walletKeypair, mintPubKey, walletKeypair.publicKey);
            const vaultTokenAccount = await getOrCreateAssociatedTokenAccount(connection, walletKeypair, mintPubKey, vaultAuthorityPDA, true);

            // Call the initialize function
            const tx = await program.methods
                .withdrawTokens(adminTokenAccount.address, new BN(wt.amount).mul(new BN(10 ** token.decimals)), mintPubKey)
                .accounts({
                    mintAccount: mintPubKey,
                    receiverTokenAccount: adminTokenAccount.address,
                    vaultTokenAccount: vaultTokenAccount.address,
                })
                .signers([walletKeypair])
                .rpc();

            console.log(`✅ Withdraw transaction successful! Signature: ${tx}`);
        })
    } catch (error) {
        console.error("❌ Error withdraw failed:", error);
    }
}

// Run the function
withdrawTokens();