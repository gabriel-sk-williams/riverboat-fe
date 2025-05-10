import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom'
import '../styles/main.css'
import '../styles/type.css'
import '../styles/flex.css'
import '../styles/layout.css'
import '../styles/entry.css'

import { Box } from 'theme-ui'

import { PublicKey } from "@solana/web3.js";

import makeBlockie from 'ethereum-blockies-base64';

function Blockie({ walletAddress }) {

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

    const publicKey = new PublicKey(walletAddress);
    const solanaAddress = publicKey.toBase58();
    const avatarUrl = getWalletAvatar(solanaAddress)
    
    return (
        <Box sx={{
            width: '4rem',
            height: '4rem',
            borderRadius: '50%',
            backgroundImage: `url(${avatarUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }}/>

    );
}

export default Blockie;