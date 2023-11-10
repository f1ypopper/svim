# svim - spreadsheet vim

svim: A spreadsheet with vim bindings.

## Features

- Motion with standard with vim motion keys: h, j, k, l
- Visual mode
- Command mode
- Formulas
- Import/Export CSV files

## how to svim

### svimming around

basic up, down, left and right movement can be performed with keys: hjkl.
- y:  copy a cell value
- x:  cut a cell value
- p:  paste a cell value
- G:  goto first cell of grid
- g:  goto last cell of grid

### normal mode
the default mode present, to return to normal from any other mode press Escape

### visual mode
visual mode can be entered with v and selection can be done using standard motion

### insert mode
data can be inserted using i and escape to return back to normal mode

### command mode
command mode starts by colon(:) followed by the command and the arguments, if any
some commands also work with a selection

#### current commands
- align - align text inside a cell.
- bold - makes the text inside a cell bold.
- fill - fills the n selected cells with numbers from 0 to n.
- add [row|col] [n] - extends sheet with n cols or rows.
- export [file_name] - exports the current sheet as a CSV file.
- [cell_cord] - teleports to the given cell.

## svim source code

All code currently lies in the src/ directory

| File name        | Description                     |
| ---------------- | ------------------------------- |
| cell.js          | cell class                      |
| globals.js       | all global variables            |
| init.js          | initialize grid & etc           |
| formulaengine.js | formula executor                |
| ftable.js        | handles formula cells           |
| normal.js        | normal mode handler             |
| command.js       | command mode handler            |
| insert.js        | insert mode handler             |
| common.js        | common functions (global scope) |
| styles.css       | css for the whole site          |

## todo

all todo lies in the todo.txt
