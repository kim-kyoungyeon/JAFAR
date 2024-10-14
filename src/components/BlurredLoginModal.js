import React from "react";
import "../styles/BlurredLoginModal.css";
import { clearAllCookies } from "../utils/cookies";
import naverLoginButton from "../assets/naverLogin.png";

export default function BlurredLoginModal({ onClose }) {
  const handleOAuthLogin = (provider) => {
    clearAllCookies();
    const authUrl = `http://localhost:8080/oauth2/authorization/${provider}`;
    window.location.href = authUrl; 
  };

  return (
    <div className="modal-overlay">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">소셜 로그인</h2>
          <button onClick={onClose} className="close-button">x</button>
        </div>
        <div className="card-content">
          <button onClick={() => handleOAuthLogin("naver")} className="oauth-button naver">
            <img src={naverLoginButton} alt="Naver 로그인" className="naver-login-image" />
          </button>
        </div>
      </div>
    </div>
  );
}