import { useState, useEffect, useCallback } from 'react';

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const [email, setEmail] = useState(() => localStorage.getItem('email') || '');

  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
    localStorage.setItem('email', email);
  }, [isLoggedIn, email]);

  const handleLoginSuccess = useCallback((userData) => {
    setIsLoggedIn(true);
    setEmail(userData.email);
  }, []);

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    setEmail('');
  }, []);

  return { isLoggedIn, email, handleLoginSuccess, handleLogout };
};

export default useAuth;