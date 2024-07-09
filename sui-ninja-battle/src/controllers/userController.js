const userService = require('../services/userService');

exports.createUser = async (req, res) => {
  try {
    const { username, email, walletAddress } = req.body;
    const user = await userService.createUser(username, email, walletAddress);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
};

exports.getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userService.getUser(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;
    const updatedUser = await userService.updateUser(userId, updates);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
};

exports.authenticateUser = async (req, res) => {
  try {
    const { walletAddress } = req.body;
    const user = await userService.authenticateUser(walletAddress);
    if (!user) {
      return res.status(401).json({ error: 'Authentication failed' });
    }
    res.status(200).json({ message: 'Authentication successful', user });
  } catch (error) {
    res.status(500).json({ error: 'Authentication failed' });
  }
};