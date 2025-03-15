import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PrivyProvider } from "@privy-io/react-auth";
import Index from './index.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PrivyProvider
      appId={import.meta.env.VITE_PRIVY_APP_ID}
      onSuccess={(user) => console.log(`User ${user.id} logged in!`)}
    >
      <Index />
    </PrivyProvider>
  </StrictMode>,
)
