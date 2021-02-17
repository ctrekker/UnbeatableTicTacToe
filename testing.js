const TicTacToeGame = require('./TicTacToeGame');

const game = TicTacToeGame.fromNumeric(27338);
console.log(game.board);
console.log(game.toString());
console.log(game.getWinner());
