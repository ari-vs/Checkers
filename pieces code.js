class Piece {
    constructor(row, col, type, player) {
        this.row = row; //row on which the piece exists
        this.col = col; //col on which the piece exists
        this.type = type; //whether the piece is a peasant or a royal
        this.player = player; //which player the piece belongs to
        this.canTake = 0; //whether or not the piece can take an enemy piece
    }


    //method to get the possible moves of a given piece
    getPossibleMoves() {
        //sets relativeMoves to be an array of possible moves for a piece by its type
        let relativeMoves;
        if (this.type === PEASANT) {
            relativeMoves = this.getPeasantRelativeMoves();
        } else if (this.type === ROYAL) {
            relativeMoves = this.getRoyalRelativeMoves();
        }


        //converts the relative moves to absolute cell coordinates on the table on the table
        let absoluteMoves = [];
        for (let relativeMove of relativeMoves) {
            const absoluteRow = this.row + relativeMove[0];
            const absoluteCol = this.col + relativeMove[1];
            absoluteMoves.push([absoluteRow, absoluteCol]);
        }


        //filters out the moves which are outside of the board and makes sure the cells are empty
        let filteredMoves = [];
        for (let absoluteMove of absoluteMoves) {
            const absoluteRow = absoluteMove[0];
            const absoluteCol = absoluteMove[1];
            if (absoluteRow >= 1 && absoluteRow <= 8 && absoluteCol >= 1 && absoluteCol <= 8) {
                if (dataBoard.checkCell(pieces, absoluteRow, absoluteCol) == undefined) {
                    filteredMoves.push(absoluteMove);
                }
            }
        }
        return filteredMoves;
    }


    /*this function calculates the relative moves of a given peasant piece.
    for both players if there is nothing in front of the piece on the diagonals in front of it, those are valid moves.
    if there is something there and the square next up diagonally in that direction exists and is unoccupied then that is a valid move,
    if that move exists the endangered piece is marked with the "danger" class and the moving piece gets canTake=1, the move gets pushed to takingMoves as well*/
    getPeasantRelativeMoves() {
        let result = [];
        if (this.player == 'red') {
            if (dataBoard.checkCell(pieces, this.row + 1, this.col + 1) == undefined) {
                result.push([1, 1]);
            }
            if (dataBoard.checkCell(pieces, this.row + 1, this.col - 1) == undefined) {
                result.push([1, -1]);
            }
            if (this.player !== dataBoard.checkPlayer(pieces, this.row + 1, this.col + 1) && dataBoard.checkPlayer(pieces, this.row + 1, this.col + 1) !== undefined && dataBoard.checkCell(pieces, this.row + 2, this.col + 2) == undefined) {
                result.push([2, 2]);
                if ((this.row + 2 < 9) && (this.row + 2 > 0) && (this.col + 2 < 9) && (this.col + 2 > 0)) {
                    document.getElementById((this.row + 1) + "-" + (this.col + 1)).classList.add("danger");
                    this.canTake = 1;
                    takingMoves.push([2, 2]);
                }
            }
            if (this.player !== dataBoard.checkPlayer(pieces, this.row + 1, this.col - 1) && dataBoard.checkPlayer(pieces, this.row + 1, this.col - 1) !== undefined && dataBoard.checkCell(pieces, this.row + 2, this.col - 2) == undefined) {
                result.push([2, -2]);
                if ((this.row + 2 < 9) && (this.row + 2 > 0) && (this.col - 2 < 9) && (this.col - 2 > 0)) {
                    document.getElementById((this.row + 1) + "-" + (this.col - 1)).classList.add("danger");
                    this.canTake = 1;
                    takingMoves.push([2, -2]);
                }
            }
        } else if (this.player == 'blue') {
            if (dataBoard.checkCell(pieces, this.row - 1, this.col + 1) == undefined) {
                result.push([-1, 1]);
            }
            if (dataBoard.checkCell(pieces, this.row - 1, this.col - 1) == undefined) {
                result.push([-1, -1]);
            }
            if (this.player !== dataBoard.checkPlayer(pieces, this.row - 1, this.col + 1) && dataBoard.checkPlayer(pieces, this.row - 1, this.col + 1) !== undefined && dataBoard.checkCell(pieces, this.row - 2, this.col + 2) == undefined) {
                result.push([-2, 2]);
                if ((this.row - 2 < 9) && (this.row - 2 > 0) && (this.col + 2 < 9) && (this.col + 2 > 0)) {
                    document.getElementById((this.row - 1) + "-" + (this.col + 1)).classList.add("danger");
                    this.canTake = 1;
                    takingMoves.push([-2, 2]);
                }
            }
            if (this.player !== dataBoard.checkPlayer(pieces, this.row - 1, this.col - 1) && dataBoard.checkPlayer(pieces, this.row - 1, this.col - 1) !== undefined && dataBoard.checkCell(pieces, this.row - 2, this.col - 2) == undefined) {
                result.push([-2, -2]);
                if ((this.row - 2 < 9) && (this.row - 2 > 0) && (this.col - 2 < 9) && (this.col - 2 > 0)) {
                    document.getElementById((this.row - 1) + "-" + (this.col - 1)).classList.add("danger");
                    this.canTake = 1;
                    takingMoves.push([-2, -2]);
                }
            }
        }
        return result;
    }


    /*calculates the relative moves of a given royal piece.
    checks every direction individually and keeps going in each direction until either:
    -it is blocked by an allied piece
    -it is blocked by an enemy piece, the cell after which (in the same direction) is free.
    this is then pushed to takingMoves and the endangered piece gets the class "danger", canTake of the piece is set to 1 after which the loop ends.
    -it is blocked by an enemy piece the cell after which (in the same direction) is occupied by another piece or does not exist.
    -the cell being checked is outside of the existing board*/
    getRoyalRelativeMoves() {
        let result = [];
        for (let i = 1; i < 9; i++) {
            if (dataBoard.checkCell(pieces, this.row + i, this.col + i) == undefined) {
                result.push([i, i]);
            } else if (this.player !== dataBoard.checkPlayer(pieces, this.row + i, this.col + i) && dataBoard.checkPlayer(pieces, this.row + i, this.col + i) !== undefined && dataBoard.checkCell(pieces, this.row + i + 1, this.col + i + 1) == undefined && (this.row + i + 1 >= 1 && this.row + i + 1 <= 8 && this.col + i + 1 >= 1 && this.col + i + 1 <= 8)) {
                document.getElementById((this.row + i) + "-" + (this.col + i)).classList.add("danger");
                this.canTake = 1;
                takingMoves.push([i + 1, i + 1]);
                result.push([i + 1, i + 1]);
                break;
            }else{
                break;
            }
        }
        for (let i = 1; i < 9; i++) {
            if (dataBoard.checkCell(pieces, this.row + i, this.col - i) == undefined) {
                result.push([i, -i]);
            } else if (this.player !== dataBoard.checkPlayer(pieces, this.row + i, this.col - i) && dataBoard.checkPlayer(pieces, this.row + i, this.col - i) !== undefined && dataBoard.checkCell(pieces, this.row + i + 1, this.col - i - 1) == undefined && (this.row + i + 1 >= 1 && this.row + i + 1 <= 8 && this.col - i - 1 >= 1 && this.col - i - 1 <= 8)) {
                document.getElementById((this.row + i) + "-" + (this.col - i)).classList.add("danger");
                this.canTake = 1;
                takingMoves.push([i + 1, -i - 1]);
                result.push([i + 1, -i - 1]);
                break;
            }else{
                break;
            }
        }
        for (let i = 1; i < 9; i++) {
            if (dataBoard.checkCell(pieces, this.row - i, this.col + i) == undefined) {
                result.push([-i, +i]);
            } else if (this.player !== dataBoard.checkPlayer(pieces, this.row - i, this.col + i) && dataBoard.checkPlayer(pieces, this.row - i, this.col + i) !== undefined && dataBoard.checkCell(pieces, this.row - i - 1, this.col + i + 1) == undefined && (this.row - i - 1 >= 1 && this.row - i - 1 <= 8 && this.col + i + 1 >= 1 && this.col + i + 1 <= 8)) {
                document.getElementById((this.row - i) + "-" + (this.col + i)).classList.add("danger");
                this.canTake = 1;
                takingMoves.push([-i - 1, i + 1]);
                result.push([-i - 1, i + 1]);
                break;
            }else{
                break;
            }
        }
        for (let i = 1; i < 9; i++) {
            if (dataBoard.checkCell(pieces, this.row - i, this.col - i) == undefined) {
                result.push([-i, -i]);
            } else if (this.player !== dataBoard.checkPlayer(pieces, this.row - i, this.col - i) && dataBoard.checkPlayer(pieces, this.row - i, this.col - i) !== undefined && dataBoard.checkCell(pieces, this.row - i - 1, this.col - i - 1) == undefined && (this.row - i - 1 >= 1 && this.row - i - 1 <= 8 && this.col - i - 1 >= 1 && this.col - i - 1 <= 8)) {
                document.getElementById((this.row - i) + "-" + (this.col - i)).classList.add("danger");
                this.canTake = 1;
                takingMoves.push([-i - 1, -i - 1]);
                result.push([-i - 1, -i - 1]);
                break;
            }else{
                break;
            }
        }
        return result;
    }
}