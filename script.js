// ブロックの色の定義
const COLORS = {
  1: "#FF0000", // Red
  2: "#00FF00", // Green
  3: "#0000FF", // Blue
  4: "#FFFF00", // Yellow
};

// テトリミノの形状の定義
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

// テトリミノを表示するためのクラス
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

  // キャンバスのセットアップ
  setupCanvas() {
    this.cvs.width = this.canvasW;
    this.cvs.height = this.canvasH;
    this.cvs.style.width = this.canvasW + "px";
    this.ctx.strokeStyle = "rgba(0, 0, 0, 1)";
  }

  // テトリミノの初期位置のセットアップ
  setupInitialPosition() {
    this.x = 4;
    this.y = 0;
  }

  // テトリミノを描画
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

  // キャンバスをクリア
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
  }

  // 正方形を描画
  drawSquare(x, y, size, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, size, size);
    this.ctx.strokeRect(x, y, size, size);
  }

  // ブロックの回転
  rotateBlock() {
    // 回転ロジックの実装
  }

  // 右に移動
  moveRight() {
    this.x++;
  }

  // 下に移動
  moveDown() {
    this.y++;
  }

  // 左に移動
  moveLeft() {
    this.x--;
  }

  // キー入力の処理
  handleKeyPress(event) {
    switch (event.keyCode) {
      case 37: // 左矢印キー
        this.moveLeft();
        break;
      case 38: // 上矢印キー
        this.rotateBlock();
        break;
      case 39: // 右矢印キー
        this.moveRight();
        break;
      case 40: // 下矢印キー
        this.moveDown();
        break;
    }
  }
}

// ゲームボードを表示するためのクラス
class GameBoard {
  constructor() {
    this.cvs = document.getElementById("game");
    this.ctx = this.cvs.getContext("2d");
    this.blockSize = 30;
    this.boardRow = 20;
    this.boardCol = 10;
    this.canvasW = this.blockSize * this.boardCol;
    this.canvasH = this.blockSize * this.boardRow;
    this.setupCanvas();
    this.gameArea = this.createEmptyArea();
  }

  // キャンバスのセットアップ
  setupCanvas() {
    this.cvs.width = this.canvasW;
    this.cvs.height = this.canvasH;
    this.cvs.style.width = this.canvasW + "px";
    this.ctx.fillStyle = "#000";
  }

  // 空のゲームエリアを作成
  createEmptyArea() {
    return Array.from({ length: this.boardRow }, () =>
      Array(this.boardCol).fill(0)
    );
  }

  // 正方形を描画
  drawBlock(x, y, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, this.blockSize, this.blockSize);
  }

  // ゲームエリアを描画
  drawGameArea() {
    for (let row = 0; row < this.gameArea.length; row++) {
      for (let col = 0; col < this.gameArea[row].length; col++) {
        if (this.gameArea[row][col] === 0) {
          const blockX = col * this.blockSize;
          const blockY = row * this.blockSize;
          this.drawBlock(blockX, blockY, "#000");
        }
      }
    }
  }
}

// ゲームの開始
const startGame = () => {
  const gameBoard = new GameBoard();
  const tetoriminoBoard = new TetoriminoBoard();

  gameBoard.drawGameArea();
  tetoriminoBoard.drawBlock(SHAPES.L, COLORS[1]);

  // キー入力のリスナーを追加
  window.addEventListener("keydown", (event) => {
    tetoriminoBoard.handleKeyPress(event);
  });

  // ゲームループの実行
  function gameLoop() {
    tetoriminoBoard.moveDown();
    tetoriminoBoard.drawBlock(SHAPES.L, COLORS[1]);
    requestAnimationFrame(gameLoop);
  }

  // ゲームループを開始
  gameLoop();
};

// ゲームを開始する
startGame();
