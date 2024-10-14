import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./styles/App.css";
import "./styles/BlurredLoginModal.css";
import TestTuiEditor from "./components/TestTuiEditor";
import BlurredLoginModal from "./components/BlurredLoginModal";
import OAuthCallback from "./components/OAuthCallback";
import Logo from "./components/Logo";
import useAuth from "./hooks/useAuth";
import axios from 'axios';


function App() {
  const { email, isLoggedIn, handleLoginSuccess, handleLogout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);


  const handleOpenLoginModal = () => setShowLoginModal(true);
  const handleCloseLoginModal = () => setShowLoginModal(false);

  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('http://localhost:8080/user-info', {
          withCredentials: true
        });
        setUserInfo(response.data);
        handleLoginSuccess({
          email: response.data.email
        });
      } catch (err) {
        setError('Failed to fetch user info');
        console.error(err);
      }
    };

    fetchUserInfo();
  }, [handleLoginSuccess]);
  

  return (
    <Router>
      <div className="app-container">
        <div className="content-container">
          <header className="app-header" style={{paddingBottom: '10px', position: 'relative'}}>
            <Logo className="app-logo" />
            <div className="loginSection">
              {isLoggedIn ? (
                <>
                  <span className="welcomeMessage">{email}!</span>
                  <button className="styledButton logoutButton" onClick={handleLogout}>Logout</button>
                </>
              ) : (
                <button className="styledButton loginButton" onClick={handleOpenLoginModal}>Login</button>
              )}
            </div>
          </header>
          <Routes>
            <Route path="/" element={<TestTuiEditor />} />
            <Route 
              path="/login/oauth2/code/naver" 
              element={<OAuthCallback onLoginSuccess={handleLoginSuccess} />} 
            />
          </Routes>
        </div>
      </div>
      {showLoginModal && (
        <BlurredLoginModal
          onClose={handleCloseLoginModal}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </Router>
  );
}

export default App;