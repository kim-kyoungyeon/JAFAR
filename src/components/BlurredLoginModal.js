import React from "react";
import "../styles/BlurredLoginModal.css";

export default function BlurredLoginModal({ onClose }) {
  const handleOAuthLogin = (provider) => {
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const popup = window.open(
      `/oauth2/authorization/${provider}`, // 프록시를 통해 요청
      `${provider} Login`,
      `width=${width},height=${height},left=${left},top=${top}`
    );

    const checkPopup = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkPopup);
        onClose();
        window.location.reload();
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
