import { parse, Executor } from './formulaengine.js';

function handleFormula() {
    let inputCell = getInputCell(currentCol, currentRow);
    let source = inputCell.value;
    let formula = parse(source.substring(1));
    for (const dep of formula.deps) {
        if (!(dep in depTable)) {
            depTable[dep] = new Set();
        }
        depTable[dep].add({ col: colNum2Label(currentCol), row: currentRow });
    }
    formulaTable[colNum2Label(currentCol) + currentRow] = { expr: formula.expr, source: source };
    let executor = new Executor(formula.expr);
    inputCell.value = executor.execute();
}

function reExec(col, row) {
    let formula = formulaTable[col + row];
    let executor = new Executor(formula.expr);
    getInputCell(colLabel2Num(col), row).value = executor.execute();
}

function reExecDeps(col, row) {
    //Maybe switch to a queue?
    console.log(col, row);
    if (colNum2Label(col) + row in depTable) {
    for (const dep of depTable[colNum2Label(col) + row].values()) {
            reExec(dep.col, dep.row);
            reExecDeps(colLabel2Num(dep.col), dep.row);
        }
    }
}

export function modeInsert(ev) {
    if (ev.key === 'Escape') {
        let value = Current.value;
        if (value.startsWith("=")) {
            //handleFormula();
        }
        //reExecDeps(currentCol, currentRow);
        mode = 'NORMAL';
        Current.elem.setAttribute('disabled', '');
    } else {
        Current.elem.removeAttribute('disabled');
        Current.elem.focus();
    }
}