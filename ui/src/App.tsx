import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { useAuth } from "./auth/hooks";
import Board from "./components/board";
import Header from "./components/header";
import List from "./components/list";
import Login from "./components/login";
import SnackbarProvider from "./components/snackbar/SnackbarProvider";

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <SnackbarProvider>
        <div className="App">
          <Header />
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
      </SnackbarProvider>
    </Router>
  );
}

export default App;
