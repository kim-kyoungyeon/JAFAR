import axios from "axios";

const axiosInstance = axios.create({
  withCredentials: true, // 쿠키를 포함하여 요청을 보냄
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // 토큰 만료 또는 인증 실패
      window.location.href = "/login"; // 또는 로그인 모달을 띄우는 등의 처리
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
