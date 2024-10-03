// src/hooks/useLogin.js
import { useState } from "react";

const useLogin = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginClick = () => {
    console.log("click in hooks");
    setIsModalOpen(true);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return {
    isModalOpen,
    isLoggedIn,
    handleLoginClick,
    handleLoginSuccess,
    handleCloseModal,
  };
};

export default useLogin;
