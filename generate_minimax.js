const TicTacToeGame = require('./TicTacToeGame');
const fs = require('fs');


class GameNode {
  constructor() {
    this.parent = null;
    this.children = [];
    
    this.props = {};
  }
  
  getParent() {
    return this.parent;
  }
  getChildren() {
    return this.children;
  }
  addChild(child, setParent = true) {
    this.children.push(child);
    if(setParent) {
      child.setParent(this, false);
    }
  }
  setParent(parent, addChild = true) {
    this.parent = parent;
    if(addChild) {
      parent.addChild(this);
    }
  }
  
  getProp(key) {
    return this.props[key];
  }
  setProp(key, value) {
    this.props[key] = value;
  }
}

// const oldGames = [];

const initGame = new TicTacToeGame();
const rootNode = new GameNode();
rootNode.setProp('game', initGame);

// let games = [initGame];
// const gameDefs = {[initGame.id]: initGame.toNumeric()};
// for(let layer=1; layer<=9; layer++) {
//   console.log(layer+'...');
//
//   const nextGames = [];
//   for(let game of games) {
//     const gameState = game.toArray();
//     let i=0;
//     for(let square of gameState) {
//       if(square === 0) {
//         const nextGame = game.doMoveImmutable(game.turn, i);
//         tree[nextGame.id] = game.id;
//         gameDefs[nextGame.id] = nextGame.toNumeric();
//         if(nextGame.getWinner() === 0) {
//           nextGames.push(nextGame);
//         }
//       }
//       i++;
//     }
//   }
//
//   oldGames.push(games);
//   games = nextGames;
// }
// oldGames.push(games);

let totalGames = 0;

function minimax(game, gameNode, layer = 0) {
  if(game.getWinner() === 0) {
    const gameState = game.toArray();
    let minValue =  10000;
    let maxValue = -10000;
    let isDraw = true;
    for(let i=0; i<gameState.length; i++) {
      if(gameState[i] === 0) {
        isDraw = false;
        
        const nextGame = game.doMoveImmutable(game.turn, i);
        const nextGameNode = new GameNode();
        nextGameNode.setProp('game', nextGame);
        nextGameNode.setProp('move', i);
        nextGameNode.setParent(gameNode);
      
        minimax(nextGame, nextGameNode, layer + 1);
        
        const nextGameVal = nextGameNode.getProp('value');
        if(nextGameVal < minValue) minValue = nextGameVal;
        if(nextGameVal > maxValue) maxValue = nextGameVal;
      }
    }
    if(isDraw) {
      gameNode.setProp('value', 0);
      totalGames++;
    }
    else gameNode.setProp('value', layer % 2 === 0 ? minValue : maxValue);
    if(layer === 0) {
      // console.log(isDraw);
      // console.log(gameNode.getProp('value'));
      // console.log(totalGames);
      // console.log(gameNode.getChildren()[0].getChildren().length);
    }
  }
  else {
    totalGames++;
    gameNode.setProp('value', game.getWinner());
  }
}


minimax(initGame, rootNode);

console.log(totalGames);

module.exports = rootNode;