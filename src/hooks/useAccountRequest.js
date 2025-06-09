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
    const wagerPda = new PublicKey(accountId)

    async function getAccount() {
        try {
            setStatus(null);
            setLoading(true);
            const response = await connection.getAccountInfo(wagerPda);
            const wagerAccount = deserializeWager(response.data)
            // console.log("wawa", wagerAccount);
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
            encodedData.writeUInt8(2, 0); // InstructionVariant.SUBMIT_DEPOSIT
            encodedData.writeBigUInt64LE(BigInt(stakeAmount), 1);

            // find vault PDA TODO: export function?
            const [vaultPda, vaultBump] = PublicKey.findProgramAddressSync(
                [
                Buffer.from("vault"),
                wagerPda.toBuffer(),
                ],
                programId
            );

            // Create the instruction
            const instruction = new TransactionInstruction({
                keys: [
                { pubkey: wagerPda, isSigner: false, isWritable: true },
                { pubkey: vaultPda, isSigner: false, isWritable: true },
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

            const instructionData = new Uint8Array([InstructionVariant.UPDATE_BELIEF, belief]);

            // Create the instruction
            const instruction = new TransactionInstruction({
                keys: [
                { pubkey: wagerPda, isSigner: false, isWritable: true },
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
            console.log(error);
            setStatus(`belief update failed: ${error?.message}`);
        } finally {
            getAccount();
        }
    }

    async function lockSubmission() {
        try {
            const userWallet = new PublicKey(activeWallet.address);

            const instructionData = new Uint8Array([InstructionVariant.LOCK_SUBMISSION]);

            // Create the instruction
            const instruction = new TransactionInstruction({
                keys: [
                { pubkey: wagerPda, isSigner: false, isWritable: true },
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
                alert(`Submission Locked! Transaction signature: ${signature}`);
            }

        } catch (error) {
            setStatus(`lock submission failed: ${error?.message}`);
        } finally {
            getAccount();
        }
    }

    async function setApproval(approval) {
        try {
            const userWallet = new PublicKey(activeWallet.address);

            const instructionData = new Uint8Array([InstructionVariant.SET_APPROVAL, approval]);

            // Create the instruction
            const instruction = new TransactionInstruction({
                keys: [
                { pubkey: wagerPda, isSigner: false, isWritable: true },
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
                alert(`Wager Outcome Approved! Transaction signature: ${signature}`);
            }
        
        } catch (error) {
            setStatus(`approve outcome failed: ${error?.message}`);
        } finally {
            getAccount();
        }
    }

    async function claimPayout() {
        try{
            console.log("claiming payout...")
        } catch (error) {
            setStatus(`claim payout failed: ${error?.message}`);
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
    
   
    return { loading, status, error, account, submitDeposit, updateBelief, lockSubmission, setApproval, claimPayout };
}