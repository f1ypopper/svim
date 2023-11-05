export class FormulaTable {
  constructor() {
    this.fTable = {}; //dictionary of cells and their forumlas
    this.dTable = {}; //dictionary of cells and set of cells which depend on them
  }

  addFormula(cell, formula) {
    //TODO: if cell already exists, remove it from both tables
    let label = cell.label;
    this.fTable[label] = formula;
    for (const dep of formula.deps) {
      let depLabel = dep.label;
      if (!(depLabel in this.dTable)) {
        this.dTable[depLabel] = new Set();
      }
      this.dTable[depLabel].add(cell.clone());
    }
  }

  removeFormula(cell) {
    let label = cell.label;
    let deps = this.fTable[label].deps;
    for (const dep of deps) {
      let depLabel = dep.label;
      this.dTable[depLabel].remove(label);
    }
    delete this.fTable[label];
  }

  getFormula(cell) {
    let label = cell.label;
    return this.fTable[label];
  }

  isFormula(cell) {
    return cell.label in this.fTable;
  }

  isDependency(cell) {
    return cell.label in this.dTable;
  }

  getDeps(cell) {
    let depLabel = cell.label;
    return this.dTable[depLabel];
  }
}
