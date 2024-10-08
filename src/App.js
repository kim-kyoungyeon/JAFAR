import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./styles/App.css";
import "./styles/BlurredLoginModal.css";
import TestTuiEditor from "./components/TestTuiEditor";
import S3ImageCRUD from "./services/S3ImageCRUD";

// ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("accessToken");
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

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
