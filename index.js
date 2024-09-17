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

drawBoard();

// Pieces
const Z = [ [ [1,1,0], [0,1,1], [0,0,0] ], 
            [ [0,0,1], [0,1,1], [0,1,0] ],
            [ [0,0,0], [1,1,0], [0,1,1] ],
            [ [0,1,0], [1,1,0], [1,0,0] ] ];


function Piece(Tetromino, color) {
    this.tetromino = Tetromino;
    this.tetrominoN = 0;
    // we start from this index
    this.activeTetromino = this.tetromino[this.tetrominoN];
    // the rotation which we are handling now
    this.color = color;
    this.x = 3;
    this.y = -2;
}

let piece = new Piece(Z, "blue");

// MOVE THE ACTIVE TETROMINO
Piece.prototype.draw = function() {
    for(r=0; r<this.activeTetromino.length; r++) {
        for(c=0; c<this.activeTetromino.length; c++) {
            if(this.activeTetromino[r][c])
                drawSquare(this.x+c, this.y+r, this.color);
        }
    }
}

Piece.prototype.unDraw = function() {
    for(r=0; r<this.activeTetromino.length; r++) {
        for(c=0; c<this.activeTetromino.length; c++) {
            if(this.activeTetromino[r][c])
                drawSquare(this.x+c, this.y+r, Vacant);
        }
    }
}

document.addEventListener("keydown", CONTROL);
function CONTROL(event) {
    if(event.keyCode == 37)
        piece.moveLeft();
    else if(event.keyCode == 38)
        piece.rotate();
    else if(event.keyCode == 39)
        piece.moveRight();
    else if(event.keyCode == 40)
        piece.moveDown();
}

Piece.prototype.moveLeft() = function() {
    if(!this.collision(-1, 0, this.activeTetromino)) {
        this.unDraw();
        this.x--;
        this.draw();
    }
    else {
        // later
    }
}

Piece.prototype.moveRight = function() {
    if(!this.collision(1, 0, this.activeTetromino)) {
        this.unDraw();
        this.x++;
        this.draw();
    }
    else {
        // later
    }
}

Piece.prototype.moveDown = function() {
    if(!this.collision(0, 1, this.activeTetromino)) {
        this.unDraw();
        this.y++;
        this.draw();
    }
    else {
        // later
    }
}

Piece.prototype.collision = function(x, y, piece) {
    for(r=0; r<piece.length; r++) {
        for(c=0; c<piece.length; c++) {
            // continue if the square is vacant
            if(!piece[r][c])
                continue;

            let newX = this.x + x + c;
            let newY = this.y + y + r;

            // check boundries
            if(newX < 0 || nexX >= Col || newY >= Row)
                return true;
            // we skip this else piece[-1][x] will crash the game
            if(newY < 0)
                continue;
            if(board[newY][newX] != Vacant)
                return true;
        }
    }
    return false;
}

//  Rotate the piece
Piece.prototype.rotate = function() {
    this.unDraw();
    this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
    this.activeTetromino = this.tetromino[this.tetrominoN];
    this.draw();
}