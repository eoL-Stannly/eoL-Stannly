import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useEffect, useState } from 'react'

function App() {
  const { connection } = useConnection()
  const { publicKey, connected } = useWallet()
  const [balance, setBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (publicKey && connected) {
      setLoading(true)
      connection
        .getBalance(publicKey)
        .then((bal) => {
          setBalance(bal / LAMPORTS_PER_SOL)
        })
        .catch(console.error)
        .finally(() => setLoading(false))
    } else {
      setBalance(null)
    }
  }, [publicKey, connected, connection])

  return (
    <div className="app">
      <header>
        <h1>Solana Web3 App</h1>
      </header>

      <main>
        <div className="wallet-section">
          <WalletMultiButton />
        </div>

        {connected && publicKey && (
          <div className="wallet-info">
            <p>
              <strong>Address:</strong>
            </p>
            <p className="address">{publicKey.toBase58()}</p>
            <p>
              <strong>Balance:</strong>{' '}
              {loading ? 'Loading...' : balance !== null ? `${balance.toFixed(4)} SOL` : 'N/A'}
            </p>
          </div>
        )}

        {!connected && (
          <div className="connect-prompt">
            <p>Connect your Solana wallet to get started</p>
            <p className="supported-wallets">
              Supported: Phantom, Solflare, Torus, Ledger
            </p>
          </div>
        )}
      </main>

      <footer>
        <p>Built with React, TypeScript, and Solana Wallet Adapter</p>
      </footer>
    </div>
  )
}

export default App
