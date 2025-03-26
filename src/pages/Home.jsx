import '../styles/main.css'
import '../styles/type.css'

import {
  useSolanaWallets,
  useActiveWallet,
  // getAccessToken, 
  // usePrivy, 
  // useLogin,
  // useSendTransaction,
} from "@privy-io/react-auth";

import { 
  PublicKey, 
  SystemProgram, 
  LAMPORTS_PER_SOL, 
  clusterApiUrl,
  Connection,
  Transaction,
  // TransactionMessage,
  // VersionedTransaction,
  // sendAndConfirmTransaction, 
  // ComputeBudgetProgram, 
  // sendAndConfirmRawTransaction,
} from "@solana/web3.js";

import { useConnection, useWallet } from '@solana/wallet-adapter-react'


function Home() { 

  const { wallets, ready } = useSolanaWallets();
  const { signTransaction } = useWallet();

  const logDetails = () => {
    const desiredWallet = wallets.find((wallet) => wallet.address === '7V4wLNxUvejyeZ5Bmr2GpvfBL1mZxzQMhsyR7noiM3uD');
    console.log("desired", desiredWallet);
  }

  const makePayment = async () => {
    try {
      const connection = new Connection(clusterApiUrl('devnet'));
      console.log("connection", connection)

      const desiredWallet = wallets.find((wallet) => wallet.address === '7V4wLNxUvejyeZ5Bmr2GpvfBL1mZxzQMhsyR7noiM3uD');
      console.log("desired", desiredWallet);

      const publicKey = new PublicKey(desiredWallet.address);
      console.log("publicKey", publicKey)

      const destinationWallet = new PublicKey('4DRFsCcnsDPGGVKGg75p1e9pPBQtser87f5AXm9rEfF2');

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

  return (
    <article>
      <br/>
      <br/>
      <br/>
      <br/>
      <button onClick={logDetails}>
          details
      </button>
      <button onClick={makePayment}>
          make pay
      </button>
    </article>
  );
}

export default Home;