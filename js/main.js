// main.js
import {
  startGame,
  resetGame,
  gameBoard,
  tetoriminoBoard,
  bindKeyClickEvent,
} from "./game.js";
import { config } from "./config.js";

bindKeyClickEvent(config.upKey, 38);
bindKeyClickEvent(config.downKey, 40);
bindKeyClickEvent(config.leftKey, 37);
bindKeyClickEvent(config.rightKey, 39);

config.startBtn.addEventListener("click", function () {
  startGame();
});

config.resetBtn.addEventListener("click", function () {
  resetGame(gameBoard, tetoriminoBoard);
});

config.quitBtn.addEventListener("click", function () {
  // ページを再ロード
  location.reload();
});

config.replayBtn.addEventListener("click", function () {
  // リスタート関数を実行
  config.switchPages(config.finalPage, config.mainPage);
  resetGame(gameBoard, tetoriminoBoard);
});

config.sliderVolume.addEventListener("input", (e) => {
  config.bgm.volume = config.sliderVolume.value;
  config.move.volume = config.sliderVolume.value;
  config.rotate.volume = config.sliderVolume.value;
  config.slash.volume = config.sliderVolume.value;
});
