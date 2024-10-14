// // import React, { useState, useEffect } from "react";
// // import Logo from "./Logo";
// // import NaverLogin from "./NaverLogin";

// // const BlurredLoginModal = ({ onClose, onLoginSuccess }) => {
// //   const [loginWindow, setLoginWindow] = useState(null);
// //   const [loginError, setLoginError] = useState(null);

// //   const handleNaverLogin = () => {
// //     const width = 500;
// //     const height = 600;
// //     const left = window.screen.width / 2 - width / 2;
// //     const top = window.screen.height / 2 - height / 2;

// //     const newWindow = window.open(
// //       "http://3.39.251.48:8080/oauth2/authorization/naver",
// //       "Naver OAuth Login",
// //       `width=${width},height=${height},left=${left},top=${top}`
// //     );

// //     if (newWindow) {
// //       setLoginWindow(newWindow);
// //     } else {
// //       setLoginError("팝업 차단을 해제해주세요.");
// //     }
// //   };

// //   const checkLoginCookie = () => {
// //     const cookies = document.cookie.split(";");
// //     const loginCookie = cookies.find((cookie) =>
// //       cookie.trim().startsWith("login=")
// //     );
// //     if (loginCookie) {
// //       const loginData = JSON.parse(
// //         decodeURIComponent(loginCookie.split("=")[1])
// //       );
// //       return loginData;
// //     }
// //     return null;
// //   };

// //   useEffect(() => {
// //     if (!loginWindow) return;

// //     const checkLoginStatus = setInterval(() => {
// //       try {
// //         if (loginWindow.closed) {
// //           clearInterval(checkLoginStatus);
// //           const loginData = checkLoginCookie();
// //           if (loginData) {
// //             onLoginSuccess(loginData);
// //             onClose();
// //           } else {
// //             setLoginError("로그인에 실패했습니다. 다시 시도해주세요.");
// //           }
// //         }
// //       } catch (error) {
// //         // 크로스 도메인 이슈로 인한 에러는 무시
// //       }
// //     }, 500);

// //     return () => clearInterval(checkLoginStatus);
// //   }, [loginWindow, onClose, onLoginSuccess]);

// //   return (
// //     <div className="modal-overlay">
// //       <div className="modal-content">
// //         <Logo className="modal-logo" />
// //         <h2>Login</h2>
// //         <button onClick={handleNaverLogin}>Login with Naver</button>
// //         {loginError && <p className="error-message">{loginError}</p>}
// //         <button onClick={onClose}>Close</button>
// //       </div>
// //     </div>
// //   );
// // };

// // export default BlurredLoginModal;

// import { React, useEffect } from "react";
// import "../styles/BlurredLoginModal.css";
// import { clearAllCookies } from "../utils/cookies";
// import naverLoginButton from "../assets/naverLogin.png";
// import useAuth from "../hooks/useAuth";

// export default function BlurredLoginModal({ onClose, onLoginSuccess }) {
//   const { handleLoginSuccess } = useAuth();

//   const handleOAuthLogin = async (provider) => {
//     clearAllCookies();
//     const authUrl = `http://localhost:8080/oauth2/authorization/${provider}`;
//     window.location.href = authUrl;
//   };

//   // 로그인 성공 시
//   const handleSuccess = async () => {
//     await handleLoginSuccess();
//     onLoginSuccess();
//     onClose();
//     checkAuthStatus();
//   };

//   const checkAuthStatus = async () => {
//     try {
//       const response = await fetch("http://localhost:8080/api/check-auth", {
//         credentials: "include",
//       });
//       const data = await response.json();
//       if (data.isAuthenticated) {
//         onLoginSuccess();
//         onClose();
//       }
//     } catch (error) {
//       console.error("Error checking auth status:", error);
//     }
//   };

//   useEffect(() => {
//     const checkAuth = async () => {
//       const isAuthenticated = await checkAuthStatus();
//       if (isAuthenticated) {
//         handleSuccess();
//       }
//     };
//     checkAuth();
//   }, []);

//   return (
//     <div className="modal-overlay">
//       <div className="card">
//         <div className="card-header">
//           <h2 className="card-title">소셜 로그인</h2>
//           <button onClick={onClose} className="close-button">
//             x
//           </button>
//         </div>
//         <div className="card-content">
//           <button
//             onClick={() => handleOAuthLogin("naver")}
//             className="oauth-button naver"
//           >
//             <img
//               src={naverLoginButton}
//               alt="Naver 로그인"
//               className="naver-login-image"
//             />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useEffect } from "react";
import "../styles/BlurredLoginModal.css";
import { clearAllCookies } from "../utils/cookies";
import naverLoginButton from "../assets/naverLogin.png";
import useAuth from "../hooks/useAuth";

export default function BlurredLoginModal({ onClose, onLoginSuccess }) {
  const { handleLoginSuccess } = useAuth();

  const handleNaverLogin = () => {
    clearAllCookies();
    // 프록시 설정을 사용하므로 상대 경로 사용
    const authUrl = "/oauth2/authorization/naver";
    window.location.href = authUrl;
  };

  const handleSuccess = async () => {
    await handleLoginSuccess();
    onLoginSuccess();
    onClose();
  };

  const checkAuthStatus = async () => {
    try {
      // 프록시 설정을 사용하므로 상대 경로 사용
      const response = await fetch("/api/check-auth", {
        credentials: "include",
      });
      const data = await response.json();
      return data.isAuthenticated;
    } catch (error) {
      console.error("Error checking auth status:", error);
      return false;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = await checkAuthStatus();
      if (isAuthenticated) {
        handleSuccess();
      }
    };
    checkAuth();
  }, []);

  return (
    <div className="modal-overlay">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">소셜 로그인</h2>
          <button onClick={onClose} className="close-button">
            x
          </button>
        </div>
        <div className="card-content">
          <button onClick={handleNaverLogin} className="oauth-button naver">
            <img
              src={naverLoginButton}
              alt="Naver 로그인"
              className="naver-login-image"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
