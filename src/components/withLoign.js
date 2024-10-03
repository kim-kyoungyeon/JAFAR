import React, { useState } from "react";
import BlurredLoginModal from "./BlurredLoginModal";

const withLogin = (WrappedComponent) => {
  return (props) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const handleLoginSuccess = () => {
      setIsLoggedIn(true);
      setShowLoginModal(false);
    };

    if (!isLoggedIn) {
      return (
        <div>
          <button onClick={() => setShowLoginModal(true)}>Login</button>
          {showLoginModal && (
            <BlurredLoginModal
              onLoginSuccess={handleLoginSuccess}
              onClose={() => setShowLoginModal(false)}
            />
          )}
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

export default withLogin;
