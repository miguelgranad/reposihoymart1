const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Configuración del canvas
canvas.width = 800;
canvas.height = 600;

// Variables del juego
let player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 60,
    width: 50,
    height: 50,
    speed: 5,
    dx: 0
};

let projectiles = [];
let enemies = [];
let enemyRows = 3;
let enemyColumns = 8;
let enemyWidth = 50;
let enemyHeight = 50;
let enemyMargin = 10;
let enemySpeed = 1;
let gameOver = false;

// Crear enemigos
for (let row = 0; row < enemyRows; row++) {
    for (let col = 0; col < enemyColumns; col++) {
        let enemy = {
            x: col * (enemyWidth + enemyMargin),
            y: row * (enemyHeight + enemyMargin),
            width: enemyWidth,
            height: enemyHeight,
            dx: enemySpeed
        };
        enemies.push(enemy);
    }
}

// Dibujar jugador
function drawPlayer() {
    ctx.fillStyle = 'white';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Dibujar enemigos
function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.fillStyle = 'red';
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

// Dibujar proyectiles
function drawProjectiles() {
    projectiles.forEach(projectile => {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(projectile.x, projectile.y, projectile.width, projectile.height);
    });
}

// Mover jugador
function movePlayer() {
    player.x += player.dx;

    // Limitar movimiento del jugador
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

// Mover enemigos
function moveEnemies() {
    enemies.forEach(enemy => {
        enemy.x += enemy.dx;

        // Cambiar dirección al chocar con el borde
        if (enemy.x + enemy.width > canvas.width || enemy.x < 0) {
            enemy.dx *= -1;
            enemy.y += enemy.height;
        }

        // Verificar si el enemigo alcanza al jugador
        if (enemy.y + enemy.height > player.y) {
            gameOver = true;
        }
    });
}

// Mover proyectiles
function moveProjectiles() {
    projectiles.forEach((projectile, index) => {
        projectile.y -= projectile.dy;

        // Eliminar proyectiles fuera de pantalla
        if (projectile.y < 0) {
            projectiles.splice(index, 1);
        }
    });
}

// Detectar colisiones
function detectCollisions() {
    projectiles.forEach((projectile, pIndex) => {
        enemies.forEach((enemy, eIndex) => {
            if (
                projectile.x < enemy.x + enemy.width &&
                projectile.x + projectile.width > enemy.x &&
                projectile.y < enemy.y + enemy.height &&
                projectile.y + projectile.height > enemy.y
            ) {
                // Eliminar enemigo y proyectil al colisionar
                enemies.splice(eIndex, 1);
                projectiles.splice(pIndex, 1);
            }
        });
    });
}

// Dibujar todo
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawEnemies();
    drawProjectiles();
}

// Actualizar juego
function update() {
    if (gameOver) {
        alert('Game Over');
        return;
    }
    movePlayer();
    moveEnemies();
    moveProjectiles();
    detectCollisions();
    draw();
    requestAnimationFrame(update);
}

// Manejar teclas de movimiento
function keyDown(e) {
    if (e.key === 'ArrowRight' || e.key === 'Right') {
        player.dx = player.speed;
    } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
        player.dx = -player.speed;
    } else if (e.key === ' ') {
        // Disparar proyectil
        projectiles.push({
            x: player.x + player.width / 2 - 2.5,
            y: player.y,
            width: 5,
            height: 10,
            dy: 5
        });
    }
}

function keyUp(e) {
    if (e.key === 'ArrowRight' || e.key === 'Right' || e.key === 'ArrowLeft' || e.key === 'Left') {
        player.dx = 0;
    }
}

// Eventos de teclado
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

// Iniciar juego
update();
