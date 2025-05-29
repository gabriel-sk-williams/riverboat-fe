import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import {
  useSolanaWallets,
  useActiveWallet,
} from "@privy-io/react-auth";

import {
  Box,
} from 'theme-ui'

import WagerLayout from '../components/WagerLayout';
import { calcRisk, truncate, constructSentence, getFavorite } from '../util/wallet';

function Wager() {

  const { accountId } = useParams();
  const { wallet: activeWallet } = useActiveWallet();

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
          accountId={accountId} 
          activeWallet={activeWallet}
        />

      </Box>
    </Box>
  );
}

export default Wager;