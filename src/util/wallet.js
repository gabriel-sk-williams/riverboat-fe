//
// Utility Functions
//

import { 
  PublicKey,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Transaction,
} from "@solana/web3.js";

export const truncate = (accountId) => {
    const firstFour = accountId.slice(0, 4);
    const lastFour = accountId.slice(40);
    return `${firstFour}...${lastFour}`;
};

// TODO: for donations
export const makePayment = async () => {

    try {
        const donationAddress = import.meta.env.VITE_DONATION_WALLET;
        const desiredWallet = wallets.find((wallet) => wallet.address === donationAddress);
        const publicKey = new PublicKey(desiredWallet.address);

        const destinationWallet = new PublicKey(donationAddress);

        const transactionLamports = 0.001 * LAMPORTS_PER_SOL; // Convert SOL to lamports

        const {
            value: { blockhash, lastValidBlockHeight },
        }  = await connection.getLatestBlockhashAndContext();

        const transaction = new Transaction() // Transaction
            .add(
            SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: destinationWallet,
            lamports: transactionLamports,
            })
        );

        transaction.recentBlockhash = blockhash;
        transaction.feePayer = publicKey;

        if (signTransaction) {
            const signedTx = await desiredWallet.signTransaction(transaction)
            
            // Send the transaction
            const signature = await connection.sendRawTransaction(signedTx.serialize())

            const confirmation = await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature })
            alert(`Transfer complete! Transaction signature: ${signature}`);
        }

    } catch (error) {
        console.error('Error sending transaction:', error);
        alert(`Transaction failed: ${error?.message}`);
    }
}

// square of surprise
export const calcRisk = (stake, beliefA, beliefB) => {

    // console.log("calc", beliefA, beliefB);

    if (beliefA == beliefB) return [ 0.0, 0.0 ];

    const p = Math.max(beliefA, beliefB);
    const q = (1 - Math.min(beliefA, beliefB));

    // console.log("pq", p, q);

    const pSqd = Math.pow(p, 2);
    const qSqd = Math.pow(q, 2);

    const pSurprise = 1 - p;
    const qSurprise = 1 - q;

    const pSurpriseSqd = Math.pow(pSurprise, 2);
    const qSurpriseSqd = Math.pow(qSurprise, 2);

    const portionA = pSqd - qSurpriseSqd;
    const portionB = qSqd - pSurpriseSqd;

    // allow five decimal places but remove trailing zeroes
    const riskA = parseFloat((stake * portionA).toFixed(5));
    const riskB = parseFloat((stake * portionB).toFixed(5));

    if (beliefA > beliefB) {
        return [riskA, riskB]
    } else {
        return [riskB, riskA]
    }
}

export const calcReserve = (stake, riskA, riskB) => {

    const reserveA = parseFloat((stake - riskA).toFixed(5));
    const reserveB = parseFloat((stake - riskB).toFixed(5));

    return [reserveA, reserveB];
}

export const validSolanaWallet = (wallet) => {
    try {
        if (!wallet || typeof wallet.address !== "string") return false;
        new PublicKey(wallet.address); // throws if invalid
        return true;
    } catch {
        return false;
    }
}

export const getVaultPDA = () => {
    
}
