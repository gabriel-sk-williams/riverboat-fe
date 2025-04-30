import React, { useState, useEffect, useRef, useCallback, memo } from 'react'
import makeBlockie from 'ethereum-blockies-base64'


// Generate blockie for the wallet address
export const getWalletAvatar = useCallback((address) => {
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