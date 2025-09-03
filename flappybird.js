const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');

// Variables del juego
let score = 0;
let isGameOver = false;

// Pájaro
const bird = {
    x: 50,
    y: 200,
    width: 30,
    height: 25,
    gravity: 0.5,
    velocity: 0,
    jumpStrength: -10,
    draw() {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    },
    update() {
        this.velocity += this.gravity;
        this.y += this.velocity;
    },
    flap() {
        this.velocity = this.jumpStrength;
    }
};

// Tuberías
let pipes = [];
const pipeWidth = 50;
const pipeGap = 120;
const pipeSpeed = 2;

function createPipe() {
    const minHeight = 50;
    const maxHeight = canvas.height - pipeGap - minHeight;
    const topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;

    pipes.push({
        x: canvas.width,
        y: 0,
        width: pipeWidth,
        height: topHeight,
        passed: false
    });
    pipes.push({
        x: canvas.width,
        y: topHeight + pipeGap,
        width: pipeWidth,
        height: canvas.height - topHeight - pipeGap,
        passed: false
    });
}

// Bucle principal del juego
function gameLoop() {
    if (isGameOver) {
        return;
    }

    // Limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Actualizar y dibujar el pájaro
    bird.update();
    bird.draw();

    // Actualizar y dibujar las tuberías
    pipes.forEach(pipe => {
        pipe.x -= pipeSpeed;
        ctx.fillStyle = 'green';
        ctx.fillRect(pipe.x, pipe.y, pipe.width, pipe.height);

        // Aumentar puntuación
        if (pipe.x + pipe.width < bird.x && !pipe.passed && pipe.y === 0) {
            score++;
            pipe.passed = true;
            scoreDisplay.textContent = 'Puntuación: ' + score;
        }

        // Detección de colisiones
        if (
            bird.x < pipe.x + pipe.width &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.y + pipe.height && bird.y + bird.height > pipe.y)
        ) {
            isGameOver = true;
            alert('¡Juego Terminado! Puntuación: ' + score);
            document.location.reload();
        }
    });

    // Eliminar tuberías fuera de pantalla
    pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);

    // Generar nuevas tuberías
    if (pipes.length < 2) {
        createPipe();
    }

    // Comprobar colisión con el suelo y el techo
    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        isGameOver = true;
        alert('¡Juego Terminado! Puntuación: ' + score);
        document.location.reload();
    }

    requestAnimationFrame(gameLoop);
}

// Manejar los eventos del teclado y ratón
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.key === ' ') {
        bird.flap();
    }
});

document.addEventListener('click', () => {
    bird.flap();
});

// Iniciar el juego
gameLoop();