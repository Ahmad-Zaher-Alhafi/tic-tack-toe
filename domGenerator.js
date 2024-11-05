let container;
const configurationForm = document.querySelector(".configurationForm");
let confirmAddingPlayerButton;
let cancelAddingPlayerButton;
let gridDimention;

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
        }
    }
}

function addListenerToCellDivs(callBack) {
    cells.forEach(cell => {
        cell.getDiv().addEventListener("click", callBack);
    });
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

    confirmAddingPlayerButton = document.createElement("button");
    confirmAddingPlayerButton.textContent = "Confirm";
    confirmAddingPlayerButton.setAttribute("class", "confirmButton");
    confirmAddingPlayerButton.setAttribute("type", "submit");
    playerConfiguration.appendChild(confirmAddingPlayerButton);

    cancelAddingPlayerButton = document.createElement("button");
    cancelAddingPlayerButton.setAttribute("class", "cancelButton");
    cancelAddingPlayerButton.textContent = "Cancle";
    playerConfiguration.appendChild(cancelAddingPlayerButton);


    function clearInputs() {
        nameInput.value = "";
        symbolInput.value = "";
    }

    function showNewPlayerConfiguration() {
        clearInputs();
        playersConfiguration.appendChild(configurationForm);
        nameInput.focus()
    }

    function hidePlayerConfiguration() {
        playersConfiguration.removeChild(configurationForm);
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

function isFormValid(event) {
    configurationForm.reportValidity();
    return configurationForm.checkValidity();
}

export { setCellContent, addListenerToCellDivs, onGameRestart, showNewPlayerConfiguration, hidePlayerConfiguration, createPlayingPlayerSection, isInAddingPlayerProcess, isFormValid, configurationForm, confirmAddingPlayerButton, cancelAddingPlayerButton };