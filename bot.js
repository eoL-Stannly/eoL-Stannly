const TelegramBot = require('node-telegram-bot-api');
const { v4: uuidv4 } = require('uuid');
const { meetsMinimum, TOKEN_MINT, MIN_BALANCE } = require('./solana');

const VERIFY_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

function createBot(db) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const publicUrl = process.env.PUBLIC_URL;
  const checkInterval = parseInt(process.env.CHECK_INTERVAL_MINUTES || '60', 10);

  if (!token || !chatId || !publicUrl) {
    throw new Error('Missing required env vars: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, PUBLIC_URL');
  }

  const bot = new TelegramBot(token, { polling: true });

  const VERIFY_MESSAGE = 'Please sign this message to verify your wallet for the Telegram token gate.';

  // /start command
  bot.onText(/\/start/, async (msg) => {
    if (msg.chat.type !== 'private') return;
    await bot.sendMessage(
      msg.chat.id,
      `👋 *Welcome to the Token Gate Bot!*\n\nThis bot verifies you hold at least ${MIN_BALANCE} of the required SPL token to stay in the group.\n\nCommands:\n/verify — Get a verification link\n/status — Check your linked wallet\n/removewallet — Unlink your wallet`,
      { parse_mode: 'Markdown' }
    );
  });

  // /verify command
  bot.onText(/\/verify/, async (msg) => {
    const userId = msg.from.id;
    const username = msg.from.username || msg.from.first_name || String(userId);

    const verifyToken = uuidv4();
    const link = `${publicUrl}/verify/${verifyToken}`;

    // Store pending verification
    db.data.pendingVerifications.push({
      token: verifyToken,
      telegramId: userId,
      username,
      message: VERIFY_MESSAGE,
      expiresAt: Date.now() + VERIFY_EXPIRY_MS,
    });
    await db.write();

    try {
      await bot.sendMessage(
        userId,
        `🔗 *Verify your wallet*\n\nClick the link below, connect your Solana wallet, and sign the message.\n\n[Open Verification Page](${link})\n\n⏰ This link expires in 10 minutes.`,
        { parse_mode: 'Markdown', disable_web_page_preview: true }
      );

      // If sent from group, also reply in group
      if (msg.chat.type !== 'private') {
        await bot.sendMessage(
          msg.chat.id,
          `📩 @${username}, I sent you a DM with a verification link. Check your messages!`
        );
      }
    } catch (e) {
      // User hasn't started the bot in DM
      if (msg.chat.type !== 'private') {
        await bot.sendMessage(
          msg.chat.id,
          `⚠️ @${username}, I can't DM you. Please start a conversation with me first, then try /verify again.`
        );
      }
    }
  });

  // /status command
  bot.onText(/\/status/, async (msg) => {
    if (msg.chat.type !== 'private') return;
    const userId = msg.from.id;
    const user = db.data.verifiedUsers.find((u) => u.telegramId === userId);

    if (!user) {
      return bot.sendMessage(userId, '❌ No wallet linked. Use /verify to link one.');
    }

    const { balance, meets } = await meetsMinimum(user.wallet);
    user.balance = balance;
    await db.write();

    await bot.sendMessage(
      userId,
      `📊 *Wallet Status*\n\nWallet: \`${user.wallet}\`\nBalance: ${balance} tokens\nRequired: ${MIN_BALANCE}\nStatus: ${meets ? '✅ Verified' : '❌ Below minimum'}`,
      { parse_mode: 'Markdown' }
    );
  });

  // /removewallet command
  bot.onText(/\/removewallet/, async (msg) => {
    if (msg.chat.type !== 'private') return;
    const userId = msg.from.id;
    const index = db.data.verifiedUsers.findIndex((u) => u.telegramId === userId);

    if (index === -1) {
      return bot.sendMessage(userId, '❌ No wallet linked.');
    }

    db.data.verifiedUsers.splice(index, 1);
    await db.write();
    await bot.sendMessage(userId, '✅ Wallet removed. Use /verify to link a new one.');
  });

  // /checkall command (admins only, group only)
  bot.onText(/\/checkall/, async (msg) => {
    if (msg.chat.type === 'private') return;
    if (String(msg.chat.id) !== String(chatId)) return;

    // Check if user is admin
    try {
      const member = await bot.getChatMember(chatId, msg.from.id);
      if (!['creator', 'administrator'].includes(member.status)) {
        return bot.sendMessage(msg.chat.id, '⚠️ Only admins can run /checkall.');
      }
    } catch (e) {
      return;
    }

    await bot.sendMessage(msg.chat.id, '🔄 Checking all verified wallets...');
    await runPeriodicCheck(bot, db, chatId);
    await bot.sendMessage(msg.chat.id, '✅ Check complete.');
  });

  // New member join handler
  bot.on('message', async (msg) => {
    if (!msg.new_chat_members) return;
    if (String(msg.chat.id) !== String(chatId)) return;

    for (const member of msg.new_chat_members) {
      if (member.is_bot) continue;

      const userId = member.id;
      const username = member.username || member.first_name || String(userId);

      // Check if already verified
      const existing = db.data.verifiedUsers.find((u) => u.telegramId === userId);
      if (existing) {
        const { meets } = await meetsMinimum(existing.wallet);
        if (meets) {
          await bot.sendMessage(chatId, `✅ Welcome back, @${username}! Wallet still verified.`);
          continue;
        }
      }

      // Send DM with verification link
      const verifyToken = uuidv4();
      const link = `${publicUrl}/verify/${verifyToken}`;

      db.data.pendingVerifications.push({
        token: verifyToken,
        telegramId: userId,
        username,
        message: VERIFY_MESSAGE,
        expiresAt: Date.now() + VERIFY_EXPIRY_MS,
      });
      await db.write();

      try {
        await bot.sendMessage(
          userId,
          `👋 *Welcome!*\n\nTo stay in the group, you need to verify you hold at least ${MIN_BALANCE} of the required token.\n\n[Click here to verify](${link})\n\n⏰ You have 10 minutes.`,
          { parse_mode: 'Markdown', disable_web_page_preview: true }
        );
        await bot.sendMessage(
          chatId,
          `👋 Welcome @${username}! I've sent you a DM with verification instructions. Please complete verification within 10 minutes.`
        );
      } catch (e) {
        await bot.sendMessage(
          chatId,
          `⚠️ @${username}, I can't DM you. Please message me directly first, then send /verify.`
        );
      }
    }
  });

  // Periodic balance re-check
  setInterval(
    () => runPeriodicCheck(bot, db, chatId),
    checkInterval * 60 * 1000
  );

  // Clean up expired verifications every 5 minutes
  setInterval(async () => {
    const before = db.data.pendingVerifications.length;
    db.data.pendingVerifications = db.data.pendingVerifications.filter(
      (p) => p.expiresAt > Date.now()
    );
    if (db.data.pendingVerifications.length !== before) {
      await db.write();
    }
  }, 5 * 60 * 1000);

  return bot;
}

async function runPeriodicCheck(bot, db, chatId) {
  console.log(`[Periodic Check] Checking ${db.data.verifiedUsers.length} verified users...`);

  for (const user of [...db.data.verifiedUsers]) {
    try {
      const { balance, meets } = await meetsMinimum(user.wallet);
      user.balance = balance;

      if (!meets) {
        console.log(`[Periodic Check] User ${user.username} (${user.telegramId}) below minimum: ${balance}`);
        try {
          await bot.banChatMember(chatId, user.telegramId);
          await bot.unbanChatMember(chatId, user.telegramId);
        } catch (e) {
          console.error(`Could not kick ${user.username}:`, e.message);
        }

        try {
          await bot.sendMessage(
            user.telegramId,
            `⚠️ *Token check failed*\n\nYour balance dropped to ${balance} (minimum: ${MIN_BALANCE}).\nYou've been removed from the group. Acquire more tokens and rejoin to re-verify.`,
            { parse_mode: 'Markdown' }
          );
        } catch (e) {
          console.error(`Could not notify ${user.username}:`, e.message);
        }

        // Remove from verified list
        const idx = db.data.verifiedUsers.findIndex(
          (u) => u.telegramId === user.telegramId
        );
        if (idx !== -1) db.data.verifiedUsers.splice(idx, 1);
      }
    } catch (err) {
      console.error(`Error checking ${user.username}:`, err.message);
    }
  }

  await db.write();
  console.log('[Periodic Check] Done.');
}

module.exports = { createBot };
