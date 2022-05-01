//game constants declaration
const BOARD_SIZE = 8;
const RED_PLAYER = 'red';
const BLUE_PLAYER = 'blue';

//piece type declaration
const PEASANT = 'peasant';
const ROYAL = 'royal';

//global variables declaration
let hasMoved = 0;
let selectedCell;
let pieces = [];
let possibleMove;
let possibleMoves;
let currentPiece = [];
let currentPlayer = 'red';
let winner;
let eatenPieceRow;
let eatenPieceCol;
let blueCount = 12;
let redCount = 12;
let takeAvailable = 0;

class BoardData {
    constructor(pieces) {
        this.pieces = pieces;
    }

    getPiece(row, col) {
        let gPiece;
        for (let piece of this.pieces) {
            if (piece.row == row && piece.col == col) {
                gPiece = piece;
            }
        }
        if (gPiece == undefined) {
            gPiece = "nothing";
        }
        return gPiece;
    }

    checkCell(pieces, row, col) {
        for (let piece of pieces) {
            if (piece.row == row && piece.col == col) {
                return piece;
            }
        }
    }

    checkPlayer(pieces, row, col) {
        for (let piece of pieces) {
            if (piece.row == row && piece.col == col) {
                return piece.player;
            }
        }
    }
}

//creates the images for pieces and puts data for each piece in a class
function setUpPieces() {
    let result = [];
    for (let row = 1; row <= BOARD_SIZE; row++) {
        for (let col = 1; col <= BOARD_SIZE; col++) {
            let cell = document.getElementById(row + "-" + col);
            cell.addEventListener('click', (event) => onCellClick(event, row, col, table));
            console.log(cell);
            if ((row == 1) || (row == 2) || (row == 3)) {
                if (document.getElementById(row + "-" + col).classList.contains("dark-cell")) {
                    result.push(new Piece(row, col, PEASANT, RED_PLAYER));
                    const image = document.createElement('img');
                    image.src = RED_PLAYER + '/' + PEASANT + '.png';
                    image.classList.add("image");
                    document.getElementById(row + "-" + col).appendChild(image);
                }
            }
            if ((row == 6) || (row == 7) || (row == 8)) {
                if (document.getElementById(row + "-" + col).classList.contains("dark-cell")) {
                    result.push(new Piece(row, col, PEASANT, BLUE_PLAYER));
                    const image = document.createElement('img');
                    image.src = BLUE_PLAYER + '/' + PEASANT + '.png';
                    image.classList.add("image");
                    document.getElementById(row + "-" + col).appendChild(image);
                }
            }
        }
    }
    console.log(result);
    return result;
}

function onCellClick(event, row, col, table) {
    let cPieceRow = currentPiece[0];
    let cPieceCol = currentPiece[1];
    let piecePlayer = dataBoard.getPiece(cPieceRow, cPieceCol).player;
    if ((currentPlayer == dataBoard.getPiece(row, col).player) || (currentPlayer == piecePlayer)) {
        if (event.currentTarget.classList.contains("movement")) {
            moveCurrentPiece(cPieceRow, cPieceCol, row, col);
            if (currentPlayer === 'red') {
                currentPlayer = 'blue';
            } else if (currentPlayer === 'blue') {
                currentPlayer = 'red';
            }
        }

        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                table.rows[i].cells[j].classList.remove('selected', 'movement', 'danger');
            }
        }
        if (winner == undefined) {
            if (hasMoved == 0) {
                let movingPiece = dataBoard.getPiece(row, col);
                console.log('this cell is occupied by', movingPiece);
                for (let piece of pieces) {
                    if (piece.row === row && piece.col === col) {
                        possibleMoves = piece.getPossibleMoves();
                        for (let possibleMove of possibleMoves) {
                            table.rows[possibleMove[0] - 1].cells[possibleMove[1] - 1].classList.add('movement');
                        }
                    }
                }
            } else {
                hasMoved = 0;
            }
        } else {
            alert(winner + " wins!")
        }
    } else {
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                table.rows[i].cells[j].classList.remove('selected', 'movement', 'danger');
            }
        }
        alert("this is " + currentPlayer + "'s turn!");
    }
    selectedCell = event.currentTarget;
    selectedCell.classList.add('selected');
    currentPiece = [row, col];
}

function moveCurrentPiece(cPieceRow, cPieceCol, row, col) {
    for (let piece of pieces)
        if (piece.row === cPieceRow && piece.col === cPieceCol) {
            piece.row = row;
            piece.col = col;
            pieceImage = document.getElementById(cPieceRow + '-' + cPieceCol).firstElementChild;
            document.getElementById(cPieceRow + '-' + cPieceCol).firstElementChild.remove();
            document.getElementById(row + '-' + col).appendChild(pieceImage);
            hasMoved = 1;
        }

    for (let piece of pieces) {
        let rowDifference = Math.abs(row - piece.row);
        let colDifference = Math.abs(col - piece.col);
        if ((rowDifference == 1) && (colDifference == 1) && (document.getElementById(piece.row + "-" + piece.col).classList.contains("danger"))) {
            eatenPiece = dataBoard.getPiece(piece.row, piece.col);
            indexOfEaten = pieces.indexOf(eatenPiece);
            pieces.splice(indexOfEaten, 1);
            document.getElementById(piece.row + '-' + piece.col).firstElementChild.remove();
            if (piece.player == RED_PLAYER) {
                redCount--;
                takeAvailable = 0;
                if (redCount == 0) {
                    winner = "blue";
                }
            } else if (piece.player == BLUE_PLAYER) {
                blueCount--;
                takeAvailable = 0;
                if (blueCount == 0) {
                    winner = "red";
                }
            }
        }
    }
}

window.addEventListener('load', () => {
    pieces = setUpPieces()
    dataBoard = new BoardData(pieces);
    console.log(dataBoard);
});