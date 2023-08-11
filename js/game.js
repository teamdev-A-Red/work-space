import { config } from "./config.js";

// ブロックの色の定義
export const COLORS = {
  1: "#FF0000", // Red
  2: "#00FF00", // Green
  3: "#0000FF", // Blue
  4: "#FFFF00", // Yellow
};

// テトリミノの形状の定義
export const SHAPES = {
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

  // J-shape
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],

  // z-shape
  Z: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
};

export let gameBoard;
export let tetoriminoBoard;
export let gameRunning = true; // ゲームの状態を管理するフラグ
export let isPaused = false; // ポーズ状態を管理するフラグ
export let autoMoveInterval;

// テトリミノを表示するためのクラス
export class TetoriminoBoard {
  constructor(gameBoard) {
    this.gameBoard = gameBoard;
    this.cvs = document.getElementById("tetorimino");
    this.ctx = this.cvs.getContext("2d");
    this.boardRow = 20;
    this.boardCol = 10;
    this.blockSize = 30;
    this.canvasW = this.blockSize * this.boardCol;
    this.canvasH = this.blockSize * this.boardRow;
    this.currentShape = this.getNextShape();
    this.currentColor = this.getNextColor();
    this.move = config.move;
    this.rotate = config.rotate;
    this.AUTO_MOVE_INTERVAL = this.chooseDifficulty();
    this.nextShape = null;
    this.nextColor = null;
    this.setupCanvas();
    this.setupInitialPosition();
    this.setupNextBlockCanvas();
    this.drawNextBlock();
    this.drawSquareNextBlock();
    this.startGame();
  }

  // ゲーム開始時に選択した難易度を受け取る
  chooseDifficulty() {
    this.difficulty = document.getElementById("difficultyOption");
    this.playSpeed = this.difficulty.value;
    return this.playSpeed;
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
    this.x = Math.floor((this.boardCol - this.currentShape[0].length) / 2);
    this.y = 0;
  }

  startGame() {
    this.switchToMainPage();
    this.initializeGameLoop();
    this.initializePauseButton();
    this.initializeKeyListeners();
  }

  switchToMainPage() {
    config.switchPages(config.initialPage, config.mainPage);
    this.gameBoard.drawGameArea();
  }

  initializeGameLoop() {
    // 自動でテトリミノを下に移動する間隔（ミリ秒）
    if (gameRunning && !isPaused) {
      config.bgm.volume = config.sliderVolume.value;
      config.move.volume = config.sliderVolume.value;
      config.rotate.volume = config.sliderVolume.value;
      config.slash.volume = config.sliderVolume.value;
      config.gameover.volume = config.sliderVolume.value;
      config.bgm.play();
      config.bgm.loop = true;

      autoMoveInterval = setInterval(() => {
        this.moveDown(this.gameBoard);
        runGameLoop(tetoriminoBoard, gameBoard);
      }, this.AUTO_MOVE_INTERVAL);
    }
  }

  initializePauseButton() {
    config.pauseBtn.addEventListener("click", () => {
      this.togglePause();
      if (isPaused) {
        this.pauseGame();
      } else {
        this.resumeGame();
      }
    });
  }

  initializeKeyListeners() {
    window.addEventListener("keydown", (event) => {
      if (!isPaused) {
        handleKeyPress(event, tetoriminoBoard, gameBoard);
      }
    });
  }

  pauseGame() {
    clearInterval(autoMoveInterval);
    config.bgm.pause();
    config.pauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
  }

  resumeGame() {
    autoMoveInterval = setInterval(() => {
      this.moveDown(this.gameBoard);
      runGameLoop(tetoriminoBoard, gameBoard);
    }, this.AUTO_MOVE_INTERVAL);
    config.bgm.play();
    config.pauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
  }

  // ポーズの切り替え
  togglePause() {
    isPaused = !isPaused;
  }

  // ランダムなテトリミノを描画
  drawRandomBlock() {
    this.currentShape = this.nextShape;
    this.currentColor = this.nextColor;
  }

  // テトリミノを描画
  drawBlock() {
    this.clearCanvas();
    const blockSize = this.blockSize;

    // 通常のテトリミノを描画
    for (let row = 0; row < this.currentShape.length; row++) {
      for (let col = 0; col < this.currentShape[row].length; col++) {
        if (this.currentShape[row][col] === 1) {
          const x = (col + this.x) * blockSize;
          const y = (row + this.y) * blockSize;
          this.drawSquare(x, y, blockSize, this.currentColor);
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
          const opacity = 0.5;
          this.drawSquare(x, y, blockSize, this.currentColor, opacity);
        }
      }
    }
  }

  // キャンバスをクリア
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
  }

  // 正方形を描画
  drawSquare(x, y, size, color, opacity = 1) {
    this.ctx.fillStyle = color;
    this.ctx.globalAlpha = opacity;
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

    this.drawBlock();
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
    }
  }

  // 下に移動
  moveDown(gameBoard) {
    // 移動先が衝突しないかチェック
    if (
      !this.checkCollision(gameBoard, this.currentShape, this.x, this.y + 1)
    ) {
      this.y++;
    }
  }

  // 左に移動
  moveLeft(gameBoard) {
    // 移動先が衝突しないかチェック
    if (
      !this.checkCollision(gameBoard, this.currentShape, this.x - 1, this.y)
    ) {
      this.x--;
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

  // 次のブロックを表示するための canvas 要素をセットアップ
  setupNextBlockCanvas() {
    this.nextBlockCvs = document.getElementById("nextBlock");
    this.nextBlockCtx = this.nextBlockCvs.getContext("2d");
    this.nextBlockCvs.width = this.blockSize * 4; // ブロック4つ分の幅
    this.nextBlockCvs.height = this.blockSize * 4; // ブロック4つ分の高さ
    this.nextBlockCvs.style.margin = "0 auto";
    this.nextBlockCtx.strokeStyle = "rgba(0, 0, 0, 1)";
  }

  // 次のブロックを描画
  drawNextBlock() {
    this.nextBlockCtx.clearRect(
      0,
      0,
      this.nextBlockCvs.width,
      this.nextBlockCvs.height
    );
    const blockSize = this.blockSize;
    const nextShape = this.getNextShape(); // 次のブロックの形状を取得
    const nextColor = this.getNextColor(); // 次のブロックの色を取得

    // ブロックの描画位置を調整
    const xOffset =
      (this.nextBlockCvs.width - nextShape[0].length * blockSize) / 2;
    const yOffset =
      (this.nextBlockCvs.height - nextShape.length * blockSize) / 2;

    for (let row = 0; row < nextShape.length; row++) {
      for (let col = 0; col < nextShape[row].length; col++) {
        if (nextShape[row][col] === 1) {
          const x = xOffset + col * blockSize;
          const y = yOffset + row * blockSize;
          this.drawSquareNextBlock(x, y, blockSize, nextColor);
        }
      }
    }

    this.nextShape = nextShape; // 次のブロックの形状を保持
    this.nextColor = nextColor; // 次のブロックの色を保持
  }

  // 次のブロックの形状を取得
  getNextShape() {
    // ランダムなテトリミノの形状を返すロジックを実装
    const shapeKeys = Object.keys(SHAPES);
    const randomShapeKey =
      shapeKeys[Math.floor(Math.random() * shapeKeys.length)];
    return SHAPES[randomShapeKey];
  }

  // 次のブロックの色を取得
  getNextColor() {
    // ランダムな色を返すロジックを実装
    const randomColor =
      COLORS[Math.floor(Math.random() * Object.keys(COLORS).length) + 1];
    return randomColor;
  }

  // 次のブロックを描画するための正方形を描画
  drawSquareNextBlock(x, y, size, color) {
    this.nextBlockCtx.fillStyle = color;
    this.nextBlockCtx.fillRect(x, y, size, size);
    this.nextBlockCtx.strokeRect(x, y, size, size);
  }
}

// ゲームボードを表示するためのクラス
export class GameBoard {
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
    this.score = 0;
    this.bestScore = 0;
  }

  // キャンバスのセットアップ
  setupCanvas() {
    this.cvs.width = this.canvasW;
    this.cvs.height = this.canvasH;
    this.cvs.style.width = this.canvasW + "px";
    this.ctx.fillStyle = "#000";
    this.ctx.strokeStyle = "rgba(220, 220, 200, 1)";
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
      (key) => COLORS[key] === tetoriminoBoard.currentColor
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

    // テトリミノが画面上に到達したかをチェックし、ゲームオーバーとする
    if (checkGameOver(gameBoard)) {
      handleGameOver(gameBoard);
    }

    // 横一列が揃ったかどうかをチェックし、揃った行を削除
    this.checkAndClearLines();

    // 新しいテトリミノを生成し、初期位置を設定
    tetoriminoBoard.drawRandomBlock();
    tetoriminoBoard.drawNextBlock();
    tetoriminoBoard.setupInitialPosition();
  }

  // 横一列が揃ったかどうかをチェックし、揃った行を削除
  checkAndClearLines() {
    let linesCleared = 0;

    for (let row = this.gameArea.length - 1; row >= 0; row--) {
      if (this.isLineFull(row)) {
        this.clearLines(row);
        linesCleared++;
      }
    }

    if (linesCleared > 0) {
      this.score += this.calculateScore(linesCleared);
      this.updateScoreDisplay();

      // 初回の行をクリアした後、追加のクリア行があるか再帰的にチェック
      this.checkAndClearLines();
    }

    return linesCleared;
  }

  // 指定された行がすべて埋まっているかをチェック
  isLineFull(row) {
    return this.gameArea[row].every((cell) => cell !== 0);
  }

  // 指定された行を削除し、上の行を下に詰める
  clearLines(row) {
    config.slash.play();
    this.gameArea.splice(row, 1);
    this.gameArea.unshift(Array(this.boardCol).fill(0));
  }

  // 削除された行に基づいて、ポイントを計算する
  calculateScore(linesCleared) {
    const pointsPerLine = 100;
    return linesCleared * pointsPerLine;
  }

  // ページ上のスコア表示要素を更新する
  updateScoreDisplay() {
    config.score.textContent = `${this.score}`;
  }

  // ページ上のベストスコア表示要素を更新する
  updateBestScoreDisplay() {
    config.bestScore.textContent = `${this.bestScore}`;
  }
}

// ゲームを初期化する
export function initializeGame() {
  gameBoard = new GameBoard();
  tetoriminoBoard = new TetoriminoBoard(gameBoard);
}

// ゲームを開始する
export function startGame() {
  initializeGame();
  runGameLoop(tetoriminoBoard, gameBoard);
}

export function runGameLoop(tetoriminoBoard, gameBoard) {
  // ゲームループの実行
  const gameLoop = () => {
    if (gameRunning && !isPaused) {
      if (
        tetoriminoBoard.checkCollision(
          gameBoard,
          tetoriminoBoard.currentShape,
          tetoriminoBoard.x,
          tetoriminoBoard.y + 1
        )
      ) {
        // テトリミノをゲームボードにマージ
        gameBoard.mergeBlock(tetoriminoBoard, gameBoard);
        gameBoard.drawGameArea(tetoriminoBoard);
      }
      tetoriminoBoard.drawBlock();
      requestAnimationFrame(gameLoop);
    }
  };

  // ゲームループを開始
  gameLoop();
}

// ゲームをリセットする
export function resetGame() {
  gameRunning = true;
  isPaused = false;
  config.pauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
  config.bgm.currentTime = 0;
  config.gameover.pause();
  clearInterval(autoMoveInterval);

  // テトリミノボードをリセット
  tetoriminoBoard.initializeGameLoop();
  tetoriminoBoard.currentShape = tetoriminoBoard.getNextShape();
  tetoriminoBoard.currentColor = tetoriminoBoard.getNextColor();
  tetoriminoBoard.drawNextBlock();
  tetoriminoBoard.setupInitialPosition();

  // ゲームボードをリセット
  gameBoard.gameArea = gameBoard.createEmptyArea();
  gameBoard.score = 0;
  gameBoard.updateScoreDisplay();
  gameBoard.drawGameArea(tetoriminoBoard);
}

// ゲームオーバーのチェック
export function checkGameOver(gameBoard) {
  // マージされたテトリミノの一番上の行をチェック
  for (let col = 0; col < gameBoard.boardCol; col++) {
    if (gameBoard.gameArea[0][col] !== 0) {
      return true; // ゲームオーバー
    }
  }
  return false; // ゲーム続行
}

// ゲームオーバーの処理
export function handleGameOver(gameBoard) {
  config.switchPages(config.mainPage, config.finalPage);
  gameRunning = false;
  config.bgm.pause();
  config.gameover.play();
  if (gameBoard.score > gameBoard.bestScore) {
    gameBoard.bestScore = gameBoard.score;
    gameBoard.updateBestScoreDisplay();
  }
  config.finalScore.textContent = `${gameBoard.score}`;
  config.finalBestScore.textContent = `${gameBoard.bestScore}`;
}

// キーコードと処理の対応を定義
export const keyActions = {
  37: () => tetoriminoBoard.moveLeft(gameBoard), //左方向
  38: () => {
    config.rotate.play();
    tetoriminoBoard.rotateBlock(gameBoard); //右回転
  },
  39: () => tetoriminoBoard.moveRight(gameBoard), //右方向
  40: () => tetoriminoBoard.moveDown(gameBoard), //下方向
};

// キー入力の処理
export function handleKeyPress(event) {
  const action = keyActions[event.keyCode];
  if (action && !isPaused) {
    action();
  }
}

export function bindKeyClickEvent(keyElement, keyCode) {
  keyElement.addEventListener("click", () => {
    handleKeyPress({ keyCode });
  });
}

// 音量アイコンを音量レベルに基づいて更新
export function updateVolumeIcon(volume) {
  if (volume === 0) {
    config.volumeIcon.className = "fa-solid fa-volume-mute fa-inverse";
  } else if (volume > 0 && volume < 0.4) {
    config.volumeIcon.className = "fa-solid fa-volume-low fa-inverse";
  } else {
    config.volumeIcon.className = "fa-solid fa-volume-high fa-inverse";
  }
}
