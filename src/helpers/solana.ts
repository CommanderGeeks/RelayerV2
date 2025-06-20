import { PublicKey } from "@solana/web3.js";
import { CONFIG_ACCOUNT, PROGRAM_ID, walletKeypair } from "../config/solana";
import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import { connection } from "../web3/solana";


export const vaultAccount = async () => {
    const [vaultAuthorityPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("vault_authority"), CONFIG_ACCOUNT.toBuffer()],
        PROGRAM_ID
    );

    return vaultAuthorityPDA;
}

export const vaultTokenAccount = async (mintAddress: PublicKey) => {
    const [vaultAuthorityPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("vault_authority"), CONFIG_ACCOUNT.toBuffer()],
        PROGRAM_ID
    );

    return await getOrCreateAssociatedTokenAccount(connection, walletKeypair, mintAddress, vaultAuthorityPDA, true);
}

export const getTokenAccountBalance = async (tokenAccount: PublicKey): Promise<number> => {
    try {
        const balanceInfo = await connection.getTokenAccountBalance(tokenAccount);
        return parseFloat(balanceInfo.value.amount);
    } catch (error) {
        console.error(`⚠️ Failed to fetch balance for ${tokenAccount.toBase58()}: ${error}`);
        return 0;
    }
};


export const getAccountBalance = async (account: PublicKey): Promise<number> => {

    try {

        const balanceInfo = await connection.getBalance(account);

        return balanceInfo;

    } catch (error) {

        console.error(`⚠️ Failed to fetch balance for ${account.toBase58()}: ${error}`);

        return 0;

    }

};