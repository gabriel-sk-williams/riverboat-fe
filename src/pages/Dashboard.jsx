import { useState, useEffect, useCallback } from 'react';




import Tabs from '../components/Tabs';
import WagerList from '../components/dashboard/WagerList';
import VersusContractForm from '../components/VersusContractForm';
import DropdownSelect from '../components/shared/DropdownSelect';
import Filter from '../components/dashboard/Filter';

import useProgramRequest from '../hooks/useProgramRequest';

import '../styles/main.css'
import '../styles/type.css'
import '../styles/flex.css'

import { 
  PublicKey, 
} from "@solana/web3.js";

import {
    Box,
	Flex,
	Button
} from 'theme-ui'


const tabsData = [
    { label: 'EXPLORE', page: "/dashboard" }, // 0
    { label: 'CREATE', page: "/create" }, // 1
	{ label: 'INFO', page: "/info" }, // 2
];

const sortItems = ['newest', 'oldest', 'popular'];
const statusItems = ['open', 'closed', 'resolved'];
const filterItems = ['keyword', 'creator'];

function Dashboard() {

	const [ currentTab, setCurrentTab ] = useState(0);
	const [ sortBy, setSortBy] = useState('newest');
	const [ statusFilter, setStatusFilter] = useState('open');

	const [filterTerm, setFilterTerm] = useState("");
    const [filterType, setFilterType] = useState("keyword");

	const programId = new PublicKey(import.meta.env.VITE_PROGRAM_ADDRESS);
	const { loading, status, accounts, refresh } = useProgramRequest(programId);


	const handleFilterFieldChange = (event) => {
        setFilterTerm(event.target.value);
    }
	
	const test = () =>  {
		console.log("testing")
		console.log(sortBy)
		console.log(statusFilter)
		console.log(filterTerm)
		console.log(filterType)
	}

	return (
		<Box>
			{/*<Button onClick={test} />*/}
			<Box sx={{pb:'4rem'}}>
				<Tabs 
					tabs={tabsData}
					activeTab={currentTab}
					onTabChange={setCurrentTab} 
				/>
			</Box>

			<Box>
				<Filter items={filterItems} onFieldChange={handleFilterFieldChange} onFilterChange={setFilterType} />
			</Box>

			<Flex sx={{ gap:'4rem' }}>
				<DropdownSelect label={"SORT BY"} naked={false} items={sortItems} onChange={setSortBy} />
				<DropdownSelect label={"SORT BY"} naked={false} items={statusItems} onChange={setStatusFilter} />
			</Flex>


			<Box sx={{pb: '2rem'}}>
				<Flex>
					<WagerList loading={loading} wagers={accounts} />
				</Flex>
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