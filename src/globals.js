//GLOBALS
//All globals should be ONLY defined here

var currentRow = 0;
var currentCol = 0;
var mode = 'NORMAL';//NORMAL, INSERT, (VISUAL)?, COMMAND
var modeHandler = {};

//COMMAND MODE
var commandBuffer = '';
//var commandMap = { 'trans': trans, 'fill': fill, 'center': center, 'bold': bold };

//VISUAL MODE
var isVisual = false;
var selectionBuffer = []; //used by visual mode to store selected cells(['A1','Z10',...])
var selectionStartCellCol = 0; //cell from where selection has started
var selectionStartCellRow = 0; //cell from where selection has started
var selectionEndCellCol = 0; //cell from where selection has ended
var selectionEndCellRow = 0; //cell from where selection has ended

//TODO: use 2d Array 
var clipboard = [];
var maxRows = 100;
var maxCols = 26;
var status_bar = document.getElementById('status');
//TODO: use integer for columns as well; use (maybe) dict for mappings to alphabet
const colNames = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

//COMMAND BAR
let commandBar = document.getElementById('command-bar');


//FORMULA
let depTable = {};
let formulaTable = {};