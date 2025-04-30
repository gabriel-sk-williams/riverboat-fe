import { useState, useEffect, useCallback } from 'react';
import '../styles/main.css'
import '../styles/type.css'
import '../styles/flex.css'
import '../styles/layout.css'
import '../styles/entry.css'

import { deserialize } from 'borsh';
import makeBlockie from 'ethereum-blockies-base64';

import { 
    PublicKey, 
    SystemProgram, 
    LAMPORTS_PER_SOL, 
    clusterApiUrl,
    Connection,
    Transaction,
    // TransactionMessage,
    // VersionedTransaction,
    // sendAndConfirmTransaction, 
    // ComputeBudgetProgram, 
    // sendAndConfirmRawTransaction,
} from "@solana/web3.js";

import {
    Box,
    Button,
    Flex,
    Text,
    Image
} from 'theme-ui'

/*
Example Wager object:
{
    "account": {
      "data": {
        "type": "Buffer",
        "data": [ 38, 0, 0, 0, ... ]
      },
      "executable": false,
      "lamports": 1740000,
      "owner": "HPQKvAZrphgoifPai59wsYHDRtfd2ESsa4bJPDi9AnK4",
      "rentEpoch": 18446744073709552000,
      "space": 122
    },
    "pubkey": "Gjrp7PJ8LnpRTnHst9iQ5CyySfsXzdtTvMxy1R27Yv6n"
}
*/

const DualSpaceSchema = {
    struct: {
        terms: 'string',
        wallet_a: { array: { type: 'u8', len: 32 }},
        belief_a: 'f64',
        wallet_b: { array: { type: 'u8', len: 32 }},
        belief_b: 'f64',
    }
}



// Component to display a single space
function WagerCard({ data }) {
    const { account, pubkey } = data;

    console.log(account.data)

    // Helper function to decode the buffer data
    const decodeSpaceData = (buffer) => {
        try {
            const deserializedData = deserialize(DualSpaceSchema, buffer);
            return deserializedData
            //console.log("dd", deserializedData)
        } catch (error) {
            console.error("Error decoding space data:", error);
            return { title: "Error decoding data" };
        }
    };
    
    // Parse the data
    const bufferData = Buffer.from(account.data);
    const dd = decodeSpaceData(bufferData);
    console.log(dd)

    // Generate blockie for the wallet address
    const getWalletAvatar = useCallback((address) => {
        try {
            // For Solana addresses, ensure we have a valid format for blockie generation
            const isSolanaAddress = address.length > 0 && !address.startsWith('0x');
            const formattedAddress = isSolanaAddress ? `0x${address.slice(0, 40).padEnd(40, '0')}` : address;
            return makeBlockie(formattedAddress || '0x0');
        } catch (error) {
            console.error("Error generating blockie:", error);
            return '';
        }
    }, []);

    const publicKeyA = new PublicKey(dd.wallet_a);
    const solanaAddressA = publicKeyA.toBase58();

    const publicKeyB = new PublicKey(dd.wallet_b);
    const solanaAddressB = publicKeyB.toBase58();

    const avatarUrlA = getWalletAvatar(solanaAddressA)
    const avatarUrlB = getWalletAvatar(solanaAddressB)
    
    return (
        <div className="wager-card">
            <div className='flex-center'>
                <Box
                    sx={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundImage: `url(${avatarUrlA})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                    }}
                />
                <div classNAme="flex-column">
                    <div>
                        {dd.terms}
                    </div>
                </div>
                <Box
                    sx={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundImage: `url(${avatarUrlA})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                    }}
                />
            </div>
        </div>
    );
}

/*
<div>
{pubkey.toString()}
</div>
<div>
{account.lamports}
</div>
*/

export default WagerCard;