class Battle {
  constructor(id, player1, player2, player1Weapon, player2Weapon, status = 'pending') {
    this.id = id;
    this.player1 = player1;
    this.player2 = player2;
    this.player1Weapon = player1Weapon;
    this.player2Weapon = player2Weapon;
    this.status = status; // 'pending', 'ongoing', 'completed'
    this.rounds = [];
    this.winner = null;
  }

  addRound(player1Move, player2Move, roundWinner) {
    this.rounds.push({ player1Move, player2Move, roundWinner });
  }

  setWinner(winner) {
    this.winner = winner;
    this.status = 'completed';
  }
}

module.exports = Battle;