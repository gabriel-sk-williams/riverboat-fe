import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom'
import '../styles/main.css'
import '../styles/type.css'
import '../styles/flex.css'
import '../styles/layout.css'
import '../styles/entry.css'

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
    Button,
    Flex,
    Text,
    Image
} from 'theme-ui'

import Blockie from './Blockie'

// Component to display a single wager
function WagerLayout({ pda, props }) {

    const { parlor, wallet_a_decision, wallet_b_decision } = props;

    const beliefA = `${Math.floor(parlor.belief_a * 100)}%`;
    const beliefB = `${Math.floor(parlor.belief_b * 100)}%`;

    const updateStatus = () => {
        console.log("updating status!")
    }
    
    return (
        <Box sx={{my:'3rem'}}>
            <h2>PDA: {pda}</h2>
            <h2>{parlor.terms} </h2>
            <Blockie walletAddress={parlor.wallet_a}/>
            <h5>{beliefA}</h5>
            <Blockie walletAddress={parlor.wallet_b}/>
            <h5>{beliefB}</h5>
            <Box sx={{my:'3rem'}}>
            <button onClick={updateStatus}>
                Update Status
            </button>
            </Box>
        </Box>
    );
}

export default WagerLayout;
