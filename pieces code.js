class Piece {
    constructor(row, col, type, player) {
        this.row = row;
        this.col = col;
        this.type = type;
        this.player = player;
        this.eaten = 0;
    }

    getPossibleMoves() {
        let relativeMoves;
        if (this.type === PEASANT) {
            relativeMoves = this.getPeasantRelativeMoves();
        } else if (this.type === ROYAL) {
            relativeMoves = this.getRoyalRelativeMoves();
        }

        let absoluteMoves = [];
        for (let relativeMove of relativeMoves) {
            const absoluteRow = this.row + relativeMove[0];
            const absoluteCol = this.col + relativeMove[1];
            absoluteMoves.push([absoluteRow, absoluteCol]);
        }
        console.log(absoluteMoves);

        let filteredMoves = [];
        for (let absoluteMove of absoluteMoves) {
            const absoluteRow = absoluteMove[0];
            const absoluteCol = absoluteMove[1];
            if (absoluteRow >= 1 && absoluteRow <= 8 && absoluteCol >= 1 && absoluteCol <= 8) {
                if (takeAvailable == 0) {
                    if (dataBoard.checkCell(pieces, absoluteRow, absoluteCol) == undefined) {
                        filteredMoves.push(absoluteMove);
                    } else if (this.player !== dataBoard.checkPlayer(pieces, absoluteRow, absoluteCol)) {
                        filteredMoves.push(absoluteMove);
                    }
                } else if (takeAvailable > 0) {
                    if(dataBoard.getPiece(absoluteRow+1,absoluteCol+1) !== undefined || dataBoard.getPiece(absoluteRow+1, absoluteCol-1) !== undefined || dataBoard.getPiece(absoluteRow-1, absoluteCol+1) !== undefined|| dataBoard.getPiece(absoluteRow-1, absoluteCol-1) !== undefined){
                        filteredMoves.push(absoluteMove);
                    }
                }
            }
        }
        console.log(filteredMoves);
        return filteredMoves;
    }

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
                takeAvailable++;
                if ((this.row + 2 < 9) && (this.row + 2 > 0) && (this.col + 2 < 9) && (this.col + 2 > 0)) {
                    document.getElementById((this.row + 1) + "-" + (this.col + 1)).classList.add("danger");
                }
            }
            if (this.player !== dataBoard.checkPlayer(pieces, this.row + 1, this.col - 1) && dataBoard.checkPlayer(pieces, this.row + 1, this.col - 1) !== undefined && dataBoard.checkCell(pieces, this.row + 2, this.col - 2) == undefined) {
                result.push([2, -2]);
                takeAvailable++;
                if ((this.row + 2 < 9) && (this.row + 2 > 0) && (this.col - 2 < 9) && (this.col - 2 > 0)) {
                    document.getElementById((this.row + 1) + "-" + (this.col - 1)).classList.add("danger");
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
                takeAvailable++;
                if ((this.row - 2 < 9) && (this.row - 2 > 0) && (this.col + 2 < 9) && (this.col + 2 > 0)) {
                    document.getElementById((this.row - 1) + "-" + (this.col + 1)).classList.add("danger");
                }
            }
            if (this.player !== dataBoard.checkPlayer(pieces, this.row - 1, this.col - 1) && dataBoard.checkPlayer(pieces, this.row - 1, this.col - 1) !== undefined && dataBoard.checkCell(pieces, this.row - 2, this.col - 2) == undefined) {
                result.push([-2, -2]);
                takeAvailable++;
                if ((this.row - 2 < 9) && (this.row - 2 > 0) && (this.col - 2 < 9) && (this.col - 2 > 0)) {
                    document.getElementById((this.row - 1) + "-" + (this.col - 1)).classList.add("danger");
                }
            }
        }
        console.log(takeAvailable);
        console.log(result);
        return result;
    }
}