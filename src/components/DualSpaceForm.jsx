import { useState, useEffect, useCallback } from 'react';

import PercentageField from '../components/PercentageField';
import CurrencyField from '../components/CurrencyField';

import {
  useSolanaWallets,
  useActiveWallet,
} from "@privy-io/react-auth";

import {
    Textarea,
    Box,
    Field,
    Button,
    Label
} from 'theme-ui'

import {
  PublicKey,
  Transaction,
  SystemProgram,
  TransactionInstruction,
} from '@solana/web3.js';

import { useWallet } from '@solana/wallet-adapter-react'
import { serialize } from 'borsh';
import { addVariant, InstructionVariant } from '../util/solana';
import { connection } from '../hooks/useSolanaConnection';
import { DualSpaceSchema } from "../util/borsh";
import { sha256 } from '@noble/hashes/sha2';

/*
    {
        "stake": 0.1,
        "terms": "Trump switches to Regular Coke in 2025",
        "wallet_a": '7V4wLNxUvejyeZ5Bmr2GpvfBL1mZxzQMhsyR7noiM3uD',
        "belief_a": 0.65,
        "wallet_b": 'BjEUqQuAB4RRAKhMjtXE9r2PfKeTQRqLMbgbhrJkS1Qu',
        "belief_b": 0.88
    }
*/

function DualSpaceForm({ refreshProgramRequest }) {

    const [ stake, setStake ] = useState(0.1);
    const [ walletA, setWalletA ] = useState(import.meta.env.VITE_DONATION_WALLET);
    const [ walletB, setWalletB ] = useState(import.meta.env.VITE_DEV_WALLET_A);
    const [ beliefA, setBeliefA ] = useState(0.0);
    const [ beliefB, setBeliefB ] = useState(0.0);
    const [ terms, setTerms ] = useState('');

    const { wallet: activeWallet } = useActiveWallet();
    const { signTransaction } = useWallet();

    const handleStakeInputChange = (event) => {
        const floatAmount = parseFloat(event.target.value);
        setStake(floatAmount);
    }

    const handleWalletAInputChange = (event) => {
        setWalletA(event.target.value);
    }

    const handleWalletBInputChange = (event) => {
        setWalletB(event.target.value);
    }

    const handleBeliefAInputChange = (event) => {
        const integer = parseInt(event.target.value);
        const belief = integer / 100;
        setBeliefA(belief);
    }

    const handleBeliefBInputChange = (event) => {
        const integer = parseInt(event.target.value);
        const belief = integer / 100;
        setBeliefB(belief);
    }

    const handleTermsInputChange = (event) => {
        setTerms(event.target.value);
    }

    const createSpace = async () => {
        try {
            const programId = new PublicKey(import.meta.env.VITE_PROGRAM_ADDRESS);

            // Hash the terms
            const termsBytes = new TextEncoder().encode(terms); // Uint8Array
            const termsHash = sha256(termsBytes); // Uint8Array of length 32

            const userWallet = new PublicKey(activeWallet.address);

            const publicWalletA = new PublicKey(walletA);
            const publicWalletB = new PublicKey(walletB);

            const [pda, bump] = PublicKey.findProgramAddressSync(
                [
                termsHash,
                publicWalletA.toBuffer(),
                publicWalletB.toBuffer(),
                ],
                programId
            );
            
            const dualSpace = {
                terms: terms,
                wallet_a: publicWalletA.toBytes(),
                wallet_b: publicWalletB.toBytes(),
                belief_a: beliefA,
                belief_b: beliefB,
                stake: stake,
            };

            const serializedData = serialize(DualSpaceSchema, dualSpace);
            const instructionData = addVariant(InstructionVariant.CREATE, serializedData);

            // Create the instruction
            const instruction = new TransactionInstruction({
                keys: [
                { pubkey: pda, isSigner: false, isWritable: true },
                { pubkey: userWallet, isSigner: true, isWritable: true },
                { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
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
                refreshProgramRequest();
                alert(`Wager Creation complete! Transaction signature: ${signature}`);
            }

        } catch (error) {
            alert(`create wager failed: ${error?.message}`);
        }
    }

    return (

        <Box sx={{mt:'1rem'}}>
            <h2 className="center">Create Wager</h2>

            <div className="flex-container center" style={{marginTop:'1rem'}}>
                <CurrencyField label="Stake" onInputChange={handleStakeInputChange} />
            </div>

            <div className="flex-container">
                <Field 
                    label="Wallet A" 
                    name="walletA" 
                    defaultValue={import.meta.env.VITE_DONATION_WALLET} // temp
                    onChange={handleWalletAInputChange} 
                    sx={{mb:'1rem'}}
                />
                <PercentageField label="Belief A" onInputChange={handleBeliefAInputChange} />
            </div>
            
            <div className="flex-container">
                <Field 
                    label="Wallet B" 
                    name="walletB" 
                    defaultValue={import.meta.env.VITE_DEV_WALLET_A} // temp
                    onChange={handleWalletBInputChange} 
                    sx={{mb:'1rem'}}
                />
                <PercentageField label="Belief B" onInputChange={handleBeliefBInputChange} />

            </div>
            
            <Label htmlFor="textarea">Terms</Label>
            <Textarea
                sx={{
                    height: '10rem',
                    width: '24rem',
                    resize: 'vertical',
                    whiteSpace: 'pre-wrap',
                    overflowWrap: 'break-word',
                    lineHeight: '1.5',
                    fontFamily: 'body',
                }}
                placeholder="Type your terms here..."
                onChange={handleTermsInputChange} 
            />
            <div className='flex-center' style={{marginTop:'1.5rem'}}>
                <Button onClick={createSpace} sx={{cursor:'pointer'}}>
                    Create Wager
                </Button>
                {/*
                <CreateDualSpace
                    stake={stake}
                    terms={terms}
                    walletA={walletA}
                    walletB={walletB}
                    beliefA={beliefA}
                    beliefB={beliefB}
                />
                */}
            </div>
        </Box>
    )
}

export default DualSpaceForm;