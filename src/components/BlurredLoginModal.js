import React from 'react';
import Logo from './Logo';

const BlurredLoginModal = ({ onClose }) => {
  const handleOAuthLogin = () => {
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    
    window.open(
      'http://3.39.251.48:8080/login',
      'OAuth Login',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    // Close the modal immediately after opening the new window
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <Logo className="modal-logo" />
        <h2>Login</h2>
        <button onClick={handleOAuthLogin}>Login with Naver</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default BlurredLoginModal;