// src/App.js
import React from "react";
import "./styles/App.css";
import "./styles/BlurredLoginModal.css";
import ProtectedImageEditorWithHooks from "./components/ProtectedImageEditorWithHooks";

function App() {
  return (
    <div className="app-container">
      <div className="pattern-overlay"></div>
      <div className="radial-gradient-1"></div>
      <div className="radial-gradient-2"></div>
      <div className="content-container">
        <ProtectedImageEditorWithHooks />
      </div>
    </div>
  );
}

export default App;
