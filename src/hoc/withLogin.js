import React, { useState, useEffect, useCallback } from "react";
import BlurredLoginModal from "../components/BlurredLoginModal";
import jwtDecode from "jwt-decode";
import axios from "axios";

const withLogin = (WrappedComponent) => {
  return (props) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [username, setUsername] = useState("");

    const handleLoginClick = () => {
      setShowLoginModal(true);
    };

    const handleLoginSuccess = (token) => {
      localStorage.setItem("jwtToken", token);
      setIsLoggedIn(true);
      fetchUserInfo(token);
      scheduleTokenRefresh(token);
    };

    const handleLogout = () => {
      localStorage.removeItem("jwtToken");
      setIsLoggedIn(false);
      setUsername("");
    };

    const handleCloseModal = () => {
      setShowLoginModal(false);
    };

    const refreshToken = async () => {
      try {
        const response = await axios.post(
          "/api/refresh-token",
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          }
        );
        const newToken = response.data.token;
        localStorage.setItem("jwtToken", newToken);
        scheduleTokenRefresh(newToken);
        return newToken;
      } catch (error) {
        console.error("Error refreshing token:", error);
        handleLogout();
        return null;
      }
    };

    const isTokenExpired = (token) => {
      try {
        const decoded = jwtDecode(token);
        return decoded.exp < Date.now() / 1000;
      } catch (error) {
        return true;
      }
    };

    const getValidToken = async () => {
      let token = localStorage.getItem("jwtToken");
      if (token && isTokenExpired(token)) {
        token = await refreshToken();
      }
      return token;
    };

    const scheduleTokenRefresh = useCallback((token) => {
      const decoded = jwtDecode(token);
      const expiresIn = decoded.exp * 1000 - Date.now();
      const refreshTime = Math.max(expiresIn - 60000, 0); // Refresh 1 minute before expiration

      setTimeout(() => {
        refreshToken();
      }, refreshTime);
    }, []);

    const fetchUserInfo = async (token) => {
      try {
        const response = await axios.get("/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsername(response.data.username);
      } catch (error) {
        console.error("Error fetching user info:", error);
        handleLogout();
      }
    };

    useEffect(() => {
      const initializeAuth = async () => {
        const token = await getValidToken();
        if (token) {
          setIsLoggedIn(true);
          fetchUserInfo(token);
          scheduleTokenRefresh(token);
        }
      };
      initializeAuth();
    }, [scheduleTokenRefresh]);

    return (
      <div>
        <WrappedComponent
          {...props}
          isLoggedIn={isLoggedIn}
          username={username}
          handleLogout={handleLogout}
          handleLoginSuccess={handleLoginSuccess}
          getValidToken={getValidToken}
          handleLoginClick={handleLoginClick}
        />
        {showLoginModal && (
          <BlurredLoginModal
            onLoginSuccess={handleLoginSuccess}
            onClose={handleCloseModal}
          />
        )}
      </div>
    );
  };
};

export default withLogin;
