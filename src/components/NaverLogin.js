import React, { useEffect } from "react";
import "../styles/NaverLogin.css"; // CSS 파일을 import 합니다.

const NaverLogin = ({ onSuccess, onFailure }) => {
  useEffect(() => {
    const naverLogin = new window.naver.LoginWithNaverId({
      clientId: "vvG5cjMDwzCMLyMgSy5p", // 네이버 개발자 센터에서 발급받은 클라이언트 ID
      callbackUrl: "http://43.203.233.134:3000/callback", // 콜백 URL
      isPopup: false,
      loginButton: { color: "white", type: 5, height: 15 },
    });

    naverLogin.init();

    naverLogin.getLoginStatus((status) => {
      if (status) {
        const { id, email, name } = naverLogin.user;

        // 사용자 정보를 로컬 스토리지에 저장
        const userData = { id, email, name };
        localStorage.setItem("user", JSON.stringify(userData));

        onSuccess(userData);
      } else {
        console.log("AccessToken이 올바르지 않습니다.");
        onFailure(new Error("Invalid access token"));
      }
    });
  }, [onSuccess, onFailure]);

  return <div id="naverIdLogin"></div>;
};

export default NaverLogin;
