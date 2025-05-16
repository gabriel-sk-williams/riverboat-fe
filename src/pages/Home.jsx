import { Link } from 'react-router-dom'
import useProgramRequest from '../hooks/useProgramRequest';
import { connection } from '../hooks/useSolanaConnection';

import '../styles/main.css'
import '../styles/type.css'
import '../styles/flex.css'

import { useConnection, useWallet } from '@solana/wallet-adapter-react'

import {
  useSolanaWallets,
  useActiveWallet,
} from "@privy-io/react-auth";

import { 
  PublicKey, 
  SystemProgram, 
  LAMPORTS_PER_SOL, 
  Transaction,
} from "@solana/web3.js";

import {
    Input,
    Textarea,
    Box,
    Button,
    Flex,
    Text,
    Image
  } from 'theme-ui'

import boat from '../assets/riverboat.jpg'

function Home() {

	const { wallets, ready } = useSolanaWallets();
	const { signTransaction } = useWallet();

	const programId = new PublicKey(import.meta.env.VITE_PROGRAM_ADDRESS);
	const { loading, status, spaces } = useProgramRequest(programId);

	const logDetails = async () => {
		console.log("details")

		console.log("spaces", spaces)
	}
	
	const makeDonation = async () => {

		try {
			const donationAddress = import.meta.env.VITE_DONATION_WALLET;
			const desiredWallet = wallets.find((wallet) => wallet.address === donationAddress);
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
		<div className="container">
			<div className="flex-column center">
					<div style={{paddingTop:'6rem'}}/>
					<div className="flex-center">
						<Image src={boat} sx={{width:'660px'}} />
					</div>
					<h1>riverboat</h1>
					<h2>the decentralized prediction protocol</h2>
					<h2>now live on 
						<code style={{ marginLeft: '8px', backgroundColor: '#f5f5f5', fontSize: '1rem', padding: '2px 4px', borderRadius: '4px' }}>
						solana devnet
						</code>
					</h2>
					<Link to='/dashboard' style={{marginTop:'1rem'}}>
						<Button>Enter</Button>
					</Link>
			</div>
		</div>
	);
}

export default Home;