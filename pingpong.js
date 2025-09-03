const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');

// Configuración del juego
const BALL_SPEED = 5;
const PADDLE_SPEED = 6;

// Pelota
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 7,
    dx: BALL_SPEED,
    dy: BALL_SPEED,
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#ecf0f1';
        ctx.fill();
        ctx.closePath();
    }
};

// Paletas
const paddleWidth = 10;
const paddleHeight = 80;

const player1 = {
    x: 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    score: 0,
    draw() {
        ctx.fillStyle = '#3498db';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
};

const player2 = {
    x: canvas.width - paddleWidth - 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    score: 0,
    draw() {
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
};

// Movimiento de las paletas
const keys = {};

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

function movePaddles() {
    // Jugador 1: 'w' y 's'
    if (keys['w'] && player1.y > 0) {
        player1.y -= PADDLE_SPEED;
    }
    if (keys['s'] && player1.y + player1.height < canvas.height) {
        player1.y += PADDLE_SPEED;
    }

    // Jugador 2: flecha arriba y flecha abajo
    if (keys['ArrowUp'] && player2.y > 0) {
        player2.y -= PADDLE_SPEED;
    }
    if (keys['ArrowDown'] && player2.y + player2.height < canvas.height) {
        player2.y += PADDLE_SPEED;
    }
}

// Bucle principal del juego
function gameLoop() {
    // Limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar elementos
    player1.draw();
    player2.draw();
    ball.draw();

    // Mover la pelota
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Movimiento de las paletas
    movePaddles();

    // Colisiones con paredes
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
    }

    // Colisiones con las paletas
    if (
        ball.x - ball.radius < player1.x + player1.width &&
        ball.y > player1.y && ball.y < player1.y + player1.height
    ) {
        ball.dx = -ball.dx;
    }

    if (
        ball.x + ball.radius > player2.x &&
        ball.y > player2.y && ball.y < player2.y + player2.height
    ) {
        ball.dx = -ball.dx;
    }

    // Puntuación y reinicio
    if (ball.x + ball.radius > canvas.width) {
        player1.score++;
        updateScore();
        resetBall();
    }
    
    if (ball.x - ball.radius < 0) {
        player2.score++;
        updateScore();
        resetBall();
    }

    // Dibujar la línea divisoria
    drawDividingLine();

    requestAnimationFrame(gameLoop);
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * BALL_SPEED;
    ball.dy = (Math.random() > 0.5 ? 1 : -1) * BALL_SPEED;
}

function updateScore() {
    scoreDisplay.textContent = `${player1.score} - ${player2.score}`;
}

function drawDividingLine() {
    ctx.beginPath();
    ctx.setLineDash([5, 15]);
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.strokeStyle = '#ecf0f1';
    ctx.stroke();
    ctx.setLineDash([]);
}

// Iniciar el juego
gameLoop();