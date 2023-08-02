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

const draw = () => {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvasW, canvasH);
};
//初期化処理
const init = () => {
  draw();
};
