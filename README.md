# Web3

A full-stack Web3 application with Python backend, TypeScript/React frontend, and Solidity smart contracts.

## Project Structure

```
Web3/
├── backend/           # Python FastAPI backend
│   ├── main.py        # API server with Web3 integration
│   └── requirements.txt
├── frontend/          # React + TypeScript frontend
│   ├── src/
│   │   ├── App.tsx    # Main app with wallet connection
│   │   ├── wagmi.ts   # Wagmi configuration
│   │   └── ...
│   └── package.json
├── contracts/         # Solidity smart contracts
│   ├── ExampleToken.sol
│   ├── hardhat.config.ts
│   └── package.json
├── scripts/           # Deployment scripts
│   └── deploy.ts
└── tests/             # Test files
```

## Features

- **Wallet Connection**: Connect with MetaMask, WalletConnect, and other wallets
- **Balance Display**: View ETH balance for connected wallet
- **Smart Contracts**: ERC20 token example with deployment scripts
- **Python API**: FastAPI backend with Web3.py integration

## Getting Started

### Prerequisites

- Node.js >= 18
- Python >= 3.10
- npm or yarn

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Copy environment variables
cp ../.env.example .env
# Edit .env with your RPC URL

# Run the server
uvicorn main:app --reload
```

### Frontend Setup

```bash
cd frontend
npm install

# Copy environment variables
cp ../.env.example .env.local
# Edit .env.local with your WalletConnect project ID

# Run development server
npm run dev
```

### Smart Contracts Setup

```bash
cd contracts
npm install

# Compile contracts
npm run compile

# Run local node
npm run node

# Deploy to local network (in another terminal)
npm run deploy:local
```

## Environment Variables

Create a `.env` file based on `.env.example`:

| Variable | Description |
|----------|-------------|
| `RPC_URL` | Ethereum RPC endpoint (Alchemy, Infura, etc.) |
| `VITE_WALLETCONNECT_PROJECT_ID` | WalletConnect Cloud project ID |
| `PRIVATE_KEY` | Private key for contract deployment |
| `ETHERSCAN_API_KEY` | Etherscan API key for verification |

## Tech Stack

- **Frontend**: React, TypeScript, Vite, wagmi, viem
- **Backend**: Python, FastAPI, Web3.py
- **Smart Contracts**: Solidity, Hardhat, OpenZeppelin
- **Testing**: Pytest, Hardhat Test

## License

MIT License - see [LICENSE](LICENSE) for details.
