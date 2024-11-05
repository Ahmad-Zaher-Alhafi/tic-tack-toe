import * as gameBoard from "./gameBaord.js";
import * as domGenerator from "./domGenerator.js";

let gameFinished;


const addPlayerButton = document.querySelector(".addPlayerButton");



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

    const players = [];

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

        let wonPlayer = players.find(player => player.getGameSymbol() == wonSymbol);
        wonPlayer = wonPlayer == undefined ? undefined : wonPlayer.getName();

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
        domGenerator.addListenerToCellDivs(onCellClicked);
        gameBoard.onGameRestart(gridDimention);
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
    addPlayerButton.disabled = true;
    domGenerator.showNewPlayerConfiguration();
}

function cancelAddingPlayer() {
    domGenerator.hidePlayerConfiguration();
}

domGenerator.configurationForm.addEventListener("submit", confirmAddingPlayerClicked);

function confirmAddingPlayerClicked(event) {
    event.preventDefault();

    if (!domGenerator.isFormValid(event)) {
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
    addPlayerButton.disabled = false;
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

domGenerator.confirmAddingPlayerButton?.addEventListener("click", confirmAddingPlayerClicked);

domGenerator.cancelAddingPlayerButton?.addEventListener("click", cancelAddingPlayer);


function onCellClicked(event) {
    if (gameFinished) {
        alert("Game is finished, please click restart to start a new one!");
        return;
    }
    const cellRow = event.target.getAttribute("row");
    const cellColumn = event.target.getAttribute("column");

    if (!gameBoard.isCellEmpty(cellRow, cellColumn)) return;

    gameController.play(cellRow, cellColumn);
    gameController.checkWinCondition();
}