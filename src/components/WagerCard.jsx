import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom'
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

    const beliefA = `${Math.floor(dd.belief_a * 100)}%`;
    const beliefB = `${Math.floor(dd.belief_b * 100)}%`;
    
    return (
        <Link to={`/${data.account.owner}`}>
            <Box sx={{
                padding: '1rem',
                border: `1px solid #d4d3d3`,
                borderRadius: '8px',
            }}>
                <Flex sx={{alignItems: 'center', gap: '2rem'}}>
                    <Box sx={{
                        width: '4rem',
                        height: '4rem',
                        borderRadius: '50%',
                        backgroundImage: `url(${avatarUrlA})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}/>
                    <h5>{beliefA}</h5>
                    <Box sx={{
                        border: `1px solid #ccc`,
                        borderRadius: '8px',
                        p:'1rem',
                    }}>
                        <Text sx={{
                            width: '24rem',
                            lineHeight: '1.5em',
                            maxHeight: 'calc(1.5em * 3)+2',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                        }}>
                            Trump switches to Regular Coke in 2025, 
                            then he also does a backflip and eats SHIT lmao
                            Are you fricking kidding me big dawg, he's outta control
                            for real dude!
                        </Text>
                    </Box>
                    <h5>{beliefB}</h5>
                    <Box sx={{
                        width: '4rem',
                        height: '4rem',
                        borderRadius: '50%',
                        backgroundImage: `url(${avatarUrlB})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}/>
                </Flex>
            </Box>
        </Link>
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