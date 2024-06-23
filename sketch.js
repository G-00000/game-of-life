const CELL_SIZE = 10;
const WIDTH = 800;
const HEIGHT = 600;
const TOP_BAR_HEIGHT = 40;
const ROWS = Math.floor((HEIGHT - TOP_BAR_HEIGHT) / CELL_SIZE);
const COLS = Math.floor(WIDTH / CELL_SIZE);

let grid;
let paused = true;
let fps = 10;

function setup() {
    createCanvas(WIDTH, HEIGHT);
    grid = create2DArray(ROWS, COLS);
    frameRate(fps);
}

function draw() {
    background(255);
    drawTopBar();
    
    if (!paused) {
        updateGrid();
    }
    
    drawCells();
    drawGrid();
}

function drawTopBar() {
    fill(220);
    noStroke();
    rect(0, 0, WIDTH, TOP_BAR_HEIGHT);
    
    fill(0);
    textSize(16);
    textAlign(LEFT, CENTER);
    text(`${paused ? 'Paused' : 'Running'} | FPS: ${fps}`, 10, TOP_BAR_HEIGHT / 2);
    
    drawButton("Play/Pause", 200, 5, 100, 30);
    drawButton("Clear", 310, 5, 70, 30);
    drawButton("Random", 390, 5, 80, 30);
    drawButton("Speed -", 480, 5, 70, 30);
    drawButton("Speed +", 560, 5, 70, 30);
}

function drawButton(label, x, y, w, h) {
    fill(255);
    stroke(0);
    rect(x, y, w, h);
    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    text(label, x + w / 2, y + h / 2);
}

function drawCells() {
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            if (grid[i][j] === 1) {
                fill(255, 204, 102);
                noStroke();
                rect(j * CELL_SIZE, i * CELL_SIZE + TOP_BAR_HEIGHT, CELL_SIZE - 1, CELL_SIZE - 1);
            }
        }
    }
}

function drawGrid() {
    stroke(200);
    for (let x = 0; x <= WIDTH; x += CELL_SIZE) {
        line(x, TOP_BAR_HEIGHT, x, HEIGHT);
    }
    for (let y = TOP_BAR_HEIGHT; y <= HEIGHT; y += CELL_SIZE) {
        line(0, y, WIDTH, y);
    }
}

function updateGrid() {
    let newGrid = create2DArray(ROWS, COLS);
    
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            let state = grid[i][j];
            let neighbors = countNeighbors(i, j);
            
            if (state === 0 && neighbors === 3) {
                newGrid[i][j] = 1;
            } else if (state === 1 && (neighbors < 2 || neighbors > 3)) {
                newGrid[i][j] = 0;
            } else {
                newGrid[i][j] = state;
            }
        }
    }
    
    grid = newGrid;
}

function countNeighbors(row, col) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            let r = (row + i + ROWS) % ROWS;
            let c = (col + j + COLS) % COLS;
            count += grid[r][c];
        }
    }
    return count;
}

function mousePressed() {
    if (mouseY < TOP_BAR_HEIGHT) {
        handleButtonClick();
    } else {
        let col = Math.floor(mouseX / CELL_SIZE);
        let row = Math.floor((mouseY - TOP_BAR_HEIGHT) / CELL_SIZE);
        if (row >= 0 && row < ROWS && col >= 0 && col < COLS) {
            grid[row][col] = 1 - grid[row][col];
        }
    }
}

function handleButtonClick() {
    if (mouseY >= 5 && mouseY <= 35) {
        if (mouseX >= 200 && mouseX < 300) {
            paused = !paused;
        } else if (mouseX >= 310 && mouseX < 380) {
            grid = create2DArray(ROWS, COLS);
        } else if (mouseX >= 390 && mouseX < 470) {
            randomizeGrid();
        } else if (mouseX >= 480 && mouseX < 550) {
            fps = Math.max(fps - 1, 1);
            frameRate(fps);
        } else if (mouseX >= 560 && mouseX < 630) {
            fps = Math.min(fps + 1, 60);
            frameRate(fps);
        }
    }
}

function create2DArray(rows, cols) {
    return new Array(rows).fill().map(() => new Array(cols).fill(0));
}

function randomizeGrid() {
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            grid[i][j] = Math.random() < 0.2 ? 1 : 0;
        }
    }
}
