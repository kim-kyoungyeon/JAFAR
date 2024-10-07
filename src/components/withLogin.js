import React, { useState } from "react";
import BlurredLoginModal from "./BlurredLoginModal";

const withLogin = (WrappedComponent) => {
  return (props) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [username, setUsername] = useState("");

    const handleLoginClick = () => {
      setShowLoginModal(true);
    };

    const handleLoginSuccess = (loggedInUsername) => {
      setIsLoggedIn(true);
      setShowLoginModal(false);
      setUsername(loggedInUsername);
    };

    const handleCloseModal = () => {
      setShowLoginModal(false);
    };

    return (
      <div>
        <WrappedComponent
          {...props}
          isLoggedIn={isLoggedIn}
          username={username}
          handleLoginClick={handleLoginClick}
          handleLoginSuccess={handleLoginSuccess}
          handleCloseModal={handleCloseModal}
        />
        {showLoginModal && (
          <BlurredLoginModal
            onLoginSuccess={handleLoginSuccess}
            onClose={handleCloseModal}
          />
        )}
      </div>
    );
  };
};

export default withLogin;
