<<<<<<< Updated upstream
import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import "../styles/BlurredLoginModal.css";
const FormInput = ({
  id,
  name,
  type,
  value,
  onChange,
  placeholder,
  label,
  error,
}) => (
  <div className="form-group">
    <label htmlFor={id} className="label">
      {label}
    </label>
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="input"
    />
    {error && (
      <p className="error-message">
        <AlertCircle className="error-icon" />
        {error}
      </p>
    )}
  </div>
);

const SubmitButton = ({ isSubmitting }) => (
  <button type="submit" className="submit-button" disabled={isSubmitting}>
    {isSubmitting ? "물의 호흡 제 1형 ..." : "MINAMIMORI!!"}
  </button>
);

const useLoginForm = (initialState, validate, onSubmit) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate(formData);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      try {
        await onSubmit(formData);
      } catch (error) {
        console.error("Login failed:", error);
        alert("Login failed. 전집중 호흡 다시하기 ");
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  return { formData, errors, isSubmitting, handleChange, handleSubmit };
};

export default function BlurredLoginModal({ isOpen, onLoginSuccess, onClose }) {
  const initialSTate = { email: "", password: "" };

  const validateForm = (data) => {
    let errors = {};
    if (!data.email.trim()) {
      errors.email = "Email 주소는 필수입니다";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = "Email 형식 오류 ";
    }
    if (!data.password) {
      errors.password = "Password는 필수입니다";
    }
    return errors;
  };

  const onSubmit = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Form submit", data);
    onLoginSuccess();
  };

  const { formData, errors, isSubmitting, handleChange, handleSubmit } =
    useLoginForm(initialSTate, validateForm, onSubmit);
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">전집중 호흡!</h2>
          <p className="card-description">하나노코큐</p>
        </div>
        <div className="card-content">
          <form onSubmit={handleSubmit} className="form">
            <FormInput
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="aladin@lamp.com"
              label="user email"
              errror={errors.email}
            />
            <FormInput
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              label="Secret Password Power!!"
              error={errors.password}
            />
            <SubmitButton isSubmitting={isSubmitting} />
          </form>
        </div>
      </div>
    </div>
  );
}
=======
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
>>>>>>> Stashed changes
