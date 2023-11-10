# svim - spreadsheet vim

svim: A spreadsheet with vim bindings.

## Features

- Motion with standard with vim motion keys: h, j, k, l
- Visual mode
- Command mode
- Formulas
- Import/Export CSV files

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
