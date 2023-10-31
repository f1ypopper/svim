import {parse, Executor} from './formulaengine.js';

function bold(args) {
    let startCol, startRow, endCol, endRow;
    if (isVisual) {
        startCol = selectionStartCellCol;
        startRow = selectionStartCellRow;
        endCol = selectionEndCellCol;
        endRow = selectionEndCellRow;
    } else {
        startCol = currentCol;
        startRow = currentRow;
        endCol = currentCol;
        endRow = currentRow;
    }
    for (let row = startRow; row <= endRow; row++) {
        for (let col = startCol; col <= endCol; col++) {
            document.getElementById(colNum2Label(col) + row + '_input').style.fontWeight = 'bold';
        }
    }
    exitCommandMode();
}
function center(args) {
    console.log('HI');
    let startCol, startRow, endCol, endRow;
    if (isVisual) {
        startCol = selectionStartCellCol;
        startRow = selectionStartCellRow;
        endCol = selectionEndCellCol;
        endRow = selectionEndCellRow;
    } else {
        startCol = currentCol;
        startRow = currentRow;
        endCol = currentCol;
        endRow = currentRow;
    }
    for (let row = startRow; row <= endRow; row++) {
        for (let col = startCol; col <= endCol; col++) {
            document.getElementById(colNum2Label(col) + row + '_input').style.textAlign = 'center';
        }
    }
    exitCommandMode();
}
function exitCommandMode() {
    commandBuffer = '';
    mode = 'NORMAL';
}
function fill(args) {
    //TODO: Start from the number in the startCell
    let startCol, startRow, endCol, endRow;
    if (isVisual) {
        startCol = selectionStartCellCol;
        startRow = selectionStartCellRow;
        endCol = selectionEndCellCol;
        endRow = selectionEndCellRow;
    } else {
        startCol = currentCol;
        startRow = currentRow;
        endCol = colLabel2Num(args[0].toUpperCase());
        endRow = parseInt(args[0].substring(1));
    }
    let num = 0;

    for (let row = startRow; row <= endRow; row++) {
        for (let col = startCol; col <= endCol; col++) {
            getInputCell(col, row).value = num;
            num++;
        }
    }
    exitCommandMode();
}

function trans(args) {
    if (isVisual) {
        //TODO
        let startCol = selectionStartCellCol;
        let startRow = selectionStartCellRow;

        copyToClipboard();
        deleteSelection();
        let tClip = transpose(clipboard);
        for (let col = startCol; col < startCol + tClip.at(0).length; col++) {
            for (let row = startRow; row < startRow + tClip.length; row++) {
                let clipValue = tClip.at(row - startRow).at(col - startCol);
                getInputCell(col, row).value = clipValue;
            }
        }
        isVisual = false;
        changeCurrent(selectionStartCellCol, startRow);
        exitCommandMode();
    } else {
        commandError('visual mode required for transpose');
    }
}

function addToGrid(args) {
    let type = args[0];
    let n = parseInt(args[1]);
    if (type === 'col') {
        let col_header = document.getElementById('col_heads');
        for (let i = maxCols; i < maxCols + n; i++) {
            const ch = document.createElement("th");
            ch.className = 'col-header';
            ch.innerHTML = colNum2Label(i);
            col_header.appendChild(ch);
        }
        for (let i = 0; i < maxRows; i++) {
            let row = document.getElementById(i + '_row');

            for (let j = maxCols; j < maxCols + n; j++) {
                let cell = row.insertCell(-1);
                cell.id = colNum2Label(j) + i;
                cell.className = 'grid-cell';
                let cellInput = document.createElement('input');
                cellInput.id = colNum2Label(j) + i + '_input';
                cellInput.setAttribute('type', 'text');
                cellInput.setAttribute('disabled', '');
                cellInput.className = 'cell-input';
                cell.appendChild(cellInput);
            }
        }
        maxCols += n;
    } else {
        for (let i = maxRows; i < maxRows + n; i++) {
            let row = grid.insertRow(-1);
            row.id = i + '_row';
            let row_header = document.createElement("th");
            row_header.innerHTML = i;
            row_header.className = 'row-header';
            row.appendChild(row_header);
            for (let j = 0; j < maxCols; j++) {
                let cell = row.insertCell(-1);
                cell.id = colNum2Label(j) + i;
                cell.className = 'grid-cell';
                let cellInput = document.createElement('input');
                cellInput.id = colNum2Label(j) + i + '_input';
                cellInput.setAttribute('type', 'text');
                cellInput.setAttribute('disabled', '');
                cellInput.className = 'cell-input';
                cell.appendChild(cellInput);
            }
        }
        maxRows += n;
    }
    exitCommandMode();
}

export var commandMap = { 'trans': trans, 'fill': fill, 'center': center, 'bold': bold, 'add': addToGrid};
function parseCommand() {
    let scomm = commandBuffer.split(' ');
    return { name: scomm.at(0), args: scomm.slice(1) };
}

export function modeCommand(ev) {
    if (ev.key === 'Escape') {
        mode = 'NORMAL';
        commandBuffer = '';
    } else if (ev.key === 'Enter') {
        //command completed, now parse it
        //TODO: use a regex table for commands and their handler functions?
        let comm = parseCommand();
        if (commandMap[comm.name] !== undefined) {
            commandMap[comm.name](comm.args);
        } else if (isLetter((commandBuffer.charAt(0).toString()))) {
            //COMMAND IS GOTO CELL EX: (:A0)
            let newCord = parseCordinate(commandBuffer);
            if ((newCord.col < maxCols) && (newCord.row < maxRows)) {
                changeCurrent(newCord.col, newCord.row);
                if (isVisual) {
                    addSelected(newCord.col, newCord.row);
                }
            }
            exitCommandMode();
        }
    } else if (ev.key === 'Backspace') {
        commandBuffer = commandBuffer.slice(0, -1);
    } else if (/^[a-z0-9 ]$/i.test(ev.key)) {
        commandBuffer += ev.key;
    }
}