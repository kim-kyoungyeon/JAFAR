import React, { useState, useRef, useEffect } from "react";
import ImageEditor from "@toast-ui/react-image-editor";
import "tui-image-editor/dist/tui-image-editor.css";
import "../styles/editor.css";
import axios from "axios";
import S3ImageRetrieval from "./S3ImageRetrieval";
import Logo from "../components/Logo";

import { debounce } from "lodash";

const API_URL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_PROD_API_URL
    : process.env.REACT_APP_DEV_API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

const TestTuiEditor = ({ isLoggedIn, username, onLoginClick, onLogout }) => {
  const editorRef = useRef(null);
  const [editorInstance, setEditorInstance] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [recommendedImages, setRecommendedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 3;

    const initializeEditor = async () => {
      if (editorRef.current && isMounted) {
        try {
          const instance = editorRef.current.getInstance();
          setEditorInstance(instance);

          await new Promise((resolve) => setTimeout(resolve, 1000));
          if (instance && typeof instance.loadImageFromURL === "function") {
            await instance.loadImageFromURL(
              "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
              "blank"
            );
            console.log("Editor initialized successfully");
          } else {
            throw new Error("Editor instance not properly initialized");
          }
        } catch (error) {
          console.error("Error initializing editor:", error);
          if (retryCount < maxRetries) {
            retryCount++;
            console.log(
              `Retrying initialization (${retryCount}/${maxRetries})...`
            );
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

  const handleImageSelect = async (imageUrl) => {
    if (editorInstance) {
      try {
        const proxyUrl = `${API_URL}/api/image-proxy?url=${encodeURIComponent(
          imageUrl
        )}`;
        await editorInstance.loadImageFromURL(proxyUrl, "selected");
        editorInstance.clearUndoStack();
        // 선택된 이미지 URL을 서버로 전송
        const response = await api.post("/api/select-image", { imageUrl });
        console.log("Image selection response:", response.data);
      } catch (error) {
        console.error("Error loading image:", error);
        alert("이미지 로딩 중 오류가 발생했습니다.");
      }
    }
  };

  const debouncedHandleGenerateImages = debounce(async () => {
    if (!prompt) {
      alert("프롬프트를 입력해주세요.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await api.get(
        `/api/images?keyword=${encodeURIComponent(prompt)}`
      );
      setSearchKeyword(prompt);
      setRecommendedImages(response.data);
    } catch (error) {
      console.error("Error generating images:", error);
      alert("이미지 생성 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, 300);

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
              <button onClick={onLogout}>Logout ({username})</button>
            ) : (
              <button onClick={onLoginClick}>Login</button>
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
          crossOrigin="anonymous"
          customOptions={{
            zoom: {
              min: 0.1,
              max: 5,
            },
          }}
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
        <button onClick={debouncedHandleGenerateImages} disabled={isLoading}>
          {isLoading ? "처리 중..." : "이미지 검색/생성"}
        </button>
        <S3ImageRetrieval
          keyword={searchKeyword}
          onImageSelect={handleImageSelect}
          recommendedImages={recommendedImages}
        />
      </div>
    </div>
  );
};

export default TestTuiEditor;
