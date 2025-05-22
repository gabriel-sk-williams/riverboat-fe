import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom'
import '../styles/main.css'
import '../styles/type.css'
import '../styles/flex.css'
import '../styles/layout.css'
import '../styles/entry.css'

import { useConnection, useWallet } from '@solana/wallet-adapter-react';

import {
    useSolanaWallets,
    useActiveWallet,
} from "@privy-io/react-auth";

import {
    LAMPORTS_PER_SOL,
    PublicKey,
    Transaction,
    TransactionInstruction,
} from '@solana/web3.js';

import {
    Box,
    Spinner,
    Button,
    Flex,
    Text,
    Image,
} from 'theme-ui'

import Blockie from './Blockie';
import UpdateWager from './UpdateWager';
import { addVariant, InstructionVariant, ApprovalState } from '../util/solana';
import { connection } from '../hooks/useSolanaConnection';
import { calcRisk, truncate, constructSentence, getFavorite } from '../util/wallet';

// Component to display a single wager
function WagerLayout({ id, refreshAccountRequest, props }) {

    const { ready } = useSolanaWallets();
    const { wallet: activeWallet } = useActiveWallet();
    const { signTransaction } = useWallet();

    const { contract, decision_a, decision_b, belief_a, belief_b, paid_a, paid_b } = props;

    const [ update, setUpdate ] = useState(0);

    const publicKeyA = new PublicKey(contract.wallet_a);
    const publicKeyB = new PublicKey(contract.wallet_b);

    const solanaAddressA = publicKeyA.toBase58();
    const solanaAddressB = publicKeyB.toBase58();

    const beliefA = `${Math.floor(belief_a * 100)}%`;
    const beliefB = `${Math.floor(belief_b * 100)}%`;

    const activeButtonA = activeWallet?.address == solanaAddressA;
    const activeButtonB = activeWallet?.address == solanaAddressB;

    const truncatedId = truncate(id);
    const pka = truncate(solanaAddressA);
    const pkb = truncate(solanaAddressB);

    const [ riskA, riskB ] = calcRisk(contract.stake, belief_a, belief_b);
    const [ faveA, faveB ] = getFavorite(belief_a, belief_b);

    const landStatement = constructSentence(pka, beliefA, riskA, faveA);
    const missStatement = constructSentence(pkb, beliefB, riskB, faveB);

    const stakeLamports = Number(contract.stake);
    const stakeSol = stakeLamports / LAMPORTS_PER_SOL;


    const updateStatus = async () => {
        try {
            const programId = new PublicKey(import.meta.env.VITE_PROGRAM_ADDRESS);

            const userWallet = new PublicKey(activeWallet.address);

            const instructionData = new Uint8Array([InstructionVariant.UPDATE, update]);

            console.log("data", instructionData);

            const pda = new PublicKey(id)

            // Create the instruction
            const instruction = new TransactionInstruction({
                keys: [
                { pubkey: pda, isSigner: false, isWritable: true },
                { pubkey: userWallet, isSigner: true, isWritable: true },
                ],
                programId,
                data: instructionData
            });

            const {
                value: { blockhash, lastValidBlockHeight },
            }  = await connection.getLatestBlockhashAndContext();

            const transaction = new Transaction().add(instruction);
            transaction.feePayer = userWallet;
            transaction.recentBlockhash = blockhash;

            if (signTransaction) {
                const signedTx = await activeWallet.signTransaction(transaction)
                const signature = await connection.sendRawTransaction(signedTx.serialize())
                const confirmation = await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature })
                refreshAccountRequest();
                alert(`Wager Update complete! Transaction signature: ${signature}`);
            }
        
        } catch (error) {
            alert(`update wager failed: ${error?.message}`);
        }
    }

    if (!ready) {
        return (
            <div className='flex-center'>
                <Spinner />
            </div>
        );
    }
    
    return (
        <Box sx={{my:'2rem'}}>
            
            <div className="flex-column">
                <h2>Wager: {truncatedId}</h2>
                <h2>Stake: {stakeSol} SOL ({stakeLamports} Lamports) </h2>
            </div>

            <Box sx={{my:'2rem'}}>
                <h1>{contract.terms}</h1>
            </Box>

            <Box sx={{my:'2rem'}}>
                <h2>{landStatement}</h2>
                <h2>{missStatement}</h2>
            </Box>

            <Box sx={{my:'2rem'}}>
                <h2>Participants:</h2>

                <div className="flex align-vertical" style={{gap:'2rem'}}>
                    <Blockie walletAddress={contract.wallet_a}/>
                    <h5>{beliefA}</h5>
                    <UpdateWager 
                        status={decision_a} 
                        active={activeButtonA} 
                        onSelect={setUpdate} 
                        submitUpdate={updateStatus}
                    />
                </div>

                <div className="flex align-vertical" style={{gap:'2rem'}}>
                    <Blockie walletAddress={contract.wallet_b}/>
                    <h5>{beliefB}</h5>
                    <UpdateWager 
                        status={decision_a} 
                        active={activeButtonB} 
                        onSelect={setUpdate} 
                        submitUpdate={updateStatus}
                    />
                </div>
            </Box>
        </Box>
    );
}

export default WagerLayout;
