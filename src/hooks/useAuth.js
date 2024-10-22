import { useState, useCallback } from "react";

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");

  const handleLoginSuccess = useCallback((userData) => {
    console.log("Login success data:", userData); // 추가된 로그
    setIsLoggedIn(true);
    setEmail(userData.email);
  }, []);

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    setEmail("");
  }, []);

  return { isLoggedIn, email, handleLoginSuccess, handleLogout };
};

export default useAuth;
