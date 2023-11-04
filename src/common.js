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
    if (isVisual) {
        clipboard = Selection.values();
    } else {
        clipboard.push([Current.value]);
    }
}

const colNames = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function colLabel2Num(label){
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

function colNum2Label(col){
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

function updateStatusBar() {
    if (isVisual) {
        document.getElementById('status_current_cell').innerHTML = Selection.start+':'+Selection.end;
    } else if (mode === 'NORMAL') {
        document.getElementById('status_current_cell').innerHTML = Current.label;
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

function parseCordinate(cord){
    let regex = /([a-zA-Z]+)(\d+)/;
    let result = cord.match(regex).slice(1);
    return {col: colLabel2Num(result[0].toUpperCase()), row: parseInt(result[1])};
}

function getInputCell(col, row){
    return document.getElementById(colNum2Label(col) + row+'_input')
}