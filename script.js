let score = 0;
let timeLeft = 30;
let snowflakeVisible = false;
let timerInterval;
let level = 1;
let highScore = 0;
const levelUpScore = 5; // Score needed to level up
const baseSpawnTime = 1000; // Base spawn time in milliseconds
const snowflakeDuration = 1500; // Time before the snowflake disappears
let autoPlayInterval;

// Create a notification element
const notification = document.createElement('div');
notification.id = 'levelUpNotification';
notification.className = 'hidden';
document.body.appendChild(notification);

function randomPosition() {
    const gameArea = document.getElementById('gameArea');
    const snowflake = document.getElementById('snowflake');

    const x = Math.random() * (gameArea.clientWidth - 30);
    const y = Math.random() * (gameArea.clientHeight - 30);

    snowflake.style.left = `${x}px`;
    snowflake.style.top = `${y}px`;
    snowflake.style.display = 'block';
    snowflakeVisible = true;

    // Add a fade-in effect
    snowflake.style.opacity = 0;
    setTimeout(() => {
        snowflake.style.opacity = 1;
    }, 100);

    // Automatically hide the snowflake after a certain duration
    setTimeout(() => {
        if (snowflakeVisible) {
            snowflake.style.display = 'none';
            snowflakeVisible = false;
            spawnSnowflake(); // Spawn a new snowflake immediately
        }
    }, snowflakeDuration);
}

function catchSnowflake() {
    if (snowflakeVisible) {
        score += level; // Increase score based on level
        document.getElementById('score').innerText = `Score: ${score}`;
        document.getElementById('snowflake').style.display = 'none';
        snowflakeVisible = false;

        // Check for level up
        if (score % levelUpScore === 0) {
            levelUp();
        } else {
            spawnSnowflake(); // Spawn the next snowflake immediately
        }
    }
}

function levelUp() {
    level++;
    timeLeft = 30; // Reset timer on level up
    document.getElementById('level').innerText = `Level: ${level}`;
    document.getElementById('timer').innerText = `Time: ${timeLeft}`;
    spawnSnowflake(); // Spawn new snowflake immediately on level up
    showLevelUpNotification(); // Notify player of level up
}

function showLevelUpNotification() {
    notification.innerText = `Congratulations! You've reached Level ${level}!`;
    notification.classList.remove('hidden');
    
    // Fade out notification after 2 seconds
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 2000);
}

function spawnSnowflake() {
    const spawnTime = Math.max(baseSpawnTime - (level * 100), 200); // Decrease spawn time with level
    setTimeout(randomPosition, spawnTime);
}

function startGame() {
    score = 0;
    timeLeft = 30;
    level = 1;
    document.getElementById('score').innerText = `Score: ${score}`;
    document.getElementById('timer').innerText = `Time: ${timeLeft}`;
    document.getElementById('level').innerText = `Level: ${level}`;
    randomPosition();

    document.getElementById('bgMusic').play();

    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').innerText = `Time: ${timeLeft}`;
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function endGame() {
    clearInterval(timerInterval);
    clearInterval(autoPlayInterval);
    if (score > highScore) {
        highScore = score;
        document.getElementById('highScore').innerText = `High Score: ${highScore}`;
    }
    alert(`Game Over! Your final score is: ${score}`);
    document.getElementById('snowflake').style.display = 'none';
    document.getElementById('bgMusic').pause();
}

function autoPlay() {
    autoPlayInterval = setInterval(() => {
        if (snowflakeVisible) {
            catchSnowflake(); // Simulate catching the snowflake
        }
    }, 500); // Adjust the interval for catching frequency
}

document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('snowflake').addEventListener('click', catchSnowflake);
document.getElementById('guideButton').addEventListener('click', () => {
    document.getElementById('guide').classList.remove('hidden');
});
document.getElementById('closeGuide').addEventListener('click', () => {
    document.getElementById('guide').classList.add('hidden');
});

// Secret button activation
document.addEventListener('keydown', (event) => {
    if (event.key === 'h') {
        document.getElementById('autoPlayButton').classList.remove('hidden');
        autoPlay(); // Start autoplay when 'H' is pressed
    }
});