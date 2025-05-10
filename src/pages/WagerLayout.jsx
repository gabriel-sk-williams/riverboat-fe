import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useAccountRequest from '../hooks/useAccountRequest';

import {
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  SystemProgram,
  TransactionInstruction,
  clusterApiUrl,
  sendAndConfirmTransaction,
} from '@solana/web3.js';

import {
  Box,
  Button,
  Flex,
  Text,
  Image
} from 'theme-ui'

import WagerInfo from '../components/WagerInfo';


function WagerLayout() {
  const { id } = useParams(); // Get ID from URL
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);

  const pda = new PublicKey(id);
  const { loading, status, account } = useAccountRequest(pda);

  const updateStatus = () => {
    console.log("updating status")
    console.log(account.parlor)
    console.log(account.wallet_a_decision)
    console.log(account.wallet_b_decision)
  }

  if (loading) {
    return <div className="">Loading Wager Info</div>;
}

  return (
    <Box>
      <Link to={`/dashboard`}>
        <h2>{'<- Back to Dashboard'}</h2>
      </Link>

      {account && (
        <WagerInfo pda={id} props={account}/>
      )}

    </Box>
  );
}

export default WagerLayout;