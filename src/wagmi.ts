import { http, createConfig } from 'wagmi'
import { baseSepolia, sepolia } from 'wagmi/chains'
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors'

export const config = createConfig({
  chains: [baseSepolia, sepolia],
  connectors: [
    injected(),
    coinbaseWallet(),
    walletConnect({ projectId: import.meta.env.WC_PROJECT_ID }),
  ],
  transports: {
    [baseSepolia.id]: http(import.meta.env.BASE_SEPOLIA_RPC),
    [sepolia.id]: http(import.meta.env.SEPOLIA_RPC),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
