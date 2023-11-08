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
const downloadFile = function (text, fileName) {
  const link = document.createElement("a");
  link.setAttribute(
    "href",
    `data:text/csv;charset=utf-8,${encodeURIComponent(text)}`
  );
  link.setAttribute("download", fileName);

  link.style.display = "none";
  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
};

const exportCSV = function (args) {
  //Get the min row and col which are not empty
  let fileName = args[0]+'.csv';
  let data = "";
  for (let row = 0; row < maxRows; row++) {
    let rowText = "";
    for (let col = 0; col < maxCols; col++) {
      rowText += getInputCell(col, row).value;
      if(col+1 < maxCols){
        rowText+=',';
      }
    }
    data += rowText;
    if(row+1 < maxRows){
      data+='\n';
    }
  }
  downloadFile(data, fileName);
};

export var commandMap = {
  fill: fill,
  center: center,
  bold: bold,
  add: addToGrid,
  export: exportCSV,
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
