const cvs = document.getElementById("tetris");
const ctx = cvs.getContext("2d");

const ROW = 20;
const COL = COLUMN = 10;
const SQ = squareSize = 30;
const VACANT = "#e1eeb0"; // color of an empty square

let score = 0;
let currentLevel = 0;
let linesCleared = 0;

// draw a square
function drawSquare(x,y,color, innerColor) {
    ctx.clearRect(x * SQ, y * SQ, SQ, SQ);

    if(color != VACANT) {
        ctx.fillStyle = color;
        ctx.fillRect(x*SQ,y*SQ,SQ,SQ);

        ctx.lineWidth = 1;
        ctx.strokeStyle = VACANT;
        ctx.strokeRect(x*SQ,y*SQ,SQ,SQ);

        if(innerColor) {
            const innerOffset = SQ / 4;
            const innerSize = SQ/2;
            ctx.fillStyle = innerColor;
            ctx.fillRect(x * SQ + innerOffset, y * SQ + innerOffset, innerSize, innerSize);
            ctx.lineWidth = 1;
            ctx.strokeStyle = "black";
            ctx.strokeRect(x * SQ + innerOffset, y * SQ + innerOffset, innerSize, innerSize);
        }
    }
    else {
        ctx.fillStyle = VACANT;
        ctx.fillRect(x*SQ,y*SQ,SQ,SQ);
    }
}

// create the board
let board = [];
for( r = 0; r <ROW; r++){
    board[r] = [];
    for(c = 0; c < COL; c++){
        board[r][c] = VACANT;
    }
}

// draw the board
function drawBoard(){
    for( r = 0; r <ROW; r++){
        for(c = 0; c < COL; c++) {
            const cell1 = board[r][c];
            const color = cell1.color || VACANT;
            const innerColor = cell1.innerColor || VACANT;
            drawSquare(c,r, color, innerColor);
        }
    }
}

drawBoard();

// #0a1d7b
// the pieces and their colors
const PIECES = [
    [Z,"#dca3ff"],
    [S,"#ff90a0"],
    [T,"#80ffb4"],
    [O,"purple"],
    [L,"#70b3f5"],
    [I,"#b2e77d"],
    [J,"#ffd700"]
];

const INNER_PIECE = [
    [Z,"#dca3ff"],
    [S,"yellow"],
    [T,"blue"],
    [O,"#ff7666"],
    [L,"cyan"],
    [I,"orange"],
    [J,"red"]
];

// generate random pieces
function randomPiece(){
    let r = randomN = Math.floor(Math.random() * PIECES.length) // 0 -> 6
    return new Piece( PIECES[r][0],PIECES[r][1], INNER_PIECE[r][1]);
}

let p = randomPiece();

// The Object Piece
function Piece(tetromino,color, innerColor){
    this.tetromino = tetromino;
    this.color = color;
    
    this.tetrominoN = 0; // we start from the first pattern
    this.activeTetromino = this.tetromino[this.tetrominoN];
    
    // we need to control the pieces
    this.x = 3;
    this.y = -2;

    this.innerColor = innerColor;
}

// fill function
Piece.prototype.fill = function(color, innerColor){
    for( r = 0; r < this.activeTetromino.length; r++){
        for(c = 0; c < this.activeTetromino.length; c++){
            // we draw only occupied squares
            if( this.activeTetromino[r][c]){
                drawSquare(this.x + c,this.y + r, color, innerColor);
            }
        }
    }
}

// draw a piece to the board
Piece.prototype.draw = function(){
    this.fill(this.color, this.innerColor);
}

// undraw a piece
Piece.prototype.unDraw = function(){
    this.fill(VACANT, VACANT);
}

// move Down the piece
Piece.prototype.moveDown = function(){
    if(!this.collision(0,1,this.activeTetromino)){
        this.unDraw();
        this.y++;
        this.draw();
    }else{
        // we lock the piece and generate a new one
        this.lock();
        p = randomPiece();
    }
    
}

// move Right the piece
Piece.prototype.moveRight = function(){
    if(!this.collision(1,0,this.activeTetromino)){
        this.unDraw();
        this.x++;
        this.draw();
    }
}

// move Left the piece
Piece.prototype.moveLeft = function(){
    if(!this.collision(-1,0,this.activeTetromino)){
        this.unDraw();
        this.x--;
        this.draw();
    }
}

// rotate the piece
Piece.prototype.rotate = function(){
    let nextPattern = this.tetromino[(this.tetrominoN + 1)%this.tetromino.length];
    let kick = 0;
    
    if(this.collision(0,0,nextPattern)){
        if(this.x > COL/2){
            // it's the right wall
            kick = -1; // we need to move the piece to the left
        }else{
            // it's the left wall
            kick = 1; // we need to move the piece to the right
        }
    }
    
    if(!this.collision(kick,0,nextPattern)){
        this.unDraw();
        this.x += kick;
        this.tetrominoN = (this.tetrominoN + 1)%this.tetromino.length; // (0+1)%4 => 1
        this.activeTetromino = this.tetromino[this.tetrominoN];
        this.draw();
    }
}

Piece.prototype.lock = function() {
    let nextPiece = randomPiece();
    showPiece();

    for( r = 0; r < this.activeTetromino.length; r++){
        for(c = 0; c < this.activeTetromino.length; c++){
            // we skip the vacant squares
            if( !this.activeTetromino[r][c]){
                continue;
            }
            // pieces to lock on top = game over
            if(this.y + r < 0){
                alert("Game Over");
                // stop request animation frame
                gameOver = true;
                break;
            }
            // we lock the piece
            board[this.y+r][this.x+c] = {
                color: this.color,
                innerColor: this.innerColor
            };
        }
    }

    // remove full rows
    for(r = 0; r < ROW; r++){
        let isRowFull = true;
        for( c = 0; c < COL; c++){
            isRowFull = isRowFull && (board[r][c] != VACANT);
        }
        if(isRowFull){
            // if the row is full
            // we move down all the rows above it
            for( y = r; y > 1; y--){
                for( c = 0; c < COL; c++){
                    board[y][c] = board[y-1][c];
                }
            }
            // the top row board[0][..] has no row above it
            for( c = 0; c < COL; c++){
                board[0][c] = VACANT;
            }
            // increment the score
            score += 10;
        }
    }
    // update the board
    drawBoard();
    
    // update the score
    scoreShow.innerHTML = score;
}

// collision fucntion

Piece.prototype.collision = function(x,y,piece){
    for( r = 0; r < piece.length; r++){
        for(c = 0; c < piece.length; c++){
            // if the square is empty, we skip it
            if(!piece[r][c]){
                continue;
            }
            // coordinates of the piece after movement
            let newX = this.x + c + x;
            let newY = this.y + r + y;
            
            // conditions
            if(newX < 0 || newX >= COL || newY >= ROW){
                return true;
            }
            // skip newY < 0; board[-1] will crush our game
            if(newY < 0){
                continue;
            }
            // check if there is a locked piece alrady in place
            if(board[newY][newX] && board[newY][newX] != VACANT){
                return true;
            }
        }
    }
    return false;
}

// CONTROL the piece

document.addEventListener("keydown",CONTROL);

function CONTROL(event){
    if(event.keyCode == 37){
        p.moveLeft();
        dropStart = Date.now();
    }else if(event.keyCode == 38){
        p.rotate();
        dropStart = Date.now();
    }else if(event.keyCode == 39){
        p.moveRight();
        dropStart = Date.now();
    }else if(event.keyCode == 40){
        p.moveDown();
    }
}

// drop the piece every 1sec
let dropStart = Date.now();
let gameOver = false;
function drop(){
    let now = Date.now();
    let delta = now - dropStart;
    if(delta > 1000){
        p.moveDown();
        dropStart = Date.now();
    }
    if( !gameOver){
        requestAnimationFrame(drop);
    }
}

drop();