import React from "react";
import "../styles/BlurredLoginModal.css";
import useAuth from "../utils/useAuth";

export default function BlurredLoginModal({ onClose, onLoginSuccess }) {
  const { login } = useAuth();

  const handleOAuthLogin = (provider) => {
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const popup = window.open(
      `/oauth2/authorization/${provider}`,
      `${provider} Login`,
      `width=${width},height=${height},left=${left},top=${top}`
    );

    const checkPopup = setInterval(async () => {
      if (popup.closed) {
        clearInterval(checkPopup);
        try {
          await login();
          if (typeof onLoginSuccess === "function") {
            onLoginSuccess();
          }
        } catch (error) {
          console.error(error);
        }
        onClose();
      }
    }, 1000);
  };
  return (
    <div className="modal-overlay">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">소셜 로그인</h2>
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
