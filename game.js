document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const startBtn = document.getElementById('startBtn');
    const restartBtn = document.getElementById('restartBtn');
    const scoreElement = document.getElementById('score');

    // Debug logging
    console.log('DOM Elements:', { canvas, startBtn, restartBtn, scoreElement });

    // Set canvas size
    canvas.width = 400;
    canvas.height = 400;

    const gridSize = 20;
    const tileCount = canvas.width / gridSize;
    let snake = [];
    let food = {};
    let dx = gridSize;
    let dy = 0;
    let score = 0;
    let gameInterval;
    let gameStarted = false;

    function initGame() {
        snake = [
            { x: 5 * gridSize, y: 5 * gridSize }
        ];
        generateFood();
        score = 0;
        scoreElement.textContent = score;
        dx = gridSize;
        dy = 0;
    }

    function generateFood() {
        food = {
            x: Math.floor(Math.random() * tileCount) * gridSize,
            y: Math.floor(Math.random() * tileCount) * gridSize
        };

        // Check if food spawned on snake
        for (let segment of snake) {
            if (segment.x === food.x && segment.y === food.y) {
                generateFood();
                break;
            }
        }
    }

    function drawGame() {
        // Clear canvas
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw snake
        ctx.fillStyle = '#4CAF50';
        snake.forEach(segment => {
            ctx.fillRect(segment.x, segment.y, gridSize - 2, gridSize - 2);
        });

        // Draw food
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(food.x, food.y, gridSize - 2, gridSize - 2);
    }

    function moveSnake() {
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };

        // Check wall collision
        if (head.x >= canvas.width) head.x = 0;
        if (head.x < 0) head.x = canvas.width - gridSize;
        if (head.y >= canvas.height) head.y = 0;
        if (head.y < 0) head.y = canvas.height - gridSize;

        // Check self collision
        for (let i = 0; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                gameOver();
                return;
            }
        }

        snake.unshift(head);

        // Check food collision
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            scoreElement.textContent = score;
            generateFood();
        } else {
            snake.pop();
        }
    }

    function gameLoop() {
        moveSnake();
        drawGame();
    }

    function startGame() {
        console.log('Start Game clicked, current gameStarted:', gameStarted);
        if (!gameStarted) {
            gameStarted = true;
            startBtn.style.display = 'none';
            restartBtn.style.display = 'block';
            initGame();
            gameInterval = setInterval(gameLoop, 100);
            console.log('Game started successfully');
        }
    }

    function gameOver() {
        clearInterval(gameInterval);
        gameStarted = false;
        alert(`Game Over! Score: ${score}`);
    }

    function restartGame() {
        clearInterval(gameInterval);
        startGame();
    }

    // Event listeners
    console.log('Setting up event listeners');
    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', restartGame);
    console.log('Event listeners set up successfully');

    document.addEventListener('keydown', (event) => {
        if (!gameStarted) return;

        switch (event.key) {
            case 'ArrowUp':
                if (dy === 0) {
                    dx = 0;
                    dy = -gridSize;
                }
                break;
            case 'ArrowDown':
                if (dy === 0) {
                    dx = 0;
                    dy = gridSize;
                }
                break;
            case 'ArrowLeft':
                if (dx === 0) {
                    dx = -gridSize;
                    dy = 0;
                }
                break;
            case 'ArrowRight':
                if (dx === 0) {
                    dx = gridSize;
                    dy = 0;
                }
                break;
        }
    });
});