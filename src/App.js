import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./styles/App.css";
import "./styles/BlurredLoginModal.css";
import TestTuiEditor from "./components/TestTuiEditor";
import S3ImageCRUD from "./services/S3ImageCRUD";
import BlurredLoginModal from "./components/BlurredLoginModal";
import OAuthCallback from "./components/OAuthCallback";
import Logo from "./components/Logo";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const handleAuthMessage = (event) => {
      if (event.origin !== "http://43.203.233.134:3000") return;
      
      if (event.data.type === 'AUTH_SUCCESS') {
        setIsLoggedIn(true);
        // You might want to fetch the username from your backend here
        setUsername("User"); // Placeholder username
        setShowLoginModal(false);
      }
    };

    window.addEventListener('message', handleAuthMessage);

    return () => {
      window.removeEventListener('message', handleAuthMessage);
    };
  }, []);

  const handleOpenLoginModal = () => setShowLoginModal(true);
  const handleCloseLoginModal = () => setShowLoginModal(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    document.cookie = 'auth_token=; path=/; domain=43.203.233.134; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  };

  return (
    <Router>
      <div className="app-container">
        <div className="pattern-overlay"></div>
        <div className="radial-gradient-1"></div>
        <div className="radial-gradient-2"></div>
        <div className="content-container">
          <header className="app-header">
            <Logo className="app-logo" />
            {isLoggedIn ? (
              <>
                <span>Welcome, {username}!</span>
                <button onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <button onClick={handleOpenLoginModal}>Login</button>
            )}
          </header>
          <Routes>
            <Route path="/" element={<TestTuiEditor />} />
            <Route path="/login/oauth2/code/naver" element={<OAuthCallback />} />
          </Routes>
        </div>
      </div>
      {showLoginModal && (
        <BlurredLoginModal
          onClose={handleCloseLoginModal}
        />
      )}
    </Router>
  );
}

export default App;