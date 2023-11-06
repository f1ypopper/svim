import { parse, Executor } from "./formulaengine.js";

function bold(args) {
  if (isVisual) {
    Selection.map(function (cell) {
      cell.elem.style.fontWeight = "bold";
    });
  } else {
    Current.elem.style.fontWeight = "bold";
  }

  exitCommandMode();
}
function center(args) {
  if (isVisual) {
    Selection.map(function (cell) {
      cell.elem.style.textAlign = "center";
    });
  } else {
    Current.elem.style.textAlign = "center";
  }
  exitCommandMode();
}
function exitCommandMode() {
  commandBuffer = "";
  mode = "NORMAL";
}
function fill(args) {
  //TODO: Start from the number in the startCell
  let num = 0;
  if (isVisual) {
    Selection.map(function (cell) {
      cell.value = num;
      num++;
    });
  }
  exitCommandMode();
}

function addToGrid(args) {
  let type = args[0];
  let n = parseInt(args[1]);
  if (type === "col") {
    extendCol(n);
  } else {
    extendRow(n);
  }
  exitCommandMode();
}

export var commandMap = {
  fill: fill,
  center: center,
  bold: bold,
  add: addToGrid,
};
function parseCommand() {
  let scomm = commandBuffer.split(" ");
  return { name: scomm.at(0), args: scomm.slice(1) };
}

export function modeCommand(ev) {
  if (ev.key === "Escape") {
    mode = "NORMAL";
    commandBuffer = "";
  } else if (ev.key === "Enter") {
    //command completed, now parse it
    //TODO: use a regex table for commands and their handler functions?
    let comm = parseCommand();
    if (commandMap[comm.name] !== undefined) {
      commandMap[comm.name](comm.args);
    } else if (isLetter(commandBuffer.charAt(0).toString())) {
      //COMMAND IS GOTO CELL EX: (:A0)
      let newCord = parseCordinate(commandBuffer);
      if (newCord.col < maxCols && newCord.row < maxRows) {
        Current.update(newCord.row, newCord.col);
      }
      exitCommandMode();
    }
  } else if (ev.key === "Backspace") {
    commandBuffer = commandBuffer.slice(0, -1);
  } else if (/^[a-z0-9 ]$/i.test(ev.key)) {
    commandBuffer += ev.key;
  }
}
