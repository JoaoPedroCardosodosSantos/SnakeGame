
let inputDir = { x: 0, y: 0 };
const foodSound = new Audio('./assets/music/food.mp3');
const gameOverSound = new Audio('./assets/music/gameover.mp3');
const moveSound = new Audio('./assets/music/move.mp3');
const musicSound = new Audio('./assets/music/music.mp3');
const hiscoreBox = document.getElementById('hiscoreBox');
let speed = 5;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [
    { x: 13, y: 15 }
];
food = { x: 6, y: 7 };

// Variáveis para controle do jogador e envio de pontuação
let playerName = '';
let lastScore = 0; // Última pontuação do jogador
let hiscore = 0; // HiScore atual
let sessionActive = true; // Para controlar se o jogo ainda está em execução

// Funções para pegar e atualizar o hiscore via servidor
async function getHiscore() {
    try {
        const response = await fetch('./controller/server.php?status=?'); // Exemplo de endpoint
        const data = await response.json();
        return data.hiscore;
    } catch (error) {
        console.error('Erro ao pegar o hiscore:', error);
        return 0; 
    }
}

async function updateHiscore(newHiscore, playerName) {
    try {
        const response = await fetch(`./controller/server.php?score=${newHiscore}&name=${playerName}`);
        const data = await response.json();
        return data.success;
    } catch (error) {
        console.error('Erro ao atualizar o hiscore:', error);
        return false;
    }
}

// Função para enviar a pontuação ao servidor quando o jogador clicar em "Sair"
async function sendScoreToServer() {
    if (lastScore > 0) {
        // Só atualiza o HiScore se o score for maior que o atual HiScore
        if (lastScore > hiscore) {
            await updateHiscore(lastScore, playerName); // Atualiza o HiScore com a pontuação final
            alert(`Novo HiScore enviado! Jogador: ${playerName}, HiScore: ${lastScore}`);
        } else {
            alert(`Pontuação enviada! Jogador: ${playerName}, Pontuação: ${lastScore}`);
            await updateHiscore(lastScore, playerName);
        }
    } else {
        alert("Nenhuma pontuação para enviar.");
    }
}

// Funções do jogo
function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snake) {
    // Detecta colisões
    for (let i = 1; i < snakeArr.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) {
        return true;
    }
    return false;
}

async function gameEngine() {
    if (isCollide(snakeArr)) {
        // Quando o jogador colide e perde
        gameOverSound.play();
        musicSound.pause();
        inputDir = { x: 0, y: 0 };
        alert("Fim de jogo. Pressione OK para jogar novamente!");

        // Salva a última pontuação, mas NÃO envia para o servidor ainda
        lastScore = score;
        score = 0;

        // Reseta o jogo
        snakeArr = [{ x: 13, y: 15 }];
        musicSound.play();
    }

    // Se comeu a comida, incrementa a pontuação e gera nova comida
    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        foodSound.play();
        score += 1;

        // Atualiza a interface de pontuação
        scoreBox.innerHTML = "Score: " + score;

        // Aumenta o tamanho da cobra
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
        let a = 2;
        let b = 16;
        food = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) }
    }

    // Movimenta a cobra
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }

    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Renderiza a cobra e a comida
    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        let snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;

        if (index === 0) {
            snakeElement.classList.add('head');
        }
        else {
            snakeElement.classList.add('snake');
        }
        board.appendChild(snakeElement);
    });

    // Renderiza a comida
    let foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

async function initializeGame() {
    // Solicita o nome do jogador ao iniciar o jogo
    playerName = prompt("Digite seu nome para salvar o score:", "Default");
    if (!playerName) playerName = "Default"; // Usa "Default" se o nome for vazio

    // Inicia a música
    musicSound.play();

    // Pega o hiscore inicial do servidor
    hiscore = await getHiscore();
    if (hiscore === null) {
        hiscore = 0;
        await updateHiscore(hiscore, playerName);
    }
    hiscoreBox.innerHTML = "HiScore: " + hiscore;
}

// Eventos de controle da cobra e início do jogo
window.addEventListener('keydown', (event) => {
    document.getElementById("main-menu").style.display = 'none';
    document.getElementById("main-menu").style.index = '-1';
    document.getElementById("exitButton").style.display = 'block';

    window.requestAnimationFrame(main);
    window.addEventListener('keydown', (e) => {
        inputDir = { x: 0, y: 1 }; // Inicia o jogo
        moveSound.play();
        switch (e.key) {
            case "ArrowUp":
                inputDir.x = 0;
                inputDir.y = -1;
                break;
            case "ArrowDown":
                inputDir.x = 0;
                inputDir.y = 1;
                break;
            case "ArrowLeft":
                inputDir.x = -1;
                inputDir.y = 0;
                break;
            case "ArrowRight":
                inputDir.x = 1;
                inputDir.y = 0;
                break;
            default:
                break;
        }
    });
});

initializeGame();

document.getElementById("exitButton").addEventListener('click', async () => {
    await sendScoreToServer();  
    window.location.href = './ranking.html';
});
