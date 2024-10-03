import React, { useState } from "react";
import ImageEditor from "@toast-ui/react-image-editor";
import "tui-image-editor/dist/tui-image-editor.css";
import BlurredLoginModal from "./BlurredLoginModal";
import styled from "styled-components";
import "../styles/editor.css";
import sampleLogo from "../styles/sampleLogo.jpg";

const EditorContainer = styled.div`
  display: flex;
  background-color: #1e1e1e;
  color: white;
  height: 100vh;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #2d2d2d;
`;

const RightSidebar = styled.div`
  width: 300px;
  background-color: #2d2d2d;
  padding: 20px;
`;

const ImagePreview = styled.div`
  width: 100%;
  height: 100px;
  background-color: #444;
  margin-bottom: 20px;
`;

const Button = styled.button`
  background-color: #0066cc;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
`;

const TestTuiEditor = () => {
const [isLoggedIn, setIsLoggedIn] = useState(true); // 예시를 위해 true로 설정

  return (
    <EditorContainer>
      <MainContent>
        <Header>
          <img src= {sampleLogo} width='50px'/>
          <div>
            <Button>내보내기</Button>
          </div>
        </Header>
        {isLoggedIn && (
          <ImageEditor
            includeUI={{
              menu: ["crop", "flip", "rotate", "draw", "shape", "icon", "text", "mask", "filter"],
              initMenu: "filter",
              uiSize: {
                width: "100%",
                height: "calc(100vh - 60px)", // Header 높이를 뺀 값
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
        )}
      </MainContent>
      <RightSidebar>
        <h3>생성형 이미지 추천</h3>
        <p>사진과 유사한 생성형 이미지를 추천합니다.</p>
        <Button>생성형 프롬프트 쓰기</Button>
        <ImagePreview />
        <ImagePreview />
        <ImagePreview />
      </RightSidebar>
    </EditorContainer>
  );
};

export default TestTuiEditor;
