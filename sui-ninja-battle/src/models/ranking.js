class PlayerRanking {
  constructor(playerId, score, wins, losses) {
    this.playerId = playerId;
    this.score = score;
    this.wins = wins;
    this.losses = losses;
  }
}

module.exports = PlayerRanking;