const express = require('express');
const dotenv = require('dotenv');
const nftRoutes = require('./src/routes/nftRoutes');
const battleRoutes = require('./src/routes/battleRoutes');
const rankingRoutes = require('./src/routes/rankingRoutes');
const userRoutes = require('./src/routes/userRoutes');
const { authenticate } = require('./src/middleware/auth');
const telegramBot = require('./src/telegram/bot');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/nfts', authenticate, nftRoutes);
app.use('/api/battles', authenticate, battleRoutes);
app.use('/api/rankings', rankingRoutes);

app.get('/', (req, res) => {
  res.send('SUI Ninja Battle API is running');
});

// Telegramボットを起動
telegramBot.startPolling();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log('Telegram bot is active');
});