import api from "./api";

// The ONLY place the loans endpoint is written down.
const LOANS_URL = "/loans";
const DEFAULT_PAGE_SIZE = 10;

export const loanService = {
  async getAll({ page = 1, limit = DEFAULT_PAGE_SIZE } = {}) {
    const response = await api.get(LOANS_URL, { params: { page, limit } });
    const { data: loans, pagination, summary } = response.data ?? {};

    if (!Array.isArray(loans)) {
      throw new Error("The server returned an invalid loans response.");
    }
    if (
      !pagination ||
      !Number.isInteger(pagination.page) ||
      !Number.isInteger(pagination.limit) ||
      !Number.isInteger(pagination.total) ||
      !Number.isInteger(pagination.totalPages) ||
      !summary ||
      !Number.isInteger(summary.total) ||
      !Number.isInteger(summary.pending) ||
      !Number.isInteger(summary.approved) ||
      !Number.isInteger(summary.rejected)
    ) {
      throw new Error("The server returned invalid loan pagination or summary data.");
    }
    return { loans, pagination, summary };
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
