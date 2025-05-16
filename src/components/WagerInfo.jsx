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
import UpdateDualSpace from '../components/UpdateDualSpace';
import { addVariant, InstructionVariant, ApprovalState } from '../util/solana';
import { connection } from '../hooks/useSolanaConnection';
import { calcRisk, truncate, constructSentence, getFavorite } from '../util/wallet';

// Component to display a single wager
function WagerLayout({ id, refreshAccountRequest, props }) {

    const { ready } = useSolanaWallets();
    const { wallet: activeWallet } = useActiveWallet();
    const { signTransaction } = useWallet();

    const { parlor, wallet_a_decision, wallet_b_decision } = props;

    const [ update, setUpdate ] = useState(0);

    const publicKeyA = new PublicKey(parlor.wallet_a);
    const publicKeyB = new PublicKey(parlor.wallet_b);

    const solanaAddressA = publicKeyA.toBase58();
    const solanaAddressB = publicKeyB.toBase58();

    const beliefA = `${Math.floor(parlor.belief_a * 100)}%`;
    const beliefB = `${Math.floor(parlor.belief_b * 100)}%`;

    const activeButtonA = activeWallet?.address == solanaAddressA;
    const activeButtonB = activeWallet?.address == solanaAddressB;

    const truncatedId = truncate(id);
    const pka = truncate(solanaAddressA);
    const pkb = truncate(solanaAddressB);

    const [ riskA, riskB ] = calcRisk(parlor.stake, parlor.belief_a, parlor.belief_b);
    const [ faveA, faveB ] = getFavorite(beliefA, beliefB);

    const landStatement = constructSentence(pka, beliefA, riskA, faveA);
    const missStatement = constructSentence(pkb, beliefB, riskB, faveB);


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
                <h2>Stake: {parlor.stake} SOL</h2>
            </div>

            <Box sx={{my:'2rem'}}>
                <h1>{parlor.terms}</h1>
            </Box>

            <Box sx={{my:'2rem'}}>
                <h2>{landStatement}</h2>
                <h2>{missStatement}</h2>
            </Box>

            <Box sx={{my:'2rem'}}>
                <h2>Participants:</h2>

                <div className="flex align-vertical" style={{gap:'2rem'}}>
                    <Blockie walletAddress={parlor.wallet_a}/>
                    <h5>{beliefA}</h5>
                    <UpdateDualSpace 
                        status={wallet_a_decision} 
                        active={activeButtonA} 
                        onSelect={setUpdate} 
                        submitUpdate={updateStatus}
                    />
                </div>

                <div className="flex align-vertical" style={{gap:'2rem'}}>
                    <Blockie walletAddress={parlor.wallet_b}/>
                    <h5>{beliefB}</h5>
                    <UpdateDualSpace 
                        status={wallet_b_decision} 
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
