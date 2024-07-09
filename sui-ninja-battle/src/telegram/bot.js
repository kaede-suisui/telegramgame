const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const { getUser, saveUser } = require('../utils/storage');

const token = process.env.TELEGRAM_BOT_TOKEN;
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api';

const bot = new TelegramBot(token, {polling: true});

// 入力バリデーション関数
function validateUsername(username) {
  return username.length >= 3 && username.length <= 20;
}

function validateEmail(email) {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
}

function validateWalletAddress(address) {
  // この正規表現は簡易的なものです。実際のSUIウォレットアドレスの形式に合わせて調整してください。
  const re = /^0x[a-fA-F0-9]{64}$/;
  return re.test(address);
}

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'SUI忍者バトルへようこそ！ 以下のコマンドが利用可能です：\n/register - ユーザー登録\n/battle - バトル開始\n/nfts - 所持NFT一覧\n/ranking - ランキング表示');
});

bot.onText(/\/register/, async (msg) => {
  const chatId = msg.chat.id;
  const user = await getUser(chatId.toString());
  if (user) {
    bot.sendMessage(chatId, '既に登録されています。');
    return;
  }
  await saveUser(chatId.toString(), { stage: 'AWAITING_USERNAME' });
  bot.sendMessage(chatId, 'ユーザー登録を開始します。ユーザー名を入力してください（3〜20文字）：');
});

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text.startsWith('/')) return; // コマンドは無視

  const user = await getUser(chatId.toString());
  if (!user) return; // 登録プロセス中のユーザーのみ処理

  switch (user.stage) {
    case 'AWAITING_USERNAME':
      if (!validateUsername(text)) {
        bot.sendMessage(chatId, 'ユーザー名は3〜20文字である必要があります。再度入力してください：');
        return;
      }
      user.username = text;
      user.stage = 'AWAITING_EMAIL';
      await saveUser(chatId.toString(), user);
      bot.sendMessage(chatId, 'ユーザー名を登録しました。次にメールアドレスを入力してください：');
      break;
    case 'AWAITING_EMAIL':
      if (!validateEmail(text)) {
        bot.sendMessage(chatId, '無効なメールアドレスです。再度入力してください：');
        return;
      }
      user.email = text;
      user.stage = 'AWAITING_WALLET';
      await saveUser(chatId.toString(), user);
      bot.sendMessage(chatId, 'メールアドレスを登録しました。最後にSUIウォレットアドレスを入力してください：');
      break;
    case 'AWAITING_WALLET':
      if (!validateWalletAddress(text)) {
        bot.sendMessage(chatId, '無効なウォレットアドレスです。再度入力してください：');
        return;
      }
      try {
        const response = await axios.post(`${API_BASE_URL}/users`, {
          username: user.username,
          email: user.email,
          walletAddress: text
        });
        bot.sendMessage(chatId, `登録が完了しました！ユーザーID: ${response.data.id}`);
        await saveUser(chatId.toString(), { ...response.data, registered: true });
      } catch (error) {
        console.error('Registration error:', error.response ? error.response.data : error.message);
        bot.sendMessage(chatId, '登録に失敗しました。もう一度最初から登録をお願いします。 /register コマンドを使用してください。');
        await saveUser(chatId.toString(), null);
      }
      break;
  }
});

// /battleコマンドのハンドラ
bot.onText(/\/battle/, async (msg) => {
  const chatId = msg.chat.id;
  try {
    // バックエンドAPIを呼び出してバトルを開始
    const response = await axios.post(`${API_BASE_URL}/battles`, { /* バトル開始に必要なデータ */ });
    bot.sendMessage(chatId, `バトルが開始されました！ バトルID: ${response.data.id}`);
  } catch (error) {
    bot.sendMessage(chatId, 'バトルの開始に失敗しました。もう一度お試しください。');
  }
});

// /nftsコマンドのハンドラ
bot.onText(/\/nfts/, async (msg) => {
  const chatId = msg.chat.id;
  try {
    // バックエンドAPIを呼び出してNFT一覧を取得
    const response = await axios.get(`${API_BASE_URL}/nfts/${msg.from.id}`);
    let nftList = 'あなたの所持NFT一覧：\n';
    response.data.forEach((nft, index) => {
      nftList += `${index + 1}. ${nft.name} (タイプ: ${nft.type}, レア度: ${nft.rarity})\n`;
    });
    bot.sendMessage(chatId, nftList);
  } catch (error) {
    bot.sendMessage(chatId, 'NFT一覧の取得に失敗しました。もう一度お試しください。');
  }
});

// /rankingコマンドのハンドラ
bot.onText(/\/ranking/, async (msg) => {
  const chatId = msg.chat.id;
  try {
    // バックエンドAPIを呼び出してランキングを取得
    const response = await axios.get(`${API_BASE_URL}/rankings/top`);
    let rankingList = 'トップ10ランキング：\n';
    response.data.forEach((player, index) => {
      rankingList += `${index + 1}. ${player.username} (スコア: ${player.score})\n`;
    });
    bot.sendMessage(chatId, rankingList);
  } catch (error) {
    bot.sendMessage(chatId, 'ランキングの取得に失敗しました。もう一度お試しください。');
  }
});

module.exports = bot;