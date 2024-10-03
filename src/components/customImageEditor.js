import React, { useState } from "react";
import ImageEditor from "@toast-ui/react-image-editor";
import BlurredLoginModal from "./BlurredLoginModal";

const CustomImageEditor = () => {
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

  return (
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
  );
};

export default CustomImageEditor;
