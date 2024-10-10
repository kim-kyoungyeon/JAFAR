import React from "react";
import "../styles/BlurredLoginModal.css";
import { clearAllCookies } from "../utils/cookies";
import useAuth from "../utils/useAuth";
import Logo from "./Logo"; // Logo 컴포넌트를 import

export default function BlurredLoginModal({ onClose ,onLoginSuccess }) {
  const { login } = useAuth();

  const handleOAuthLogin = (provider) => {
    clearAllCookies();
 
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const authUrl = `http://3.39.251.48:8080/oauth2/authorization/${provider}`;

    const popup = window.open(
      authUrl,
      `${provider} Login`,
      `width=${width},height=${height},left=${left},top=${top}`
    );

    const checkPopup = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkPopup);
        // Check if the user is authenticated after the popup is closed
        checkAuthStatus();
      }
    }, 1000);
  };



 const checkAuthStatus = async () => {
    try {
      const response = await fetch('http://3.39.251.48:8080/api/check-auth', {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.isAuthenticated) {
        onLoginSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    }
  };
  return (
    <div className="modal-overlay">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">소셜 로그인</h2>
            <Logo className="modal-logo" width="84" height="10" />
        </div>
        <div className="card-content">
          <div className="oauth-buttons">
            <button
              onClick={() => handleOAuthLogin("naver")}
              className="oauth-button naver"
            >
              Naver로 로그인
            </button>
          </div>
        </div>
        <button onClick={onClose} className="close-button">
          Close
        </button>
      </div>
    </div>
  );
}