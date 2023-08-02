const blockSize = 30;
const boardRow = 20;
const boardCol = 10;
const cvs = document.getElementById("game");
const ctx = cvs.getContext("2d");
const canvasW = blockSize * boardCol;
const canvasH = blockSize * boardRow;
cvs.width = canvasW;
cvs.height = canvasH;
cvs.style.width = canvasW + "px";

class GameBoard {
  constructor() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvasW, canvasH);
  }

  startGame() {}
}

const startGame = () => {
  const newGame = new GameBoard();
  newGame.startGame();
};

const init = () => {
  startGame();
};

init();
