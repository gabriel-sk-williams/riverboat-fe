
// import { useState, useEffect, useCallback } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { WalletButton } from './solana/solana-provider';
// import { getAccessToken, usePrivy, useLogin, useConnectWallet, useSolanaWallets } from "@privy-io/react-auth";
// import { PrivyWalletButton } from './PrivyWalletButton';

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

import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { serialize } from 'borsh';
import { addVariant, InstructionVariant } from '../util/solana';
import { connection } from '../hooks/useSolanaConnection';
import { DualSpaceSchema } from "../util/borsh";
import { sha256 } from '@noble/hashes/sha2';
// import { TextEncoder } from 'util';


function CreateDualSpace({ terms, walletA, beliefA, walletB, beliefB,  }) {

  const { wallets, ready } = useSolanaWallets();
  const { signTransaction } = useWallet();

  const createSpace = async () => {
    try {
      const programId = new PublicKey(import.meta.env.VITE_PROGRAM_ADDRESS);

      // Hash the terms
      const termsBytes = new TextEncoder().encode(terms); // Uint8Array
      const termsHash = sha256(termsBytes); // Uint8Array of length 32

      const donationAddress = import.meta.env.VITE_DONATION_WALLET;
      const desiredWallet = wallets.find((wallet) => wallet.address === donationAddress);
      const userWallet = new PublicKey(desiredWallet.address);

      const publicWalletA = new PublicKey(walletA);
      const publicWalletB = new PublicKey(walletB);

      console.log("pa", publicWalletA);
      console.log("pb", publicWalletB);

      const [pda, bump] = PublicKey.findProgramAddressSync(
        [
          termsHash,
          publicWalletA.toBuffer(),
          publicWalletB.toBuffer(),
        ],
        programId
      );

      console.log(`PDA: ${pda}`);
      console.log(`Bump: ${bump}`);
      
      const dualSpace = {
        terms: terms,
        wallet_a: publicWalletA.toBytes(),
        belief_a: beliefA,
        wallet_b: publicWalletB.toBytes(),
        belief_b: beliefB,
      };

      console.log("ds", dualSpace)

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

      console.log("instruction", instruction);
      const transaction = new Transaction().add(instruction);
      transaction.feePayer = userWallet;
      transaction.recentBlockhash = blockhash;

      
      if (signTransaction) {
        const signedTx = await desiredWallet.signTransaction(transaction)
        const signature = await connection.sendRawTransaction(signedTx.serialize())

        const confirmation = await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature })
        alert(`Space Creation complete! Transaction signature: ${signature}`);
      }

      // return signature;

    } catch (error) {
      alert(`create space failed: ${error?.message}`);
      // console.log(error.GetLogs())
    }
  }

  return (
    <div>
      <button onClick={createSpace}>
        Create Space
      </button>
    </div>
  )
}

export default CreateDualSpace;