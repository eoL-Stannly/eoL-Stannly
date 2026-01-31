/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SOLANA_NETWORK: 'devnet' | 'testnet' | 'mainnet-beta'
  readonly VITE_SOLANA_RPC_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
