import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { WalletButton } from './solana/solana-provider';

import { getAccessToken, usePrivy, useLogin, useConnectWallet, useSolanaWallets } from "@privy-io/react-auth";

import { PrivyWalletButton } from './PrivyWalletButton';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const { login } = useLogin({
    onComplete: () => console.log("user logged in")
  });

  const {
    ready,
    authenticated,
    user,
    logout,
    linkWallet,
    unlinkWallet,
  } = usePrivy();

  const { connectWallet } = useConnectWallet();
  const { wallet } = useSolanaWallets();
  
  /*
  useEffect(() => {
    console.log(ready, authenticated)
    if (ready && !authenticated) {
      navigate("/");
    }
  }, [ready, authenticated, navigate]);
  */

  const userWallet = user?.wallet;

  const numAccounts = user?.linkedAccounts?.length || 0;
  //const canRemoveAccount = numAccounts > 1;
  const canRemoveAccount = true;

  const handleLogin = useCallback(() => {
    return login({
      loginMethods: ['wallet'],
      walletChainType: 'ethereum-and-solana', // solana-only
      disableSignup: false
    });
   console.log("loggin in")
  }, [login]);

  const handleConnect = () => {
    return connectWallet({
      //suggestedAddress?: string,
      //walletList?: WalletListEntry[],
      //walletChainType?: 'ethereum' | 'solana'
      walletChainType: 'solana'
    })
  }

  const handleLink = () => {
    return linkWallet()
  }

  const handleLogout = () =>  {
    return logout()
  }
  

  return (
    <nav className="navbar">
      <Link to="/">
        <h1>riverboat</h1>
      </Link>
      <PrivyWalletButton />
      {ready && authenticated ? (
        <button
          style={{
            fontSize: '0.875rem',
            border: '1px solid #7C3AED',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            color: '#7C3AED',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.border = '#6D28D9';
            e.currentTarget.style.color = '#6D28D9';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.border = '#7C3AED';
            e.currentTarget.style.color = '#7C3AED';
          }}
          onClick={handleLogout}
        >
          Unlink wallet
        </button>
      ) : (
        <button
          style={{
            fontSize: '0.875rem',
            backgroundColor: '#7C3AED',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#6D28D9'; // hover:bg-violet-700
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#7C3AED';
          }}
          onClick={handleLogin}
          
        >
          Connect wallet
        </button>
      )}
    </nav>
  );
}

export default Navbar;