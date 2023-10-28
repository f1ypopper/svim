export function modeNormal(ev) {
    switch (ev.key) {
        case 'h': {
            //Right
            let newCol = Math.max(0, currentCell.col- 1);
            changeCurrent({col: newCol, row: currentCell.row});
            break;
        }
        case 'l': {
            //Left
            let newCol = Math.min(maxCols-1, currentCell.col+ 1);
            changeCurrent({col: newCol, row: currentCell.row});
            break;
        }
        case 'j': {
            //Down
            let newRow = Math.min(currentCell.row+ 1, maxRows - 1);
            changeCurrent({col: currentCell.col, row:newRow});
            break;
        }
        case 'k': {
            //Up
            let newRow = Math.max(currentCell.row - 1, 0);
            changeCurrent({col: currentCell.col, row:newRow});
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
            for (let row = currentCell.row; row < currentCell.row + clipboard.length; row++) {
                for (let col = currentCell.col; col < currentCell.col + clipboard.at(0).length; col++) {
                    let clipValue = clipboard.at(row - currentCell.row).at(col - currentCell.col);
                    getInputCell({col: col, row: row}).value = clipValue;
                }
            }
            break;
        }
        case 'i': {
            //Insert
            mode = 'INSERT';
            let currentElem = getCurrentCell();
            let cellInput = currentElem.children[0];
            if(currentCell in formulaTable){
                cellInput.value = formulaTable[currentCell].source;
                delete formulaTable[currentCell];
            }
            break;
        }
        case 'G': {
            //GOTO Last Cell
            changeCurrent({col: maxCols-1, row: maxRows - 1});
            break;
        }
        case 'g': {
            //GOTO Last Cell
            changeCurrent({col: 0, row: 0});
            break;
        }
        case ':': {
            mode = 'COMMAND';
            break;
        }
        case 'v': {
            isVisual = true;
            selectionStart = {...currentCell};
            break;
        }
        case 'Escape': {
            clearSelection();
            isVisual = false;
            break;
        }
    }
    if (isVisual) {
        addSelected(currentCell);
    }
}
