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

  const keyframes = [
    { time: 0, position: 0 },
    { time: 160, position: -60 },
    { time: 330, position: 0 },
    { time: 500, position: -60 },
    { time: 660, position: 0 },
    { time: 830, position: -60 },
    { time: 1000, position: 0 }
  ];

  let currentSegment = 0;
  let animationStart = null;  

  function update(browserTime) {

    if (animationStart === null) {
      animationStart = browserTime;
    }    
    const animationTime = browserTime - animationStart;

    if (currentSegment >= keyframes.length - 1) {
        playerHand.style.transform = "translateY(0px)";
        onComplete();
        return;
    }

    const start = keyframes[currentSegment];
    const end = keyframes[currentSegment + 1]; 
    const position = calculatePosition(start, end, animationTime);

    playerHand.style.transform = `translateY(${position}px)`;
    computerHand.style.transform = `scaleX(-1) translateY(${position}px)`;

      if (animationTime >= end.time) {
        currentSegment++;
      }
    requestAnimationFrame(update);
  }
    
  function calculatePosition(start, end, animationTime) {
    const movementUnit = (end.position - start.position) / (end.time - start.time);
    return start.position + ((animationTime - start.time) * movementUnit);  
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

