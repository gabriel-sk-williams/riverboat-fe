
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
import { addVariant } from '../util/solana';
import { connection } from '../hooks/useSolanaConnection';

const DualSpaceSchema = {
  struct: {
    terms: 'string',
    wallet_a: { array: { type: 'u8', len: 32 }},
    belief_a: 'f64',
    wallet_b: { array: { type: 'u8', len: 32 }},
    belief_b: 'f64',
  }
}

function CreateDualSpace({ variant, terms }) {

  const { wallets, ready } = useSolanaWallets();
  const { signTransaction } = useWallet();

  const createSpace = async () => {
    try {
      console.log("var", variant);
      console.log("terms", terms);

      const programId = new PublicKey(import.meta.env.VITE_PROGRAM_ADDRESS);

      const seeds = [Buffer.from("gerben")];
      const [pda, bump] = PublicKey.findProgramAddressSync(
        seeds,
        programId
      );

      console.log(`PDA: ${pda}`);
      console.log(`Bump: ${bump}`);

      const opposingWallet = new PublicKey("HWeDsoC6T9mCfaGKvoF7v6WdZyfEFhU2VaPEMzEjCq3J");

      //const userWallet = new PublicKey("7V4wLNxUvejyeZ5Bmr2GpvfBL1mZxzQMhsyR7noiM3uD").toBytes();
      const desiredWallet = wallets.find((wallet) => wallet.address === '7V4wLNxUvejyeZ5Bmr2GpvfBL1mZxzQMhsyR7noiM3uD');
      const userWallet = new PublicKey(desiredWallet.address);
      
      const dualSpace = {
        terms: "Trump switches to Regular Coke in 2025",
        wallet_a: userWallet.toBytes(),
        belief_a: 0.65,
        wallet_b: opposingWallet.toBytes(),
        belief_b: 0.88,
      };

      const serializedData = serialize(DualSpaceSchema, dualSpace);
      const instructionData = addVariant(variant, serializedData);

      // Create the instruction
      const instruction = new TransactionInstruction({
        keys: [
          { pubkey: pda, isSigner: false, isWritable: true },
          { pubkey: userWallet, isSigner: true, isWritable: true },
          { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        ],
        programId,
        data: instructionData // instructionData.slice(0, serializedData.length + 1), // Cut off the unused part
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

      console.log(error.GetLogs())
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