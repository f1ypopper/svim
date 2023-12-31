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
function align(args) {
  if (isVisual) {
    Selection.map(function (cell) {
      cell.elem.style.textAlign = args[0];
    });
  } else {
    Current.elem.style.textAlign = args[0];
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
  let fileName = args[0] + ".csv";
  let data = "";
  for (let row = 0; row < maxRows; row++) {
    let rowText = "";
    for (let col = 0; col < maxCols; col++) {
      rowText += getInputCell(col, row).value;
      if (col + 1 < maxCols) {
        rowText += ",";
      }
    }
    data += rowText;
    if (row + 1 < maxRows) {
      data += "\n";
    }
  }
  downloadFile(data, fileName);
};

function isDigit(c) {
  return c >= "0" && c <= "9";
}

function decodeSVF(source) {
  let flatArray = [];
  let len = source.length;
  let i = 0;
  let value = "";
  while (i < len) {
    let multiple = 0;
    if (isDigit(source[i])) {
      let start = i;
      while (isDigit(source[i])) {
        i++;
      }
      multiple = parseInt(source.substring(start, i));
    }
    if (source[i] === '"') {
      i++;
      let start = source[i];
      while (source[i] !== '"') {
        i++;
      }
      value = source.substring(start, i);
      i++;
    }
    while (multiple) {
      flatArray.push(value);
      multiple++;
    }
  }
  return flatArray;
}

function save(args) {
  let flatGrid = [];
  for (let i = 0; i < maxRows; i++) {
    for (let j = 0; j < maxCols; j++) {
      flatGrid.push(getInputCell(j, i).value);
    }
  }
  let i = 0;
  let len = flatGrid.length;
  let encoded = "";
  while (i < len) {
    let value = flatGrid[i];
    let count = 1;
    while (value === flatGrid[i + 1]) {
      count++;
      i++;
    }
    if (count > 1) {
      encoded += count;
    }
    if (value) {
      encoded += '"' + value + '"';
    } else {
      encoded += "E";
    }
    i++;
  }
  console.log(encoded);
  exitCommandMode();
}

function cellcolor(args) {
  let color = args[0];
  if (isVisual) {
    Selection.map(function (cell) {
      cell.elem.style.backgroundColor = color;
    });
  } else {
    Current.elem.style.backgroundColor = color;
  }
  exitCommandMode();
}

export var commandMap = {
  fill: fill,
  align: align,
  bold: bold,
  add: addToGrid,
  export: exportCSV,
  save: save,
  color: cellcolor,
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
