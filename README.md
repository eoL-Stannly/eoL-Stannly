# Solana Web3 App

A full-stack Solana Web3 application with Python backend, TypeScript/React frontend, and Anchor/Rust programs.

## Project Structure

```
solana-web3-app/
├── backend/              # Python FastAPI backend
│   ├── main.py           # API server with Solana integration
│   └── requirements.txt  # Python dependencies
├── frontend/             # React + TypeScript frontend
│   ├── src/
│   │   ├── App.tsx       # Wallet connection UI
│   │   ├── main.tsx      # Solana wallet providers
│   │   └── index.css     # Styling
│   └── package.json
├── programs/             # Anchor/Rust programs
│   └── example_token/
│       ├── src/lib.rs    # SPL Token program
│       └── Cargo.toml
├── scripts/              # Deployment scripts
│   └── deploy.ts
├── tests/                # Test files
│   ├── test_backend.py   # Python API tests
│   └── example_token.ts  # Anchor program tests
├── Anchor.toml           # Anchor configuration
├── Cargo.toml            # Rust workspace
└── package.json          # Node dependencies
```

## Features

- **Wallet Connection**: Connect with Phantom, Solflare, Torus, Ledger
- **Balance Display**: View SOL balance for connected wallet
- **SPL Tokens**: View token accounts and balances
- **Anchor Programs**: Example token program with mint, transfer, burn
- **Python API**: FastAPI backend with solana-py integration

## Prerequisites

- Node.js >= 18
- Python >= 3.10
- Rust >= 1.70
- Solana CLI >= 1.17
- Anchor CLI >= 0.29

### Install Solana & Anchor

```bash
# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/v1.17.0/install)"

# Install Anchor CLI
cargo install --git https://github.com/coral-xyz/anchor avm --locked
avm install latest
avm use latest

# Generate a new keypair (if needed)
solana-keygen new
```

## Getting Started

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Copy environment variables
cp ../.env.example .env

# Run the server
uvicorn main:app --reload
```

### Frontend Setup

```bash
cd frontend
npm install

# Copy environment variables
cp ../.env.example .env.local

# Run development server
npm run dev
```

### Program Development

```bash
# Install dependencies
npm install

# Start local validator
solana-test-validator

# Build programs
anchor build

# Deploy to localnet
anchor deploy --provider.cluster localnet

# Run tests
anchor test
```

### Deploy to Devnet

```bash
# Configure for devnet
solana config set --url devnet

# Airdrop SOL for deployment
solana airdrop 2

# Deploy
anchor deploy --provider.cluster devnet
```

## Environment Variables

Create a `.env` file based on `.env.example`:

| Variable | Description |
|----------|-------------|
| `SOLANA_RPC_URL` | Solana RPC endpoint for backend |
| `VITE_SOLANA_NETWORK` | Network: devnet, testnet, or mainnet-beta |
| `VITE_SOLANA_RPC_URL` | Optional custom RPC for frontend |

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /` | Health check with Solana version |
| `GET /balance/{address}` | Get SOL balance |
| `GET /slot/latest` | Get latest slot info |
| `GET /account/{address}` | Get account details |
| `GET /tokens/{address}` | Get SPL token accounts |

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Solana Wallet Adapter
- **Backend**: Python, FastAPI, solana-py, solders
- **Programs**: Rust, Anchor, SPL Token
- **Testing**: Pytest, Mocha/Chai

## Resources

- [Solana Docs](https://docs.solana.com/)
- [Anchor Book](https://book.anchor-lang.com/)
- [Solana Wallet Adapter](https://github.com/solana-labs/wallet-adapter)
- [solana-py](https://github.com/michaelhly/solana-py)

## License

MIT License - see [LICENSE](LICENSE) for details.
