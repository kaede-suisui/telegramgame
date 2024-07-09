const provider = require('../config/sui');
const User = require('../models/user');
const crypto = require('crypto');

class UserService {
  constructor() {
    this.users = new Map();
  }

  async createUser(username, email, walletAddress) {
    try {
      const userId = crypto.randomUUID();
      const user = new User(userId, username, email, walletAddress);

      // この部分は実際のSUI SDKの呼び出しに置き換える必要があります
      await provider.executeMoveCall({
        packageObjectId: 'YOUR_PACKAGE_ID',
        module: 'user',
        function: 'create_user',
        typeArguments: [],
        arguments: [userId, username, email, walletAddress],
        gasBudget: 10000,
      });

      this.users.set(userId, user);
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async getUser(userId) {
    return this.users.get(userId) || null;
  }

  async updateUser(userId, updates) {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error('User not found');
    }

    Object.assign(user, updates);

    // この部分は実際のSUI SDKの呼び出しに置き換える必要があります
    await provider.executeMoveCall({
      packageObjectId: 'YOUR_PACKAGE_ID',
      module: 'user',
      function: 'update_user',
      typeArguments: [],
      arguments: [userId, user.username, user.email, user.walletAddress],
      gasBudget: 10000,
    });

    return user;
  }

  async authenticateUser(walletAddress) {
    // この実装は簡略化されています。実際には、ウォレットアドレスの署名検証などが必要です。
    for (let user of this.users.values()) {
      if (user.walletAddress === walletAddress) {
        return user;
      }
    }
    return null;
  }
}

module.exports = new UserService();