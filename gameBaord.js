let gridDimention;

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

let boardCells = [];

function createBoardCells() {
    boardCells = [];
    for (let i = 0; i < gridDimention; i++) {
        for (let j = 0; j < gridDimention; j++) {
            boardCells.push(createBoardCell(i, j))
        }
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
    function checkIfWonByAnyRow() {
        for (let i = 0; i < gridDimention; i++) {
            let cellsInRow = boardCells.filter(cell => cell.getPosition().cellRow == i && cell.getContent() !== undefined);
            if (cellsInRow.length < gridDimention) continue;
            let definedCellContent = cellsInRow.find(cell => cell.getContent() !== undefined)?.getContent();
            if (definedCellContent == undefined) break;
            if (cellsInRow.every(cell => cell.getContent() == definedCellContent)) return definedCellContent;
        }
    }

    function checkIfWonByAnyColumn() {
        for (let j = 0; j < gridDimention; j++) {
            let cellsInColumn = boardCells.filter(cell => cell.getPosition().cellColumn == j && cell.getContent() !== undefined);
            if (cellsInColumn.length < gridDimention) continue;
            let definedCellContent = cellsInColumn.find(cell => cell.getContent() !== undefined)?.getContent();
            if (definedCellContent == undefined) break;
            if (cellsInColumn.every(cell => cell.getContent() == definedCellContent)) return definedCellContent;
        }
    }

    function checkIfWonDiagonally() {
        let diagonalCells = boardCells.filter(cell => cell.getPosition().cellRow == cell.getPosition().cellColumn && cell.getContent() !== undefined);
        if (diagonalCells.length < gridDimention) return;
        let definedCellContent = diagonalCells.find(cell => cell.getContent() !== undefined)?.getContent();
        if (definedCellContent != undefined) {
            if (diagonalCells.every(cell => cell.getContent() == definedCellContent)) return definedCellContent;
        }
    }

    function checkIfTie() {
        if (boardCells.every(cell => cell.getContent() !== undefined)) return "Tie"
    }

    let wonSymbol = checkIfWonByAnyRow();
    if (wonSymbol != undefined) return wonSymbol;
    wonSymbol = checkIfWonByAnyColumn();
    if (wonSymbol != undefined) return wonSymbol;
    wonSymbol = checkIfWonDiagonally();
    if (wonSymbol != undefined) return wonSymbol;
    wonSymbol = checkIfTie();
    if (wonSymbol != undefined) return wonSymbol;
}

function isCellEmpty(cellRow, cellColumn) {
    return getCellContent(cellRow, cellColumn) === undefined;
}

function onGameRestart(dimention) {
    gridDimention = dimention;
    createBoardCells();
}

export { fillBaordCell, getCellContent, getWonSymbolIfExist, onGameRestart, isCellEmpty };
