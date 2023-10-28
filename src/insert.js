import { parse, Executor } from './formulaengine.js';

function handleFormula(cell) {
    let inputCell = getInputCell(cell);
    let source = inputCell.value;
    let formula = parse(source.substring(1));
    for (const dep of formula.deps) {
        if (!(dep in depTable)) {
            depTable[dep] = new Set();
        }
        depTable[dep].add({ col: col, row: row });
    }
    formulaTable[cell] = { expr: formula.expr, source: source };
    let executor = new Executor(formula.expr);
    inputCell.value = executor.execute();
}

function reExec(cell) {
    let formula = formulaTable[cell];
    let executor = new Executor(formula.expr);
    getInputCell(cell).value = executor.execute();
}

function reExecDeps(cell) {
    //Maybe switch to a queue?
    if (cell in depTable) {
        for (const dep of depTable[cell].values()) {
            reExec(dep);
            reExecDeps(dep);
        }
    }
}

export function modeInsert(ev) {
    let cellInput = getInputCell(currentCell);

    if (ev.key === 'Escape') {
        let value = cellInput.value;
        if (value.startsWith("=")) {
            handleFormula(current);
        }
        reExecDeps(currentCell);
        mode = 'NORMAL';
        cellInput.setAttribute('disabled', '');
    } else {
        cellInput.removeAttribute('disabled');
        cellInput.focus();

    }
}