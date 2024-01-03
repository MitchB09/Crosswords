import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import "./App.css";
import { useAuth } from "./auth/hooks";
import Board from "./components/board";
import Header from "./components/header";
import List from "./components/list";
import Login from "./components/login";
import SnackbarProvider from "./components/snackbar/SnackbarProvider";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <SnackbarProvider>
          <div className="App">
            <Header />
            <div className="App-header">
              <Routes>
                {user ? (
                  <>
                    <Route path="/login" element={<Login />} />
                    <Route path="/home" element={<List />} />
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
      </LocalizationProvider>
    </Router>
  );
}

export default App;
