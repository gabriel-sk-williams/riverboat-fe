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
import { ApprovalState } from '../util/solana';
import UpdateDualSpace from '../components/UpdateDualSpace';

// Component to display a single wager
function WagerLayout({ id, props }) {

    const { parlor, wallet_a_decision, wallet_b_decision } = props;

    const [ updateA, setUpdateA ] = useState(wallet_a_decision);
    const [ updateB, setUpdateB ] = useState(wallet_b_decision);

    console.log(props);

    const beliefA = `${Math.floor(parlor.belief_a * 100)}%`;
    const beliefB = `${Math.floor(parlor.belief_b * 100)}%`;

    const decisionA = ApprovalState.getApprovalState(wallet_a_decision);
    const decisionB = ApprovalState.getApprovalState(wallet_b_decision);

    const updateStatus = () => {
        console.log("updating status!")
    }
    
    return (
        <Box sx={{my:'3rem'}}>
            
            <Box sx={{
              //padding: '12px 16px',
              //my: '3rem',
              color: 'primary',
              borderBottom: '2px solid #ccc',
              // marginBottom: '-1px',
            }}>
                <div className="flex-center" style={{marginBotton:'3rem'}}>
                    <h2>Wager</h2>
                </div>
            </Box>

            <h2>{id}</h2>
            <h1>{parlor.terms} </h1>


            <h2>Participants:</h2>

            <div className="flex align-vertical" style={{gap:'2rem'}}>
                <Blockie walletAddress={parlor.wallet_a}/>
                <h5>{beliefA}</h5>
                <h5>{decisionA}</h5>
                <UpdateDualSpace id={id} updateChoice={updateA} />
            </div>

            <div className="flex align-vertical" style={{gap:'2rem'}}>
                <Blockie walletAddress={parlor.wallet_b}/>
                <h5>{beliefB}</h5>
                <h5>{decisionB}</h5>
                <UpdateDualSpace id={id} updateChoice={updateB} />
            </div>

            <Box sx={{my:'3rem'}}>
            </Box>
        </Box>
    );
}

export default WagerLayout;
