import { BN } from '@coral-xyz/anchor';
import { CONFIG_ACCOUNT, walletKeypair } from '../config/solana';
import { program } from '../web3/solana';
import chains from "../config/chains";

async function addChain() {
    console.log("🚀 Adding chain to Solana program...");
    console.log(`🔑 Config Account: ${CONFIG_ACCOUNT.toBase58()}`);

    for (let index = 0; index < chains.length; index++) {
        try {
            const chain = chains[index];
            if (chain.chainId === 2001) continue;

            // Call the initialize function
            const tx = await program.methods
                .addChain(new BN(chain.chainId))
                .accounts({
                    config: CONFIG_ACCOUNT,
                    authority: walletKeypair.publicKey,
                })
                .signers([walletKeypair])
                .rpc();

            console.log(`✅ Add chain ${chain.name}: ${chain.chainId} transaction successful! Signature: ${tx}`);
        } catch (error) {
            console.error("❌ Error adding chain:", error);
        }
    }
}

// Run the function
addChain();