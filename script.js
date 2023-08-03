const COLORS = {
  1: "#FF0000", // Red
  2: "#00FF00", // Green
  3: "#0000FF", // Blue
  4: "#FFFF00", // Yellow
};

const SHAPES = {
  // L-shape
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],

  // T-shape
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],

  // I-shape
  I: [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
  ],

  // Square-shape
  Square: [
    [1, 1],
    [1, 1],
  ],
};

// ***新しい画面(透明)にテトリスブロックを表示しよう***//
class TetoriminoBoard {
  constructor() {
    this.cvs = document.getElementById("tetorimino");
    this.ctx = this.cvs.getContext("2d");
    this.boardRow = 20;
    this.boardCol = 10;
    this.blockSize = 30;
    this.canvasW = this.blockSize * this.boardCol;
    this.canvasH = this.blockSize * this.boardRow;
    this.cvs.width = this.canvasW;
    this.cvs.height = this.canvasH;
    this.cvs.style.width = this.canvasW + "px";
    this.board = this.createEmptyArea();
  };

  createEmptyArea() {
    this.gameArea = Array.from({ length: this.boardRow }, () =>
      Array(this.boardCol).fill(0)
    );
    return this.gameArea;
  };

  drawGameArea() {
    for (let row = 0; row < this.gameArea.length; row++) {
      for (let col = 0; col < this.gameArea[row].length; col++) {
        if (this.gameArea[row][col] === 0) {
          const blockX = col * this.blockSize;
          const blockY = row * this.blockSize;
          this.ctx.fillStyle = "rgba(0, 0, 0, 0)";
          this.ctx.fillRect(blockX, blockY, this.blockSize, this.blockSize);
        }
      }
    }
  };

  gameStart() {
    this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);

    const startX = 4; // ブロックの開始位置X
    const startY = 0; // ブロックの開始位置Y
    const blockSize = this.blockSize;

    // テトリスブロックの描画
    this.ctx.strokeStyle = "rgba(0, 0, 0, 1)"; // 枠線の色を黒に設定

    // テトリスブロックの形状を取得
    const blockShape = SHAPES["L"]; // 例として "L" 形状を指定

    for (let row = 0; row < blockShape.length; row++) {
      for (let col = 0; col < blockShape[row].length; col++) {
        if (blockShape[row][col] === 1) {
          const x = (col + startX) * blockSize;
          const y = (row + startY) * blockSize;
          this.ctx.fillStyle = COLORS[1]; // ブロックの色を取得 (ここでは "L" ブロックは赤色に設定)
          this.ctx.fillRect(x, y, blockSize, blockSize); // ブロックを塗りつぶす
          this.ctx.strokeRect(x, y, blockSize, blockSize); // ブロックの枠線を描画
        }
      }
    }
  }
};






class GameBoard {
  constructor() {
    this.cvs = document.getElementById("game");
    this.ctx = this.cvs.getContext("2d");
    this.boardRow = 20;
    this.boardCol = 10;
    this.blockSize = 30;
    this.canvasW = this.blockSize * this.boardCol;
    this.canvasH = this.blockSize * this.boardRow;
    this.cvs.width = this.canvasW;
    this.cvs.height = this.canvasH;
    this.cvs.style.width = this.canvasW + "px";
    this.board = this.createEmptyArea();
  }

  createEmptyArea() {
    this.gameArea = Array.from({ length: this.boardRow }, () =>
      Array(this.boardCol).fill(0)
    );
    return this.gameArea;
  }

  drawGameArea() {
    for (let row = 0; row < this.gameArea.length; row++) {
      for (let col = 0; col < this.gameArea[row].length; col++) {
        if (this.gameArea[row][col] === 0) {
          const blockX = col * this.blockSize;
          const blockY = row * this.blockSize;
          this.ctx.fillStyle = "#000";
          this.ctx.fillRect(blockX, blockY, this.blockSize, this.blockSize);
        }
      }
    }
  }

  placeBlock(block, color) {
    for (let row = 0; row < block.shape.length; row++) {
      for (let col = 0; col < block.shape[row].length; col++) {
        if (block.shape[row][col] === 1) {
          const blockX = (this.x + col) * this.blockSize;
          const blockY = (this.y + row) * this.blockSize;
          this.ctx.fillStyle = color;
          this.ctx.fillRect(blockX, blockY, this.blockSize, this.blockSize);
        }
      }
    }
  }
}

class Tetromino {
  constructor(shapeName) {
    this.shape = shapeName;
    this.color = COLORS[Math.floor(Math.random() * 4) + 1];
    this.x = Math.floor(this.boardCol / 2) - Math.floor(this.shape.length / 2);
    this.y = 0;
  }

  // moveUp() {
  //   this.y++;
  // }

  // moveRight() {
  //   this.x++;
  // }

  // moveDown() {
  //   this.y++;
  // }

  // moveLeft() {
  //   this.x--;
  // }
}

const initializeGame = () => {
  const newGame = new GameBoard();
  newGame.drawGameArea();
  const newBlock = new Tetromino(SHAPES.L);
  console.log(newBlock);
  newGame.placeBlock(newBlock, newBlock.color);
};

const init = () => {
  initializeGame();
};

// document.addEventListener("keydown", (event) => {
//   if (event.key === "ArrowLeft") {
//     newBlock.moveLeft();
//   } else if (event.key === "ArrowRight") {
//     newBlock.moveRight();
//   } else if (event.key === "ArrowDown") {
//     newBlock.moveDown();
//   }
// });

const startGame = () => {
  const tetoriminoBoard = new TetoriminoBoard(); // 新たなゲーム画面を作成
  tetoriminoBoard.gameStart(); // テトリスブロックを描画
};
