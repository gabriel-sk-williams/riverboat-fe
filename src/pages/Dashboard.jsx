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
	Spinner,
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

	const [ currentTab, setCurrentTab ] = useState(0);

	const programId = new PublicKey(import.meta.env.VITE_PROGRAM_ADDRESS);
	const { loading, status, accounts, refresh } = useProgramRequest(programId);

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
				mt: '2rem',
				pb: '2rem',
			}}>
				<div className="flex-center">
					<div>
						{currentTab == 0 && <WagerList loading={loading} spaces={accounts} />}
						{currentTab == 1 && <DualSpaceForm refreshProgramRequest={refresh} />}
					</div>
				</div>
			</Box>
		</Box>
	);
}

export default Dashboard;