import {
    Button,
    Select,
  } from 'theme-ui'

import {
  useSolanaWallets,
  useActiveWallet,
} from "@privy-io/react-auth";

import { useWallet } from '@solana/wallet-adapter-react'

import {
  PublicKey,
  Transaction,
  SystemProgram,
  TransactionInstruction,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';

import { connection } from '../hooks/useSolanaConnection';
import { addVariant, InstructionVariant, ApprovalState } from '../util/solana';

function SubmitDeposit({ id, stake, paid, refreshAccountRequest }) {

    const buttonType = paid ? "PAID" : "UNPAID";

    const { wallet: activeWallet } = useActiveWallet();
    const { signTransaction } = useWallet();

    const submitDeposit = async () => {
        try {
            console.log("paid", paid);
            console.log("submitting deposit", stake);

            const programId = new PublicKey(import.meta.env.VITE_PROGRAM_ADDRESS);

            const userWallet = new PublicKey(activeWallet.address);

            // const instructionData = new Uint8Array([InstructionVariant.SUBMIT, stake]);

            const encodedData = Buffer.alloc(9);
            encodedData.writeUInt8(2, 0); // Submit variant
            encodedData.writeBigUInt64LE(BigInt(stake), 1);

            const pda = new PublicKey(id)

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
                const signedTx = await activeWallet.signTransaction(transaction)
                const signature = await connection.sendRawTransaction(signedTx.serialize())
                const confirmation = await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature })
                refreshAccountRequest();
                alert(`Stake Deposit complete! Transaction signature: ${signature}`);
            }

        } catch (error) {
            alert(`submit deposit failed: ${error?.message}`);
        }
    }

    return (
        <div className='flex' style={{gap:'1rem'}}>

            <Button disabled variant={buttonType}>
                {buttonType}
            </Button>
            
            { !paid && ( 
                <div className='flex' style={{gap:'1rem'}}>
                    <Button
                        onClick={submitDeposit}
                        sx={{cursor:'pointer'}}
                    >
                        Submit Stake
                    </Button>
                </div>
            )}

        </div>
    );
}

export default SubmitDeposit;