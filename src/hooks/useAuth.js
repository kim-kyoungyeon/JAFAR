import { useState, useEffect } from 'react';
import axios from 'axios';

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  // useEffect(() => {
  //   checkAuthStatus();
  // }, []);

  // const checkAuthStatus = async () => {
  //   try {
  //     const response = await axios.get('http://3.39.251.48:8080/api/user', {
  //       withCredentials: true,
  //     });
      
  //     if (response.status === 200 && response.data.username) {
  //       setIsLoggedIn(true);
  //       setUsername(response.data.username);
  //     } else {
  //       setIsLoggedIn(false);
  //       setUsername('');
  //     }
  //   } catch (error) {
  //     console.error('Error checking auth status:', error);
  //     setIsLoggedIn(false);
  //     setUsername('');
  //   }
  // };

  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    setUsername(userData.username);
  };

  // const logout = async () => {
  //   try {
  //     await axios.post('http://3.39.251.48:8080/api/logout', {}, { 
  //       withCredentials: true,
  //     });
  //     setIsLoggedIn(false);
  //     setUsername('');
  //     // Remove the JWT token cookie
  //     document.cookie = 'jwt=; path=/; domain=43.203.233.134; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  //   } catch (error) {
  //     console.error('Error logging out:', error);
  //   }
  // };

  // return { isLoggedIn, username, handleLoginSuccess, logout, checkAuthStatus };
  return { isLoggedIn, username, handleLoginSuccess };
};

export default useAuth;