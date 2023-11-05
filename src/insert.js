import { parse, Executor } from "./formulaengine.js";

function executeFormula(cell) {
  if (formulaTable.isFormula(cell)) {
    let formula = formulaTable.getFormula(cell);
    let exec = new Executor(formula.expr);
    cell.value = exec.execute();
  }
}

function handleFormula(cell) {
  let source = cell.value.substring(1);
  let formula = parse(source);
  formulaTable.addFormula(cell, formula);
  executeFormula(cell);
}

function reExecDeps(cell) {
  if (formulaTable.isDependency(cell)) {
    let dependees = formulaTable.getDeps(cell);
    for (const d of dependees) {
      executeFormula(d);
      reExecDeps(d);
    }
  }
}

export function modeInsert(ev) {
  if (ev.key === "Escape") {
    let value = Current.value;
    if (value.startsWith("=")) {
      handleFormula(Current);
    }
    reExecDeps(Current);
    mode = "NORMAL";
    Current.elem.setAttribute("disabled", "");
  } else {
    Current.elem.removeAttribute("disabled");
    Current.elem.focus();
  }
}
