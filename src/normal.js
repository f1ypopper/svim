export function modeNormal(ev) {
  switch (ev.key) {
    case "h": {
      //Left
      Current.moveLeft();
      break;
    }
    case "l": {
      //Right
      Current.moveRight();
      break;
    }
    case "j": {
      //Down
      Current.moveDown();
      break;
    }
    case "k": {
      //Up
      Current.moveUp();
      break;
    }
    case "x": {
      //Copy the entry to selection and Delete
      copyToClipboard();
      if(isVisual){
        Selection.delete();
        Selection.clear();
        isVisual = false;
      }else{
        Current.value = '';
      }
      break;
    }
    case "y": {
      //Copy the entry to selection
      copyToClipboard();
      Selection.clear();
      isVisual = false;
      break;
    }
    case "p": {
      //TODO: What if a value already exists?
      for (let row = Current.row; row < Current.row + clipboard.length; row++) {
        for (
          let col = Current.col;
          col < Current.col + clipboard.at(0).length;
          col++
        ) {
          let clipValue = clipboard.at(row - Current.row).at(col - Current.col);
          getInputCell(col, row).value = clipValue;
        }
      }
      break;
    }
    case "i": {
      //Insert
      mode = "INSERT";
      break;
    }
    case "G": {
      //GOTO first Cell
      Current.update(maxRows - 1, maxCols - 1);
      break;
    }
    case "g": {
      //GOTO Last Cell
      Current.update(0, 0);
      break;
    }
    case ":": {
      mode = "COMMAND";
      break;
    }
    case "v": {
      isVisual = true;
      Selection.newSelection(Current);
      break;
    }
    case "Escape": {
      Selection.clear();
      isVisual = false;
      break;
    }
  }
}
