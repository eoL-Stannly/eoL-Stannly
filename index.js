const { join } = require('path');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const { createBot } = require('./bot');
const { createServer } = require('./server');
const { TOKEN_MINT, MIN_BALANCE } = require('./solana');

async function main() {
  // Initialize lowdb — uses /tmp on Railway (ephemeral)
  const dbPath = process.env.DB_PATH || join('/tmp', 'db.json');
  const defaultData = { verifiedUsers: [], pendingVerifications: [] };
  const adapter = new JSONFile(dbPath);
  const db = new Low(adapter, defaultData);

  await db.read();
  if (!db.data) {
    db.data = defaultData;
    await db.write();
  }

  // Start the bot
  const bot = createBot(db);
  console.log('Bot started.');

  // Start the verification web server
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const app = createServer(db, bot, chatId);
  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`Verification server on port ${port}`);
    console.log(`Token gate active for mint: ${TOKEN_MINT}`);
    console.log(`Minimum balance required: ${MIN_BALANCE}`);
  });
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
