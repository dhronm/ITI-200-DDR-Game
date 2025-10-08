// Game navigation
const playButton = document.getElementById("playButton");
if (playButton) {
  playButton.addEventListener("click", () => {
    window.location.href = "game.html";
  });
}

// Game logic for Arrow Storm
let score = 0;
let combo = 0;
let misses = 0;
let gameActive = false;
let spawnInterval;

// DOM elements
const scoreDisplay = document.getElementById("score");
const comboDisplay = document.getElementById("combo");
const missDisplay = document.getElementById("misses");
const startBtn = document.getElementById("startGameBtn");
const lanes = document.querySelectorAll(".lane");
const stopBtn = document.getElementById("stopGameBtn");

// Function to spawn arrows
function spawnArrow(lane) {
  const arrow = document.createElement("div");
  arrow.classList.add("arrow");
  arrow.textContent = lane.dataset.symbol;
  lane.appendChild(arrow);

  let pos = -40;
  function fall() {
    if (!gameActive) return;
    pos += 4;
    arrow.style.top = pos + "px";

    if (pos < 560) {
      requestAnimationFrame(fall);
    } else {
      if (arrow.parentNode) {
        lane.removeChild(arrow);
        combo = 0;
        misses++;
        missDisplay.textContent = misses;
      }
    }
  }
  fall();
}

// Start game function
function startGame() {
  if (gameActive) return;
  gameActive = true;
  score = 0;
  combo = 0;
  misses = 0;
  scoreDisplay.textContent = 0;
  comboDisplay.textContent = 0;
  missDisplay.textContent = 0;

  spawnInterval = setInterval(() => {
    const lane = lanes[Math.floor(Math.random() * lanes.length)];
    spawnArrow(lane);
  }, 1000);
}

// Stop game function
function stopGame() {
  gameActive = false;
  clearInterval(spawnInterval);
  alert(`Game Over!\nScore: ${score}\nMisses: ${misses}`);
}

// Start button functionality
if (startBtn) {
  startBtn.addEventListener("click", startGame);
}
// Stop button functionality
if (stopBtn) {
  stopBtn.addEventListener("click", stopGame);
}

// Handle key presses
document.addEventListener("keydown", (e) => {
  if (!gameActive) return;
  const lane = [...lanes].find((l) => l.dataset.key === e.key);
  if (lane) {
    const arrows = lane.querySelectorAll(".arrow");
    arrows.forEach((arrow) => {
      const pos = parseInt(arrow.style.top);
      if (pos > 500 && pos < 580) {
        lane.removeChild(arrow);
        const accuracy = Math.abs(540 - pos);
        if (accuracy < 10) {
          score += 300;
          combo++;
        } else if (accuracy < 25) {
          score += 150;
          combo++;
        } else {
          score += 50;
          combo = 0;
        }
        scoreDisplay.textContent = score;
        comboDisplay.textContent = combo;
        arrow.classList.add("hit");
      }
    });
  }
});

