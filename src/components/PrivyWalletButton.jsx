import React, { useState, useEffect, useRef, useCallback, memo } from 'react'
import { usePrivyWallet } from '../hooks/usePrivyWallet'   // '@/hooks/usePrivyWallet'
import { usePrivy, useWallets, useSolanaWallets } from '@privy-io/react-auth'
import makeBlockie from 'ethereum-blockies-base64'

import {
  Box,
  Button,
  Flex,
  Text,
  Image
} from 'theme-ui'

/*
// Define wallet interface based on what we need for display
interface DisplayWallet {
  address: string;
  walletClientType: string;
  isActive: boolean;
}

interface PrivyWalletButtonProps {
  text?: string;
  style?: any;
  mobile?: boolean;
}
*/

const PrivyWalletButtonBase = ({ text, style, mobile = false }) => { // PrivyWalletButtonProps
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [userWallets, setUserWallets] = useState([]); // <DisplayWallet[]>
    const walletUpdateRef = useRef(false);
    
    const privy = usePrivy();
    const { wallets: evmWallets } = useWallets(); // EVM/Ethereum wallets
    const { wallets: solanaWallets } = useSolanaWallets(); // Solana wallets

    const {
        ready,
        authenticated,
        user,
        logout,
        linkWallet,
        unlinkWallet,
    } = usePrivy();
    
    const { 
        isConnected,
        isAuthenticated,
        connectWallet,
        handleLogin,
        addWallet,
        formattedWalletAddress,
        disconnectWallet,
        isEmbeddedWallet,
        walletAddress,
        activeWallet,
        switchActiveWallet,
        linkedWallets
    } = usePrivyWallet();
  
    // Use linkedWallets from usePrivyWallet instead of maintaining our own state
    useEffect(() => {
        if (linkedWallets.length > 0) {
        // Convert LinkedWallet to DisplayWallet
        const displayWallets = linkedWallets.map(wallet => ({
            address: wallet.address,
            walletClientType: wallet.walletClientType,
            isActive: wallet.isActive
        }));
        
        setUserWallets(displayWallets);
        }
    }, [linkedWallets]);

    // Handle wallet switching using our direct method
    const handleWalletClick = useCallback(async (address) => {
        if (!address) {
        setShowDropdown(false);
        addWallet();
        return;
        }
        
        // Check if the wallet is already active
        if (walletAddress === address) {
        setShowDropdown(false);
        return;
        }
        
        setShowDropdown(false);
        
        try {
        // Try direct wallet switching
        const success = await switchActiveWallet(address);
        
        if (!success) {
            // If direct switching fails, try the wallet selector
            addWallet();
        }
        } catch (error) {
        console.error("Error switching wallet:", error);
        addWallet();
        }
    }, [addWallet, switchActiveWallet, walletAddress]);

    const handleButtonClick = useCallback(() => {
        if (!isAuthenticated) {
        // If user is not logged in, show login flow
        handleLogin();
        } else if (isAuthenticated && !isConnected) {
        // If authenticated but no wallet connected, show wallet connection
        addWallet();
        } else if (isConnected) {
        // If already connected, toggle the dropdown
        setShowDropdown(!showDropdown);
        }
    }, [addWallet, handleLogin, isAuthenticated, isConnected, showDropdown]);

    const handleDisconnect = useCallback(() => {
        console.log("disconnecting")
        setShowDropdown(false);
        logout();
    }, [disconnectWallet]);

    const handleOpenWalletSelector = useCallback(() => {
        setShowDropdown(false);
        addWallet();
    }, [addWallet]);

    // Handle clicks outside of the dropdown
    useEffect(() => {
        const handleClickOutside = (event) => { //MouseEven
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        // Add event listener only when dropdown is shown
        if (showDropdown) {
        document.addEventListener('mousedown', handleClickOutside);
        
            // Clean up event listener
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
        return undefined;
    }, [showDropdown, dropdownRef]);

    const buttonText = isConnected && isAuthenticated
        ? formattedWalletAddress
        : text || (isAuthenticated ? "Link Wallet" : "Connect Wallet");

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

    const avatarUrl = walletAddress ? getWalletAvatar(walletAddress) : '';
    //const avatarUrl = walletAddress;

    // Updated common button styles to match theme toggle button
    const buttonCommonStyle = {
        background: '#0B0813',
        border: '2px solid #743DC0',
        boxShadow: '0px 4px 0px 0px #743DC0',
        borderRadius: '0 !important',
        color: 'white',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        transition: 'all 0.2s ease',
        fontFamily: 'Inter, sans-serif',
    };

    return (
        <Flex sx={{ position: 'relative' }} ref={dropdownRef}>
        <Button
            onClick={handleButtonClick}
            sx={{
            ...buttonCommonStyle,
            padding: isConnected ? '10px 16px' : '10px 24px',
            gap: '8px',
            width: mobile ? '100%' : 'auto',
            fontWeight: '400',
            fontSize: '16px',
            letterSpacing: '0.5px',
            '&:hover': {
                backgroundColor: 'rgba(116, 61, 192, 0.1)'
            },
            // Custom mobile styling
            ...(mobile && {
                height: '40px',
                padding: isConnected ? '8px 12px' : '8px 16px',
                minWidth: isConnected ? '120px' : '140px',
                fontSize: '14px',
                // If space is very limited, show a shorter version
                ...(isConnected && {
                padding: '8px',
                minWidth: '40px',
                justifyContent: 'center',
                })
            }),
            ...style
            }}
        >
            {isConnected && walletAddress && (
            <Box
                sx={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundImage: `url(${avatarUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
                }}
            />
            )}
            <Text sx={{ 
            fontSize: ['12px', '14px'], 
            fontFamily: 'Inter, sans-serif',
            // Hide text on very small mobile if connected (just show the icon)
            display: (mobile && isConnected) ? ['none', 'block'] : 'block'
            }}>
            {buttonText}
            </Text>
        </Button>

        {showDropdown && isConnected && (
            <Box
            sx={{
                position: 'absolute',
                top: '44px', // Adjusted to account for box shadow
                right: 0,
                width: '260px',
                backgroundColor: '#0B0813',
                border: '2px solid #743DC0',
                boxShadow: '0px 4px 0px 0px #743DC0',
                zIndex: 100,
                padding: '16px',
                borderRadius: '0 !important',
                fontFamily: 'Inter, sans-serif',
            }}
            >
            {/* Wallet Options */}
            <Box sx={{ py: 1 }}>
                <Text sx={{ 
                fontSize: '14px', 
                fontWeight: 'bold', 
                mb: 2,
                color: 'rgba(255, 255, 255, 0.7)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontFamily: 'Inter, sans-serif'
                }}>
                Your Wallets
                </Text>
                
                {userWallets.map((wallet) => (
                <Flex
                    key={wallet.address}
                    onClick={() => handleWalletClick(wallet.address)}
                    sx={{
                    py: 2,
                    px: 2,
                    cursor: 'pointer',
                    alignItems: 'center',
                    gap: 2,
                    backgroundColor: activeWallet?.address === wallet.address ? 'rgba(116, 61, 192, 0.3)' : 'transparent',
                    borderRadius: '4px',
                    transition: 'all 0.2s ease',
                    }}
                >
                    <Box
                    sx={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundImage: `url(${getWalletAvatar(wallet.address)})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                    />
                    <Flex sx={{ flexDirection: 'column', flex: 1 }}>
                    <Text sx={{ 
                        fontSize: '14px', 
                        color: 'white', 
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: activeWallet?.address === wallet.address ? 'bold' : 'normal'
                    }}>
                        {wallet.address.substring(0, 4)}...{wallet.address.substring(wallet.address.length - 4)}
                    </Text>
                    <Text sx={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)', fontFamily: 'Inter, sans-serif' }}>
                        {wallet.walletClientType}
                        {activeWallet?.address === wallet.address && <span style={{ marginLeft: '4px', color: '#743DC0' }}>(Active)</span>}
                    </Text>
                    </Flex>
                    {activeWallet?.address === wallet.address && (
                    <Box sx={{ 
                        backgroundColor: '#743DC0', 
                        borderRadius: '50%', 
                        width: '8px', 
                        height: '8px',
                        marginLeft: '8px'
                    }} />
                    )}
                </Flex>
                ))}
                
                {/* Add Wallet Button */}
                <Button
                onClick={handleOpenWalletSelector}
                sx={{
                    mt: 2,
                    width: '100%',
                    py: 2,
                    backgroundColor: 'rgba(116, 61, 192, 0.1)',
                    border: '1px solid #743DC0',
                    color: '#743DC0',
                    fontWeight: 'bold',
                    fontFamily: 'Inter, sans-serif',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    '&:hover': {
                    backgroundColor: 'rgba(116, 61, 192, 0.2)',
                    border: '1px solid #743DC0'
                    }
                }}
                >
                <span>+</span> Link New Wallet
                </Button>
            </Box>

            {/* Action buttons */}
            <Flex sx={{ 
                flexDirection: 'column', 
                borderTop: '1px solid rgba(255, 255, 255, 0.1)', 
                mt: 3, 
                pt: 3,
                px: 2
            }}>
                <Button
                onClick={handleDisconnect}
                sx={{
                    width: '100%',
                    py: 2,
                    backgroundColor: 'transparent',
                    border: '2px solid rgba(220, 53, 69, 0.5)',
                    color: 'rgba(220, 53, 69, 0.8)',
                    fontWeight: 'normal',
                    fontFamily: 'Inter, sans-serif',
                    cursor: 'pointer',
                    '&:hover': {
                    backgroundColor: 'rgba(220, 53, 69, 0.05)',
                    border: '2px solid rgba(220, 53, 69, 0.8)',
                    color: 'rgba(220, 53, 69, 1)'
                    }
                }}
                >
                Sign Out
                </Button>
            </Flex>
            </Box>
        )}
        </Flex>
    );
    };

    // Export a memoized version to prevent unnecessary re-renders
    export const PrivyWalletButton = memo(PrivyWalletButtonBase);

    export default PrivyWalletButton; 