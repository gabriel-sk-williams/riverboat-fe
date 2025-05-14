import { useState, useEffect, useCallback } from 'react';

import {
    useSolanaWallets,
    useActiveWallet,
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
    Select,
    Flex,
    Text,
    Image
  } from 'theme-ui'


import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { addVariant, InstructionVariant, ApprovalState } from '../util/solana';
import { connection } from '../hooks/useSolanaConnection';
import { DualSpaceSchema } from "../util/borsh";
import { sha256 } from '@noble/hashes/sha2';

function UpdateDualSpace({ status, active, onSelect, submitUpdate }) {

    const buttonType = ApprovalState.getApprovalState(status);

    const updateStates = ['Pending', 'Landed', 'Missed', 'Push'];
    
    const handleSelect = (e) => {
        const value = e.target.value;
        const index = ApprovalState.getApprovalIndex(value)
        onSelect(index);
    };

    return (
        <div className='flex' style={{gap:'1rem'}}>
            <Button disabled variant={buttonType}>
                    {buttonType}
            </Button>
            
            { active && ( 
                <div className='flex' style={{gap:'1rem'}}>
                    <Select 
                        defaultValue='Select'
                        onChange={handleSelect}
                        sx={{width:'12rem'}}
                    >
                        {updateStates.map((status) => (
                            <option key={status} value={status}>
                            {status}
                            </option>
                        ))}
                    </Select>

                    <Button
                        onClick={submitUpdate}
                        sx={{cursor:'pointer'}}>
                        Submit
                    </Button>
                </div>
            )}

        </div>
    );
}

export default UpdateDualSpace;