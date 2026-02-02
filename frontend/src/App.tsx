import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useEffect, useState } from 'react'
import { PriceDashboard } from './components/PriceDashboard'

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
        <h1>SOLANA_TERMINAL</h1>
        <div className="wallet-header">
          <WalletMultiButton />
        </div>
      </header>

      <main>
        {connected && publicKey && (
          <div className="wallet-info">
            <div className="wallet-badge">
              <span className="wallet-label">CONNECTED</span>
              <span className="wallet-address">{publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}</span>
              <span className="wallet-balance">
                {loading ? '...' : balance !== null ? `${balance.toFixed(4)} SOL` : '0 SOL'}
              </span>
            </div>
          </div>
        )}

        <PriceDashboard />

        {!connected && (
          <div className="connect-prompt">
            <p>Connect wallet to access full functionality</p>
            <p className="supported-wallets">
              phantom | solflare | ledger
            </p>
          </div>
        )}
      </main>

      <footer>
        <p>solana // pyth network // react</p>
      </footer>
    </div>
  )
}

export default App
