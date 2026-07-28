const WINNING_SCORE = 10;
const choices = ["rock", "paper", "scissors"];
const choiceEmoji = {
  rock: "✊",
  paper: "✋",
  scissors: "✌️"
};

const state = {
  playerScore: 0,
  computerScore: 0,
  round: 1,
  gameOver: false,
  history: []
};

const elements = {
  playerScore: document.getElementById("playerScore"),
  computerScore: document.getElementById("computerScore"),
  roundNumber: document.getElementById("roundNumber"),
  playerImage: document.getElementById("player1Image"),
  computerImage: document.getElementById("player2Image"),
  playerChoiceLabel: document.getElementById("playerChoiceLabel"),
  computerChoiceLabel: document.getElementById("computerChoiceLabel"),
  result: document.getElementById("result"),
  resultDetail: document.getElementById("resultDetail"),
  resultIcon: document.getElementById("resultIcon"),
  resetButton: document.getElementById("resetBtn"),
  clearHistoryButton: document.getElementById("clearHistoryBtn"),
  historyList: document.getElementById("historyList"),
  moveButtons: [...document.querySelectorAll(".move-button")],
  modal: document.getElementById("gameOverModal"),
  modalIcon: document.getElementById("modalIcon"),
  modalTitle: document.getElementById("modalTitle"),
  modalMessage: document.getElementById("modalMessage"),
  playAgainButton: document.getElementById("playAgainBtn")
};

function getComputerChoice() {
  return choices[Math.floor(Math.random() * choices.length)];
}

function getRoundResult(playerChoice, computerChoice) {
  if (playerChoice === computerChoice) return "draw";

  const playerWins =
    (playerChoice === "rock" && computerChoice === "scissors") ||
    (playerChoice === "paper" && computerChoice === "rock") ||
    (playerChoice === "scissors" && computerChoice === "paper");

  return playerWins ? "win" : "loss";
}

function formatChoice(choice) {
  return choice.charAt(0).toUpperCase() + choice.slice(1);
}

function animateImage(image) {
  image.classList.remove("reveal");
  void image.offsetWidth;
  image.classList.add("reveal");
}

function updateChoiceDisplay(playerChoice, computerChoice) {
  elements.playerImage.src = `images/${playerChoice}.jpg`;
  elements.computerImage.src = `images/${computerChoice}.jpg`;
  elements.playerImage.alt = `You chose ${playerChoice}`;
  elements.computerImage.alt = `Computer chose ${computerChoice}`;

  elements.playerChoiceLabel.textContent = formatChoice(playerChoice);
  elements.computerChoiceLabel.textContent = formatChoice(computerChoice);
  elements.playerChoiceLabel.classList.add("active");
  elements.computerChoiceLabel.classList.add("active");

  animateImage(elements.playerImage);
  animateImage(elements.computerImage);
}

function updateResultMessage(roundResult, playerChoice, computerChoice) {
  const details = `${formatChoice(playerChoice)} vs ${formatChoice(computerChoice)}`;

  if (roundResult === "draw") {
    elements.result.textContent = "A perfect draw";
    elements.resultDetail.textContent = `${details}. Nobody takes the point.`;
    elements.resultIcon.textContent = "↔";
    return;
  }

  if (roundResult === "win") {
    elements.result.textContent = "Point to you";
    elements.resultDetail.textContent = `${details}. Nice read.`;
    elements.resultIcon.textContent = "↑";
    return;
  }

  elements.result.textContent = "Computer takes it";
  elements.resultDetail.textContent = `${details}. Try another move.`;
  elements.resultIcon.textContent = "↓";
}

function renderScores() {
  elements.playerScore.textContent = state.playerScore;
  elements.computerScore.textContent = state.computerScore;
  elements.roundNumber.textContent = state.round;
}

function renderHistory() {
  if (state.history.length === 0) {
    elements.historyList.innerHTML = '<p class="empty-history">Your last five rounds will appear here.</p>';
    return;
  }

  elements.historyList.innerHTML = state.history
    .map((item) => {
      const resultText = item.result === "win" ? "Won" : item.result === "loss" ? "Lost" : "Draw";
      return `
        <span class="history-chip ${item.result}">
          <span aria-hidden="true">${choiceEmoji[item.playerChoice]}</span>
          ${resultText} · ${formatChoice(item.playerChoice)} / ${formatChoice(item.computerChoice)}
        </span>
      `;
    })
    .join("");
}

function setControlsDisabled(disabled) {
  elements.moveButtons.forEach((button) => {
    button.disabled = disabled;
  });
}

function finishGame(playerWon) {
  state.gameOver = true;
  setControlsDisabled(true);

  elements.modalIcon.textContent = playerWon ? "🏆" : "🤖";
  elements.modalTitle.textContent = playerWon ? "You won the match!" : "The computer won";
  elements.modalMessage.textContent = `Final score: ${state.playerScore}–${state.computerScore}`;
  elements.modal.hidden = false;
  elements.playAgainButton.focus();
}

function playRound(playerChoice) {
  if (state.gameOver || !choices.includes(playerChoice)) return;

  const computerChoice = getComputerChoice();
  const roundResult = getRoundResult(playerChoice, computerChoice);

  updateChoiceDisplay(playerChoice, computerChoice);
  updateResultMessage(roundResult, playerChoice, computerChoice);

  if (roundResult === "win") state.playerScore += 1;
  if (roundResult === "loss") state.computerScore += 1;

  state.history.unshift({ playerChoice, computerChoice, result: roundResult });
  state.history = state.history.slice(0, 5);

  if (state.playerScore < WINNING_SCORE && state.computerScore < WINNING_SCORE) {
    state.round += 1;
  }

  renderScores();
  renderHistory();

  if (state.playerScore === WINNING_SCORE) finishGame(true);
  if (state.computerScore === WINNING_SCORE) finishGame(false);
}

function resetGame() {
  state.playerScore = 0;
  state.computerScore = 0;
  state.round = 1;
  state.gameOver = false;
  state.history = [];

  elements.playerImage.src = "images/hand1.jpg";
  elements.computerImage.src = "images/hand2.jpg";
  elements.playerImage.alt = "Your current choice";
  elements.computerImage.alt = "Computer's current choice";
  elements.playerChoiceLabel.textContent = "Waiting";
  elements.computerChoiceLabel.textContent = "Waiting";
  elements.playerChoiceLabel.classList.remove("active");
  elements.computerChoiceLabel.classList.remove("active");
  elements.result.textContent = "Choose your move";
  elements.resultDetail.textContent = "Use the buttons below or press R, P, or S.";
  elements.resultIcon.textContent = "✦";
  elements.modal.hidden = true;

  setControlsDisabled(false);
  renderScores();
  renderHistory();
}

function clearHistory() {
  state.history = [];
  renderHistory();
}

elements.moveButtons.forEach((button) => {
  button.addEventListener("click", () => playRound(button.dataset.choice));
});

elements.resetButton.addEventListener("click", resetGame);
elements.playAgainButton.addEventListener("click", resetGame);
elements.clearHistoryButton.addEventListener("click", clearHistory);

document.addEventListener("keydown", (event) => {
  if (event.repeat || state.gameOver) return;

  const keyMap = {
    r: "rock",
    p: "paper",
    s: "scissors"
  };

  const choice = keyMap[event.key.toLowerCase()];
  if (choice) playRound(choice);
});

resetGame();
