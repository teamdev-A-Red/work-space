export const config = {
  startBtn: document.getElementById("start_btn"),
  resetBtn: document.getElementById("reset_btn"),
  initialPage: document.getElementById("initialPage"),
  mainPage: document.getElementById("mainPage"),
  finalPage: document.getElementById("finalPage"),
  pauseBtn: document.getElementById("pause_btn"),
  score: document.getElementById("score"),
  bestScore: document.getElementById("best-score"),
  finalScore: document.getElementById("final-score"),
  finalBestScore: document.getElementById("final-best-score"),
  rotate: document.getElementById("rotate"),
  slash: document.getElementById("slash"),
  gameover: document.getElementById("gameover"),
  bgm: document.getElementById("background_mp3"),
  pause: document.getElementById("pause"),
  quitBtn: document.getElementById("quit_btn"),
  replayBtn: document.getElementById("replay_btn"),
  sliderVolume: document.getElementById("volume"),
  volumeIcon: document.getElementById("volume-icon"),
  upKey: document.querySelector(".up"),
  downKey: document.querySelector(".down"),
  leftKey: document.querySelector(".left"),
  rightKey: document.querySelector(".right"),

  // ページ切り替え
  switchPages: function switchPages(page1, page2) {
    page1.style.display = "none";
    page2.style.display = "block";
  },
};
