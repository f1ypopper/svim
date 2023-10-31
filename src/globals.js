//GLOBALS
//All globals should be ONLY defined here

var currentCell = {row: 0, col: 0};
var mode = 'NORMAL';//NORMAL, INSERT, (VISUAL)?, COMMAND
var modeHandler = {};

//COMMAND MODE
var commandBuffer = '';
var commandHasError = false;
//var commandMap = { 'trans': trans, 'fill': fill, 'center': center, 'bold': bold };

//VISUAL MODE
var isVisual = false;
var selectionBuffer = []; //used by visual mode to store selected cells(['A1','Z10',...])
var selectionStart = {row: 0, col: 0};
var selectionEnd = {row: 0, col: 0};

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