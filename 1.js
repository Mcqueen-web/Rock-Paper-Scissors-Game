let playerScore = 0;
let computerScore = 0;

let gameOver = false;

function showChoice(playerChoice){

  if(gameOver){
    return;
  }

  const choices = ["rock", "paper", "scissors"];

  // Display Player Choice
  document.getElementById("player1Image").src =
    "images/" + playerChoice + ".jpg";

  // Generate Computer Choice
  let computerChoice =
    choices[Math.floor(Math.random() * choices.length)];

  // Display Computer Choice
  document.getElementById("player2Image").src =
    "images/" + computerChoice + ".jpg";

  let result = "";

  // DRAW
  if(playerChoice === computerChoice){
    result = "Draw!";
  }

  // PLAYER WINS
  else if(
    (playerChoice === "rock" && computerChoice === "scissors") ||
    (playerChoice === "paper" && computerChoice === "rock") ||
    (playerChoice === "scissors" && computerChoice === "paper")
  ){

    result = "You Win This Round!";

    playerScore++;

    document.getElementById("playerScore").innerHTML =
      playerScore;
  }

  // COMPUTER WINS
  else{

    result = "Computer Wins This Round!";

    computerScore++;

    document.getElementById("computerScore").innerHTML =
      computerScore;
  }

  // Show Result
  document.getElementById("result").innerHTML =
    result;

  // Check Winner
  if(playerScore === 10){

    document.getElementById("result").innerHTML =
      "🎉 YOU WIN THE GAME!";

    gameOver = true;
  }

  if(computerScore === 10){

    document.getElementById("result").innerHTML =
      "💻 COMPUTER WINS THE GAME!";

    gameOver = true;
  }
}

function resetGame(){

  playerScore = 0;
  computerScore = 0;

  gameOver = false;

  document.getElementById("playerScore").innerHTML = 0;
  document.getElementById("computerScore").innerHTML = 0;

  document.getElementById("player1Image").src =
    "images/hand1.jpg";

  document.getElementById("player2Image").src =
    "images/hand2.jpg";

  document.getElementById("result").innerHTML =
    "Choose your move";
}