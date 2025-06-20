import { PublicKey } from "@solana/web3.js";
import { BN, } from "@coral-xyz/anchor";
import { FEE_RECEIVER, PROGRAM_ID, walletKeypair } from '../config/solana';
import { program } from "../web3/solana";

async function initializeProgram() {
    try {
        console.log("🚀 Initializing Solana program...");

        // Generate config account PDA
        const [configPDA] = PublicKey.findProgramAddressSync(
            [Buffer.from("config")],
            PROGRAM_ID
        );

        // Define initialization parameters
        const feeReceiver = FEE_RECEIVER; // Fee receiver address
        const defaultFee = new BN(50); // Default fee

        console.log(`🔑 Config Account: ${configPDA.toBase58()}`);

        // Call the initialize function
        const tx = await program.methods
            .initialize(feeReceiver, defaultFee)
            .accounts({
                admin: walletKeypair.publicKey
            })
            .signers([walletKeypair])
            .rpc();

        console.log(`✅ Initialize transaction successful! Signature: ${tx}`);
    } catch (error) {
        console.error("❌ Error initializing program:", error);
    }
}

// Run the function
initializeProgram();