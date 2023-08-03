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
    this.setupCanvas();
    this.setupInitialPosition();
  }

  setupCanvas() {
    this.cvs.width = this.canvasW;
    this.cvs.height = this.canvasH;
    this.cvs.style.width = this.canvasW + "px";
    this.ctx.strokeStyle = "rgba(0, 0, 0, 1)";
  }

  setupInitialPosition() {
    this.x = 4;
    this.y = 0;
  }

  drawBlock(shape, color) {
    this.clearCanvas();
    const blockSize = this.blockSize;

    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col] === 1) {
          const x = (col + this.x) * blockSize;
          const y = (row + this.y) * blockSize;
          this.drawSquare(x, y, blockSize, color);
        }
      }
    }
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
  }

  drawSquare(x, y, size, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, size, size);
    this.ctx.strokeRect(x, y, size, size);
  }

  rotateBlock() {
    // Implement the rotation logic here
  }

  moveRight() {
    this.x++;
  }

  moveDown() {
    this.y++;
  }

  moveLeft() {
    this.x--;
  }

  handleKeyPress(event) {
    switch (event.keyCode) {
      case 37: // Left Arrow
        this.moveLeft();
        break;
      case 38: // Up Arrow
        this.rotateBlock();
        break;
      case 39: // Right Arrow
        this.moveRight();
        break;
      case 40: // Down Arrow
        this.moveDown();
        break;
    }
  }
}

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

  placeBlock(block, color, x, y) {
    for (let row = 0; row < block.shape.length; row++) {
      for (let col = 0; col < block.shape[row].length; col++) {
        if (block.shape[row][col] === 1) {
          const blockX = (x + col) * this.blockSize;
          const blockY = (y + row) * this.blockSize;
          this.ctx.fillStyle = color;
          this.ctx.fillRect(blockX, blockY, this.blockSize, this.blockSize);
        }
      }
    }
  }
}

// const startGame = () => {
//   // テトリスブロックを描画
//   const tetoriminoBoard = new TetoriminoBoard(); // 新たなゲーム画面を作成

//   return newBlock;
// };

const startGame = () => {
  const newGame = new GameBoard();
  newGame.drawGameArea();
  const tetoriminoBoard = new TetoriminoBoard();
  const newBlock = tetoriminoBoard.drawBlock(SHAPES.L, COLORS[1]);
  console.log(newBlock);
  window.addEventListener("keydown", (event) => {
    tetoriminoBoard.handleKeyPress(event);
  });

  function gameLoop() {
    tetoriminoBoard.drawBlock(SHAPES.L, COLORS[1]);
    requestAnimationFrame(gameLoop);
  }

  gameLoop();
};

// ページが読み込まれた際にテトリスゲームを初期化
