// utils/cookies.js
export const setCookie = (name, value, days) => {
    let expires = "";
    
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = `; expires=${date.toUTCString()}`;
  }
  document.cookie = `${name}=${value || ""}${expires}; path=/; secure; samesite=strict`;
};


export const removeCookie = (name) => {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};


export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};


export const clearAllCookies = () => {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;";
    }
}