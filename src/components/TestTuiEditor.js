import React, { useState } from "react";
import ImageEditor from "@toast-ui/react-image-editor";
import "tui-image-editor/dist/tui-image-editor.css";
import BlurredLoginModal from "./BlurredLoginModal";

const TestTuiEditor = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowLoginModal(false);
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
  };

  return (
    <div>
      <h1>JAFAR Image Editor Test</h1>
      {!isLoggedIn && (
        <button
          onClick={handleLoginClick}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
        >
          Login
        </button>
      )}
      {showLoginModal && (
        <BlurredLoginModal
          onLoginSuccess={handleLoginSuccess}
          onClose={handleCloseModal}
        />
      )}
      {isLoggedIn && (
        <ImageEditor
          includeUI={{
            menu: [
              "crop",
              "flip",
              "rotate",
              "draw",
              "shape",
              "icon",
              "text",
              "mask",
              "filter",
            ],
            initMenu: "filter",
            uiSize: {
              width: "1000px",
              height: "700px",
            },
            menuBarPosition: "bottom",
          }}
          cssMaxHeight={500}
          cssMaxWidth={700}
          selectionStyle={{
            cornerSize: 20,
            rotatingPointOffset: 70,
          }}
          usageStatistics={true}
        />
      )}
    </div>
  );
};

export default TestTuiEditor;
