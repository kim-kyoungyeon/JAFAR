import axios from "axios";

const api = axios.create({
  baseURL: "/api", // 프록시를 사용하므로 상대 경로로 변경
  withCredentials: true, // 쿠키를 포함하여 요청을 보냄
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터는 제거 (쿠키는 자동으로 전송되므로)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // 인증에 실패한 경우
      // 로그인 페이지로 리다이렉트하거나 다른 처리를 수행
    }
    return Promise.reject(error);
  }
);

export const login = async (email, password) => {
  try {
    const response = await api.post("/login", { email, password });
    // 서버에서 쿠키를 설정하므로 클라이언트에서 별도로 저장할 필요 없음
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    await api.post("/logout");
    // 서버에서 쿠키를 삭제하므로 클라이언트에서 별도로 처리할 필요 없음
  } catch (error) {
    throw error;
  }
};

export default api;
