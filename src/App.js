<<<<<<< Updated upstream
// src/App.js
import React from "react";
import "./styles/App.css";
import "./styles/BlurredLoginModal.css";
import ProtectedImageEditorWithHooks from "./components/ProtectedImageEditorWithHooks";

function App() {
  return (
    <div className="app-container">
      <div className="pattern-overlay"></div>
      <div className="radial-gradient-1"></div>
      <div className="radial-gradient-2"></div>
      <div className="content-container">
        <ProtectedImageEditorWithHooks />
      </div>
    </div>
=======
// import React, { useState, useEffect } from "react";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import "./styles/App.css";
// import "./styles/BlurredLoginModal.css";
// import TestTuiEditor from "./components/TestTuiEditor";
// import S3ImageCRUD from "./services/S3ImageCRUD";
// import BlurredLoginModal from "./components/BlurredLoginModal";
// import OAuthCallback from "./components/OAuthCallback";
// import Logo from "./components/Logo";

// function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [username, setUsername] = useState("");
//   const [showLoginModal, setShowLoginModal] = useState(false);

//   useEffect(() => {
//     const handleAuthMessage = (event) => {
//       if (event.origin !== "http://43.203.233.134:3000") return;

//       if (event.data.type === "AUTH_SUCCESS") {
//         setIsLoggedIn(true);
//         // You might want to fetch the username from your backend here
//         setUsername("User"); // Placeholder username
//         setShowLoginModal(false);
//       }
//     };

//     window.addEventListener("message", handleAuthMessage);

//     return () => {
//       window.removeEventListener("message", handleAuthMessage);
//     };
//   }, []);

//   const handleOpenLoginModal = () => setShowLoginModal(true);
//   const handleCloseLoginModal = () => setShowLoginModal(false);

//   const handleLogout = () => {
//     setIsLoggedIn(false);
//     setUsername("");
//     document.cookie =
//       "auth_token=; path=/; domain=43.203.233.134; expires=Thu, 01 Jan 1970 00:00:00 GMT";
//   };

//   return (
//     <Router>
//       <div className="app-container">
//         <div className="pattern-overlay"></div>
//         <div className="radial-gradient-1"></div>
//         <div className="radial-gradient-2"></div>
//         <div className="content-container">
//           <header className="app-header">
//             <Logo className="app-logo" />
//             {isLoggedIn ? (
//               <>
//                 <span>Welcome, {username}!</span>
//                 <button onClick={handleLogout}>Logout</button>
//               </>
//             ) : (
//               <button onClick={handleOpenLoginModal}>Login</button>
//             )}
//           </header>
//           <Routes>
//             <Route path="/" element={<TestTuiEditor />} />
//             <Route
//               path="/oauth2/authentication/naver"
//               element={<OAuthCallback />}
//             />
//             {/* Add this new route */}
//             <Route
//               path="/login/oauth2/authorization/naver"
//               element={<OAuthCallback />}
//             />
//           </Routes>
//         </div>
//       </div>
//       {showLoginModal && <BlurredLoginModal onClose={handleCloseLoginModal} />}
//     </Router>
//   );
// }

// export default App;

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./styles/App.css";
import "./styles/BlurredLoginModal.css";
import TestTuiEditor from "./components/TestTuiEditor";
import BlurredLoginModal from "./components/BlurredLoginModal";
import Logo from "./components/Logo";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    // 앱 로드 시 로컬 스토리지에서 사용자 정보 확인
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    setShowLoginModal(false);
  };

  const handleOpenLoginModal = () => setShowLoginModal(true);
  const handleCloseLoginModal = () => setShowLoginModal(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("user");
    // 네이버 로그아웃
    if (window.naver && window.naver.LoginWithNaverId) {
      const naverLogin = new window.naver.LoginWithNaverId({
        clientId: "YOUR_CLIENT_ID",
      });
      naverLogin.logout();
    }
  };

  return (
    <Router>
      <div className="app-container">
        <div className="pattern-overlay"></div>
        <div className="radial-gradient-1"></div>
        <div className="radial-gradient-2"></div>
        <div className="content-container">
          <header className="app-header">
            <Logo className="app-logo" />
            {isLoggedIn ? (
              <>
                <span>Welcome, {user.name}!</span>
                <button onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <button onClick={handleOpenLoginModal}>Login</button>
            )}
          </header>
          <Routes>
            <Route path="/" element={<TestTuiEditor />} />
          </Routes>
        </div>
      </div>
      {showLoginModal && (
        <BlurredLoginModal
          onClose={handleCloseLoginModal}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </Router>
>>>>>>> Stashed changes
  );
}

export default App;
