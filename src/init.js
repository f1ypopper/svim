import { modeCommand } from "./command.js";
import { modeNormal } from "./normal.js";
import { modeInsert } from "./insert.js";
import { CurrentCell, SelectionRange } from "./cell.js";

function handleKeyEv(ev) {
  if (ev.key === " " && ev.target.tagName === "BODY") {
    ev.preventDefault();
  }
  if(isVisual){
    Selection.clear();
  }
  modeHandler[mode](ev);
  updateStatusBar();
  updateCommandBar();

  if(isVisual){
    Selection.show();
  }
}

function initGrid() {
  var grid = document.getElementById("grid");
  //Column Name Header
  const col_header = document.createElement("tr");
  col_header.id = "col_heads";
  const c = document.createElement("th");
  c.className = "row-header";
  col_header.appendChild(c);
  for (let i = 0; i < maxCols; i++) {
    const c = document.createElement("th");
    c.innerHTML = colNum2Label(i);
    c.className = "col-header";
    col_header.appendChild(c);
  }
  grid.appendChild(col_header);

  for (let i = 0; i < maxRows; i++) {
    let row = grid.insertRow(-1);
    row.id = i + "_row";
    let row_header = document.createElement("th");
    row_header.innerHTML = i;
    row_header.className = "row-header";
    row.appendChild(row_header);
    for (let j = 0; j < maxCols; j++) {
      let cell = row.insertCell(-1);
      cell.id = colNum2Label(j) + i;
      cell.className = "grid-cell";
      let cellInput = document.createElement("input");
      cellInput.id = colNum2Label(j) + i + "_input";
      cellInput.setAttribute("type", "text");
      cellInput.setAttribute("disabled", "");
      cellInput.className = "cell-input";
      cell.appendChild(cellInput);
    }
  }
}

function registerCallbacks() {
  modeHandler["COMMAND"] = modeCommand;
  modeHandler["NORMAL"] = modeNormal;
  modeHandler["INSERT"] = modeInsert;
}

export function setup() {
  initGrid();
  Current = new CurrentCell(0, 0);
  Selection = new SelectionRange(Current);
  Current.show();
  registerCallbacks();
  updateStatusBar();
  window.addEventListener("keydown", handleKeyEv);
  document.scrollTo(0, 0);
}

setup();
