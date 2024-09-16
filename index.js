const SQ = 20;

const Row = 20;
const Col = 10;
const Vacant = "white";

const cvs = document.getElementById('tetris');
const ctx = cvs.getContext('2d');

function drawSquare(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x*SQ, y*SQ, SQ, SQ);
    ctx.strokeStyle = "black";
    ctx.strokeRect(x*SQ, y*SQ, SQ, SQ);
}

let board = [];

for(r=0; r<Row; r++) {
    board[r] = [];
    for(c=0; c<Col; c++) 
        board[r][c] = Vacant;
}

function drawBoard() {
    for(r=0; r<Row; r++) {
        for(c=0; c<Col; c++)
            drawSquare(c, r, board[r][c]);
    }
}
