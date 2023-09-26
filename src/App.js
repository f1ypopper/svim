import Grid from './grid.js';
import StatusBar from './statusbar.js';
import { useEffect, useState } from 'react';

function App() {
  const [status_text, setStatusText] = useState('NORMAL');
  const [mode, setMode] = useState('NORMAL');
  const [selectedCol, setSelectedCol] = useState('A');
  const [selectedRow, setSelectedRow] = useState(0);
  function handleKeyPress(evt){
    if (evt.isComposing || evt.keyCode === 229)  return; 
    let key = evt.key;
    //Movement Keys
    if(key === 'l'){
      //Right
      setSelectedCol(String.fromCharCode(selectedCol.charCodeAt(0)+1));
    }else if(key === 'h'){
      //Left
      setSelectedCol(String.fromCharCode(selectedCol.charCodeAt(0)-1));
    }else if(key === 'j'){
      //Down
      setSelectedRow(selectedRow+1);
    }else if(key === 'k'){
      //Down
      setSelectedRow(selectedRow-1);
    }
    window.removeEventListener("keydown",handleKeyPress);
  }
  window.addEventListener("keydown",handleKeyPress);
  return (
    <>
      <Grid selected={selectedCol+selectedRow}></Grid>
      <StatusBar text={status_text}></StatusBar>
    </>
  );
}

export default App;
