import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { WalletButton } from './solana/solana-provider';

import { getAccessToken, usePrivy, useLogin, useConnectWallet, useSolanaWallets } from "@privy-io/react-auth";
import { PrivyWalletButton } from './PrivyWalletButton';

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


function GetSpaces() {

    const getSpaces = async () => {
        try {
            const connection = new Connection(clusterApiUrl('devnet'));
            console.log("connection", connection)

            const programId = new PublicKey('7JiTvmnVTBHXisWWiFVpM1Ca8NAjBY2GgUGexL8AWr8q');
            const accounts = await connection.getProgramAccounts(programId);
            console.log("accounts", accounts);

        } catch (error) {
            alert(`Transaction failed: ${error?.message}`);
        }
    }

    return (
        <div>
            <button onClick={getSpaces}>
                GetSpaces
            </button>
        </div>
    )
}

export default GetSpaces;