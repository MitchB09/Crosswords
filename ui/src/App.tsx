import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { useAuth, useUser } from "./auth/hooks";
import Board from "./components/board";
import List from "./components/list";
import Login from "./components/login";

function App() {
  const { user } = useAuth();
  
  useEffect(() => {
    console.dir(user?.getUsername())
  }, [user])

  return (
    <Router>
      <div className="App">
        <div className="App-header">
          <Routes>
            {user ? (
              <>
                <Route path="/login" element={<Login />} />
                <Route path="/:id" element={<Board />} />
                <Route path="/" element={<List />} />
              </>
            ) : (
              <>
                <Route path="/login" element={<Login />} />
                <Route path="/:id" element={<Board />} />
                <Route path="/" element={<Login />} />
              </>
            )}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
