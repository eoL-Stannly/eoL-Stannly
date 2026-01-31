"""
Solana Backend API Server
"""
import os
import base58
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from solana.rpc.api import Client
from solders.pubkey import Pubkey

load_dotenv()

app = FastAPI(
    title="Solana API",
    description="Backend API for Solana Web3 application",
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

# Solana RPC connection
RPC_URL = os.getenv("SOLANA_RPC_URL", "https://api.mainnet-beta.solana.com")
client = Client(RPC_URL)


class WalletBalanceResponse(BaseModel):
    address: str
    balance_lamports: int
    balance_sol: float


class TokenAccountResponse(BaseModel):
    mint: str
    amount: int
    decimals: int


@app.get("/")
async def root():
    """Health check endpoint"""
    try:
        version = client.get_version()
        return {
            "status": "ok",
            "connected": True,
            "solana_version": version.value.solana_core,
            "message": "Solana API is running"
        }
    except Exception as e:
        return {
            "status": "error",
            "connected": False,
            "message": str(e)
        }


def is_valid_solana_address(address: str) -> bool:
    """Validate a Solana public key address"""
    try:
        decoded = base58.b58decode(address)
        return len(decoded) == 32
    except Exception:
        return False


@app.get("/balance/{address}", response_model=WalletBalanceResponse)
async def get_balance(address: str):
    """Get the SOL balance of a wallet address"""
    if not is_valid_solana_address(address):
        raise HTTPException(status_code=400, detail="Invalid Solana address")

    try:
        pubkey = Pubkey.from_string(address)
        response = client.get_balance(pubkey)
        balance_lamports = response.value
        balance_sol = balance_lamports / 1_000_000_000  # 1 SOL = 1 billion lamports

        return WalletBalanceResponse(
            address=address,
            balance_lamports=balance_lamports,
            balance_sol=balance_sol
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/slot/latest")
async def get_latest_slot():
    """Get the latest slot information"""
    try:
        slot = client.get_slot()
        block_time = client.get_block_time(slot.value)

        return {
            "slot": slot.value,
            "timestamp": block_time.value if block_time.value else None,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/account/{address}")
async def get_account_info(address: str):
    """Get account information for a Solana address"""
    if not is_valid_solana_address(address):
        raise HTTPException(status_code=400, detail="Invalid Solana address")

    try:
        pubkey = Pubkey.from_string(address)
        response = client.get_account_info(pubkey)

        if response.value is None:
            raise HTTPException(status_code=404, detail="Account not found")

        account = response.value
        return {
            "address": address,
            "lamports": account.lamports,
            "owner": str(account.owner),
            "executable": account.executable,
            "rent_epoch": account.rent_epoch,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/tokens/{address}")
async def get_token_accounts(address: str):
    """Get SPL token accounts for a wallet address"""
    if not is_valid_solana_address(address):
        raise HTTPException(status_code=400, detail="Invalid Solana address")

    try:
        pubkey = Pubkey.from_string(address)
        # Token Program ID
        token_program = Pubkey.from_string("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")

        response = client.get_token_accounts_by_owner(
            pubkey,
            {"programId": token_program}
        )

        tokens = []
        for account in response.value:
            tokens.append({
                "pubkey": str(account.pubkey),
                "account": {
                    "lamports": account.account.lamports,
                    "owner": str(account.account.owner),
                }
            })

        return {"address": address, "token_accounts": tokens}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
