import axios from "axios";

const API_BASE_URL = "/api/admin";

// Admin Auth API
export const adminAuthApi = {
  checkUser: async (email: string) => {
    const response = await axios.post(`${API_BASE_URL}/auth/check-user`, {
      email,
    });
    return response.data;
  },
  sendCode: async (admin_id: number, email: string) => {
    const response = await axios.post(`${API_BASE_URL}/auth/send-code`, {
      admin_id,
      email,
    });
    return response.data;
  },
  verifyCode: async (admin_id: number, code: string) => {
    const response = await axios.post(`${API_BASE_URL}/auth/verify-code`, {
      admin_id,
      code,
    });
    return response.data;
  },
};

// Admin Products API
export const adminProductsApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    const response = await axios.get(`${API_BASE_URL}/products`, { params });
    return response.data;
  },
  getById: async (id: number) => {
    const response = await axios.get(`${API_BASE_URL}/products/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await axios.post(`${API_BASE_URL}/products`, data);
    return response.data;
  },
  update: async (id: number, data: any) => {
    const response = await axios.put(`${API_BASE_URL}/products/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await axios.delete(`${API_BASE_URL}/products/${id}`);
    return response.data;
  },
};

// Admin Quotes API
export const adminQuotesApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) => {
    const response = await axios.get(`${API_BASE_URL}/quotes`, { params });
    return response.data;
  },
  getById: async (id: number) => {
    const response = await axios.get(`${API_BASE_URL}/quotes/${id}`);
    return response.data;
  },
  updateStatus: async (
    id: number,
    data: { status?: string; admin_notes?: string },
  ) => {
    const response = await axios.put(`${API_BASE_URL}/quotes/${id}`, data);
    return response.data;
  },
};

// Admin Content API
export const adminContentApi = {
  getAll: async () => {
    const response = await axios.get(`${API_BASE_URL}/content`);
    return response.data;
  },
  getBySlug: async (slug: string) => {
    const response = await axios.get(`${API_BASE_URL}/content/${slug}`);
    return response.data;
  },
  update: async (slug: string, data: { title: string; content: string }) => {
    const response = await axios.put(`${API_BASE_URL}/content/${slug}`, data);
    return response.data;
  },
};

// Admin Users API
export const adminUsersApi = {
  getAll: async () => {
    const response = await axios.get(`${API_BASE_URL}/users`);
    return response.data;
  },
  getById: async (id: number) => {
    const response = await axios.get(`${API_BASE_URL}/users/${id}`);
    return response.data;
  },
  create: async (data: {
    email: string;
    first_name: string;
    last_name: string;
    phone?: string;
    role?: string;
  }) => {
    const response = await axios.post(`${API_BASE_URL}/users`, data);
    return response.data;
  },
  update: async (
    id: number,
    data: {
      first_name?: string;
      last_name?: string;
      phone?: string;
      role?: string;
      is_active?: boolean;
    },
  ) => {
    const response = await axios.put(`${API_BASE_URL}/users/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await axios.delete(`${API_BASE_URL}/users/${id}`);
    return response.data;
  },
};
