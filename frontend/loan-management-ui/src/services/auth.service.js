import api from "./api";

// Each function returns the useful part of the response (response.data.data).
export const authService = {
  async login(credentials) {
    const response = await api.post("/auth/login", credentials);
    return response.data.data; // { token, user }
  },

  async signup(details) {
    const response = await api.post("/auth/signup", details);
    return response.data.data; // { token, user }
  },

  async getCurrentUser() {
    const response = await api.get("/auth/me");
    return response.data.data;
  },
};
