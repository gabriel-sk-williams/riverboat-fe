import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { WalletButton } from './solana/solana-provider';

import { getAccessToken, usePrivy, useLogin, useConnectWallet, useSolanaWallets } from "@privy-io/react-auth";
import { PrivyWalletButton } from './PrivyWalletButton';
import { connection } from '../hooks/useSolanaConnection';

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
import { serialize } from 'borsh';


function GetSpace() {

    const getSpace = async () => {
        try {
            const programId = new PublicKey(import.meta.env.VITE_PROGRAM_ADDRESS);
            const accounts = await connection.getProgramAccounts(programId);
            console.log("accounts", accounts);
        } catch (error) {
            alert(`Transaction failed: ${error?.message}`);
        }
    }

    return (
        <div>
            <button onClick={getSpace}>
                Get Space
            </button>
        </div>
    )
}

export default GetSpace;