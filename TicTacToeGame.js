function transpose(arr) {
  const out = [];
  for(let i=0; i<arr[0].length; i++) {
    const row = [];
    for(let j=0; j<arr.length; j++) {
      if(arr[j][i] !== undefined) {
        row.push(arr[j][i]);
      }
      else {
        row.push(null);
      }
    }
    out.push(row);
  }
  return out;
}
function makeid(length=32) {
  let result           = '';
  const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for ( let i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

class TicTacToeGame {
  constructor(startTurn=-1) {
    // 0  - No player
    // 1  - Human player
    // -1 - Computer player
    this.board = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];
    this.turn = startTurn;
    this.id = makeid();
    this.moveListeners = [];
  }
  
  getWinner(debug=false) {
    const back = [this.board[0][0], this.board[1][1], this.board[2][2]];
    const forward = [this.board[0][2], this.board[1][1], this.board[2][0]];
    const checks = [...this.board, ...transpose(this.board), back, forward];
    if(debug) console.log(checks);
    for(let triple of checks) {
      if(triple[0] === triple[1] && triple[0] === triple[2]) return triple[0];
    }
    return 0;
  }
  
  getSquare(position) {
    const [ i, j ] = TicTacToeGame.flatToBoard(position);
    return this.board[i][j];
  }
  __setSquare(position, value) {
    const [ i, j ] = TicTacToeGame.flatToBoard(position);
    this.board[i][j] = value;
  }
  
  validateMove(player, position) {
    if(this.turn !== player) return false;
    return this.getSquare(position) === 0;
  }
  
  doMove(player, position) {
    if(!this.validateMove(player, position)) return false;
    this.__setSquare(position, player);
    this.turn = this.turn === 1 ? -1 : 1;
    for(let fn of this.moveListeners) {
      fn();
    }
    return true;
  }
  
  doMoveImmutable(player, position) {
    const newGame = this.copy();
    newGame.doMove(player, position);
    return newGame;
  }
  
  copy() {
    const out = new TicTacToeGame(this.turn);
    const boardState = this.toArray();
    for(let i=0; i<boardState.length; i++) {
      out.__setSquare(i, boardState[i]);
    }
    return out;
  }
  
  toNumeric() {
    let num = 0;
    for(let p of [-1, 1]) {
      for(let i=0; i<9; i++) {
        num = (num << 1) | (this.getSquare(i) === p);
      }
    }
    return num;
  }
  
  toArray() {
    const out = [];
    for(let row of this.board) {
      out.push(...row);
    }
    return out;
  }
  
  onMove(fn) {
    this.moveListeners.push(fn);
  }
  
  toString() {
    let out = '';
    for(let row of this.board) {
      out += row.map(x => x !== 0 ? (x === 1 ? 'O' : 'X') : '_').join('') + '\n';
    }
    return out;
  }
  
  static fromNumeric(num) {
    const boardState = new Array(9);
    for(let p of [1, -1]) {
      for(let i=8; i>=0; i--) {
        if(num & 1 === 1) {
          boardState[i] = p;
        }
        num = num >> 1;
      }
    }
    const newGame = new TicTacToeGame();
    for(let i=0; i<boardState.length; i++) {
      newGame.__setSquare(i, boardState[i] || 0);
    }
    
    return newGame;
  }
  
  static flatToBoard(i) {
    return [Math.floor(i / 3), i % 3];
  }
}

module.exports = TicTacToeGame;
