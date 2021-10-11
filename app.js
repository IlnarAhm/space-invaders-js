const grid = document.querySelector('.grid');
const resultsDisplay = document.querySelector('.results');
const startBtn = document.querySelector('.start_btn');
const restartBtn = document.querySelector('.restart_btn');
const easyBtn = document.querySelector('.easy_btn');
const middleBtn = document.querySelector('.middle_btn');
const hardBtn = document.querySelector('.hard_btn');
const laserSpeed = 20;
let invadersSpeed = 700;
const shooterSpeed = 100;
const width = 15;


if (localStorage.getItem('difficulty') === null) {
    localStorage.setItem('difficulty', 'easy');
}


function start() {
    let currentShooterIndex = 202;
    let direction = 1;
    let invadersId;
    let goingRight = true;
    let aliensRemoved = [];
    let results = 0;

    for (let i = 0; i < 255; i++) {
        const square = document.createElement('div');

        grid.appendChild(square);
    }

    const squares = Array.from(document.querySelectorAll('.grid div'));

    const alienInvaders = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
        15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
        30, 31, 32, 33, 34, 35, 36, 37, 38, 39
    ];

    function draw() {
        for (let i = 0; i < alienInvaders.length; i++) {
            if (!aliensRemoved.includes(i)) {
                squares[alienInvaders[i]].classList.add('invader');
            }
        }
    }

    function remove() {
        for (let i = 0; i < alienInvaders.length; i++) {
            squares[alienInvaders[i]].classList.remove('invader');
        }
    }

    draw();

    squares[currentShooterIndex].classList.add('shooter');

    function moveShooter(e) {
        squares[currentShooterIndex].classList.remove('shooter');

        switch (e.key) {
            case 'ArrowLeft':
                if (currentShooterIndex % width !== 0) currentShooterIndex -= 1;
                break;
            case 'ArrowRight':
                if (currentShooterIndex % width < width - 1) currentShooterIndex += 1;
                break;
        }

        squares[currentShooterIndex].classList.add('shooter');
    }

    document.addEventListener('keydown', moveShooter);

    function moveInvaders() {
        const leftEdge = alienInvaders[0] % width === 0;
        const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1;

        remove();

        if (rightEdge && goingRight) {
            for (let i = 0; i < alienInvaders.length; i++) {
                alienInvaders[i] += width + 1;
                direction = -1;
                goingRight = false;
            }
        }

        if (leftEdge && !goingRight) {
            for (let i = 0; i < alienInvaders.length; i++) {
                alienInvaders[i] += width - 1;
                direction = 1;
                goingRight = true;
            }
        }

        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += direction;

            if (Number(alienInvaders[i]) > Number(squares.length - width)) {
                clearInterval(invadersId);
                resultsDisplay.innerHTML = 'GAME OVER!';
            }
        }

        draw();

        if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
            clearInterval(invadersId);
            resultsDisplay.innerHTML = 'GAME OVER!';
        }

        if (aliensRemoved.length === alienInvaders.length) {
            clearInterval(invadersId);
            resultsDisplay.innerHTML = 'YOU WIN!';
        }
    }

    invadersId = setInterval(moveInvaders, invadersSpeed);

    function shoot(e) {
        let laserId;
        let currentLaserIndex = currentShooterIndex;

        function moveLaser() {
            if (squares[currentLaserIndex]) {
                squares[currentLaserIndex].classList.remove('laser');
                currentLaserIndex -= width;
                squares[currentLaserIndex].classList.add('laser');

                if (squares[currentLaserIndex].classList.contains('invader')) {
                    squares[currentLaserIndex].classList.remove('laser');
                    squares[currentLaserIndex].classList.remove('invader');
                    squares[currentLaserIndex].classList.add('boom');

                    setTimeout(() => {
                        squares[currentLaserIndex].classList.remove('boom');
                    }, 100);
                    clearInterval(laserId);

                    const alienRemoved = alienInvaders.indexOf(currentLaserIndex);
                    results++;
                    resultsDisplay.innerHTML = 'Счет: ' + results;
                    aliensRemoved.push(alienRemoved);
                }
            }
        }

        switch (e.key) {
            case 'ArrowUp':
                laserId = setInterval(moveLaser, laserSpeed);
                break;
        }
    }

    document.addEventListener('keydown', shoot);
}

function lets_play() {
    start();
    restartBtn.style.display = 'block';
    startBtn.remove();
}

const difficulty = localStorage.getItem('difficulty');

function easyActivate() {
    invadersSpeed = 700;
    easyBtn.classList.add('active');
    middleBtn.classList.remove('active');
    hardBtn.classList.remove('active');
    localStorage.setItem('difficulty', 'easy');
}

function middleActivate() {
    invadersSpeed = 350;
    easyBtn.classList.remove('active');
    middleBtn.classList.add('active');
    hardBtn.classList.remove('active');
    localStorage.setItem('difficulty', 'middle');
}

function hardActivate() {
    invadersSpeed = 150;
    easyBtn.classList.remove('active');
    middleBtn.classList.remove('active');
    hardBtn.classList.add('active');
    localStorage.setItem('difficulty', 'hard');
}


switch (difficulty) {
    case 'easy':
        easyActivate();
        break;
    case 'middle':
        middleActivate()
        break;
    case 'hard':
        hardActivate()
        break;
}

easyBtn.addEventListener('click', () => {
    easyActivate();
});
middleBtn.addEventListener('click', () => {
    middleActivate();
});
hardBtn.addEventListener('click', () => {
    hardActivate()();
});

startBtn.addEventListener('click', () => {
    lets_play();
});

restartBtn.addEventListener('click', () => {
    window.location.reload();
});