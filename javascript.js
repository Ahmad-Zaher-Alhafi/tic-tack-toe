const rowsNum = 3;
const columnsNum = 3;
const winingCellsCount = 3;

const gameBoard = (function () {
    function createBoardCell(row, column) {
        let content = undefined;
        let cellRow = row;
        let cellColumn = column;

        function setContent(value) {
            content = value;
        }

        function getPosition() {
            return { cellRow, cellColumn }
        }

        function getContent() {
            return content;
        }

        return { setContent, getContent, getPosition }
    }

    boardCells = [];

    for (let i = 0; i < rowsNum; i++) {
        for (let j = 0; j < columnsNum; j++) {
            boardCells.push(createBoardCell(i, j))
        }
    }

    function fillBaordCell(cellRow, cellComun, content) {
        let cell = boardCells.find(boardCell => boardCell.getPosition().cellRow == cellRow && boardCell.getPosition().cellColumn == cellComun);
        cell.setContent(content);
    }

    function getCellContent(cellRow, cellComun) {
        let cell = boardCells.find(boardCell => boardCell.getPosition().cellRow == cellRow && boardCell.getPosition().cellColumn == cellComun);
        return cell.getContent();
    }

    function getWonSymbolIfExist() {
        for (let i = 0; i < rowsNum; i++) {
            let cellsInRow = boardCells.filter(cell => cell.getPosition().cellRow == i);
            if (cellsInRow.length < winingCellsCount) continue;

            if (cellsInRow.every(cell => cell.getContent() == cellsInRow[0].getContent())) return cellsInRow[0].getContent();
        }

        for (let j = 0; j < columnsNum; j++) {
            let cellsInColumn = boardCells.filter(cell => cell.getPosition().cellColumn == j);
            if (cellsInColumn.length < winingCellsCount) continue;

            if (cellsInColumn.every(cell => cell.getContent() == cellsInColumn[0].getContent())) return cellsInColumn[0].getContent();
        }


        let diagonalCells = boardCells.filter(cell => cell.getPosition().cellRow == cell.getPosition().cellColumn);
        if (diagonalCells.length < winingCellsCount) return;

        return diagonalCells[0].getContent();
    }

    function printBoard() {
        let toPrint = "";

        boardCells.every(cell => {
            toPrint += (cell.getContent() ?? "E") + " ";
            if (cell.getPosition().cellColumn == 2) {
                toPrint += "\n";
            }

            return cell;
        });

        console.log(toPrint);
    }

    return { fillBaordCell, getCellContent, getWonSymbolIfExist, printBoard };
})();


const gameController = (function () {
    function createPlayer(playerName, playerGameSymbol) {
        const name = playerName;
        const gameSymbol = playerGameSymbol;

        function getName() {
            return name;
        }

        function getGameSymbol() {
            return gameSymbol;
        }

        return { getName, getGameSymbol }
    }

    players = [createPlayer("Zaher", "Z"), createPlayer("Memo", "M")];

    function getPlayerSymbol(playerName) {
        let player = players.find(p => p.getName() == playerName);
        return player.getGameSymbol();
    }

    function checkWinCondition() {
        const wonSymbol = gameBoard.getWonSymbolIfExist();
        let winCondition = "No one won!";
        if (wonSymbol === undefined) return winCondition;

        const wonPlayer = players.find(player => player.getGameSymbol() == wonSymbol);
        winCondition = wonPlayer == undefined ? "No one won!" : wonPlayer.getName();
        return winCondition;
    }

    return { getPlayerSymbol, checkWinCondition };
})()




gameBoard.fillBaordCell(0, 0, "Z");
gameBoard.fillBaordCell(1, 1, "Z");
gameBoard.fillBaordCell(2, 2, "Z");

gameBoard.printBoard();
console.log(gameController.checkWinCondition());