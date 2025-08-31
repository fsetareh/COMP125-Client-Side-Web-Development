// Game elements
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const resetSpeedBtn = document.getElementById('resetSpeed');
const resetScoreBtn = document.getElementById('resetScore');

// Game variables
let score = 0;
let gameActive = true;
let bugInterval;
const initialSpeed = 1500; // ms
let currentSpeed = initialSpeed;
let timeRemaining = 119; // seconds (01:59)

// Bug properties
const bug = {
    x: 0,
    y: 0,
    size: 60,
    draw: function() {
        // Bug body
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Bug head
        ctx.fillStyle = '#c0392b';
        ctx.beginPath();
        ctx.arc(this.x - 15, this.y, this.size/4, 0, Math.PI * 2);
        ctx.fill();
        
        // Eyes
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x - 20, this.y - 5, 5, 0, Math.PI * 2);
        ctx.arc(this.x - 20, this.y + 5, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Legs
        ctx.strokeStyle = '#c0392b';
        ctx.lineWidth = 4;
        for(let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const legLength = this.size * 0.7;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(
                this.x + Math.cos(angle) * legLength,
                this.y + Math.sin(angle) * legLength
            );
            ctx.stroke();
        }
        
        // Antennae
        ctx.beginPath();
        ctx.moveTo(this.x - 25, this.y - 5);
        ctx.lineTo(this.x - 40, this.y - 20);
        ctx.moveTo(this.x - 25, this.y + 5);
        ctx.lineTo(this.x - 40, this.y + 20);
        ctx.stroke();
    }
};

// Initialize game
function init() {
    // Setup event listeners
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('touchstart', handleTouch, { passive: false });
    resetSpeedBtn.addEventListener('click', resetSpeed);
    resetScoreBtn.addEventListener('click', resetScore);
    
    // Start game loop
    startGame();
    startTimer();
}

// Start game mechanics
function startGame() {
    moveBug();
}

// Move bug to random position
function moveBug() {
    clearInterval(bugInterval);
    
    // Position bug within canvas boundaries
    bug.x = Math.random() * (canvas.width - bug.size) + bug.size/2;
    bug.y = Math.random() * (canvas.height - bug.size) + bug.size/2;
    
    bugInterval = setInterval(moveBug, currentSpeed);
    draw();
}

// Draw game state
function draw() {
    // Clear canvas with a slight transparency for trail effect
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw bug
    bug.draw();
    
    // Draw score on canvas
    ctx.fillStyle = '#2c3e50';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 20, 30);
}

// Handle mouse click
function handleClick(e) {
    if (!gameActive) return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    checkHit(mouseX, mouseY);
}

// Handle touch events
function handleTouch(e) {
    if (!gameActive) return;
    
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;
    checkHit(touchX, touchY);
}

// Check if click hit the bug
function checkHit(x, y) {
    const distance = Math.sqrt((x - bug.x) ** 2 + (y - bug.y) ** 2);
    
    if (distance < bug.size/2) {
        // Hit successful
        score++;
        scoreDisplay.textContent = score;
        
        // Increase difficulty (speed up bug)
        currentSpeed = Math.max(300, currentSpeed - 100);
        
        // Visual feedback
        ctx.fillStyle = 'rgba(46, 204, 113, 0.5)';
        ctx.beginPath();
        ctx.arc(bug.x, bug.y, bug.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Move bug immediately
        moveBug();
    }
}

// Timer functions
function startTimer() {
    // Update timer every second
    const timer = setInterval(() => {
        if (timeRemaining > 0 && gameActive) {
            timeRemaining--;
            updateTimerDisplay();
        } else if (gameActive) {
            endGame();
            clearInterval(timer);
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60).toString().padStart(2, '0');
    const seconds = (timeRemaining % 60).toString().padStart(2, '0');
    timerDisplay.textContent = `${minutes}:${seconds}`;
}

// Control functions
function resetSpeed() {
    currentSpeed = initialSpeed;
    moveBug();
}

function resetScore() {
    score = 0;
    scoreDisplay.textContent = score;
}

function endGame() {
    gameActive = false;
    clearInterval(bugInterval);
    
    // Show game over message
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'white';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER!', canvas.width/2, canvas.height/2 - 30);
    
    ctx.font = '30px Arial';
    ctx.fillText(`Final Score: ${score}`, canvas.width/2, canvas.height/2 + 30);
}

// Initialize game when page loads
window.onload = init;