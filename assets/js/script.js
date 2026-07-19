/* jshint esversion: 6, browser: true, strict: global */
"use strict";

let playerScore;
let computerScore;
let drawScore;
let playerState;
let computerState;
let result;
let header;
let message;

const beats = {
  rock: "scissors",
  paper: "rock",
  scissors: "paper",
};

function initializeGame() {
  playerScore = 0;
  computerScore = 0;
  drawScore = 0;
  header = "Ready?"
  message = "Choose rock, paper or scissors to start!";

  resetHands();
  render();
}

function resetHands() {
  playerState = "rock";
  computerState = "rock";
}

function shake(onComplete) {

  const playerHand = document.getElementById("player-hand");
  const computerHand = document.getElementById("computer-hand");

  let position = 0;
  const speed = 360;
  let direction = -1;
  let previousTime = null;
  let bounceCount = 0;

  function update(browserTime) {

    if (previousTime === null) {
      previousTime = browserTime;
      requestAnimationFrame(update);
      return;
    }

    const deltaTime = browserTime - previousTime;
    previousTime = browserTime;

    position += direction * speed * (deltaTime / 1000);

    if (position <= -60) {
      position = -60;
      direction = 1;
    }

    if (position >= 0) {
      position = 0;
      bounceCount++;

      if (bounceCount >= 3) {
        playerHand.style.transform = "translateY(0px)";
        computerHand.style.transform = "scaleX(-1) translateY(0px)";
        onComplete();
        return;
      }

      direction = -1;
    }

    playerHand.style.transform = `translateY(${position}px)`;
    computerHand.style.transform = `scaleX(-1) translateY(${position}px)`;

    requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

function playRound(choice) {
  resetHands();
  render();
  shake(() => {
    playerState = choice;
    finalState();
    render();
  });
}

function addEventListeners () {

  document.querySelectorAll(".choice-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      playRound(btn.id);
    });
  
    btn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        playRound(btn.id);
        }
    });
  });
  
  document.getElementById("restart-btn").addEventListener("click", () => {
    initializeGame(); 
  });
}


function getComputerChoice() {
  const choices = ["rock", "paper", "scissors"];
  const index = Math.floor(Math.random() * choices.length);

  computerState = choices[index];
}

function getResult() { 
  if (playerState === computerState) {
    result = "draw";
  } else if (beats[playerState] === computerState){
     result = "win";
  } else {  
  result = "lose";
  }  
}

function updateScore() {
  if (result === "win") {
    playerScore++;
  } else if (result === "lose") {
    computerScore++;    
  } else if (result === "draw") {
    drawScore++;    
  }
}

function updateTexts() { 
  if (result === "win") {
    header = "VICTORY!";
    message = "YOU CRUSHED THE COMPUTER";
  } else if (result === "lose") {
    header = "OUCH!";
    message = "BETTER LUCK NEXT TIME";
  } else if (result === "draw") {
    header = "DRAW!";
    message = "TRY AGAIN FOR GLORY";
  }
}

function finalState() {
    getComputerChoice();
    getResult();
    updateScore();
    updateTexts();    
}

function render () {
  const playerHand = document.getElementById("player-hand");
  playerHand.src = `assets/images/${playerState}.png`;
  playerHand.alt = `player ${playerState}`

  const computerHand = document.getElementById("computer-hand");
  computerHand.src = `assets/images/${computerState}.png`;
  computerHand.alt = `computer ${computerState}`

  document.getElementById("player-score").textContent = playerScore;
  document.getElementById("computer-score").textContent = computerScore;
  document.getElementById("draw-score").textContent = drawScore;
  document.getElementById("header").textContent = header;
  document.getElementById("message").textContent = message;
}

initializeGame()
addEventListeners();

