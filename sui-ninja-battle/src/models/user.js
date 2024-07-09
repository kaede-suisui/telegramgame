class User {
  constructor(id, username, email, walletAddress) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.walletAddress = walletAddress;
    this.createdAt = new Date();
  }
}

module.exports = User;