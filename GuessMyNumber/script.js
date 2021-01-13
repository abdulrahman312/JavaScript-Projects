let randomNumber;
let score;
let guessCount;
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
    randomNumber = Math.floor(Math.random() * 100) + 1;
    score = 10;
    guessCount = 0;
    scoreValue.textContent = 10;
    inputField.value = '';
    inputField.focus();
    document.querySelector('.body').style.backgroundColor = "#222";
    document.querySelector('.number').textContent = "?";
    messageField.textContent = "Start guessing..."
}

function checkInput() {
    if (inputField.value >= 1 && inputField.value <= 100) {
        if (score > 1) {
            guessCount++;
            if (inputField.value == randomNumber) {
                document.querySelector('.number').textContent = randomNumber;
                document.querySelector('.body').style.backgroundColor = "#60b347";
                document.querySelector('.number').style.width = '30rem';
                scoreValue.textContent = score;
                highScore.push(guessCount);
                document.querySelector('.highscore').textContent = Math.min(...highScore)
                messageField.textContent = "Congratulation, You won!!!"
            } else {
                score--;
                if (inputField.value > randomNumber) {
                    messageField.textContent = "Your guess is too high";
                } else {
                    messageField.textContent = "Your guess is too low";
                }
                scoreValue.textContent = score;
                inputField.value = '';
                inputField.focus();
            }
        } else {
            messageField.textContent = "Sorry, you lost."
            scoreValue.textContent = 0;
        }
    } else {
        messageField.textContent = "The INPUT should be a number between 1 and 20.🚫"
    }
    
}

initializeGame();