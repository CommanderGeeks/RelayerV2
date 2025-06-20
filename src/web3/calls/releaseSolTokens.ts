import { BN } from '@coral-xyz/anchor';
import { getOrCreateAssociatedTokenAccount } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';
import { IBridgeData, IToken } from '../../config/types';
import { CONFIG_ACCOUNT, PROGRAM_ID, walletKeypair } from '../../config/solana';
import { connection, program } from '../solana';

export async function releaseSolTokens(fromChainId: number,
    data: IBridgeData,
    token: IToken,
    hash: string) {

    const tokenAddress = new PublicKey(token.address)
    // Derive the PDA Vault Authority
    const [vaultAuthorityPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("vault_authority")],
        PROGRAM_ID
    );

    const depositorTokenAccount = await getOrCreateAssociatedTokenAccount(connection, walletKeypair, tokenAddress, new PublicKey(data.receiver));
    const vaultTokenAccount = await getOrCreateAssociatedTokenAccount(connection, walletKeypair, tokenAddress, vaultAuthorityPDA, true);

    // Call the initialize function
    const tx = await program.methods
        .withdraw(depositorTokenAccount.address, new BN(data.amount), tokenAddress, new BN(fromChainId), hash)
        .accounts({
            receiverTokenAccount: depositorTokenAccount.address,
            vaultTokenAccount: vaultTokenAccount.address,
            mintAccount: tokenAddress,
        })
        .signers([walletKeypair])
        .rpc();

    console.log(`✅ Withdraw transaction successful! Signature: ${tx}`);
    return tx
}