import { useState, useEffect, useCallback } from 'react';
import axiosInstance from './axiosConfig';

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

     const checkAuthStatus = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/api/check-auth');
      setIsLoggedIn(response.data.isAuthenticated);
      setUsername(response.data.username || "");
      return response.data.isAuthenticated;
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsLoggedIn(false);
      setUsername("");
      return false;
    }
  }, []);

   useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

   const handleLoginSuccess = useCallback(async () => {
    await checkAuthStatus();
  }, [checkAuthStatus]);

  const login = useCallback(async () => {
    try {
      const isAuthenticated = await checkAuthStatus();
      if (!isAuthenticated) {
        throw new Error('Authentication failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }, [checkAuthStatus]);

   const logout = useCallback(async () => {
    try {
      await axiosInstance.post('/logout');
      setIsLoggedIn(false);
      setUsername("");
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  return { isLoggedIn, username, handleLoginSuccess, logout, checkAuthStatus };
};

export default useAuth;