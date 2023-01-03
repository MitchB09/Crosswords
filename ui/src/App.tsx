import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./App.css";
import Board from "./components/board";
import List from "./components/list";

function App() {
  return (
    <Router>
      <div className="App">
        <div className="App-header">
          <Routes>
            <Route path="/:id" element={<Board />} />
            <Route path="/" element={<List />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
