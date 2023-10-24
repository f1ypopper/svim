function setCurrent(col, row) {
    let selected = document.getElementById(convertColNum(col) + row);
    selected.classList.add('current-cell');
    selected.scrollIntoView({ behavior: 'instant', block: 'center', inline: 'center' });
}

function removeCurrent(col, row) {
    let selected = document.getElementById(convertColNum(col) + row);
    //selected.className='grid-cell';
    selected.classList.remove('current-cell');
}

function changeCurrent(newCol, newRow) {
    removeCurrent(currentCol, currentRow);
    setCurrent(newCol, newRow);
    currentCol = newCol;
    currentRow = newRow;
}

function addSelected(Col, Row) {
    clearSelection();
    let startCol = Math.min(selectionStartCellCol, Col);
    let endCol = Math.max(selectionStartCellCol, Col);
    let startRow = Math.min(selectionStartCellRow, Row);
    let endRow = Math.max(selectionStartCellRow, Row);
    for (let col = startCol; col <= endCol; col++) {
        for (let row = startRow; row <= endRow; row++) {
            document.getElementById(convertColNum(col) + row).classList.add('visual-selected-cell');
        }
    }
    selectionEndCellRow = Row;
    selectionEndCellCol = Col;
}

function clearSelection() {
    let startCol = Math.min(selectionStartCellCol, selectionEndCellCol);
    let endCol = Math.max(selectionStartCellCol, selectionEndCellCol);
    let startRow = Math.min(selectionStartCellRow, selectionEndCellRow);
    let endRow = Math.max(selectionStartCellRow, selectionEndCellRow);
        for (let row = startRow; row <= endRow; row++) {
            for (let col = startCol; col <= endCol; col++) {
            document.getElementById(convertColNum(col) + row).classList.remove('visual-selected-cell');
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
    commandBar.style.backgroundColor = 'red';
    commandBar.innerHTML = msg;
}

function copyToClipboard() {
    //Clear the clipboard
    clipboard.length = 0;
    if (isVisual) {
        let startCol = Math.min(selectionStartCellCol, selectionEndCellCol);
        let endCol = Math.max(selectionStartCellCol, selectionEndCellCol);
        let startRow = Math.min(selectionStartCellRow, selectionEndCellRow);
        let endRow = Math.max(selectionStartCellRow, selectionEndCellRow);
        for (let row = startRow; row <= endRow; row++) {
            let sRow = [];
            for (let col = startCol; col <= endCol; col++) {
                sRow.push(getInputCell(col, row).value);
            }
            clipboard.push(sRow);
        }
        clearSelection();
    } else {
        let inputCell = getInputCell(currentCol, currentRow);
        clipboard.push([inputCell.value]);
    }
}

function deleteSelection() {
    let startCol = Math.min(selectionStartCellCol, selectionEndCellCol);
    let endCol = Math.max(selectionStartCellCol, selectionEndCellCol);
    let startRow = Math.min(selectionStartCellRow, selectionEndCellRow);
    let endRow = Math.max(selectionStartCellRow, selectionEndCellRow);

    if (isVisual) {
        for (let row = startRow; row <= endRow; row++) {
            for (let col = startCol; col <= endCol; col++) {
                let elem = document.getElementById(String.fromCharCode(col) + row + '_input');
                getInputCell(col, row).value='';
            }
        }

    } else {
        let inputCell = getInputCell(currentCol, currentRow);
        inputCell.value = '';
    }
}

function updateStatusBar() {
    let selectedCell = getCurrentCell();
    let inputCell = selectedCell.children[0];
    if ((convertColNum(currentCol)+currentRow) in formulaTable){
        document.getElementById('status_current_cell_value').innerHTML = formulaTable[(convertColNum(currentCol)+currentRow)].source;
    }else{
        document.getElementById('status_current_cell_value').innerHTML = inputCell.value;
    }
    if (isVisual) {
        document.getElementById('status_current_cell').innerHTML = convertColNum(selectionStartCellCol) + selectionStartCellRow+':' + convertColNum(selectionEndCellCol)+selectionEndCellRow;
    } else if (mode === 'NORMAL') {
        document.getElementById('status_current_cell').innerHTML = convertColNum(currentCol) + currentRow;
    }
}

function updateCommandBar() {
    if (mode === 'NORMAL') {
        commandBar.innerHTML = 'NORMAL';
    } else if (mode === 'COMMAND') {
        commandBar.innerHTML = ':' + commandBuffer;
    }else{
        commandBar.innerHTML = mode;
    }
}

function convertColNum(col){
    let colLabel = '';
    let fC = Math.floor(col/26);
    let sC = col % 26;
    while (fC > 0){
        colLabel+=colNames.at((fC-1)%26);
        fC = Math.floor(fC/26);
    }
    colLabel+=colNames.at(sC);
    return colLabel;
}

function convertColLabel(label){
    let len = label.length-1;
    let col = 0;
    let index = 0;
    while(len > 0){
        col+=26**(index+1)*((label.charCodeAt(index)-'A'.charCodeAt(0))+1);
        index++;
        len--;
    }
    col+=label.charCodeAt(index)-'A'.charCodeAt(0);
    return col;
}

function getCurrentCell(){
    return document.getElementById(convertColNum(currentCol) + currentRow)
}

function getInputCell(col, row){
    return document.getElementById(convertColNum(col) + row+'_input')
}

function parseCordinate(cord){
    let regex = /([a-zA-Z]+)(\d+)/;
    let result = cord.match(regex).slice(1);
    return {col: convertColLabel(result[0].toUpperCase()), row: parseInt(result[1])};
}