import {parse, Executor} from './formulaengine.js';

function handleFormula(){
    let inputCell = getInputCell(currentCol, currentRow);
    let source = inputCell.value;
    let formula = parse(source.substring(1));
    for (const dep of formula.deps){
        if(!(dep in depTable)){
            depTable[dep] = new Set();
        }
        depTable[dep].add({col: convertColNum(currentCol), row: currentRow});
    }
    formulaTable[convertColNum(currentCol)+currentRow] = {expr: formula.expr, source: source};
    let executor = new Executor(formula.expr);
    inputCell.value = executor.execute();
}

function reExec(col, row){
    let formula = formulaTable[col+row];
    let executor = new Executor(formula.expr);
    getInputCell(convertColLabel(col), row).value = executor.execute();
}
export function modeInsert(ev) {
    let currentElem = getCurrentCell();
    let cellInput = currentElem.children[0];
    if (ev.key === 'Escape') {
        let value = cellInput.value;
        if(value.startsWith("=")){
            handleFormula();
        }
        if(convertColNum(currentCol)+currentRow in depTable){
            for(const dep of depTable[convertColNum(currentCol)+currentRow].values()){
                console.log('hi');
                reExec(dep.col, dep.row);
            }
        }
        mode = 'NORMAL';
        cellInput.setAttribute('disabled', '');
    } else {
        cellInput.removeAttribute('disabled');
        cellInput.focus();
    }
}