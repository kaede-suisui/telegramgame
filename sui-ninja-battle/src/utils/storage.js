const fs = require('fs').promises;
const path = require('path');

const STORAGE_FILE = path.join(__dirname, '../../data/users.json');

async function readStorage() {
  try {
    const data = await fs.readFile(STORAGE_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return {};
    }
    throw error;
  }
}

async function writeStorage(data) {
  await fs.writeFile(STORAGE_FILE, JSON.stringify(data, null, 2));
}

async function getUser(userId) {
  const users = await readStorage();
  return users[userId];
}

async function saveUser(userId, userData) {
  const users = await readStorage();
  users[userId] = userData;
  await writeStorage(users);
}

module.exports = { getUser, saveUser };