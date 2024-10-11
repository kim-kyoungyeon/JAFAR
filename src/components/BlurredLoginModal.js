// import React, { useState, useEffect } from "react";
// import Logo from "./Logo";
// import NaverLogin from "./NaverLogin";

// const BlurredLoginModal = ({ onClose, onLoginSuccess }) => {
//   const [loginWindow, setLoginWindow] = useState(null);
//   const [loginError, setLoginError] = useState(null);

//   const handleNaverLogin = () => {
//     const width = 500;
//     const height = 600;
//     const left = window.screen.width / 2 - width / 2;
//     const top = window.screen.height / 2 - height / 2;

//     const newWindow = window.open(
//       "http://3.39.251.48:8080/oauth2/authorization/naver",
//       "Naver OAuth Login",
//       `width=${width},height=${height},left=${left},top=${top}`
//     );

//     if (newWindow) {
//       setLoginWindow(newWindow);
//     } else {
//       setLoginError("팝업 차단을 해제해주세요.");
//     }
//   };

//   const checkLoginCookie = () => {
//     const cookies = document.cookie.split(";");
//     const loginCookie = cookies.find((cookie) =>
//       cookie.trim().startsWith("login=")
//     );
//     if (loginCookie) {
//       const loginData = JSON.parse(
//         decodeURIComponent(loginCookie.split("=")[1])
//       );
//       return loginData;
//     }
//     return null;
//   };

//   useEffect(() => {
//     if (!loginWindow) return;

//     const checkLoginStatus = setInterval(() => {
//       try {
//         if (loginWindow.closed) {
//           clearInterval(checkLoginStatus);
//           const loginData = checkLoginCookie();
//           if (loginData) {
//             onLoginSuccess(loginData);
//             onClose();
//           } else {
//             setLoginError("로그인에 실패했습니다. 다시 시도해주세요.");
//           }
//         }
//       } catch (error) {
//         // 크로스 도메인 이슈로 인한 에러는 무시
//       }
//     }, 500);

//     return () => clearInterval(checkLoginStatus);
//   }, [loginWindow, onClose, onLoginSuccess]);

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <Logo className="modal-logo" />
//         <h2>Login</h2>
//         <button onClick={handleNaverLogin}>Login with Naver</button>
//         {loginError && <p className="error-message">{loginError}</p>}
//         <button onClick={onClose}>Close</button>
//       </div>
//     </div>
//   );
// };

// export default BlurredLoginModal;

import React from "react";
import NaverLogin from "./NaverLogin";
import Logo from "./Logo";

const BlurredLoginModal = ({ onClose, onLoginSuccess }) => {
  const handleLoginSuccess = (userData) => {
    onLoginSuccess(userData);
    onClose();
  };

  const handleLoginFailure = (error) => {
    console.error("Login failed:", error);
    // 에러 처리 로직 (예: 에러 메시지 표시)
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <Logo className="modal-logo" />
        <h2>Login</h2>
        <NaverLogin
          onSuccess={handleLoginSuccess}
          onFailure={handleLoginFailure}
        />
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default BlurredLoginModal;
