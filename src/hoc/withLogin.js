// import React, { useState, useEffect, useCallback } from "react";
// import jwtDecode from "jwt-decode";
// import axios from "axios";
// import { clearAllCookies } from "../utils/cookies";

// const withLogin = (WrappedComponent) => {
//   return (props) => {
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const [username, setUsername] = useState("");

//     const handleLoginSuccess = useCallback(async (token) => {
//       localStorage.setItem("jwtToken", token);
//       setIsLoggedIn(true);
//       fetchUserInfo(token);
//     }, []);

//     const handleLogout = useCallback(() => {
//       localStorage.removeItem("jwtToken");
//       clearAllCookies();
//       setIsLoggedIn(false);
//       setUsername("");
//     }, []);

//     const refreshToken = useCallback(async () => {
//       try {
//         const response = await axios.post("/api/refresh-token", {}, {
//           headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
//         });
//         const newToken = response.data.token;
//         localStorage.setItem("jwtToken", newToken);
//         return newToken;
//       } catch (error) {
//         console.error("Error refreshing token:", error);
//         handleLogout();
//         return null;
//       }
//     }, [handleLogout]);

//     const isTokenExpired = useCallback((token) => {
//       try {
//         const decoded = jwtDecode(token);
//         return decoded.exp < Date.now() / 1000;
//       } catch (error) {
//         return true;
//       }
//     }, []);

//     const getValidToken = useCallback(async () => {
//       let token = localStorage.getItem("jwtToken");
//       if (token && isTokenExpired(token)) {
//         token = await refreshToken();
//       }
//       return token;
//     }, [isTokenExpired, refreshToken]);

//     const fetchUserInfo = useCallback(async (token) => {
//       try {
//         const response = await axios.get("/api/user", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setUsername(response.data.username);
//       } catch (error) {
//         console.error("Error fetching user info:", error);
//         handleLogout();
//       }
//     }, [handleLogout]);

//     useEffect(() => {
//       const initializeAuth = async () => {
//         const token = await getValidToken();
//         if (token) {
//           setIsLoggedIn(true);
//           fetchUserInfo(token);
//         }
//       };
//       initializeAuth();
//     }, [getValidToken, fetchUserInfo]);

//     return (
//       <WrappedComponent
//         {...props}
//         isLoggedIn={isLoggedIn}
//         username={username}
//         handleLogout={handleLogout}
//         handleLoginSuccess={handleLoginSuccess}
//         clearAllCookies={clearAllCookies}
//       />
//     );
//   };
// };

// export default withLogin;