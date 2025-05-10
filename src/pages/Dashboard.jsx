import { useState, useEffect, useCallback } from 'react';


import Tabs from '../components/Tabs';
import DualSpaceForm from '../components/DualSpaceForm';
import GetSpace from '../components/GetSpace';
import WagerList from '../components/WagerList';
import useProgramRequest from '../hooks/useProgramRequest';
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

import {
    Box,
    Button,
    Flex,
    Text,
    Image
} from 'theme-ui'

import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { InstructionVariant } from '../util/solana';

const tabsData = [
    { label: 'Wagers' }, // 0
    { label: 'Create' }, // 1
];

function Dashboard() {

	// recent wagers || create wager
	const [ currentTab, setCurrentTab ] = useState(0);

	const { wallets, ready } = useSolanaWallets();
	const { signTransaction } = useWallet();

	const programId = new PublicKey(import.meta.env.VITE_PROGRAM_ADDRESS);
	const { loading, status, accounts } = useProgramRequest(programId);

	const logDetails = async () => {
		console.log("details")
		console.log("spaces", accounts)
	}
	
	const makePayment = async () => {

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
		<Box>
			<div className='flex-container'>
				<Tabs 
					tabs={tabsData}
					activeTab={currentTab}
					onTabChange={setCurrentTab} 
				/>
			</div>
			<Box sx={{
				//border: '1px solid #ccc',
				//borderRadius: '8px',
				mt: '2rem',
				pb: '2rem',
			}}>
				<div className="flex-center">
					<div>
						{currentTab == 0 && <WagerList spaces={accounts} />}
						{currentTab == 1 && <DualSpaceForm />}
					</div>
				</div>
			</Box>
		</Box>
	);
}

export default Dashboard;