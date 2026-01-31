"""
Web3 Backend API Server
"""
import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from web3 import Web3

load_dotenv()

app = FastAPI(
    title="Web3 API",
    description="Backend API for Web3 application",
    version="0.1.0"
)

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Web3 connection
RPC_URL = os.getenv("RPC_URL", "https://eth-mainnet.g.alchemy.com/v2/your-api-key")
w3 = Web3(Web3.HTTPProvider(RPC_URL))


class WalletBalanceResponse(BaseModel):
    address: str
    balance_wei: int
    balance_eth: float


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "ok",
        "connected": w3.is_connected(),
        "message": "Web3 API is running"
    }


@app.get("/balance/{address}", response_model=WalletBalanceResponse)
async def get_balance(address: str):
    """Get the ETH balance of a wallet address"""
    if not w3.is_address(address):
        raise HTTPException(status_code=400, detail="Invalid Ethereum address")

    checksum_address = w3.to_checksum_address(address)
    balance_wei = w3.eth.get_balance(checksum_address)
    balance_eth = w3.from_wei(balance_wei, "ether")

    return WalletBalanceResponse(
        address=checksum_address,
        balance_wei=balance_wei,
        balance_eth=float(balance_eth)
    )


@app.get("/block/latest")
async def get_latest_block():
    """Get the latest block information"""
    block = w3.eth.get_block("latest")
    return {
        "number": block.number,
        "hash": block.hash.hex(),
        "timestamp": block.timestamp,
        "transactions_count": len(block.transactions)
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
