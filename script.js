const config = {
  initialPage: document.getElementById("initialPage"),
  mainPage: document.getElementById("mainPage"),
}

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

  // // T-shape
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],

  // // I-shape
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

let gameRunning = true;
let isPaused = false; // ポーズ状態を管理するフラグ

// テトリミノを表示するためのクラス
class TetoriminoBoard {
  constructor(gameBoard, shape, color) {
    this.gameBoard = gameBoard;
    this.cvs = document.getElementById("tetorimino");
    this.ctx = this.cvs.getContext("2d");
    this.boardRow = 20;
    this.boardCol = 10;
    this.blockSize = 30;
    this.canvasW = this.blockSize * this.boardCol;
    this.canvasH = this.blockSize * this.boardRow;
    this.currentShape = shape;
    this.color = color;
    this.setupCanvas();
    this.setupInitialPosition();
    this.drawRandomBlock();
    // 操作音関連
    //this.move = document.getElementById('move');
    this.rotate = document.getElementById('rotate');
    this.startGame();
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

  startGame() {
    this.gameBoard.drawGameArea();
    // 自動でテトリミノを下に移動する間隔（ミリ秒）
    const AUTO_MOVE_INTERVAL = 500;
    let autoMoveInterval;

    // ポーズボタンのクリックイベントを追加
    const pauseBtn = document.getElementById("pause_btn");
    pauseBtn.addEventListener("click", () => {
      this.togglePause();
      if (isPaused) {
        clearInterval(autoMoveInterval); // ポーズ時に自動移動を停止
      } else {
        autoMoveInterval = setInterval(() => {
          this.moveDown(this.gameBoard);
          gameLoop();
        }, AUTO_MOVE_INTERVAL);
      }
    });

    if (gameRunning && !isPaused) {
      // 自動でテトリミノを下に移動する
      autoMoveInterval = setInterval(() => {
        this.moveDown(this.gameBoard);
      }, AUTO_MOVE_INTERVAL);

      // キー入力のリスナーを追加
      window.addEventListener("keydown", (event) => {
        if (!isPaused) {
          this.handleKeyPress(event, this.gameBoard);
        }
      });
    }

    // ゲームループの実行
    const gameLoop = () => {
      if (gameRunning && !isPaused) {
        if (
          this.checkCollision(
            this.gameBoard,
            this.currentShape,
            this.x,
            this.y + 1
          )
        ) {
          // テトリミノをゲームボードにマージ
          this.gameBoard.mergeBlock(this, this.gameBoard);
          this.gameBoard.drawGameArea(this);
        }

        this.drawBlock(this.gameBoard);
        requestAnimationFrame(gameLoop);
      }
    };

    // ゲームループを開始
    gameLoop();
  }

  // ポーズの切り替え
  togglePause() {
    isPaused = !isPaused;
  }

  // ランダムなテトリミノを描画
  drawRandomBlock() {
    const shapeKeys = Object.keys(SHAPES);
    const randomShapeKey =
      shapeKeys[Math.floor(Math.random() * shapeKeys.length)];
    const randomShape = SHAPES[randomShapeKey];
    const randomColor =
      COLORS[Math.floor(Math.random() * Object.keys(COLORS).length) + 1];
    this.currentShape = randomShape;
    this.color = randomColor;
  }

  // テトリミノを描画
  drawBlock(gameBoard) {
    this.clearCanvas();
    const blockSize = this.blockSize;

    // 通常のテトリミノを描画
    for (let row = 0; row < this.currentShape.length; row++) {
      for (let col = 0; col < this.currentShape[row].length; col++) {
        if (this.currentShape[row][col] === 1) {
          const x = (col + this.x) * blockSize;
          const y = (row + this.y) * blockSize;
          this.drawSquare(x, y, blockSize, this.color);
        }
      }
    }

    // 落下予測位置を取得
    const fallPreviewY = this.getFallPreviewPosition(gameBoard);

    // 落下予測のテトリミノを描画
    for (let row = 0; row < this.currentShape.length; row++) {
      for (let col = 0; col < this.currentShape[row].length; col++) {
        if (this.currentShape[row][col] === 1) {
          const x = (col + this.x) * blockSize;
          const y = (row + fallPreviewY) * blockSize;
          this.drawSquare(x, y, blockSize, "rgba(255, 255, 255, 0.5)");
        }
      }
    }

    // テトリミノが画面上に到達したかをチェックし、ゲームオーバーとする
    if (this.checkCollision(gameBoard, this.currentShape, this.x, this.y)) {
      alert("gameover");
      gameRunning = false;
      console.log(gameRunning);
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
  rotateBlock(gameBoard) {
    // 回転ロジックの実装
    const originalShape = this.currentShape; // 現在の形状を保存
    const rotationStates = this.getRotationStates(originalShape);
    const currentIndex = rotationStates.indexOf(this.currentShape);
    const nextIndex = (currentIndex + 1) % rotationStates.length;
    const rotatedShape = rotationStates[nextIndex];
    this.currentShape = rotatedShape;

    // 衝突判定を行い、回転した形状が設置不可能なら、位置を調整
    if (this.checkCollision(gameBoard, rotatedShape, this.x, this.y)) {
      this.adjustPosition(gameBoard);
    }

    this.drawBlock(gameBoard);
  }

  // テトリミノの位置をゲーム画面の枠内に調整
  adjustPosition(gameBoard) {
    const shapeWidth = this.currentShape[0].length;
    const shapeHeight = this.currentShape.length;
    const maxRight = gameBoard.boardCol - shapeWidth;
    const maxBottom = gameBoard.boardRow - shapeHeight;

    if (this.x < 0) {
      this.x = 0;
    } else if (this.x > maxRight) {
      this.x = maxRight;
    }

    if (this.y > maxBottom) {
      this.y = maxBottom;
    }
  }

  // 回転可能な状態の生成
  getRotationStates(shape) {
    const rotationStates = [shape];
    let rotatedShape = shape;

    // 90度ずつ回転状態を生成
    for (let i = 0; i < 3; i++) {
      rotatedShape = this.rotate90Degrees(rotatedShape);
      rotationStates.push(rotatedShape);
    }

    return rotationStates;
  }

  // 90度回転
  rotate90Degrees(shape) {
    const numRows = shape.length;
    const numCols = shape[0].length;
    const rotatedShape = [];

    for (let col = 0; col < numCols; col++) {
      const newRow = [];
      for (let row = numRows - 1; row >= 0; row--) {
        newRow.push(shape[row][col]);
      }
      rotatedShape.push(newRow);
    }

    return rotatedShape;
  }

  // 右に移動
  moveRight(gameBoard) {
    // 移動先が衝突しないかチェック
    if (
      !this.checkCollision(gameBoard, this.currentShape, this.x + 1, this.y)
    ) {
      this.x++;
      //document.getElementById('move').play();
    }
  }

  // 下に移動
  moveDown(gameBoard) {
    // 移動先が衝突しないかチェック
    if (
      !this.checkCollision(gameBoard, this.currentShape, this.x, this.y + 1)
    ) {
      this.y++;
      //document.getElementById('move').play();
    }
  }

  // 左に移動
  moveLeft(gameBoard) {
    // 移動先が衝突しないかチェック
    if (
      !this.checkCollision(gameBoard, this.currentShape, this.x - 1, this.y)
    ) {
      this.x--;
      //document.getElementById('move').play();
    }
  }

  // キー入力の処理
  handleKeyPress(event, gameBoard) {
    switch (event.keyCode) {
      case 37: // 左矢印キー
        //this.move.play();
        this.moveLeft(gameBoard);
        break;
      case 38: // 上矢印キー
        this.rotate.play();
        this.rotateBlock(gameBoard);
        break;
      case 39: // 右矢印キー
        //this.move.play();
        this.moveRight(gameBoard);
        break;
      case 40: // 下矢印キー
        //this.move.play();
        this.moveDown(gameBoard);
        break;
    }
  }

  checkCollision(gameBoard, shape, targetX, targetY) {
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col] === 1) {
          const boardX = targetX + col;
          const boardY = targetY + row;

          // ゲームボードの範囲内かをチェック
          if (
            boardX < 0 ||
            boardX >= gameBoard.boardCol ||
            boardY >= gameBoard.boardRow
          ) {
            return true; // 衝突
          }

          // ゲームボード上で既に占有されているかをチェック
          if (gameBoard.gameArea[boardY][boardX] !== 0) {
            return true; // 衝突
          }
        }
      }
    }
    return false; // 衝突なし
  }

  getFallPreviewPosition(gameBoard) {
    let fallPreviewY = this.y;
    while (
      !this.checkCollision(
        gameBoard,
        this.currentShape,
        this.x,
        fallPreviewY + 1
      )
    ) {
      fallPreviewY++;
    }
    return fallPreviewY;
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
    this.ctx.strokeStyle = "rgba(0, 0, 0, 1)";
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
    this.ctx.strokeRect(x, y, this.blockSize, this.blockSize);
  }

  // ゲームエリアを描画
  drawGameArea(tetoriminoBoard) {
    for (let row = 0; row < this.gameArea.length; row++) {
      for (let col = 0; col < this.gameArea[row].length; col++) {
        const blockX = col * this.blockSize;
        const blockY = row * this.blockSize;
        if (this.gameArea[row][col] === 0) {
          this.drawBlock(blockX, blockY, "#000");
        } else {
          // マージされた部分をテトリミノの色で描画
          const colorIndex = this.gameArea[row][col];
          const color = COLORS[colorIndex];
          this.drawBlock(blockX, blockY, color);
        }
      }
    }
  }

  mergeBlock(tetoriminoBoard, gameBoard) {
    const shape = tetoriminoBoard.currentShape;
    const x = tetoriminoBoard.x;
    const y = tetoriminoBoard.y;
    const colorIndex = Object.keys(COLORS).find(
      (key) => COLORS[key] === tetoriminoBoard.color
    );

    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col] === 1) {
          const boardX = x + col;
          const boardY = y + row;

          // ゲームボード上で占有されるように設定
          this.gameArea[boardY][boardX] = colorIndex;
        }
      }
    }

    // 横一列が揃ったかどうかをチェックし、揃った行を削除
    this.checkAndClearLines();

    // 新しいテトリミノを生成し、初期位置を設定
    tetoriminoBoard.drawRandomBlock();
    tetoriminoBoard.setupInitialPosition();
  }
}

// bgmはクラスにして処理したい
class BackgroundMp3 {
  constructor() {
    this.poseBtn = document.getElementById("pose_btn")
    this.bgm = document.getElementById('background_mp3');
    this.paused = false;
    this.play();
  }

  play() {
    this.bgm.play();
    this.bgm.loop = true;
    this.paused = false;
  }

  pause() {
    this.bgm.pause();
    this.paused = true;
  }

  toggle() {
    if (this.paused) {
      this.play(); // BGMを流し始める
      this.poseBtn.innerHTML = "ポーズ";
    } else {
      this.pause(); // BGMを一時停止
      this.poseBtn.innerHTML = "再開";
    }
  }
}

// ページ切り替え
function switchPages(page1, page2) {
  page1.style.display = "none";
  page2.style.display = "block";
}

// ゲームの開始だ
const startGame = () => {
  var initialPage = document.getElementById("initialPage");
  var mainPage = document.getElementById("mainPage");
  switchPages(initialPage, mainPage);

  const bgm = new BackgroundMp3();

  const gameBoard = new GameBoard();
  const tetoriminoBoard = new TetoriminoBoard();

  gameBoard.drawGameArea(tetoriminoBoard);
  tetoriminoBoard.drawRandomBlock();

  // キー入力のリスナーを追加
  window.addEventListener("keydown", (event) => {
    tetoriminoBoard.handleKeyPress(event, gameBoard);
  });

  // ポーズボタンのクリックイベントリスナーを追加
  const poseBtn = document.getElementById("pose_btn");
  poseBtn.addEventListener("click", () => {
    bgm.toggle(); // BGMの再生と停止を切り替える
  });

  // ゲームループの実行
  function gameLoop() {
    if (
      tetoriminoBoard.checkCollision(
        gameBoard,
        tetoriminoBoard.currentShape,
        tetoriminoBoard.x,
        tetoriminoBoard.y + 1
      )
    ) {
      // テトリミノをゲームボードにマージ
      gameBoard.mergeBlock(tetoriminoBoard);
      gameBoard.drawGameArea(tetoriminoBoard);

  // 横一列が揃ったかどうかをチェックし、揃った行を削除
  checkAndClearLines() {
    let linesCleared = 0;
    for (let row = this.gameArea.length - 1; row >= 0; row--) {
      if (this.isLineFull(row)) {
        this.clearLine(row);
        linesCleared++;
      }
    }
    return linesCleared;
  }

  // 指定された行がすべて埋まっているかをチェック
  isLineFull(row) {
    return this.gameArea[row].every((cell) => cell !== 0);
  }

  // 指定された行を削除し、上の行を下に詰める
  clearLine(row) {
    this.gameArea.splice(row, 1);
    this.gameArea.unshift(Array(this.boardCol).fill(0));
  }
}

// ゲームを開始する
function startGame() {
  const gameBoard = new GameBoard();
  const tetoriminoBoard = new TetoriminoBoard(gameBoard);
}

