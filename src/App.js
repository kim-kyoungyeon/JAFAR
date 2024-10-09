import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./styles/App.css";
import "./styles/BlurredLoginModal.css";
import TestTuiEditor from "./components/TestTuiEditor";
import S3ImageCRUD from "./services/S3ImageCRUD";

function App() {
  return (
    <Router>
      <div className="app-container">
        <div className="pattern-overlay"></div>
        <div className="radial-gradient-1"></div>
        <div className="radial-gradient-2"></div>
        <div className="content-container">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <TestTuiEditor />
                  <S3ImageCRUD />
                </>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;