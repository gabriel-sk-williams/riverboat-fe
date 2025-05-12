import {
    useSolanaWallets,
    // useActiveWallet,
    // getAccessToken, 
    // usePrivy, 
    // useLogin,
    // useSendTransaction,
} from "@privy-io/react-auth";

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


import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { addVariant, InstructionVariant, ApprovalState } from '../util/solana';
import { connection } from '../hooks/useSolanaConnection';
import { DualSpaceSchema } from "../util/borsh";
import { sha256 } from '@noble/hashes/sha2';

function UpdateDualSpace({ id, updateChoice }) {

    const { wallets, ready } = useSolanaWallets();
    const { signTransaction } = useWallet();

    const updateStatus = async () => {
        try {

            const programId = new PublicKey(import.meta.env.VITE_PROGRAM_ADDRESS);

            const donationAddress = import.meta.env.VITE_DONATION_WALLET;
            const desiredWallet = wallets.find((wallet) => wallet.address === donationAddress);
            const userWallet = new PublicKey(desiredWallet.address);

            const instructionData = new Uint8Array([InstructionVariant.UPDATE, ApprovalState.LANDED])

            console.log("id", instructionData);

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
                const signedTx = await desiredWallet.signTransaction(transaction)
                const signature = await connection.sendRawTransaction(signedTx.serialize())
                const confirmation = await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature })
                alert(`Wager Update complete! Transaction signature: ${signature}`);
            }
        
        } catch (error) {
            alert(`update wager failed: ${error?.message}`);
        }
    }

    return (
        <Button 
            onClick={updateStatus} 
            sx={{cursor:'pointer'}}>
                Update Status
        </Button>
    )
}

export default UpdateDualSpace;