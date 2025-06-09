import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import {
  useSolanaWallets,
  useActiveWallet,
} from "@privy-io/react-auth";

import { useWallet } from '@solana/wallet-adapter-react'
import useAccountRequest from '../hooks/useAccountRequest';

import {
  Box,
} from 'theme-ui'

import WagerLayout from '../components/WagerLayout';
import { truncate } from '../util/wallet';

function Wager() {

  const { accountId } = useParams();
  const { signTransaction } = useWallet();
  const { wallet: activeWallet } = useActiveWallet();

  const { loading, status, error, account, submitDeposit, updateBelief, lockSubmission, setApproval, claimPayout } = useAccountRequest(accountId, signTransaction, activeWallet);

  const truncatedId = truncate(accountId);

  return (
    <Box>
      <div className="flex-header">
          <Link to={`/dashboard`}>
            <h4>&larr; Dashboard</h4>
          </Link>

          <h4 className="centered-title">Wager: {truncatedId}</h4>
      </div>

      <Box sx={{
        border:'1px solid #ccc',
        borderRadius:'1rem',
        px:'2rem'
      }}>

        <WagerLayout
          account={account}
          activeWallet={activeWallet}
          error={error}
          submitDeposit={submitDeposit}
          updateBelief={updateBelief}
          lockSubmission={lockSubmission}
          setApproval={setApproval}
          claimPayout={claimPayout}
        />

      </Box>
    </Box>
  );
}

export default Wager;