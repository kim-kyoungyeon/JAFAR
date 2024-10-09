import axios from "axios";

const axiosInstance = axios.create({
  withCredentials: true, // 쿠키를 포함하여 요청을 보냄
  baseURL: "http://3.39.251.48:8080", // API 요청의 기본 URL 설정
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // 토큰 만료 또는 인증 실패
      // 로그인 페이지로 리다이렉트하는 대신 이벤트를 발생시킴
      const event = new CustomEvent("unauthorized", { detail: error });
      window.dispatchEvent(event);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;