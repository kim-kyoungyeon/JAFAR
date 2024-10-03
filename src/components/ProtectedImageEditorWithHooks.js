import React from "react";
import useLogin from "../hooks/useLogin";
import BlurredLoginModal from "./BlurredLoginModal";
import TestTuiEditor from "./TestTuiEditor";

const ProtectedImageEditor = () => {
  const {
    isModalOpen,
    isLoggedIn,
    handleLoginClick,
    handleLoginSuccess,
    handleCloseModal,
  } = useLogin();

  return (
    <div style={{ position: "relative" }}>
      <h1>JAFAR Image Editor Test</h1>
      {!isLoggedIn && (
        <button
          onClick={handleLoginClick}
          className="button button-login"
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            zIndex: 1000,
          }}
        >
          Login
        </button>
      )}
      <TestTuiEditor isLoggedIn={isLoggedIn} />
      <BlurredLoginModal
        isOpen={isModalOpen}
        onLoginSuccess={handleLoginSuccess}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default ProtectedImageEditor;
