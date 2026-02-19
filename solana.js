const HELIUS_API_KEY = process.env.HELIUS_API_KEY;
const TOKEN_MINT = 'He6cuy4NxvzVTWudB2qu7dyrxwkYXtWsbAXwNMzKeZQM';
const MIN_BALANCE = 1.0;

async function getTokenBalance(walletAddress) {
  const url = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;

  const body = {
    jsonrpc: '2.0',
    id: 1,
    method: 'getTokenAccountsByOwner',
    params: [
      walletAddress,
      { mint: TOKEN_MINT },
      { encoding: 'jsonParsed' },
    ],
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (data.error) {
    console.error('Helius RPC error:', data.error);
    return 0;
  }

  const accounts = data.result?.value || [];
  if (accounts.length === 0) return 0;

  let total = 0;
  for (const account of accounts) {
    const info = account.account.data.parsed.info;
    const amount = parseFloat(info.tokenAmount.uiAmountString || '0');
    total += amount;
  }

  return total;
}

async function meetsMinimum(walletAddress) {
  const balance = await getTokenBalance(walletAddress);
  return { balance, meets: balance >= MIN_BALANCE };
}

module.exports = { getTokenBalance, meetsMinimum, TOKEN_MINT, MIN_BALANCE };
