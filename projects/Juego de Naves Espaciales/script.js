document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreDisplay = document.getElementById('score');
    const livesDisplay = document.getElementById('lives');
    const gameMessage = document.getElementById('gameMessage');
    const startButton = document.getElementById('startButton');
    const gameContainer = document.getElementById('gameContainer'); // Para el cambio de tema

    // --- Configuración del Juego ---
    const CANVAS_WIDTH = canvas.width;
    const CANVAS_HEIGHT = canvas.height;
    const PLAYER_SIZE = 30;
    const BULLET_SIZE = 10;
    const ENEMY_SIZE = 30;

    const PLAYER_SPEED = 5;
    const BULLET_SPEED = 7;
    let ENEMY_SPEED = 1; // Aumentará con la puntuación
    const ENEMY_SPAWN_INTERVAL = 1500; // ms para generar un nuevo enemigo
    const SHOOT_COOLDOWN = 200; // ms entre disparos

    const SCORE_FOR_THEME_CHANGE = 500; // Puntuación para cambiar el tema
    let themeChanged = false; // Bandera para controlar el cambio de tema

    let score = 0;
    let lives = 3;
    let gameRunning = false;
    let gameInterval;
    let enemySpawnInterval;
    let lastShootTime = 0;

    // --- Colores (se actualizarán dinámicamente) ---
    // Usamos funciones para obtener los colores actuales de las variables CSS
    function getCssVar(name) {
        return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    }

    let PLAYER_COLOR = getCssVar('--player-color');
    let BULLET_COLOR = getCssVar('--bullet-color');
    let ENEMY_COLOR = getCssVar('--enemy-color');
    let GAME_BG_COLOR = getCssVar('--game-bg-color');

    // --- Objetos del Juego ---
    let player = {
        x: CANVAS_WIDTH / 2 - PLAYER_SIZE / 2,
        y: CANVAS_HEIGHT - PLAYER_SIZE - 20,
        width: PLAYER_SIZE,
        height: PLAYER_SIZE
    };

    let bullets = [];
    let enemies = [];

    // --- Manejo de Entradas (Teclado) ---
    const keys = {
        left: false,
        right: false,
        space: false
    };

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') keys.left = true;
        if (e.key === 'ArrowRight') keys.right = true;
        if (e.key === ' ') {
            keys.space = true;
            e.preventDefault(); // Evita que la barra espaciadora haga scroll
        }
        if (e.key === 'Enter' && !gameRunning) {
            startGame();
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowLeft') keys.left = false;
        if (e.key === 'ArrowRight') keys.right = false;
        if (e.key === ' ') keys.space = false;
    });

    startButton.addEventListener('click', startGame);

    // --- Funciones de Dibujo ---
    function drawPlayer() {
        ctx.fillStyle = PLAYER_COLOR;
        // Forma de triángulo simple para la nave
        ctx.beginPath();
        ctx.moveTo(player.x + player.width / 2, player.y);
        ctx.lineTo(player.x, player.y + player.height);
        ctx.lineTo(player.x + player.width, player.y + player.height);
        ctx.closePath();
        ctx.fill();
    }

    function drawBullets() {
        ctx.fillStyle = BULLET_COLOR;
        bullets.forEach(bullet => {
            ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });
    }

    function drawEnemies() {
        ctx.fillStyle = ENEMY_COLOR;
        enemies.forEach(enemy => {
            ctx.beginPath();
            ctx.arc(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.width / 2, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function clearCanvas() {
        ctx.fillStyle = GAME_BG_COLOR;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    // --- Lógica del Juego ---
    function updateGame() {
        if (!gameRunning) return;

        // Actualizar colores dinámicamente en cada fotograma por si cambia el tema
        updateColors();

        // Mover jugador
        if (keys.left && player.x > 0) {
            player.x -= PLAYER_SPEED;
        }
        if (keys.right && player.x < CANVAS_WIDTH - player.width) {
            player.x += PLAYER_SPEED;
        }

        // Disparar
        const currentTime = Date.now();
        if (keys.space && currentTime - lastShootTime > SHOOT_COOLDOWN) {
            bullets.push({
                x: player.x + player.width / 2 - BULLET_SIZE / 2,
                y: player.y,
                width: BULLET_SIZE,
                height: BULLET_SIZE * 2
            });
            lastShootTime = currentTime;
        }

        // Mover balas y eliminar las que salen de pantalla
        bullets = bullets.filter(bullet => {
            bullet.y -= BULLET_SPEED;
            return bullet.y + bullet.height > 0;
        });

        // Mover enemigos y eliminar los que salen de pantalla
        enemies = enemies.filter(enemy => {
            enemy.y += ENEMY_SPEED;
            if (enemy.y > CANVAS_HEIGHT) {
                lives--;
                livesDisplay.textContent = lives;
                if (lives <= 0) {
                    endGame('¡GAME OVER! Perdiste todas tus vidas.');
                }
                return false;
            }
            return true;
        });

        // --- Detección de Colisiones ---
        bullets.forEach((bullet, bIndex) => {
            enemies.forEach((enemy, eIndex) => {
                if (
                    bullet.x < enemy.x + enemy.width &&
                    bullet.x + bullet.width > enemy.x &&
                    bullet.y < enemy.y + enemy.height &&
                    bullet.y + bullet.height > enemy.y
                ) {
                    bullets.splice(bIndex, 1);
                    enemies.splice(eIndex, 1);
                    score += 10;
                    scoreDisplay.textContent = score;

                    // Lógica para aumentar dificultad y cambiar tema
                    if (score % 100 === 0 && ENEMY_SPEED < 5) { // Acelera cada 100 puntos
                        ENEMY_SPEED += 0.2;
                        clearInterval(enemySpawnInterval);
                        // Los enemigos aparecen más rápido también
                        enemySpawnInterval = setInterval(spawnEnemy, Math.max(500, ENEMY_SPAWN_INTERVAL - score * 2));
                    }
                    if (score >= SCORE_FOR_THEME_CHANGE && !themeChanged) {
                        toggleTheme('light'); // Cambia al tema "light"
                        gameMessage.textContent = '¡Modo Sobrecarga Activado!';
                        themeChanged = true; // Marca que el tema ya cambió
                    } else if (score < SCORE_FOR_THEME_CHANGE && themeChanged) {
                        // Si por alguna razón los puntos bajan (ej. debugging), puedes revertir el tema
                        // Aunque en este juego los puntos solo suben
                        toggleTheme('dark');
                        themeChanged = false;
                    }
                }
            });
        });

        // Jugador contra enemigos
        enemies.forEach((enemy, eIndex) => {
            if (
                player.x < enemy.x + enemy.width &&
                player.x + player.width > enemy.x &&
                player.y < enemy.y + enemy.height &&
                player.y + player.height > enemy.y
            ) {
                enemies.splice(eIndex, 1);
                lives--;
                livesDisplay.textContent = lives;
                if (lives <= 0) {
                    endGame('¡GAME OVER! Tu nave fue destruida.');
                }
            }
        });

        // Dibujar todo
        clearCanvas();
        drawPlayer();
        drawBullets();
        drawEnemies();
    }

    function spawnEnemy() {
        if (!gameRunning) return;
        enemies.push({
            x: Math.random() * (CANVAS_WIDTH - ENEMY_SIZE),
            y: -ENEMY_SIZE,
            width: ENEMY_SIZE,
            height: ENEMY_SIZE
        });
    }

    function startGame() {
        if (gameRunning) return;

        gameRunning = true;
        score = 0;
        lives = 3;
        ENEMY_SPEED = 1;
        bullets = [];
        enemies = [];
        player.x = CANVAS_WIDTH / 2 - PLAYER_SIZE / 2;
        player.y = CANVAS_HEIGHT - PLAYER_SIZE - 20;
        themeChanged = false; // Resetea la bandera del tema al inicio del juego
        toggleTheme('dark'); // Asegura que el tema esté en oscuro al inicio

        scoreDisplay.textContent = score;
        livesDisplay.textContent = lives;
        gameMessage.textContent = '¡Elimina a los invasores!';
        startButton.style.display = 'none';

        gameInterval = setInterval(updateGame, 1000 / 60);
        enemySpawnInterval = setInterval(spawnEnemy, ENEMY_SPAWN_INTERVAL);
    }

    function endGame(message) {
        gameRunning = false;
        clearInterval(gameInterval);
        clearInterval(enemySpawnInterval);
        gameMessage.textContent = message;
        startButton.textContent = 'Volver a Jugar';
        startButton.style.display = 'block';
    }

    // Función para cambiar el tema
    function toggleTheme(theme) {
        if (theme === 'light') {
            document.body.classList.add('light-theme');
        } else {
            document.body.classList.remove('light-theme');
        }
        updateColors(); // Actualiza los colores JavaScript después de cambiar la clase
    }

    // Función para obtener los colores actuales de las variables CSS y asignarlos
    function updateColors() {
        PLAYER_COLOR = getCssVar('--player-color');
        BULLET_COLOR = getCssVar('--bullet-color');
        ENEMY_COLOR = getCssVar('--enemy-color');
        GAME_BG_COLOR = getCssVar('--game-bg-color');
    }


    // Hacemos la función `restartGame` global para que el menú lateral pueda llamarla
    window.restartGame = function() {
        endGame('Presiona ENTER o haz click para empezar'); // Esto también detiene los intervalos
        startGame(); // Esto reinicia el juego completamente
    };

    // Dibujar el estado inicial y asegurar colores correctos
    updateColors(); // Cargar los colores iniciales
    clearCanvas();
    drawPlayer();
});