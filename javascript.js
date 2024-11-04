let gridDimention;
const numOfPlayers = 5;
let gameFinished;

const configurationForm = document.querySelector(".configurationForm");
const addPlayerButton = document.querySelector(".addPlayerButton");

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

    let boardCells = [];

    function createBoardCells() {
        boardCells = [];
        for (let i = 0; i < gridDimention; i++) {
            for (let j = 0; j < gridDimention; j++) {
                boardCells.push(createBoardCell(i, j))
            }
        }
    }

    createBoardCells();

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

    function onGameRestart() {
        createBoardCells();
    }

    return { fillBaordCell, getCellContent, getWonSymbolIfExist, onGameRestart, isCellEmpty };
})();


const domGenerator = (function () {
    let container;

    function createCell(cellRow, cellColumn) {
        let cellDiv = document.createElement("div");

        const row = cellRow;
        const column = cellColumn;
        let content = undefined;

        cellDiv.setAttribute("class", "cell");
        cellDiv.setAttribute("row", cellRow);
        cellDiv.setAttribute("column", cellColumn);
        cellDiv.textContent = content;
        container.appendChild(cellDiv);

        function getPosition() {
            return { row, column };
        }

        function setContent(cellContent) {
            content = cellContent;
            cellDiv.textContent = cellContent;
        }

        function onGameRestart() {
            setContent(undefined)
        }

        function getDiv() {
            return cellDiv;
        }

        return { getPosition, setContent, onGameRestart, getDiv }
    }

    let cells = [];

    function createGrid(dimention) {
        gridDimention = dimention

        container = document.querySelector(".container");
        container.replaceChildren();
        container.style.gridTemplate = `repeat(${gridDimention}, 1fr) / repeat(${gridDimention}, 1fr)`;

        cells = [];
        for (let i = 0; i < gridDimention; i++) {
            for (let j = 0; j < gridDimention; j++) {
                const cell = createCell(i, j);
                cells.push(cell);
                cell.getDiv().addEventListener("click", onCellClicked);
            }
        }
    }

    function setCellContent(cellRow, cellColumn, cellContent) {
        cells.find(cell => cell.getPosition().row == cellRow && cell.getPosition().column == cellColumn).setContent(cellContent);
    }

    function onGameRestart(gridDimention) {
        createGrid(gridDimention);
    }

    function createConfigurationSection() {
        let playersConfiguration = document.querySelector(".playersConfiguration");

        let playerConfiguration = document.createElement("div");
        playerConfiguration.setAttribute("class", "playerConfiguration")
        configurationForm.appendChild(playerConfiguration);

        let nameLabel = document.createElement("lable");
        nameLabel.setAttribute("for", "playerName");
        nameLabel.textContent = "Player name:"
        playerConfiguration.appendChild(nameLabel);

        let nameInput = document.createElement("input");
        nameInput.setAttribute("class", "playerNameInput");
        nameInput.setAttribute("id", "playerName");
        nameInput.setAttribute("required", "");
        playerConfiguration.appendChild(nameInput);

        let symbolLabel = document.createElement("lable");
        symbolLabel.setAttribute("for", "playerSymbol");
        symbolLabel.textContent = "Player symbol:"
        playerConfiguration.appendChild(symbolLabel);

        let symbolInput = document.createElement("input");
        symbolInput.setAttribute("class", "playerSymbolInput");
        symbolInput.setAttribute("id", "playerSymbol");
        symbolInput.setAttribute("required", "");
        playerConfiguration.appendChild(symbolInput);

        let confirmButton = document.createElement("button");
        confirmButton.textContent = "Confirm";
        confirmButton.setAttribute("type", "submit");
        playerConfiguration.appendChild(confirmButton);
        confirmButton.addEventListener("click", confirmAddingPlayerClicked);

        let cancelButton = document.createElement("button");
        cancelButton.textContent = "Cancle";
        playerConfiguration.appendChild(cancelButton);
        cancelButton.addEventListener("click", cancelAddingPlayer);



        function clearInputs() {
            nameInput.value = "";
            symbolInput.value = "";
        }

        function showNewPlayerConfiguration() {
            clearInputs();
            playersConfiguration.appendChild(configurationForm);
            nameInput.focus()
            addPlayerButton.disabled = true;
        }

        function hidePlayerConfiguration() {
            playersConfiguration.removeChild(configurationForm);
            addPlayerButton.disabled = false;
        }

        function isPlayerConfigurationShown() {
            return playersConfiguration.contains(configurationForm);
        }

        return { showNewPlayerConfiguration, hidePlayerConfiguration, isPlayerConfigurationShown };
    }

    const configurationSection = createConfigurationSection();

    function showNewPlayerConfiguration() {
        configurationSection.showNewPlayerConfiguration();
    }

    function hidePlayerConfiguration() {
        configurationSection.hidePlayerConfiguration();
    }

    hidePlayerConfiguration();
    let playersInGame = document.querySelector(".playersInGame");

    function createPlayingPlayerSection(playerName, playerSymbol) {
        let playerInGameDiv = document.createElement("div");
        playersInGame.appendChild(playerInGameDiv)
        playerInGameDiv.textContent = "Player name: " + playerName + ",  Player symbol: " + playerSymbol;
    }

    function isInAddingPlayerProcess() {
        return configurationSection.isPlayerConfigurationShown();
    }

    return { createCell, setCellContent, onGameRestart, showNewPlayerConfiguration, hidePlayerConfiguration, createPlayingPlayerSection, isInAddingPlayerProcess }
})()


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

        players.push({ getName, getGameSymbol })
    }

    players = [];

    const randomPlayerIndex = Math.floor(Math.random() * (players.length - 1));
    let playerTurnIndex = randomPlayerIndex;
    let playerTurnName;

    function getPlayerSymbol(playerName) {
        let player = players.find(p => p.getName() == playerName);
        return player.getGameSymbol();
    }

    function checkWinCondition() {
        const wonSymbol = gameBoard.getWonSymbolIfExist();

        if (wonSymbol === undefined) return;

        gameFinished = true;

        const wonPlayer = players.find(player => player.getGameSymbol() == wonSymbol);
        wonPlayer == undefined ? undefined : wonPlayer.getName();

        onGameFinished(wonPlayer);
    }

    function play(cellRow, cellColumn, playerName) {
        playerTurnIndex = (playerTurnIndex + 1) % players.length;
        playerTurnName = players[playerTurnIndex].getName();

        const symbol = getPlayerSymbol(playerName ?? playerTurnName)
        gameBoard.fillBaordCell(cellRow, cellColumn, symbol);
        domGenerator.setCellContent(cellRow, cellColumn, symbol)
    }

    function startNewGame(gridDimention) {
        gameFinished = false;
        domGenerator.onGameRestart(gridDimention);
        gameBoard.onGameRestart();
    }

    function isSymbolUsedByPlayer(symbol) {
        return players.find(player => player.getGameSymbol() == symbol);
    }

    function isNameUsedByPlayer(name) {
        return players.find(player => player.getName() == name);
    }

    function gameHasAtLeasetTwoPlayers() {
        return players.length >= 2;
    }

    return { getPlayerSymbol, checkWinCondition, play, startNewGame, createPlayer, isNameUsedByPlayer, isSymbolUsedByPlayer, gameHasAtLeasetTwoPlayers };
})()


addPlayerButton.addEventListener("click", addPlayer);

function addPlayer() {
    domGenerator.showNewPlayerConfiguration();
}

function cancelAddingPlayer() {
    domGenerator.hidePlayerConfiguration();
}

configurationForm.addEventListener("submit", confirmAddingPlayerClicked);

function confirmAddingPlayerClicked(event) {
    event.preventDefault();
    configurationForm.reportValidity();

    if (!configurationForm.checkValidity()) {
        event.preventDefault();
        return;
    }

    const nameInput = event.target.parentElement.querySelector(".playerNameInput");
    const playerName = nameInput.value;
    if (playerName.length > 25) {
        alert("This name is too long: " + playerName);
        return;
    }

    if (gameController.isNameUsedByPlayer(playerName)) {
        alert(`"The name: "${playerName}" is already taken by other player"`);
        return;
    }

    const symbolInput = event.target.parentElement.querySelector(".playerSymbolInput");
    const playerSymbol = symbolInput.value;
    if (playerSymbol.length > 1) {
        alert("Player symbol should not be more than one character, please replace the following symbol: " + playerSymbol);
        return;
    }

    if (gameController.isSymbolUsedByPlayer(playerSymbol)) {
        alert(`"The symbol: "${playerSymbol}" is already taken by other player"`);
        return;
    }

    gameController.createPlayer(playerName, playerSymbol);
    domGenerator.createPlayingPlayerSection(playerName, playerSymbol);
    domGenerator.hidePlayerConfiguration();
}

let startNewGameButton = document.querySelector(".startNewGameButton");
startNewGameButton.addEventListener("click", startNewGame);

let gridDimentionInput = document.querySelector(".gridDimentionInput");

function startNewGame() {
    let girDimentoin = parseInt(gridDimentionInput.value);

    if (girDimentoin % 2 == 0) {
        alert("Please enter only odd number for the grid dimention");
        return;
    }

    if (!gameController.gameHasAtLeasetTwoPlayers()) {
        alert("the game requires at least 2 players, please add more plaeyrs");
        return;
    }

    if (domGenerator.isInAddingPlayerProcess()) {
        alert("Please finish adding players process first");
        return;
    }

    gameController.startNewGame(girDimentoin);
    addPlayerButton.disabled = true;
    startNewGameButton.disabled = true;
}

function onGameFinished(winnerName) {
    addPlayerButton.disabled = false;
    startNewGameButton.disabled = false;

    if (winnerName == undefined) {
        alert(`"Tie, no one won this round"`)
        return;
    }

    alert(`"${winnerName} has won this round"`)
}

function onCellClicked(cell) {
    if (gameFinished) {
        alert("Game is finished, please click restart to start a new one!");
        return;
    }
    const cellRow = cell.target.getAttribute("row");
    const cellColumn = cell.target.getAttribute("column");

    if (!gameBoard.isCellEmpty(cellRow, cellColumn)) return;

    gameController.play(cellRow, cellColumn);
    gameController.checkWinCondition();
}
