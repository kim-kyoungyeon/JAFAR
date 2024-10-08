import { useState, useEffect } from "react";
import axiosInstance from "./axiosConfig";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuthStatus = async () => {
    try {
      await axiosInstance.get("/api/check-auth");
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async () => {
    // OAuth 로그인 처리 후
    await checkAuthStatus();
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/api/logout");
      setIsAuthenticated(false);
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return {
    isAuthenticated,
    login,
    logout,
    checkAuthStatus,
  };
};

export default useAuth;
