import React, { useState, useRef, useEffect } from "react";
import ImageEditor from "@toast-ui/react-image-editor";
import "tui-image-editor/dist/tui-image-editor.css";
import BlurredLoginModal from "./BlurredLoginModal";
import "../styles/editor.css";
import sampleLogo from "../styles/sampleLogo.jpg";

const TestTuiEditor = () => {
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
 
  return (
    <div className="editor-container">
      <div className="main-content">
        <header className="header">
          <img src= {sampleLogo} width='50px'/>
          <div className="header-buttons">
            <button className="button">내보내기</button>
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
  const [isLoggedIn, setIsLoggedIn] = useState(true); // 예시를 위해 true로 설정

  return (
    <EditorContainer>
      <MainContent>
        <Header>
          <img src={sampleLogo} width="50px" />
          <div>
            <Button>내보내기</Button>
>>>>>>> Stashed changes
          </div>
        </header>
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
        <button className="button">생성형 프롬프트 쓰기</button>
        <div className="image-preview"></div>
        <div className="image-preview"></div>
        <div className="image-preview"></div>
      </div>
    </div>
  );
};

export default TestTuiEditor;
