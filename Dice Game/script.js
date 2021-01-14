'use strict';

let playerOneData = 0;
let playerTwoData = 0;
let playerOne = document.querySelector('.player--0');
let playerTwo = document.querySelector('.player--1');
let playerOneScore = document.querySelector('#score--0');
let playerTwoScore = document.querySelector('#score--1');
let playerOneCurrentScore = document.querySelector('#current--0');
let playerTwoCurrentScore = document.querySelector('#current--1');
let diceImg = document.querySelector('.dice');

// Add event handler on the button to start a new game
document.querySelector('.btn--new').addEventListener('click', initializeGame);


function switchPlayer() {
    playerOneCurrentScore.textContent = 0;
    playerTwoCurrentScore.textContent = 0;
    playerOne.classList.toggle("player--active");
    playerTwo.classList.toggle("player--active");
}

function initializeGame() {
    playerOneScore.textContent = 0;
    playerTwoScore.textContent = 0;
    playerOneCurrentScore.textContent = 0;
    playerTwoCurrentScore.textContent = 0;
    if(!playerOne.classList.contains('player--active')) {
        switchPlayer();
    }
    playerOne.classList.remove('player--winner');
    playerTwo.classList.remove('player--winner');
    // Add event listeners on buttons
    document.querySelector('.btn--roll').addEventListener('click', rollDice);
    document.querySelector('.btn--hold').addEventListener('click', holdGame);
}

// This function will run when roll dice button is clicked
function rollDice() {
    let randomNumber = Math.floor(Math.random() * 6) + 1;
    diceImg.setAttribute("src", `dice-${randomNumber}.png`);
    if (playerOne.classList.contains('player--active')) {
        if (randomNumber == 1) {
            playerOneData += Number(playerOneCurrentScore.textContent);
            playerOneScore.textContent = playerOneData;
            switchPlayer();
        } else {
            playerOneCurrentScore.textContent = Number(playerOneCurrentScore.textContent) + randomNumber;
            if ((Number(playerOneCurrentScore.textContent) + playerOneData) >= 100) {
                playerOneScore.textContent = Number(playerOneCurrentScore.textContent) + playerOneData;
                playerOne.classList.add('player--winner');
                winGame();
            }
        }    
    } else {
        if (randomNumber == 1) {
            playerTwoData += Number(playerTwoCurrentScore.textContent);
            playerTwoScore.textContent = playerTwoData;
            switchPlayer();
        } else {
            playerTwoCurrentScore.textContent = Number(playerTwoCurrentScore.textContent) + randomNumber;
            if ((Number(playerTwoCurrentScore.textContent) + playerTwoData) >= 100) {
                playerTwoScore.textContent = Number(playerTwoCurrentScore.textContent) + playerTwoData;
                playerTwo.classList.add('player--winner');
                winGame();
            }
        } 
    }
}

// This function will run when the game is hold
function holdGame() {
    if (playerOne.classList.contains('player--active')) {
        playerOneData += Number(playerOneCurrentScore.textContent);
        playerOneScore.textContent = playerOneData;
    } else {
        playerTwoData += Number(playerTwoCurrentScore.textContent);
        playerTwoScore.textContent = playerTwoData;
    }
    switchPlayer();
}

// This function will run when the game is finished
function winGame() {
    document.querySelector('.btn--roll').removeEventListener('click', rollDice);
    document.querySelector('.btn--hold').removeEventListener('click', holdGame);
}



initializeGame();


// Code for show modal
const modal = document.querySelector('.modal');
const overLay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.close-modal');
const btnOpenModal = document.querySelector('.btn--rule');

// Add event listerner on buttons to open the modal
btnOpenModal.addEventListener('click', toggleHiddenClass);


// Add event listerner on the close button
btnCloseModal.addEventListener('click', toggleHiddenClass);

// Add event listener on overlay to close modal
overLay.addEventListener('click', toggleHiddenClass);

// Add keydown event to close modal when esc key is pressed
document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") {
        if (!(modal.classList.contains('hidden'))) {
            toggleHiddenClass();
        }
    }
})

// Function to toggle between the hidden classes
function toggleHiddenClass() {
    modal.classList.toggle("hidden");
    overLay.classList.toggle("hidden");
}
