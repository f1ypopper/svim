import Grid from './grid.js';
import StatusBar from './statusbar.js';
import { useEffect, useState } from 'react';

function handleKeyPress1(evt, commandHandler){
  console.log(evt);
  if(evt.key === ':'){
    //VIM COMMAND MODE
    window.setMode("COMMAND");
    window.setStatusText("COMMAND");
  }else if(evt.key === 'Escape'){
    window.setMode("NORMAL");
    window.setStatusText("NORMAL");
  }
}

function App() {
  const [status_text, setStatusText] = useState('NORMAL');
  const [mode, setMode] = useState('NORMAL');
  window.setMode = setMode;
  window.setStatusText = setStatusText;
  window.addEventListener("keydown",handleKeyPress1);
  return (
    <>
      <Grid></Grid>
      <StatusBar text={status_text}></StatusBar>
    </>
  );
}

export default App;
