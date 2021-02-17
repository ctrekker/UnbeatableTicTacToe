const TicTacToeGame = require('../TicTacToeGame');

const mmTree = require('../generate_minimax');


function arrayEqual(arr1, arr2) {
  if(arr1.length !== arr2.length) return false;
  for(let i=0; i<arr1.length; i++) {
    if(arr1[i] !== arr2[i]) return false;
  }
  return true;
}


module.exports = (io) => {
  io.on('connection', socket => {
    const game = new TicTacToeGame();
    let currentNode = mmTree;
    let playerValue = -1;
    
    game.onMove(() => {
      const winner = game.getWinner();
      if(winner !== 0) {
        socket.emit('gameWinner', winner === playerValue);
      }
    });
    
    function sendGame() {
      socket.emit('gameState', game.toArray());
    }
    
    console.log('Connected:', socket.id);
  
    socket.on('makeMove', position => {
      if(playerValue !== game.turn || game.getWinner() !== 0) return;
      const validMove = game.doMove(game.turn, position);
      sendGame();
      
      if(validMove) {
        doComputerMove();
      }
    });
    
    function doComputerMove() {
      for(let node of currentNode.getChildren()) {
        if(arrayEqual(node.getProp('game').toArray(), game.toArray())) {
          currentNode = node;
        }
      }
      console.log(currentNode.getChildren().length);
  
      if(currentNode.getChildren().length !== 0) {
        let minValue =  10000;
        let minNode = null;
        let maxValue = -10000;
        let maxNode = null;
        for(let node of currentNode.getChildren()) {
          const nodeVal = node.getProp('value');
          if(nodeVal < minValue) {
            minValue = nodeVal;
            minNode = node;
          }
          if(nodeVal > maxValue) {
            maxValue = nodeVal;
            maxNode = node;
          }
        }
    
        const nextNode = (game.turn === -1 ? minNode : maxNode);
        game.doMove(game.turn, nextNode.getProp('move'));
        currentNode = nextNode;
    
        game.getWinner();
      }
  
      sendGame();
    }
  });
}