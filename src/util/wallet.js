//
// Utility Functions
//

export const truncate = (accountId) => {
    const firstFour = accountId.slice(0, 4);
    const lastFour = accountId.slice(39);
    return `${firstFour}...${lastFour}`;
};

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