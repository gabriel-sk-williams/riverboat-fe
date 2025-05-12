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

  const { id } = useParams();
  const { loading, status, account } = useAccountRequest(new PublicKey(id)); // pda

  if (loading) {
    return <div className="">Loading Wager Info</div>;
  }

  return (
    <Box>
      <Link to={`/dashboard`}>
        <h2>{'<- Back to Dashboard'}</h2>
      </Link>

      {account && (
        <WagerInfo id={id} props={account}/>
      )}

    </Box>
  );
}

export default WagerLayout;