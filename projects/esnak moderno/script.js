document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreDisplay = document.getElementById('score');
    const gameMessage = document.getElementById('gameMessage');
    const startButton = document.getElementById('startButton');

    const gridSize = 20; // Tamaño de cada "cuadrado" de la serpiente y la comida
    let tileCount = canvas.width / gridSize; // Número de cuadrados en el canvas (20x20 para 400x400)

    let snake = [{ x: 10, y: 10 }]; // Posición inicial de la serpiente
    let food = {}; // Posición de la comida

    let dx = 0; // Dirección X (0 para arriba/abajo, 1 para derecha, -1 para izquierda)
    let dy = 0; // Dirección Y (0 para izquierda/derecha, 1 para abajo, -1 para arriba)

    let score = 0;
    let gameRunning = false;
    let gameInterval;
    let speed = 150; // Velocidad inicial del juego (ms por fotograma)
    let changingDirection = false; // Para prevenir giros dobles en un solo fotograma

    // Paleta de colores (tomadas de estilo.css para coherencia)
    const SNAKE_COLOR = '#00ff00'; // Verde neón
    const FOOD_COLOR = '#ff00ff';  // Magenta neón
    const BORDER_COLOR = '#00ffff'; // Cian neón
    const GAME_BG_COLOR = '#000000'; // Negro puro

    // --- Funciones del Juego ---

    function startGame() {
        if (gameRunning) return; // Evita iniciar múltiples veces
        gameRunning = true;
        gameMessage.textContent = '¡Juego en progreso!';
        startButton.style.display = 'none'; // Oculta el botón de inicio

        score = 0;
        scoreDisplay.textContent = score;
        snake = [{ x: 10, y: 10 }]; // Reinicia la serpiente en el centro
        dx = 0; // Reinicia la dirección
        dy = 0;

        generateFood(); // Genera la primera comida
        gameInterval = setInterval(gameLoop, speed); // Inicia el bucle del juego
    }

    function gameLoop() {
        if (!gameRunning) return;

        changingDirection = false; // Resetea la bandera para el siguiente fotograma

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
        // Opcional: dibujar una cuadrícula sutil en el canvas
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'; // Líneas muy tenues
        for (let i = 0; i < tileCount; i++) {
            ctx.beginPath();
            ctx.moveTo(i * gridSize, 0);
            ctx.lineTo(i * gridSize, canvas.height);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, i * gridSize);
            ctx.lineTo(canvas.width, i * gridSize);
            ctx.stroke();
        }
    }

    function drawSnakePart(part) {
        ctx.fillStyle = SNAKE_COLOR;
        ctx.strokeStyle = BORDER_COLOR;
        ctx.lineWidth = 1;
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
        ctx.strokeRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
    }

    function drawSnake() {
        snake.forEach(drawSnakePart);
    }

    function generateFood() {
        let newFoodX, newFoodY;
        let foodOnSnake = true;
        while (foodOnSnake) {
            newFoodX = Math.floor(Math.random() * tileCount);
            newFoodY = Math.floor(Math.random() * tileCount);
            foodOnSnake = snake.some(part => part.x === newFoodX && part.y === newFoodY);
        }
        food = { x: newFoodX, y: newFoodY };
    }

    function drawFood() {
        ctx.fillStyle = FOOD_COLOR;
        ctx.strokeStyle = BORDER_COLOR;
        ctx.lineWidth = 1;
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
        ctx.strokeRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
    }

    function moveSnake() {
        // Crear la nueva cabeza de la serpiente
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };

        // Añadir la nueva cabeza al principio del array de la serpiente
        snake.unshift(head);

        // Verificar si la serpiente ha comido comida
        const hasEatenFood = head.x === food.x && head.y === food.y;

        if (hasEatenFood) {
            score += 10;
            scoreDisplay.textContent = score;
            generateFood(); // Generar nueva comida
            // Aumentar la velocidad cada cierto número de puntos (opcional)
            if (score % 50 === 0 && speed > 50) { // Aumenta velocidad cada 50 puntos hasta 50ms
                speed -= 10;
                clearInterval(gameInterval);
                gameInterval = setInterval(gameLoop, speed);
            }
        } else {
            // Si no comió comida, quitar la cola de la serpiente
            snake.pop();
        }
    }

    function gameOver() {
        // Colisión con sí misma
        for (let i = 4; i < snake.length; i++) {
            if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
        }

        // Colisión con los bordes
        const hitLeftWall = snake[0].x < 0;
        const hitRightWall = snake[0].x > tileCount - 1;
        const hitTopWall = snake[0].y < 0;
        const hitBottomWall = snake[0].y > tileCount - 1;

        return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
    }

    function endGame(message) {
        gameRunning = false;
        clearInterval(gameInterval); // Detiene el bucle del juego
        gameMessage.textContent = message;
        startButton.textContent = 'Volver a Jugar';
        startButton.style.display = 'block'; // Muestra el botón para reiniciar
        dx = 0; // Resetea la dirección para que no se mueva al reiniciar
        dy = 0;
    }

    // HACEMOS ESTA FUNCIÓN GLOBAL PARA QUE PUEDA SER LLAMADA DESDE EL HTML (en este caso, desde el script del HTML)
    window.restartGame = function() {
        endGame('Presiona ENTER o haz click para empezar'); // Resetea el mensaje y botón
        startGame(); // Inicia un nuevo juego
    };

    // --- Manejo de Eventos ---

    document.addEventListener('keydown', changeDirection);
    startButton.addEventListener('click', startGame);

    function changeDirection(event) {
        // Si ya estamos cambiando de dirección en este fotograma, ignorar
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
            return; // No procesa la dirección si el juego no ha iniciado
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

    // Inicializa el canvas vacío al cargar
    clearCanvas();
});