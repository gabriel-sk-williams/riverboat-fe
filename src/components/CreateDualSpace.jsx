
import {
  useSolanaWallets,
  useActiveWallet,
} from "@privy-io/react-auth";

import {
  Button
} from 'theme-ui'

import {
  PublicKey,
  Transaction,
  SystemProgram,
  TransactionInstruction,
} from '@solana/web3.js';

import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { serialize } from 'borsh';
import { addVariant, InstructionVariant } from '../util/solana';
import { connection } from '../hooks/useSolanaConnection';
import { DualSpaceSchema } from "../util/borsh";
import { sha256 } from '@noble/hashes/sha2';


function CreateDualSpace({ stake, terms, walletA, walletB, beliefA, beliefB }) {

  const { wallet: activeWallet } = useActiveWallet();
  const { signTransaction } = useWallet();

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
        alert(`Wager Creation complete! Transaction signature: ${signature}`);
      }

    } catch (error) {
      alert(`create wager failed: ${error?.message}`);
    }
  }

  return (
    <Button onClick={createSpace} sx={{cursor:'pointer'}}>
      Create Wager
    </Button>
  )
}

export default CreateDualSpace;