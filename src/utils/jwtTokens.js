import jwtDecode from "jwt-decode";

export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

export const getTimeUntilExpiration = (token) => {
  if (!token) return 0;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return Math.max(decoded.exp - currentTime, 0);
  } catch (error) {
    return 0;
  }
};
