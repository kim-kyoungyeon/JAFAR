import React, { useState, useRef, useEffect } from "react";
import ImageEditor from "@toast-ui/react-image-editor";
import "tui-image-editor/dist/tui-image-editor.css";
import useAuth from "../utils/useAuth";
import "../styles/editor.css";
import BlurredLoginModal from "../components/BlurredLoginModal";
import axios from 'axios';
import Logo from '/logo svg.svg';

const S3_BUCKET_URL = "https://jafar-jv-s-buckett.s3.ap-northeast-2.amazonaws.com";

const S3Direct = () => {
  const { isLoggedIn, username, handleLoginSuccess, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const editorRef = useRef(null);
  const [editorInstance, setEditorInstance] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [s3Images, setS3Images] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        fetchS3Images();
    }, []);
        
    useEffect(() => {
    if (editorRef.current) {
      setEditorInstance(editorRef.current.getInstance());
    }
  }, []);

  const fetchS3Images = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${S3_BUCKET_URL}?list-type=2`);
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(response.data, "text/xml");
      const contents = xmlDoc.getElementsByTagName('Contents');
      
      const images = Array.from(contents).map(content => {
      const key = content.getElementsByTagName('Key')[0].textContent;
      return {
            name: key.split('/').pop(),
            url: `${S3_BUCKET_URL}/${encodeURIComponent(key)}`
        };
        });


      setS3Images(images);
    } catch (error) {
      console.error("Error fetching S3 images:", error);
      alert("이미지를 불러오는 데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

    
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
    await fetchS3Images();
  };

  const handleLogin = () => {
    setShowLoginModal(true);
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
  };
    
    const handleImageClick = (imageUrl) => {
    if (editorInstance) {
      editorInstance.loadImageFromURL(imageUrl, "selectedImage")
        .then(() => {
          console.log('Image loaded successfully');
        })
        .catch((err) => {
          console.error('Failed to load image:', err);
        });
    } else {
      console.error('Editor instance is not available');
    }
  };

  return (
    <div className="editor-container">
      <div className="main-content">
              <header className="header"> 
        <Logo className="modal-logo" width="100" height="30" />
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
        <h3>S3 이미지 목록</h3>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        className="prompt-input"
        placeholder="프롬프트 입력"
        />
        <button  className="refresh-button" onClick={handleGenerateImages} disabled={isLoading}>
          {isLoading ? "불러오는 중..." : "이미지 목록 새로고침"}
        </button>
        <div className="image-list">
          {s3Images.map((image, index) => (
            <div key={index} className="image-preview" onClick={() => handleImageClick(image.url)}>
              <img src={image.url} alt={image.name} />
            </div>
          ))}
        </div>
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
export default S3Direct;
