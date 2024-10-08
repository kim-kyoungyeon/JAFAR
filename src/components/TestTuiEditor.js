import React, { useState, useRef, useEffect } from "react";
import ImageEditor from "@toast-ui/react-image-editor";
import "tui-image-editor/dist/tui-image-editor.css";
import withLogin from "./withLogin";
import "../styles/editor.css";
import BlurredLoginModal from "../components/BlurredLoginModal";
import sampleLogo from "../styles/sampleLogo.jpg";
import axios from "axios"; // axios를 직접 import

const FASTAPI_URL = "http://3.35.166.17:8000"; // FastAPI 서버 주소

const TestTuiEditor = ({
  isLoggedIn,
  username,
  handleLogout,
  handleLoginSuccess,
}) => {
  const editorRef = useRef(null);
  const [editorInstance, setEditorInstance] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [recommendedImages, setRecommendedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    let timeoutId;
    const initializeEditor = () => {
      if (editorRef.current) {
        try {
          const instance = editorRef.current.getInstance();
          setEditorInstance(instance);
          console.log("Editor instance initialized:", instance);

          // 초기 이미지 로드
          instance
            .loadImageFromURL(
              "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
              "blank"
            )
            .then(() => console.log("Initial image loaded"))
            .catch((err) => console.error("Error loading initial image:", err));
        } catch (error) {
          console.error("Error initializing editor:", error);
          timeoutId = setTimeout(initializeEditor, 100);
        }
      } else {
        timeoutId = setTimeout(initializeEditor, 100);
      }
    };
    initializeEditor();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
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
          editorInstance
            .loadImageFromURL(imageUrl, "uploaded")
            .then(() => console.log("Image uploaded successfully"))
            .catch((err) => console.error("Error uploading image:", err));
        } else {
          console.error("Editor instance is not available");
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
    } else {
      console.error("Editor instance is not available");
    }
  };
  const handleGenerateImages = async () => {
    if (!prompt) {
      alert("프롬프트를 입력해주세요.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(`${FASTAPI_URL}/generate-images`, {
        prompt,
      });
      setRecommendedImages(response.data.images);
    } catch (error) {
      console.error("Error generating images:", error);
      alert("이미지 생성 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginClick = () => {
    setShowLoginModal(true); // 로그인 버튼 클릭 시 모달 표시
  };

  const handleCloseModal = () => {
    setShowLoginModal(false); // 모달 닫기
  };

  return (
    <div className="editor-container">
      <div className="main-content">
        <header className="header">
          <img src={sampleLogo} width="50px" alt="Sample Logo" />
          <div className="header-buttons">
            <button
              className="button"
              onClick={handleUpload}
              disabled={!editorInstance}
            >
              Load
            </button>
            <button
              className="button"
              onClick={handleDownload}
              disabled={!editorInstance}
            >
              Download
            </button>
            <button className="button">Save</button>
          </div>
          <div className="header-buttons">
            <button className="button">내보내기</button>
            {isLoggedIn ? (
              <button className="button" onClick={handleLogout}>
                Logout ({username})
              </button>
            ) : (
              <button className="button" onClick={handleLoginClick}>
                Login
              </button>
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
        <button
          className="button"
          onClick={handleGenerateImages}
          disabled={isLoading}
        >
          {isLoggedIn ? "생성 중..." : "이미지 생성"}
        </button>
        {recommendedImages.map((image, index) => (
          <div key={index} className="image-preview">
            <img src={image} alt={`Generated image ${index + 1}`} />
          </div>
        ))}
      </div>
      {showLoginModal && <BlurredLoginModal onClose={handleCloseModal} />}
    </div>
  );
};

export default withLogin(TestTuiEditor);
