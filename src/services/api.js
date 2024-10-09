import axios from "axios";

const api = axios.create({
  baseURL: "/api", // 프록시를 사용하므로 상대 경로로 변경
  withCredentials: true, // 쿠키를 포함하여 요청을 보냄
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      window.location.href = "/login";
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
