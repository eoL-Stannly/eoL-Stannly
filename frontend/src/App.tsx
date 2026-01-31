import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi'

function App() {
  const { address, isConnected } = useAccount()
  const { connectors, connect } = useConnect()
  const { disconnect } = useDisconnect()
  const { data: balance } = useBalance({ address })

  return (
    <div className="app">
      <header>
        <h1>Web3 App</h1>
      </header>

      <main>
        {isConnected ? (
          <div className="wallet-info">
            <p>Connected: {address}</p>
            {balance && (
              <p>Balance: {balance.formatted} {balance.symbol}</p>
            )}
            <button onClick={() => disconnect()}>Disconnect</button>
          </div>
        ) : (
          <div className="connect-options">
            <h2>Connect Wallet</h2>
            {connectors.map((connector) => (
              <button
                key={connector.uid}
                onClick={() => connect({ connector })}
              >
                {connector.name}
              </button>
            ))}
          </div>
        )}
      </main>

      <footer>
        <p>Built with React, TypeScript, and wagmi</p>
      </footer>
    </div>
  )
}

export default App
