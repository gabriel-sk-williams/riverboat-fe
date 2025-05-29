
import {
    Box,
    Spinner,
    Button,
    Flex,
    Text,
    Image,
} from 'theme-ui'

import WagerDetails from './WagerDetails';

import { useWallet } from '@solana/wallet-adapter-react'
import useAccountRequest from '../hooks/useAccountRequest';

function WagerLayout({ accountId, activeWallet }) {

    const { signTransaction } = useWallet();

    const { loading, status, error, account, submitDeposit, updateBelief, lockSubmission, setApproval } = useAccountRequest(accountId, signTransaction, activeWallet);
    
    return (
        <Box sx={{my:'2rem'}}>
            
            <WagerDetails 
                account={account}
                activeWallet={activeWallet}
                error={error}
                submitDeposit={submitDeposit}
                updateBelief={updateBelief}
                lockSubmission={lockSubmission}
                setApproval={setApproval}
            />
            
        </Box>
    );
}

export default WagerLayout;
