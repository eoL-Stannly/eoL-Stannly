const express = require('express');
const nacl = require('tweetnacl');
const bs58 = require('bs58');
const { meetsMinimum, TOKEN_MINT, MIN_BALANCE } = require('./solana');

function createServer(db, bot, chatId) {
  const app = express();
  app.use(express.json());

  // Health check
  app.get('/', (_req, res) => {
    res.send('Solana Token Gate Bot is running.');
  });

  // Serve the wallet-connect verification page
  app.get('/verify/:token', async (req, res) => {
    const { token } = req.params;
    const pending = db.data.pendingVerifications.find(
      (p) => p.token === token && p.expiresAt > Date.now()
    );

    if (!pending) {
      return res.status(410).send(expiredPage());
    }

    res.send(verificationPage(token));
  });

  // API: receive signed verification
  app.post('/verify/:token', async (req, res) => {
    const { token } = req.params;
    const { publicKey, signature } = req.body;

    const pendingIndex = db.data.pendingVerifications.findIndex(
      (p) => p.token === token && p.expiresAt > Date.now()
    );

    if (pendingIndex === -1) {
      return res.status(410).json({ error: 'Verification link expired or invalid.' });
    }

    const pending = db.data.pendingVerifications[pendingIndex];

    // Verify the signature using tweetnacl
    try {
      const message = new TextEncoder().encode(pending.message);
      const sig = bs58.decode(signature);
      const pubkey = bs58.decode(publicKey);
      const valid = nacl.sign.detached.verify(message, sig, pubkey);

      if (!valid) {
        return res.status(400).json({ error: 'Invalid signature.' });
      }
    } catch (err) {
      console.error('Signature verification error:', err);
      return res.status(400).json({ error: 'Signature verification failed.' });
    }

    // Check token balance
    const { balance, meets } = await meetsMinimum(publicKey);

    // Remove from pending
    db.data.pendingVerifications.splice(pendingIndex, 1);

    if (meets) {
      // Save verified wallet
      const existing = db.data.verifiedUsers.find(
        (u) => u.telegramId === pending.telegramId
      );
      if (existing) {
        existing.wallet = publicKey;
        existing.balance = balance;
        existing.verifiedAt = Date.now();
      } else {
        db.data.verifiedUsers.push({
          telegramId: pending.telegramId,
          username: pending.username,
          wallet: publicKey,
          balance,
          verifiedAt: Date.now(),
        });
      }
      await db.write();

      try {
        await bot.sendMessage(
          pending.telegramId,
          `✅ *Verified!*\nWallet: \`${publicKey}\`\nBalance: ${balance} tokens\nYou're all set in the group.`,
          { parse_mode: 'Markdown' }
        );
      } catch (e) {
        console.error('Could not DM user after verification:', e.message);
      }

      return res.json({ success: true, balance });
    } else {
      // Kick user — balance too low
      try {
        await bot.banChatMember(chatId, pending.telegramId);
        // Immediately unban so they can rejoin after acquiring tokens
        await bot.unbanChatMember(chatId, pending.telegramId);
      } catch (e) {
        console.error('Could not kick user:', e.message);
      }

      try {
        await bot.sendMessage(
          pending.telegramId,
          `❌ *Verification failed.*\nYour balance is ${balance} — minimum ${MIN_BALANCE} required.\nAcquire tokens and rejoin to try again.`,
          { parse_mode: 'Markdown' }
        );
      } catch (e) {
        console.error('Could not DM user after failed verification:', e.message);
      }

      return res.json({ success: false, balance, required: MIN_BALANCE });
    }
  });

  return app;
}

function expiredPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Link Expired</title>
  <style>
    body{font-family:system-ui,sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;background:#0e0e10;color:#fff}
    .card{background:#1a1a2e;padding:2rem;border-radius:12px;text-align:center;max-width:400px}
    h1{color:#ff6b6b}
  </style>
</head>
<body>
  <div class="card">
    <h1>Link Expired</h1>
    <p>This verification link has expired or was already used.</p>
    <p>Send <code>/verify</code> to the bot to get a new link.</p>
  </div>
</body>
</html>`;
}

function verificationPage(token) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Verify Wallet</title>
  <style>
    *{box-sizing:border-box}
    body{font-family:system-ui,sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;background:#0e0e10;color:#fff}
    .card{background:#1a1a2e;padding:2rem;border-radius:12px;text-align:center;max-width:440px;width:90%}
    h1{margin-bottom:.5rem;color:#9945ff}
    p{color:#aaa;line-height:1.5}
    .btn{display:block;width:100%;padding:14px;margin:8px 0;border:none;border-radius:8px;font-size:16px;font-weight:600;cursor:pointer;transition:opacity .2s}
    .btn:hover{opacity:.85}
    .phantom{background:#ab9ff2;color:#000}
    .solflare{background:#fc822b;color:#fff}
    .backpack{background:#e33e3f;color:#fff}
    .glow{background:#39d98a;color:#000}
    #status{margin-top:1rem;padding:12px;border-radius:8px;display:none}
    .success{background:#1a3a2a;color:#39d98a;display:block!important}
    .error{background:#3a1a1a;color:#ff6b6b;display:block!important}
    .loading{background:#1a1a3a;color:#ab9ff2;display:block!important}
  </style>
</head>
<body>
  <div class="card">
    <h1>Token Gate Verification</h1>
    <p>Connect your Solana wallet and sign a message to prove ownership. We'll check your token balance.</p>

    <button class="btn phantom" onclick="connectWallet('phantom')">Connect Phantom</button>
    <button class="btn solflare" onclick="connectWallet('solflare')">Connect Solflare</button>
    <button class="btn backpack" onclick="connectWallet('backpack')">Connect Backpack</button>
    <button class="btn glow" onclick="connectWallet('glow')">Connect Glow</button>

    <div id="status"></div>
  </div>

  <script>
    const token = '${token}';

    function setStatus(msg, type) {
      const el = document.getElementById('status');
      el.textContent = msg;
      el.className = type;
    }

    function getProvider(name) {
      switch (name) {
        case 'phantom': return window.phantom?.solana;
        case 'solflare': return window.solflare;
        case 'backpack': return window.backpack;
        case 'glow': return window.glowSolana;
        default: return null;
      }
    }

    async function connectWallet(name) {
      setStatus('Connecting...', 'loading');

      const provider = getProvider(name);
      if (!provider) {
        setStatus(name.charAt(0).toUpperCase() + name.slice(1) + ' wallet not detected. Please install it.', 'error');
        return;
      }

      try {
        const resp = await provider.connect();
        const publicKey = resp.publicKey.toString();

        setStatus('Signing message...', 'loading');

        // Fetch the expected message from the page context (embedded by server)
        const msgResp = await fetch('/verify/' + token);
        const message = 'Please sign this message to verify your wallet for the Telegram token gate.';
        const encoded = new TextEncoder().encode(message);
        const signed = await provider.signMessage(encoded, 'utf8');

        // bs58 encode the signature
        const signature = btoa(String.fromCharCode(...signed.signature))
          .replace(/=/g, '');

        // We need bs58 — use a minimal inline implementation
        const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
        function toBase58(bytes) {
          const digits = [0];
          for (const byte of bytes) {
            let carry = byte;
            for (let j = 0; j < digits.length; j++) {
              carry += digits[j] << 8;
              digits[j] = carry % 58;
              carry = (carry / 58) | 0;
            }
            while (carry > 0) {
              digits.push(carry % 58);
              carry = (carry / 58) | 0;
            }
          }
          let str = '';
          for (let i = 0; i < bytes.length && bytes[i] === 0; i++) str += '1';
          for (let i = digits.length - 1; i >= 0; i--) str += ALPHABET[digits[i]];
          return str;
        }

        const sigBase58 = toBase58(signed.signature);

        setStatus('Verifying on-chain...', 'loading');

        const verifyRes = await fetch('/verify/' + token, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ publicKey, signature: sigBase58 }),
        });

        const result = await verifyRes.json();

        if (result.success) {
          setStatus('Verified! Balance: ' + result.balance + ' tokens. You can close this page.', 'success');
        } else {
          setStatus('Insufficient balance: ' + result.balance + ' (need ' + result.required + '). Acquire tokens and rejoin.', 'error');
        }
      } catch (err) {
        console.error(err);
        setStatus('Error: ' + (err.message || 'Connection failed'), 'error');
      }
    }
  </script>
</body>
</html>`;
}

module.exports = { createServer };
