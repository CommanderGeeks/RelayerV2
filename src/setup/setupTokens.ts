import { BN } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import { CONFIG_ACCOUNT, walletKeypair } from '../config/solana';
import { connection, program } from '../web3/solana';
import tokens from '../config/tokens/solana';
import { getOrCreateAssociatedTokenAccount } from '@solana/spl-token';


async function setupTokens() {
    try {
        console.log("🚀 Setting up tokens on solana portal...");
        console.log(`🔑 Config account: ${CONFIG_ACCOUNT.toBase58()}`);

        for (let index = 0; index < tokens.length; index++) {
            const token = tokens[index];
            const MINT_ADDRESS = new PublicKey(token.address);
            const tokenMinTx = new BN(token.minTx).mul(new BN(10 ** token.decimals))
            const tokenMaxTx = new BN(token.maxTx).mul(new BN(10 ** token.decimals))

            if (token.isActive) {
                try {
                    await getOrCreateAssociatedTokenAccount(connection, walletKeypair, new PublicKey(token.address), CONFIG_ACCOUNT, true)
                    const tx = await program.methods
                        .addToken(MINT_ADDRESS, tokenMinTx, tokenMaxTx, !token.isMintable)
                        .accounts({
                            config: CONFIG_ACCOUNT,
                            authority: walletKeypair.publicKey,
                        })
                        .signers([walletKeypair])
                        .rpc();

                    console.log(`✅ Add ${token.name} token transaction successful! Signature: ${tx}`);
                } catch (error) {
                    //console.log(error);
                }

                await program.methods
                    .changeTxLowerLimit(MINT_ADDRESS, tokenMinTx)
                    .accounts({
                        config: CONFIG_ACCOUNT,
                        authority: walletKeypair.publicKey,
                    })
                    .signers([walletKeypair])
                    .rpc();
                console.log(`✅ Change token lower limit ${token.name}`);

                await program.methods
                    .changeTxUpperLimit(MINT_ADDRESS, tokenMaxTx)
                    .accounts({
                        config: CONFIG_ACCOUNT,
                        authority: walletKeypair.publicKey,
                    })
                    .signers([walletKeypair])
                    .rpc();
                console.log(`✅ Change token upper limit ${token.name}`);


                await program.methods
                    .changeIsOriginChain(MINT_ADDRESS, !token.isMintable)
                    .accounts({
                        config: CONFIG_ACCOUNT,
                        authority: walletKeypair.publicKey,
                    })
                    .signers([walletKeypair])
                    .rpc();
                console.log(`✅ Change token mintable status ${token.name}`);

            } else {
                await program.methods
                    .removeToken(MINT_ADDRESS)
                    .accounts({
                        config: CONFIG_ACCOUNT,
                        authority: walletKeypair.publicKey,
                    })
                    .signers([walletKeypair])
                    .rpc();
                console.log(`✅ remove ${token.name} token transaction successful!`);
            }
        }
    } catch (error) {
        console.error("❌ Error adding token:", error);
    }
}

// Run the function
setupTokens();