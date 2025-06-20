import { Keypair, } from '@solana/web3.js';


async function generateWallet() {
    try {
        const wallet = new Keypair()
        console.log(wallet.publicKey.toString());
        console.log(wallet.secretKey);
    } catch (error) {
        console.error("❌ Error generating:", error);
    }
}

// Run the function
generateWallet();