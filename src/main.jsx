import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PrivyProvider } from "@privy-io/react-auth";
import Index from './index.jsx'

import {toSolanaWalletConnectors} from '@privy-io/react-auth/solana';

const solanaConnectors = toSolanaWalletConnectors({
  // By default, shouldAutoConnect is enabled
  shouldAutoConnect: true,
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PrivyProvider
      appId={import.meta.env.VITE_PRIVY_APP_ID}
      connectors={solanaConnectors}
      onSuccess={(user) => console.log(`User ${user.id} logged in!`)}
      config={{
        // appearance: {walletChainType: 'ethereum-and-solana'}, // 'solana-only'},
        /*
        solanaClusters: [
          {name: 'mainnet-beta', rpcUrl: 'https://api.mainnet-beta.solana.com'},
          {name: 'devnet', rpcUrl: 'https://api.devnet.solana.com'},
          {name: 'testnet', rpcUrl: 'https://api.testnet.solana.com'}
        ],
        */
        externalWallets: {
          solana: {connectors: solanaConnectors}
        }
      }}
    >
      <Index />
    </PrivyProvider>
  </StrictMode>,
)
