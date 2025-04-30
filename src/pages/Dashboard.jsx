import CreateForm from '../components/CreateForm';
import GetSpace from '../components/GetSpace';
import ListWagers from '../components/ListWagers';
import useSpaceRequest from '../hooks/useSpaceRequest';
import { connection } from '../hooks/useSolanaConnection';

import '../styles/main.css'
import '../styles/type.css'
import '../styles/flex.css'

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
import { InstructionVariant } from '../util/solana';


function Dashboard() {

	const { wallets, ready } = useSolanaWallets();
	const { signTransaction } = useWallet();

	const programId = new PublicKey(import.meta.env.VITE_PROGRAM_ADDRESS);
	const { loading, status, spaces } = useSpaceRequest(programId);

	const logDetails = async () => {
		console.log("details")

		console.log("spaces", spaces)
	}
	
	const makePayment = async () => {

		try {
			const desiredWallet = wallets.find((wallet) => wallet.address === '7V4wLNxUvejyeZ5Bmr2GpvfBL1mZxzQMhsyR7noiM3uD');
			const publicKey = new PublicKey(desiredWallet.address);
			
			console.log("connection", connection)
			console.log("desired", desiredWallet);
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
		<div>
            <div style={{marginTop:'4rem'}}>
                <div className="flex-center">
                    <button onClick={logDetails}>
                        details
                    </button>
                    <button onClick={makePayment}>
                        make pay
                    </button>
                </div>
            </div>
            <div className="flex-column">
                <div className="flex-center">
                    <div style={{marginTop:'4rem'}}>
                        <CreateForm variant={InstructionVariant.CREATE}/>
                    </div>
                </div>
                <div className="flex-center">
                    <div style={{marginTop:'4rem'}}>
                        <ListWagers spaces={spaces}/>
                    </div>
                </div>
            </div>
		</div>
	);
}

export default Dashboard;