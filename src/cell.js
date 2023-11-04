export class Cell {
    constructor(row, col) {
        this.row = row;
        this.col = col;
    }

    get label() {
        return colNum2Label(this.col) + this.row;
    }

    get value() {
        return getInputCell(this.col, this.row).value;
    }

    set value(value) {
        getInputCell(this.col, this.row).value = value;
    }

    get elem(){
        return getInputCell(this.col, this.row);
    }

    clone() {
        return new Cell(this.row, this.col);
    }

    equals(other) {
        return this.row === other.row && this.col === other.col;
    }

    valueOf(){
        return colNum2Label(this.col)+this.row;
    }
}

export class CurrentCell extends Cell{
    constructor(row, col) {
        super(row, col);
    }

    moveLeft(){
        let newCol = Math.max(0, this.col- 1);
        this.updateCol(newCol);
    }

    moveRight(){
        let newCol = Math.min(maxCols-1, this.col+ 1);
        this.updateCol(newCol);
    }

    moveUp(){
        let newRow = Math.max(this.row - 1, 0);
        this.updateRow(newRow);
    }

    moveDown(){
        let newRow = Math.min(this.row + 1, maxRows - 1);
        this.updateRow(newRow);
    }

    updateRow(row){
        this.remove();
        this.row = row;
        this.show();
    }
    
    updateCol(col){
        this.remove();
        this.col = col;
        this.show();
    }

    update(row, col){
        this.remove();
        this.row = row;
        this.col = col;
        this.show();
    }

    remove(){
        this.elem.classList.remove('current-cell');
    }

    show(){
        this.elem.classList.add('current-cell');
        this.elem.scrollIntoView({ behavior: 'instant', block: 'center', inline: 'center' });
    }
    
}
function* SelectionIterator(start, end){
    let cell = new Cell(0, 0);
    for(let row = start.row; row <= end.row; row++){
        for(let col = start.col; col <= end.col; col++){
            cell.row = row;
            cell.col = col;
            yield cell;
        }
    }
    return null;
}

export class SelectionRange {
    constructor(start) {
        this.start = start.clone();
        this.end = start;
    }

    newSelection(start){
        this.start = start.clone();
        this.end = start;
    }

    map(fun){
        let iterator = this.iterate();
        for(const cell of iterator){
            fun(cell);
        }    
    }

    range(){
        let startrow = Math.min(this.start.row, this.end.row);
        let endrow = Math.max(this.start.row, this.end.row);
        let startcol = Math.min(this.start.col, this.end.col);
        let endcol = Math.max(this.start.col, this.end.col);
        return {start: new Cell(startrow, startcol), end: new Cell(endrow, endcol)};
    }

    get nrows(){
        return Math.abs(this.start.row - this.end.row)+1;
    }

    get ncols(){
        return Math.abs(this.start.col - this.end.col)+1;
    }

    iterate(){
        let range = this.range();
        let it = SelectionIterator(range.start, range.end);
        return it;
    }

    clear(){
        this.map(function(cell){
            cell.elem.classList.remove('visual-selected-cell');
        });
    }

    show(){
        this.map(function(cell){
            cell.elem.classList.add('visual-selected-cell');
        });
    }

    values(){
        let range = this.range();
        let _values = [];
        for(let row = range.start.row; row <= range.end.row; row++){
            let _row = [];
            for(let col = range.start.col; col <= range.end.col; col++){
                _row.push(getInputCell(col, row).value);
            }
            _values.push(_row);
        }
        return _values;
    }

    delete(){
        this.map(function(cell){
            cell.value = '';
        });
    }
}

