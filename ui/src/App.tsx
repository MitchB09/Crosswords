import React, { useState } from "react";
import "./App.css";
import Board from "./board";

function App() {

  return (
    <div className="App">
      <div className="App-header">
        <Board id={1} />
      </div>
    </div>
  );
}

export default App;
