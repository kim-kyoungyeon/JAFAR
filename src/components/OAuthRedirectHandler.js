import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuthRedirectHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // URL에서 토큰 정보 추출
    const token = new URLSearchParams(window.location.search).get("token");
    if (token) {
      // 토큰 저장 및 상태 업데이트 로직
      localStorage.setItem("token", token);
      window.opener.postMessage({ type: "LOGIN_SUCCESS", token }, "*");
      window.close();
    } else {
      navigate("/"); // 토큰이 없으면 홈으로 리다이렉트
    }
  }, [navigate]);

  return <div>Processing login...</div>;
};

export default OAuthRedirectHandler;
