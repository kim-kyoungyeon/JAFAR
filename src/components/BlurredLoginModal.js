import {React, useEffect} from "react";
import "../styles/BlurredLoginModal.css";
import { clearAllCookies } from "../utils/cookies";
import naverLoginButton from "../assets/naverLogin.png";
import useAuth from "../utils/useAuth";


export default function BlurredLoginModal({ onClose, onLoginSuccess }) {
  const { handleLoginSuccess } = useAuth();

  const handleOAuthLogin = async (provider) => {
    clearAllCookies();
    const authUrl = `http://localhost:8080/oauth2/authorization/${provider}`;
    window.location.href = authUrl;
  };
  

  // 로그인 성공 시
  const handleSuccess = async () => {
    await handleLoginSuccess();
    onLoginSuccess();
    onClose();
    checkAuthStatus();
  };


  const checkAuthStatus = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/check-auth', {
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

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = await checkAuthStatus();
      if (isAuthenticated) {
        handleSuccess();
      }
    };
    checkAuth();
  }, []);

  return (
    <div className="modal-overlay">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">소셜 로그인</h2>
          <button 
          onClick={onClose} 
          className="close-button"
        >
          x
        </button>
        </div>
        <div className="card-content">
          <button
            onClick={() => handleOAuthLogin("naver")}
            className="oauth-button naver"
          >
            <img 
              src={naverLoginButton} 
              alt="Naver 로그인" 
              className="naver-login-image"
            />
          </button>
        </div>
      </div>
    </div>
  );
}