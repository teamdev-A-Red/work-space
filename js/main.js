// main.js
import {
  startGame,
  resetGame,
  gameBoard,
  tetoriminoBoard,
  bindKeyClickEvent,
  updateVolumeIcon,
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

// 音量コントロールを初期化
config.sliderVolume.addEventListener("input", () => {
  const newVolume = parseFloat(config.sliderVolume.value);
  config.bgm.volume = newVolume;
  config.move.volume = newVolume;
  config.rotate.volume = newVolume;
  config.slash.volume = newVolume;
  config.gameover.volume = newVolume;
  updateVolumeIcon(newVolume);
});
