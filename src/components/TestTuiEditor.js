import React, { useState, useRef, useEffect } from "react";
import ImageEditor from "@toast-ui/react-image-editor";
import "tui-image-editor/dist/tui-image-editor.css";
import "../styles/editor.css";
import axiosInstance from "../utils/axiosConfig";
import Logo from "../components/Logo";
import useAuth from "../hooks/useAuth";
import axios from "axios";
import S3ImageRetrieval from "./S3ImageRetrieval";

import { debounce } from "lodash";

const API_URL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_PROD_API_URL
    : process.env.REACT_APP_DEV_API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

const TestTuiEditor = () => {
  const { isLoggedIn } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const editorRef = useRef(null);
  const [editorInstance, setEditorInstance] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [recommendedImages, setRecommendedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [savedImages, setSavedImages] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [activeSection, setActiveSection] = useState("prompt");

  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 3;
    
    const initializeEditor = async () => {
      if (editorRef.current && isMounted) {
        try {
          const instance = editorRef.current.getInstance();
          setEditorInstance(instance);
          
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
  }, [isLoggedIn]);

  // 오픈소스 업로드 & 다운로드
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

//AI 이미지 생성
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

  //save
  const handleSave = async () => {
    if (!editorInstance) {
      alert("편집기가 초기화되지 않았습니다.");
      return;
    }
  
    try {
      const dataURL = editorInstance.toDataURL();
      const blob = await (await fetch(dataURL)).blob();
      const file = new File([blob], "edited-image.png", { type: "image/png" });
  
      const formData = new FormData();
      formData.append("file", file);
  
      console.log("Sending save request...");
      const response = await axiosInstance.post("/pictures/save", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      console.log("Save response:", response);
      alert("이미지가 성공적으로 저장되었습니다: " + response.data);
    } catch (error) {
      console.error("Error saving image:", error);
      alert("이미지 저장 중 오류가 발생했습니다: " + error.message);
    }
  };

  useEffect(() => {
    console.log("isLoggedIn status:", isLoggedIn); 
    if (isLoggedIn) {
    }
  }, [isLoggedIn]);


  //이미지조회
  const handleSavedImagesClick = async () => {
    setActiveSection("savedImages");
    // 여기에 저장된 이미지를 가져오는 로직을 추가할 수 있습니다.
    // 예: const savedImages = await fetchSavedImages();
    // setSavedImages(savedImages);
  };


  return (
    <div className="editor-container">
      <div className="main-content">
        <header className="header">
          <Logo className="modal-logo" />
          <div className="header-buttons">
            <button className="styledButton" onClick={handleUpload} disabled={!editorInstance}>
              Load
            </button>
            <button className="styledButton" onClick={handleDownload} disabled={!editorInstance}>
              Download
            </button>
            <button className="styledButton" onClick={handleSave} >Save</button>
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
        <div className="sidebar-buttons">
          <button 
            className="sidebar-button" 
            onClick={() => setActiveSection("prompt")}
          >
            이미지 생성
          </button>
          <button 
            className="sidebar-button" 
            onClick={handleSavedImagesClick}
          >
            내 기록
          </button>
        </div>
        <div className="sidebar-content">
          <div className={`prompt-section ${activeSection === "prompt" ? "active" : ""}`}>
          <div className="prompt-input-container">
            <input
              className="prompt-input"
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="프롬프트를 입력해주세요"
            />
          </div>
            <button className="generate-button" onClick={debouncedHandleGenerateImages} disabled={isLoading}>
              {isLoading ? "처리 중..." : "이미지 생성"}
            </button>
            <S3ImageRetrieval
              keyword={searchKeyword}
              onImageSelect={handleImageSelect}
              recommendedImages={recommendedImages}
            />
          </div>
          <div className={`saved-images-section ${activeSection === "savedImages" ? "active" : ""}`}>
            <h3></h3>
            <p>저장된 이미지 여기 표시</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestTuiEditor;


