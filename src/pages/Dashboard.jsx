import { useState, useEffect, useCallback } from 'react';

import Tabs from '../components/Tabs';
import WagerList from '../components/dashboard/WagerList';
import useProgramRequest from '../hooks/useProgramRequest';
import VersusContractForm from '../components/VersusContractForm';

import '../styles/main.css'
import '../styles/type.css'
import '../styles/flex.css'

import { 
  PublicKey, 
} from "@solana/web3.js";

import {
    Box,
} from 'theme-ui'


const tabsData = [
    { label: 'EXPLORE', page: "/dashboard" }, // 0
    { label: 'CREATE', page: "/create" }, // 1
	{ label: 'INFO', page: "/info" }, // 2
];

function Dashboard() {

	const [ currentTab, setCurrentTab ] = useState(0);

	const programId = new PublicKey(import.meta.env.VITE_PROGRAM_ADDRESS);
	const { loading, status, accounts, refresh } = useProgramRequest(programId);

	return (
		<Box>
			<div className='flex'>
				<Tabs 
					tabs={tabsData}
					activeTab={currentTab}
					onTabChange={setCurrentTab} 
				/>
			</div>
			<Box sx={{mt: '2rem', pb: '2rem'}}>
				<div className="flex">
					<WagerList loading={loading} wagers={accounts} />
				</div>
			</Box>
		</Box>
	);
}

export default Dashboard;

/*
	<div>
		{currentTab == 0 && <WagerList loading={loading} wagers={accounts} />}
		{currentTab == 1 && <VersusContractForm refreshProgramRequest={refresh} />}
	</div>
*/