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
let judgementTimeout;

const MAX_MISSES = 10;

// DOM elements
const scoreDisplay = document.getElementById("score");
const comboDisplay = document.getElementById("combo");
const missDisplay = document.getElementById("misses");
const startBtn = document.getElementById("startGameBtn");
const lanes = document.querySelectorAll(".lane");
const stopBtn = document.getElementById("stopGameBtn");
const judgementEl = document.getElementById("judgement");

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

        showJudgement(0, "MISS", "miss");

        if (misses >= MAX_MISSES) {
          stopGame("miss-limit");
        }
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
function stopGame(reason = "stopped") {
  if (!gameActive) return;         // prevent double-calls
  gameActive = false;
  clearInterval(spawnInterval);

  const name = window.playerName || "";

  if (name.trim() !== "") {
    sendScoreToServer(name, score);
  } else {
    alert("You are not signed in, so your score will not be saved online.");
  }

  let extra = "";
  if (reason === "miss-limit") {
    extra = `\nReason: You reached the miss limit (${MAX_MISSES}).`;
  }

  alert(
    `Game Over!\nPlayer: ${name || "Guest"}\nScore: ${score}\nMisses: ${misses}${extra}`
  );
}

async function sendScoreToServer(username, score) {
  try {
    const response = await fetch("/api/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, score }),
    });

    if (!response.ok) {
      console.error("Failed to save score:", await response.text());
      return;
    }

    const data = await response.json();
    console.log("Score saved:", data);
  } catch (err) {
    console.error("Error sending score:", err);
  }
}

function showJudgement(points, label, type) {
  if (!judgementEl) return;

  judgementEl.textContent = points > 0 ? `+${points} ${label}` : label;
  judgementEl.className = "judgement";

  if (type) {
    judgementEl.classList.add(`judgement-${type}`);
  }

  void judgementEl.offsetWidth;
  judgementEl.classList.add("judgement-show");

  clearTimeout(judgementTimeout);
  judgementTimout = setTimeout(() => {
    judgementEl.classList.remove("judgement-show");
  }, 400)
}


// Start button functionality
if (startBtn) {
  startBtn.addEventListener("click", startGame);
}
// Stop button functionality
if (stopBtn) {
  stopBtn.addEventListener("click", () => stopGame("stopped"));
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
          showJudgement(300, "PERFECT", "perfect");
        } else if (accuracy < 25) {
          score += 150;
          combo++;
          showJudgement(150, "GREAT", "great");
        } else {
          score += 50;
          combo = 0;
          showJudgement(50, "OK", "ok");
        }
        scoreDisplay.textContent = score;
        comboDisplay.textContent = combo;
        arrow.classList.add("hit");
      }
    });
  }
});

