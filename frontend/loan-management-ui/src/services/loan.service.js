import api from "./api";

// The ONLY place the loans endpoint is written down.
const LOANS_URL = "/loans";

export const loanService = {
  async getAll() {
    const response = await api.get(LOANS_URL);
    const loans = response.data?.data;

    if (!Array.isArray(loans)) {
      throw new Error("The server returned an invalid loans response.");
    }
    return loans;
  },

  async create(payload) {
    const response = await api.post(LOANS_URL, payload);
    return response.data.data;
  },

  async update(id, payload) {
    const response = await api.put(`${LOANS_URL}/${id}`, payload);
    return response.data.data;
  },

  async remove(id) {
    await api.delete(`${LOANS_URL}/${id}`);
  },

  // Admin only (the backend enforces this): approve or reject a pending loan.
  async updateStatus(id, status) {
    const response = await api.patch(`${LOANS_URL}/${id}/status`, { status });
    return response.data.data;
  },
};
