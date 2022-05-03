//game constants declaration
const BOARD_SIZE = 8;
const RED_PLAYER = 'red';
const BLUE_PLAYER = 'blue';

//piece type declaration
const PEASANT = 'peasant';
const ROYAL = 'royal';

//global variables declaration
let hasMoved = 0; //marks if a piece was moved to not mark the possible moves after it was moved
let selectedCell; //the cell marked as selected
let pieces = []; //array containing all Piece classes
let possibleMoves; //used to store all possible moves
let currentPiece = []; //stores a chosen piece during a turn as an arrau of row and col
let currentPlayer = 'red'; //the player who gets to play his turn, red goes first
let winner; //stores the winner of the game, starts as undefined
let blueCount = 12; //the amount of blue pieces in the game
let redCount = 12; //the amount of red pieces in the game
let takeAvailable = 0; //marks if a taking move is available anywhere on the board
let possibleMovesAmount = []; //used to check at the end of every turn if the player who has to move now ran out of possible moves
let takingMoves = []; //contains all moves that would take a piece

class BoardData {
    constructor(pieces) {
        this.pieces = pieces;
    }

    //gets a piece at a given row and col
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

    //checks a cell to see if it is occupied by anything
    checkCell(pieces, row, col) {
        for (let piece of pieces) {
            if (piece.row == row && piece.col == col) {
                return piece;
            }
        }
    }

    //checks the player of a piece in a given row and col
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
    return result;
}


//performs all actions that happen on a click, recieves the event, row and col of the clicked cell and the table
function onCellClick(event, row, col, table) {
    //if a piece was already clicked this turn lines 101-105 make sure that the piece is the right one and that everything is correct for it to move
    let cPieceRow = currentPiece[0];
    let cPieceCol = currentPiece[1];
    let piecePlayer = dataBoard.getPiece(cPieceRow, cPieceCol).player;
    if ((currentPlayer == dataBoard.getPiece(row, col).player) || (currentPlayer == piecePlayer)) {
        if (event.currentTarget.classList.contains("movement")) {
            //this if and the else if make sure that a taking move is mandatory if there is one available, otherwise the piece will not move
            if (takeAvailable == 1) {
                for (let takingMove of takingMoves) {
                    let moveRowDifference = row - cPieceRow;
                    let moveColDifference = col - cPieceCol;
                    if (moveRowDifference == takingMove[0] && moveColDifference == takingMove[1]) {
                        moveCurrentPiece(cPieceRow, cPieceCol, row, col);
                    }
                }
            } else if (takeAvailable == 0) { //if there is no taking move available any piece is movable
                moveCurrentPiece(cPieceRow, cPieceCol, row, col);
            }
            /*here is where the turns shift from red to blue and back on the condition that there either was not a taking move this turn in the first place
            or that the taking move is the one that has been made*/
            if (takeAvailable == 0) {
                possibleMovesAmount = [];
                if (currentPlayer === 'red') {
                    currentPlayer = 'blue';
                    /*this for and the if after it set up the turn by checking if a take is available, which pieces can take another piece
                    and making sure that if there are no possible moves the player who finished his turn wins*/
                    for (let piece of pieces) {
                        piece.canTake = 0;
                        if (piece.player == BLUE_PLAYER) {
                            let turnOverCheck = piece.getPossibleMoves();
                            if (turnOverCheck.length !== 0) {
                                possibleMovesAmount.push(turnOverCheck);
                            }
                            if (piece.canTake == 1) {
                                takeAvailable = 1; //if any piece of the player about to play their turn can take another piece this variable helps make sure that move is mandatory
                            }
                        }
                    }
                    console.log(possibleMovesAmount);
                    if (possibleMovesAmount.length == 0) {
                        winner = 'red';
                    }
                    console.log(winner);
                } else if (currentPlayer === 'blue') {
                    currentPlayer = 'red';
                    //this does the same thing as what the last comment said except it is for the other player
                    for (let piece of pieces) {
                        piece.canTake = 0;
                        if (piece.player == RED_PLAYER) {
                            let turnOverCheck = piece.getPossibleMoves();
                            if (turnOverCheck.length !== 0) {
                                possibleMovesAmount.push(turnOverCheck);
                            }
                            if (piece.canTake == 1) {
                                takeAvailable = 1;
                            }
                        }
                    }
                    console.log(possibleMovesAmount);
                    if (possibleMovesAmount.length == 0) {
                        winner = 'blue';
                    }
                    console.log(winner);
                }
            }
        }


        //this clears the board of any markings before the turn starts
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                table.rows[i].cells[j].classList.remove('selected', 'movement', 'danger');
            }
        }

        /*this block makes sure that the player makes the correct move under the rules of the game
        starting with making sure that the game has not been won yet and that the piece hasnt already been moved (to prevent marking the movement from the new location)*/
        if (winner == undefined) {
            if (hasMoved == 0) {
                //these next 8 lines mark the possible movements of a piece
                let movingPiece = dataBoard.getPiece(row, col);
                if (movingPiece.canTake == 1 || takeAvailable == 0) {
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
                    alert("a taking move is available!"); //if a taking move is available and it is not the one being made or the wrong piece is chosen then this will pop up
                }
            } else {
                hasMoved = 0;
            }
        } else {
            alert(winner + " wins!") //if the winner has just been defined this will pop up
        }
    } else {
        //these 3 lines clear the board markings if the player decides to choose a different piece after marking one
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                table.rows[i].cells[j].classList.remove('selected', 'movement', 'danger');
            }
        }
        if (winner == undefined){
        alert("this is " + currentPlayer + "'s turn!"); //if the winner has not been declared and the piece of the wrong color is clicked this message pops up
        }else{
            alert(winner + " wins!"); //if a winner is declared it will pop up the winning message again
        }
    }
    //these 3 lines set the selectedCell to the one that was clicked, mark it as selected and set the current piece as an array of the row and col of the chosen piece
    selectedCell = event.currentTarget;
    selectedCell.classList.add('selected');
    currentPiece = [row, col];
}


//this function moves the piece and removes a piece that is being taken, recieves the row and col of the chosen piece and of the clicked cell
function moveCurrentPiece(cPieceRow, cPieceCol, row, col) {
    for (let piece of pieces)
        if (piece.row === cPieceRow && piece.col === cPieceCol) {
            //the next 5 rows set the class of the piece to exist in the new cell via row and col, also they remove the image from the old cell and add it to the new cell
            piece.row = row;
            piece.col = col;
            pieceImage = document.getElementById(cPieceRow + '-' + cPieceCol).firstElementChild;
            document.getElementById(cPieceRow + '-' + cPieceCol).firstElementChild.remove();
            document.getElementById(row + '-' + col).appendChild(pieceImage);
            hasMoved = 1;
            takeAvailable = 0;
            console.log(piece.player);
            //these two ifs change the type of the piece to a royal and change the image of it under the right conditions for each player
            if (piece.player == BLUE_PLAYER && piece.row == 1) {
                let replacedPiece = document.getElementById(piece.row + '-' + piece.col);
                replacedPiece.firstElementChild.remove();
                replacedPiece.innerHTML = '<img src="blue/royal.png" class="image">';
                piece.type = ROYAL;
            }
            if (piece.player == RED_PLAYER && piece.row == 8) {
                let replacedPiece = document.getElementById(piece.row + '-' + piece.col);
                replacedPiece.firstElementChild.remove();
                replacedPiece.innerHTML = '<img src="red/royal.png" class="image">';
                piece.type = ROYAL;
            }
        }

    //this block is in charge of removing the piece that is taken
    for (let piece of pieces) {
        let rowDifference = Math.abs(row - piece.row);
        let colDifference = Math.abs(col - piece.col);
        if ((rowDifference == 1) && (colDifference == 1) && (document.getElementById(piece.row + "-" + piece.col).classList.contains("danger"))) { // checks each piece to see if it is the one being taken
            //the next 4 lines remove the piece from the pieces array and the image
            let eatenPiece = dataBoard.getPiece(piece.row, piece.col);
            indexOfEaten = pieces.indexOf(eatenPiece);
            pieces.splice(indexOfEaten, 1);
            document.getElementById(piece.row + '-' + piece.col).firstElementChild.remove();
            /*the if and else if both reduce the total count of pieces for the player that had a piece taken, reset all variables related to taking
            and declare a winner if a player runs out of pieces*/
            if (piece.player == RED_PLAYER) {
                redCount--;
                takeAvailable = 0;
                takingMoves = [];
                for (let piece of pieces) {
                    if (piece.player == BLUE_PLAYER) {
                        piece.canTake = 0;
                    }
                }
                if (redCount == 0) {
                    winner = "blue";
                }
            } else if (piece.player == BLUE_PLAYER) {
                blueCount--;
                takeAvailable = 0;
                takingMoves = [];
                for (let piece of pieces) {
                    if (piece.player == RED_PLAYER) {
                        piece.canTake = 0;
                    }
                }
                if (blueCount == 0) {
                    winner = "red";
                }
            }
        }
    }
}


//when the page loads this sets up the pieces on the board and in the pieces and dataBoard variables
window.addEventListener('load', () => {
    pieces = setUpPieces()
    dataBoard = new BoardData(pieces);
    console.log(dataBoard);
});