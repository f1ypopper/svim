//GLOBALS
//All globals should be ONLY defined here

var Current = undefined;
var mode = "NORMAL"; //NORMAL, INSERT, (VISUAL)?, COMMAND
var modeHandler = {};

//COMMAND MODE
var commandBuffer = "";

//VISUAL MODE
var isVisual = false;
var Selection = undefined;

//TODO: use 2d Array
var clipboard = [];
var maxRows = 100;
var maxCols = 26;
var status_bar = document.getElementById("status");

//COMMAND BAR
let commandBar = document.getElementById("command-bar");

//FORMULA
let formulaTable = undefined;
