import React, { useState, useRef, useEffect } from "react";
import ImageEditor from "@toast-ui/react-image-editor";
import "tui-image-editor/dist/tui-image-editor.css";
import useAuth from "../utils/useAuth";
import "../styles/editor.css";
import BlurredLoginModal from "../components/BlurredLoginModal";
import axiosInstance from "../utils/axiosConfig";
import Logo from '../components/Logo';

const FASTAPI_URL = "";


const TestTuiEditor = () => {
  const { isLoggedIn, username, handleLoginSuccess, logout, checkAuthStatus } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const editorRef = useRef(null);
  const [editorInstance, setEditorInstance] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [recommendedImages, setRecommendedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

   useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 3;
    
    const initializeEditor = async () => {
      if (editorRef.current && isMounted) {
        try {
          const instance = editorRef.current.getInstance();
          setEditorInstance(instance);
          
          // Wait for the editor instance to fully load
          await new Promise((resolve) => setTimeout(resolve, 500));

          await instance.loadImageFromURL(
            "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
            "blank"
          );
          console.log("Editor initialized successfully");
        } catch (error) {
          console.error("Error initializing editor:", error);
          if (retryCount < maxRetries) {
            retryCount++;
            console.log(`Retrying initialization (${retryCount}/${maxRetries})...`);
            setTimeout(initializeEditor, 1000);
          }
        }
      }
    };
    initializeEditor();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleUpload = () => {
    const uploadInput = document.createElement("input");
    uploadInput.type = "file";
    uploadInput.accept = "image/*";
    uploadInput.onchange = (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        if (editorInstance) {
          editorInstance.loadImageFromURL(imageUrl, "uploaded");
        }
      };
      reader.readAsDataURL(file);
    };
    uploadInput.click();
  };

  const handleDownload = () => {
    if (editorInstance) {
      const dataURL = editorInstance.toDataURL();
      const link = document.createElement("a");
      link.download = "edited-image.png";
      link.href = dataURL;
      link.click();
    }
  };

  const handleGenerateImages = async () => {
    if (!prompt) {
      alert("프롬프트를 입력해주세요.");
      return;
    }
    setIsLoading(true);
    
    try {
      const response = await axiosInstance.post(
        `/api/generate-image`,
        { prompt },
        { responseType: 'arraybuffer' }
      );
      
      const blob = new Blob([response.data], { type: 'image/png' });
      const imageUrl = URL.createObjectURL(blob);
      
      setRecommendedImages([imageUrl]);
      
      // 생성된 이미지를 에디터에 로드
      if (editorInstance) {
        editorInstance.loadImageFromURL(imageUrl, "generated");
      }
    } catch (error) {
      console.error("Error generating image:", error);
      alert("이미지 생성 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    setShowLoginModal(true);
  };

  const handleCloseModal = async () => {
    setShowLoginModal(false);
    await checkAuthStatus();
  };

  return (
    <div className="editor-container">
      <div className="main-content">
        <header className="header">
          <Logo className="modal-logo" />
          <div className="header-buttons">
            <button onClick={handleUpload} disabled={!editorInstance}>
              Load
            </button>
            <button onClick={handleDownload} disabled={!editorInstance}>
              Download
            </button>
            <button>Save</button>
          </div>
           <div className="header-buttons">
            <button>내보내기</button>
            {isLoggedIn ? (
              <button onClick={logout}>Logout ({username})</button>
            ) : (
              <button onClick={handleLogin}>Login</button>
            )}
          </div>
        </header>
        <ImageEditor
          ref={editorRef}
          includeUI={{
            loadImage: {
              path: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
              name: "Blank",
            },
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
              width: "100%",
              height: "calc(100vh - 60px)",
            },
            menuBarPosition: "left",
          }}
          cssMaxHeight={500}
          cssMaxWidth={700}
          selectionStyle={{
            cornerSize: 20,
            rotatingPointOffset: 70,
          }}
          usageStatistics={true}
        />
      </div>
      <div className="right-sidebar">
        <h3>생성형 이미지 추천</h3>
        <p>사진과 유사한 생성형 이미지를 추천합니다.</p>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="프롬프트 입력"
        />
        <button onClick={handleGenerateImages} disabled={isLoading}>
          {isLoading ? "생성 중..." : "이미지 생성"}
        </button>
        {recommendedImages.map((image, index) => (
          <div key={index} className="image-preview">
            <img src={image} alt={`Generated image ${index + 1}`} />
          </div>
        ))}
      </div>
      {showLoginModal && (
        <BlurredLoginModal 
          onClose={handleCloseModal} 
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
};

export default TestTuiEditor;