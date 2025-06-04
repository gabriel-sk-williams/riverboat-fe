import { useState, useMemo, useEffect, useCallback } from 'react';

import {
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';

import { connection } from './useSolanaConnection';
import { validSolanaWallet } from '../util/wallet';
import { deserializeWager } from '../util/borsh';
import { addVariant, InstructionVariant, ApprovalState } from '../util/solana';


export default function useAccountRequest(accountId, signTransaction, activeWallet) {

    const [loading, setLoading] = useState(false); // boolean
    const [status, setStatus] = useState(null); // string || null
    const [error, setError] = useState(null); // string || null
    const [account, setAccount] = useState(false); // {}

    const programId = new PublicKey(import.meta.env.VITE_PROGRAM_ADDRESS);
    const pda = new PublicKey(accountId)

    async function getAccount() {
        try {
            setStatus(null);
            setLoading(true);
            const response = await connection.getAccountInfo(pda);
            const wagerAccount = deserializeWager(response.data)
            setAccount(wagerAccount);
        } catch (error) {
            setLoading(false);
            setStatus(error);
        } finally {
            setLoading(false);
        }
    }

    async function submitDeposit(stakeAmount) {
        try {
            const userWallet = new PublicKey(activeWallet.address);

            // TODO cleanup
            const encodedData = Buffer.alloc(9);
            encodedData.writeUInt8(2, 0); // Submit variant
            encodedData.writeBigUInt64LE(BigInt(stakeAmount), 1);

            // Create the instruction
            const instruction = new TransactionInstruction({
                keys: [
                { pubkey: pda, isSigner: false, isWritable: true },
                { pubkey: userWallet, isSigner: true, isWritable: true },
                { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }
                ],
                programId,
                data: encodedData
            });

            const {
                value: { blockhash, lastValidBlockHeight },
            }  = await connection.getLatestBlockhashAndContext();

            const transaction = new Transaction().add(instruction);
            transaction.feePayer = userWallet;
            transaction.recentBlockhash = blockhash;

            if (signTransaction) {
                const signedTx = await activeWallet.signTransaction(transaction);
                const signature = await connection.sendRawTransaction(signedTx.serialize());
                const confirmation = await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature });
                alert(`Stake Deposit complete! Transaction signature: ${signature}`);
            }

        } catch (error) {
            alert(`submit deposit failed: ${error?.message}`);
            setStatus(`submit deposit failed: ${error?.message}`);
        } finally {
            getAccount();
        }
    }

    async function updateBelief(belief) {
        try {
            const userWallet = new PublicKey(activeWallet.address);

            const instructionData = new Uint8Array([InstructionVariant.UPDATE, belief]);
            console.log(instructionData);

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
                alert(`Belief Update complete! Transaction signature: ${signature}`);
            }
        
        } catch (error) {
            setStatus(`update belief failed: ${error?.message}`)
        } finally {
            getAccount();
        }
    }

    async function lockSubmission(bool) {
        try {

        } catch (error) {
            setStatus(`update wager failed: ${error?.message}`);
        } finally {
            getAccount();
        }
    }

    async function setApproval(approval) {
        try {
            const userWallet = new PublicKey(activeWallet.address);

            const instructionData = new Uint8Array([InstructionVariant.SET, approval]);

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
                alert(`Wager Update complete! Transaction signature: ${signature}`);
            }
        
        } catch (error) {
            setStatus(`update wager failed: ${error?.message}`);
        } finally {
            getAccount();
        }
    }

    useEffect(() => {
        getAccount();
    }, []);

    
    useEffect(() => {
        const validWallet = validSolanaWallet(activeWallet);

        if (!validWallet) {
            setError("Please connect a valid Solana wallet.");
            //setStatus("invalid_wallet");
        } else {
            setError(null);
            //setStatus("valid_solana_wallet");
        }
    }, [activeWallet]);
    
   
    return { loading, status, error, account, submitDeposit, updateBelief, lockSubmission, setApproval };
}