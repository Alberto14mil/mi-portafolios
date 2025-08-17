document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreDisplay = document.getElementById('score');
    const gameMessage = document.getElementById('gameMessage');
    const startButton = document.getElementById('startButton');

    const gridSize = 20;
    let tileCountX = canvas.width / gridSize;
    let tileCountY = canvas.height / gridSize;

    let snake = [{ x: 10, y: 10 }];
    let food = {};

    let dx = 0;
    let dy = 0;

    let score = 0;
    let gameRunning = false;
    let gameInterval;
    let speed = 150;
    const MIN_SPEED = 50;
    const SPEED_INCREMENT = 5;
    const BIG_FOOD_SCORE_THRESHOLD = 100;
    const BIG_FOOD_CHANCE = 0.3;
    const BIG_FOOD_POINTS = 50;
    let changingDirection = false;

    const SNAKE_COLOR = '#00ff00';
    const FOOD_COLOR = '#ff00ff';
    const BIG_FOOD_COLOR = '#ffcc00';
    const BORDER_COLOR = '#00ffff';
    const GAME_BG_COLOR = '#000000';
    const START_SCORE = 10;

    function startGame() {
        if (gameRunning) return;
        gameRunning = true;
        gameMessage.textContent = '¡A Jugar!';
        startButton.style.display = 'none';

        score = START_SCORE;
        scoreDisplay.textContent = score;
        snake = [{ x: 10, y: 10 }];
        dx = 0;
        dy = 0;
        speed = 150;

        generateFood();
        gameInterval = setInterval(gameLoop, speed);
    }

    function gameLoop() {
        if (!gameRunning) return;

        changingDirection = false;

        if (gameOver()) {
            endGame('¡Juego Terminado! Te chocaste.');
            return;
        }

        clearCanvas();
        drawFood();
        moveSnake();
        drawSnake();
    }

    function clearCanvas() {
        ctx.fillStyle = GAME_BG_COLOR;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        for (let i = 0; i < tileCountX; i++) {
            ctx.beginPath();
            ctx.moveTo(i * gridSize, 0);
            ctx.lineTo(i * gridSize, canvas.height);
            ctx.stroke();
        }
        for (let i = 0; i < tileCountY; i++) {
            ctx.beginPath();
            ctx.moveTo(0, i * gridSize);
            ctx.lineTo(canvas.width, i * gridSize);
            ctx.stroke();
        }
    }

    function drawSnakePart(part, index) {
        ctx.fillStyle = SNAKE_COLOR;
        ctx.strokeStyle = BORDER_COLOR;
        ctx.lineWidth = 2;

        if (index === 0) {
            // Dibuja la cabeza (cuadrado)
            ctx.fillRect(part.x * gridSize + 1, part.y * gridSize + 1, gridSize - 2, gridSize - 2);
            ctx.strokeRect(part.x * gridSize + 1, part.y * gridSize + 1, gridSize - 2, gridSize - 2);
        } else {
            // Dibuja el cuerpo (círculo)
            const radius = gridSize / 2;
            const centerX = part.x * gridSize + radius;
            const centerY = part.y * gridSize + radius;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius - 2, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
        }
    }

    function drawSnake() {
        snake.forEach(drawSnakePart);
    }

    function generateFood() {
        let newFoodX, newFoodY;
        let foodOnSnake = true;
        while (foodOnSnake) {
            newFoodX = Math.floor(Math.random() * tileCountX);
            newFoodY = Math.floor(Math.random() * tileCountY);
            foodOnSnake = snake.some(part => part.x === newFoodX && part.y === newFoodY);
        }

        const isBigFood = score >= BIG_FOOD_SCORE_THRESHOLD && Math.random() < BIG_FOOD_CHANCE;
        
        food = {
            x: newFoodX,
            y: newFoodY,
            isBig: isBigFood
        };
    }

    function drawFood() {
        const radius = gridSize / 2;
        const centerX = food.x * gridSize + radius;
        const centerY = food.y * gridSize + radius;

        if (food.isBig) {
            ctx.fillStyle = BIG_FOOD_COLOR;
            ctx.strokeStyle = BIG_FOOD_COLOR;
            ctx.lineWidth = 4;
            ctx.shadowColor = BIG_FOOD_COLOR;
            ctx.shadowBlur = 10;
        } else {
            ctx.fillStyle = FOOD_COLOR;
            ctx.strokeStyle = FOOD_COLOR;
            ctx.lineWidth = 2;
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
        }
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius - 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }

    function moveSnake() {
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };
        snake.unshift(head);
        const hasEatenFood = head.x === food.x && head.y === food.y;

        if (hasEatenFood) {
            score += food.isBig ? BIG_FOOD_POINTS : 10;
            scoreDisplay.textContent = score;
            generateFood();
            
            if (speed > MIN_SPEED) {
                speed -= SPEED_INCREMENT;
                clearInterval(gameInterval);
                gameInterval = setInterval(gameLoop, speed);
            }
        } else {
            snake.pop();
        }
    }

    function gameOver() {
        for (let i = 4; i < snake.length; i++) {
            if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
        }

        const hitLeftWall = snake[0].x < 0;
        const hitRightWall = snake[0].x > tileCountX - 1;
        const hitTopWall = snake[0].y < 0;
        const hitBottomWall = snake[0].y > tileCountY - 1;

        return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
    }

    function endGame(message) {
        gameRunning = false;
        clearInterval(gameInterval);
        gameMessage.textContent = message;
        startButton.textContent = 'Volver a Jugar';
        startButton.style.display = 'block';
        dx = 0;
        dy = 0;
    }

    window.restartGame = function() {
        endGame('Presiona ENTER o haz click para empezar');
        startGame();
    };

    document.addEventListener('keydown', changeDirection);
    startButton.addEventListener('click', startGame);

    function changeDirection(event) {
        if (changingDirection) return;
        changingDirection = true;

        const keyPressed = event.keyCode;
        const LEFT_KEY = 37;
        const UP_KEY = 38;
        const RIGHT_KEY = 39;
        const DOWN_KEY = 40;
        const ENTER_KEY = 13;

        const goingUp = dy === -1;
        const goingDown = dy === 1;
        const goingLeft = dx === -1;
        const goingRight = dx === 1;

        if (!gameRunning && keyPressed === ENTER_KEY) {
            startGame();
            return;
        }

        if (keyPressed === LEFT_KEY && !goingRight) {
            dx = -1;
            dy = 0;
        } else if (keyPressed === UP_KEY && !goingDown) {
            dx = 0;
            dy = -1;
        } else if (keyPressed === RIGHT_KEY && !goingLeft) {
            dx = 1;
            dy = 0;
        } else if (keyPressed === DOWN_KEY && !goingUp) {
            dx = 0;
            dy = 1;
        }
    }

    clearCanvas();
});