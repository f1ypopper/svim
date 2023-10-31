function setCurrent(cell) {
    let selected = document.getElementById(Cell2Label(cell));
    selected.classList.add('current-cell');
    selected.scrollIntoView({ behavior: 'instant', block: 'center', inline: 'center' });
}

function removeCurrent(cell) {
    let selected = document.getElementById(Cell2Label(cell));
    //selected.className='grid-cell';
    selected.classList.remove('current-cell');
}

function changeCurrent(newCell) {
    removeCurrent(currentCell);
    setCurrent(newCell);
    currentCell.col = newCell.col;
    currentCell.row = newCell.row;
}

function getSelectionRange(start, end){
    let startCol = Math.min(start.col, end.col);
    let endCol = Math.max(start.col, end.col);
    let startRow = Math.min(start.row, end.row);
    let endRow = Math.max(start.row, end.row);
    return {startCol: startCol, startRow: startRow, endRow: endRow, endCol: endCol};
}

function addSelected(cell) {
    clearSelection();
    let range = getSelectionRange(selectionStart, cell);
    for (let row = range.startRow; row <= range.endRow; row++) {
    for (let col = range.startCol; col <= range.endCol; col++) {
            document.getElementById(Cell2Label({col: col, row: row})).classList.add('visual-selected-cell');
        }
    }
    selectionEnd = {...cell};
}

function clearSelection() {
    let range = getSelectionRange(selectionStart, selectionEnd);
    for (let row = range.startRow; row <= range.endRow; row++) {
        for (let col = range.startCol; col <= range.endCol; col++) {
            document.getElementById(Cell2Label({col: col, row: row})).classList.remove('visual-selected-cell');
        }
    }
}

function isLetter(str) {
    return str.length === 1 && str.match(/[a-z]/i);
}
function transpose(matrix) {
    return matrix[0].map((col, i) => matrix.map(row => row[i]));
}

function commandError(msg) {
    commandBar.innerHTML = msg;
    commandBar.style.backgroundColor = 'red';
    commandHasError = true;
}

function copyToClipboard() {
    //Clear the clipboard
    clipboard.length = 0;
    if (isVisual) {
        let range = getSelectionRange(selectionStart, selectionEnd);
        for (let row = range.startRow; row <= range.endRow; row++) {
            let sRow = [];
            for (let col = range.startCol; col <= range.endCol; col++) {
                sRow.push(getInputCell({col: col, row: row}).value);
            }
            clipboard.push(sRow);
        }
        clearSelection();
    } else {
        let inputCell = getInputCell(Current);
        clipboard.push([inputCell.value]);
    }
}

function deleteSelection() {
    let range = getSelectionRange(selectionStart, selectionEnd);
    if (isVisual) {
        for (let row = range.startRow; row <= range.endRow; row++) {
            for (let col = range.startCol; col <= range.endCol; col++) {
                getInputCell({col: col, row: row}).value = '';
            }
        }

    } else {
        let inputCell = getInputCell(currentCell);
        inputCell.value = '';
    }
}

function Cell2Label(cell) {
    return colNum2Label(cell.col) + cell.row;
}

function updateStatusBar() {
    let inputCell = getInputCell(currentCell);
    if (currentCell in formulaTable) {
        document.getElementById('status_current_cell_value').innerHTML = formulaTable[currentCell].source;
    } else {
        document.getElementById('status_current_cell_value').innerHTML = inputCell.value;
    }
    if (isVisual) {
        document.getElementById('status_current_cell').innerHTML = Cell2Label(selectionStart) + ':' + Cell2Label(selectionEnd);
    } else if (mode === 'NORMAL') {
        document.getElementById('status_current_cell').innerHTML = Cell2Label(currentCell);
    }
}

function updateCommandBar() {
    if (mode === 'NORMAL') {
        commandBar.innerHTML = 'NORMAL';
        commandBar.style.backgroundColor = 'rgb(235, 248, 118)';
    } else if (mode === 'COMMAND') {
        if(commandHasError === true){
            commandBuffer = '';
            commandHasError = false;
            mode = 'NORMAL';
        }else{
            commandBar.innerHTML = ':' + commandBuffer;
        }
    }else{
        commandBar.innerHTML = mode;
    }
}

function colNum2Label(col) {
    let colLabel = '';
    let fC = Math.floor(col / 26);
    let sC = col % 26;
    while (fC > 0) {
        colLabel += colNames.at((fC - 1) % 26);
        fC = Math.floor(fC / 26);
    }
    colLabel += colNames.at(sC);
    return colLabel;
}

function colLabel2Num(label) {
    let len = label.length - 1;
    let col = 0;
    let index = 0;
    while (len > 0) {
        col += 26 ** (index + 1) * ((label.charCodeAt(index) - 'A'.charCodeAt(0)) + 1);
        index++;
        len--;
    }
    col += label.charCodeAt(index) - 'A'.charCodeAt(0);
    return col;
}

function getCurrentCell() {
    return document.getElementById(Cell2Label(currentCell));
}

function getInputCell(cell) {
    return document.getElementById(Cell2Label(cell) + '_input')
}

function parseCordinate(cord) {
    let regex = /([a-zA-Z]+)(\d+)/;
    let result = cord.match(regex).slice(1);
    return { col: colLabel2Num(result[0].toUpperCase()), row: parseInt(result[1]) };
}