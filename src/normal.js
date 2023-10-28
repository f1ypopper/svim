export function modeNormal(ev) {
    switch (ev.key) {
        case 'h': {
            //Right
            let newCol = Math.max(0, currentCol- 1);
            changeCurrent(newCol, currentRow);
            break;
        }
        case 'l': {
            //Left
            let newCol = Math.min(maxCols-1, currentCol+ 1);
            changeCurrent(newCol, currentRow);
            break;
        }
        case 'j': {
            //Down
            let newRow = Math.min(currentRow + 1, maxRows - 1);
            changeCurrent(currentCol, newRow);
            break;
        }
        case 'k': {
            //Up
            let newRow = Math.max(currentRow - 1, 0);
            changeCurrent(currentCol, newRow);
            break;
        }
        case 'x': {
            //Copy the entry to selection and Delete 
            copyToClipboard();
            deleteSelection();
            clearSelection();
            isVisual = false;
            //inputCell.value = ''; ?
            break;
        }
        case 'y': {
            //Copy the entry to selection
            copyToClipboard();
            clearSelection();
            isVisual = false;
            break;
        }
        case 'p': {
            //TODO: What if a value already exists?
            for (let row = currentRow; row < currentRow + clipboard.length; row++) {
                for (let col = currentCol; col < currentCol + clipboard.at(0).length; col++) {
                    let clipValue = clipboard.at(row - currentRow).at(col - currentCol);
                    getInputCell(col, row).value = clipValue;
                }
            }
            break;
        }
        case 'i': {
            //Insert
            mode = 'INSERT';
            let currentElem = getCurrentCell();
            let cellInput = currentElem.children[0];
            if(colNum2Label(currentCol)+currentRow in formulaTable){
                cellInput.value = formulaTable[colNum2Label(currentCol)+currentRow].source;
                delete formulaTable[colNum2Label(currentCol)+currentRow];
            }
            break;
        }
        case 'G': {
            //GOTO Last Cell
            changeCurrent(maxCols-1, maxRows - 1);
            break;
        }
        case 'g': {
            //GOTO Last Cell
            changeCurrent(0, 0);
            break;
        }
        case ':': {
            mode = 'COMMAND';
            break;
        }
        case 'v': {
            isVisual = true;
            selectionStartCellCol = currentCol;
            selectionStartCellRow = currentRow;
            addSelected(currentCol, currentRow);
            break;
        }
        case 'Escape': {
            clearSelection();
            isVisual = false;
            break;
        }
    }
    if (isVisual) {
        addSelected(currentCol, currentRow);
    }
}
