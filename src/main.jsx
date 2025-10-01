import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PrivyProvider } from "@privy-io/react-auth";
import { ThemeUIProvider } from 'theme-ui'
import theme from './theme'
import Index from './index.jsx'
import './styles/main.css'

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
        appearance: {
          walletChainType: 'solana-only',
        },
        externalWallets: {
          solana: {connectors: solanaConnectors}
        }
      }}
    >
      <ThemeUIProvider theme={theme}>
        <Index />
      </ThemeUIProvider>
    </PrivyProvider>
  </StrictMode>,
)
