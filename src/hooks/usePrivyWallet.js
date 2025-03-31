import { usePrivy, useWallets, useLogout, useActiveWallet, useSolanaWallets } from '@privy-io/react-auth';
import { useCallback, useEffect, useReducer, useRef, useMemo } from "react";
import makeBlockie from 'ethereum-blockies-base64';

/*
export interface LinkedWallet {
  address: string;
  formattedAddress: string;
  walletClientType: string;
  isActive: boolean;
  avatar: string;
}

// Define state type
interface WalletState {
  linkedWallets: LinkedWallet[];
  isConnecting: boolean;
  walletAddress: string | null;
  walletDisplayName: string | null;
  isEmbeddedWallet: boolean;
  isConnected: boolean;
  avatar: string | null;
  initialized: boolean;
}

// Define action types
type WalletAction = 
  | { type: 'SET_WALLET_ADDRESS', payload: string | null }
  | { type: 'SET_EMBEDDED_WALLET', payload: boolean }
  | { type: 'SET_CONNECTED', payload: boolean }
  | { type: 'SET_AVATAR', payload: string | null }
  | { type: 'SET_LINKED_WALLETS', payload: LinkedWallet[] }
  | { type: 'SET_INITIALIZED', payload: boolean }
  | { type: 'RESET_STATE' };
*/

// Initial state
const initialState = { // WalletState
  linkedWallets: [],
  isConnecting: false,
  walletAddress: null,
  walletDisplayName: null,
  isEmbeddedWallet: false,
  isConnected: false,
  avatar: null,
  initialized: false
};

// Reducer function
//function walletReducer(state: WalletState, action: WalletAction): WalletState {
function walletReducer(state, action) {
  switch (action.type) {
    case 'SET_WALLET_ADDRESS':
      return { ...state, walletAddress: action.payload };
    case 'SET_EMBEDDED_WALLET':
      return { ...state, isEmbeddedWallet: action.payload };
    case 'SET_CONNECTED':
      return { ...state, isConnected: action.payload };
    case 'SET_AVATAR':
      return { ...state, avatar: action.payload };
    case 'SET_LINKED_WALLETS':
      return { ...state, linkedWallets: action.payload };
    case 'SET_INITIALIZED':
      return { ...state, initialized: action.payload };
    case 'RESET_STATE':
      return { 
        ...initialState,
        initialized: state.initialized // Keep initialization state
      };
    default:
      return state;
  }
}

export const usePrivyWallet = () => {
  const { authenticated, user, login, connectWallet: privyConnectWallet, ready: privyReady } = usePrivy();
  const { wallets: evmWallets, ready: evmWalletsReady } = useWallets();
  const { wallets: solanaWallets, ready: solanaWalletsReady } = useSolanaWallets();
  const { logout } = useLogout();
  const { wallet: activeWallet, setActiveWallet } = useActiveWallet();
  
  // Use reducer for state management
  const [state, dispatch] = useReducer(walletReducer, initialState);
  
  // Track initialization
  const initRef = useRef(false);
  // Track previous values to prevent unnecessary updates
  const prevActiveWalletRef = useRef(null); // <string | null>
  const prevAllWalletsLengthRef = useRef(0); // <number>
  
  // Format wallet address function
  const formatWalletAddress = useCallback((address) => {
    if (!address) return "";
    return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
  }, []);

  // Memoized formatted wallet address
  const formattedWalletAddress = useMemo(() => {
    return formatWalletAddress(state.walletAddress || "");
  }, [formatWalletAddress, state.walletAddress]);
  
  // Get all wallets combined (EVM + Solana)
  const allWallets = useMemo(() => {
    const evm = evmWallets || [];
    const solana = solanaWallets || [];
    return [...evm, ...solana];
  }, [evmWallets, solanaWallets]);
  
  // Wallest ready state
  const walletsReady = useMemo(() => {
    return evmWalletsReady && solanaWalletsReady;
  }, [evmWalletsReady, solanaWalletsReady]);
  
  // Update wallet state when active wallet changes
  useEffect(() => {
    if (!privyReady) return;
    
    // Skip if the wallet address hasn't changed
    if (activeWallet?.address === prevActiveWalletRef.current) return;
    
    // Update previous value ref
    prevActiveWalletRef.current = activeWallet?.address || null;
    
    if (activeWallet) {
      const address = activeWallet.address;
      const avatarUrl = makeBlockie(address);
      
      // Batch updates to prevent multiple renders
      dispatch({ type: 'SET_WALLET_ADDRESS', payload: address });
      dispatch({ type: 'SET_EMBEDDED_WALLET', payload: activeWallet.walletClientType === 'privy' });
      dispatch({ type: 'SET_CONNECTED', payload: true });
      dispatch({ type: 'SET_AVATAR', payload: avatarUrl });
    } else if (authenticated && user?.wallet?.address) {
      // Fallback to user.wallet if no active wallet
      const address = user.wallet.address;
      const avatarUrl = makeBlockie(address);
      
      dispatch({ type: 'SET_WALLET_ADDRESS', payload: address });
      dispatch({ type: 'SET_EMBEDDED_WALLET', payload: user.wallet.walletClientType === 'privy' });
      dispatch({ type: 'SET_CONNECTED', payload: true });
      dispatch({ type: 'SET_AVATAR', payload: avatarUrl });
    } else {
      // Reset state
      dispatch({ type: 'RESET_STATE' });
    }
  }, [activeWallet, authenticated, privyReady, user?.wallet?.address, user?.wallet?.walletClientType]);
  
  // Initialize active wallet once
  useEffect(() => {
    if (initRef.current || !privyReady || !authenticated || !walletsReady) return;
    
    // If there are wallets but no active wallet
    if (!activeWallet && allWallets.length > 0) {
      // Set the first wallet as active
      try {
        setActiveWallet(allWallets[0]);
        initRef.current = true;
      } catch (error) {
        console.error("Error setting initial active wallet:", error);
      }
    } else if (activeWallet) {
      // Already initialized
      initRef.current = true;
    }
  }, [activeWallet, allWallets, authenticated, privyReady, setActiveWallet, walletsReady]);
  
  // Update linked wallets list - with strict equality check to prevent unnecessary updates
  useEffect(() => {
    // Skip if wallet lists haven't changed or user is not authenticated
    if (!authenticated || allWallets.length === prevAllWalletsLengthRef.current) {
      return;
    }
    
    // Skip empty wallet list
    if (allWallets.length === 0) {
      if (state.linkedWallets.length !== 0) {
        dispatch({ type: 'SET_LINKED_WALLETS', payload: [] });
      }
      prevAllWalletsLengthRef.current = 0;
      return;
    }

    // Update reference
    prevAllWalletsLengthRef.current = allWallets.length;

    // Format wallets for UI
    const formattedWallets = allWallets.map(wallet => {
      const address = wallet.address;
      const isActive = address.toLowerCase() === state.walletAddress?.toLowerCase();
      const walletAvatar = makeBlockie(address);
      
      return {
        address,
        formattedAddress: formatWalletAddress(address),
        walletClientType: wallet.walletClientType,
        isActive,
        avatar: walletAvatar
      };
    });
    
    // Deep equality check for wallet list to prevent unnecessary updates
    const walletsChanged = !(
      state.linkedWallets.length === formattedWallets.length &&
      state.linkedWallets.every((wallet, index) => {
        const newWallet = formattedWallets[index];
        return (
          wallet.address === newWallet.address &&
          wallet.isActive === newWallet.isActive &&
          wallet.walletClientType === newWallet.walletClientType
        );
      })
    );
    
    // Only update if wallets have changed
    if (walletsChanged) {
      dispatch({ type: 'SET_LINKED_WALLETS', payload: formattedWallets });
    }
    
    // Set initialized flag if not already set
    if (!state.initialized) {
      dispatch({ type: 'SET_INITIALIZED', payload: true });
    }
  }, [allWallets, authenticated, formatWalletAddress, state.linkedWallets, state.walletAddress, state.initialized]);
  
  // Switch active wallet
  //const switchActiveWallet = useCallback(async (address: string): Promise<boolean> => {
  const switchActiveWallet = useCallback(async (address) => {
    if (!authenticated || !address) return false;
    
    // Skip if already active
    if (address.toLowerCase() === state.walletAddress?.toLowerCase()) {
      return true;
    }
    
    try {
      // Find the wallet in the combined list
      const targetWallet = allWallets.find(
        w => w.address.toLowerCase() === address.toLowerCase()
      );
      
      if (!targetWallet) {
        return false;
      }
      
      // Use the Privy API to switch wallets
      await setActiveWallet(targetWallet);
      return true;
    } catch (error) {
      console.error("Error switching wallet:", error);
      return false;
    }
  }, [allWallets, authenticated, setActiveWallet, state.walletAddress]);
  
  // Add wallet via Privy - specifically for linking a new wallet
  const addWallet = useCallback(() => {
    if (!authenticated) {
      // If not authenticated, do standard login
      return login();
    }
    
    // For authenticated users, use the modal specifically for connecting an additional wallet
    // @ts-ignore modalMode is supported but not in the type definitions
    return privyConnectWallet({ modalMode: 'connectOnly' });
  }, [authenticated, login, privyConnectWallet]);
  
  // Login handler
  const handleLogin = useCallback(() => {
    return login({
      loginMethods: ['wallet'],
      walletChainType: 'solana-only', //'ethereum-and-solana',
      disableSignup: false
    });
  }, [login]);
  
  // Connect or switch wallet
  const connectWallet = useCallback(async () => {
    if (!authenticated) {
      // Start login flow for unauthenticated users
      return handleLogin();
    } else {
      // Open wallet selector for authenticated users
      return addWallet();
    }
  }, [addWallet, authenticated, handleLogin]);
  
  // Disconnect wallet - now properly logs out the user
  const disconnectWallet = useCallback(async () => {
    try {
      // First clear the active wallet
      // @ts-ignore null is a valid value but not in the type definitions
      await setActiveWallet(null);
      
      // Then log the user out of Privy
      await logout();
      
      return true;
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      return false;
    }
  }, [logout, setActiveWallet]);
  
  return {
    isConnected: state.isConnected,
    isConnecting: state.isConnecting,
    isAuthenticated: authenticated,
    walletAddress: state.walletAddress,
    formattedWalletAddress,
    avatar: state.avatar,
    isEmbeddedWallet: state.isEmbeddedWallet,
    activeWallet: activeWallet,
    connectWallet,
    handleLogin,
    addWallet,
    switchActiveWallet,
    disconnectWallet,
    linkedWallets: state.linkedWallets,
    initialized: state.initialized,
  };
}; 