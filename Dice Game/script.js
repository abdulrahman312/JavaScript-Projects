'use strict';

let playerData = [0, 0];
let currentScore = 0;
let activePlayer = 0;
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
    (activePlayer == 0) ? activePlayer = 1 : activePlayer = 0;
    playerOneCurrentScore.textContent = 0;
    playerTwoCurrentScore.textContent = 0;
    playerOne.classList.toggle("player--active");
    playerTwo.classList.toggle("player--active");
}

function initializeGame() {
    diceImg.classList.add('hidden');
    playerOneScore.textContent = 0;
    playerTwoScore.textContent = 0;
    playerData = [0, 0];
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
    diceImg.classList.remove('hidden');
    if (randomNumber == 1) {
        currentScore = 0;
        switchPlayer();
    } else {
        currentScore += randomNumber;
        document.querySelector(`#current--${activePlayer}`).textContent = currentScore;
        if (currentScore + playerData[activePlayer] >= 10) {
            document.querySelector(`#score--${activePlayer}`).textContent = currentScore + playerData[activePlayer];
            winGame();
        }
    }
}

// This function will run when the game is hold
function holdGame() {
    document.querySelector(`#score--${activePlayer}`).textContent = currentScore + playerData[activePlayer];
    switchPlayer();
}

// This function will run when the game is finished
function winGame() {
    document.querySelector(`.player--${activePlayer}`).classList.add('player--winner');
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
