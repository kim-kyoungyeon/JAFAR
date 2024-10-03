import "./styles/App.css";
import "./styles/BlurredLoginModal.css";
import TestTuiEditor from "./components/TestTuiEditor";
import BlurredLoginModal from "./components/BlurredLoginModal";
import React, { useState } from "react";
function App() {
  return (
    <div className="app-container">
      <div className="pattern-overlay"></div>
      <div className="radial-gradient-1"></div>
      <div className="radial-gradient-2"></div>
      <div className="content-container">
        <TestTuiEditor />
      </div>
    </div>
  );
}

export default App;
