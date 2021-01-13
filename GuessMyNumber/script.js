let randomNumber;
let score;
let highScore = [];
let inputField = document.querySelector('.guess');
let scoreValue = document.querySelector('.score');
let messageField = document.querySelector('.message');

document.querySelector('.check').addEventListener('click', checkInput);
inputField.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        checkInput();
    }
})
document.querySelector('.again').addEventListener('click', initializeGame);

function initializeGame() {
    randomNumber = Math.floor(Math.random() * 20) + 1;
    score = 0;
    scoreValue.textContent = 0;
    inputField.value = '';
    inputField.focus();
    document.querySelector('.body').style.backgroundColor = "#222";
    document.querySelector('.number').textContent = "?";
}

function checkInput() {
    if (inputField.value >= 1 && inputField.value <= 20) {
        score++;
        if (inputField.value == randomNumber) {
            document.querySelector('.number').textContent = randomNumber;
            document.querySelector('.body').style.backgroundColor = "green";
            scoreValue.textContent = score;
            highScore.push(score);
            document.querySelector('.highscore').textContent = Math.min(...highScore)
            messageField.textContent = "Congratulation, You won!!!"
        } else {
            inputField.value = '';
            inputField.focus();
            messageField.textContent = "Wrong Guess 😟, Try Again.";
        }
    } else {
        messageField.textContent = "The INPUT should be a number between 1 and 20.🚫"
    }
    
}

initializeGame();