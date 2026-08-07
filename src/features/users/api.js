import { api } from "@/lib/api";

export const listPendingUsers = async (params = {}) => {
  const { data } = await api.get("/admin/users/pending", { params });
  return data.data;
};

export const listAdmins = async (params = {}) => {
  const { data } = await api.get("/admin/users", { params });
  return data.data;
};

export const approveUser = async (id) => {
  const { data } = await api.post(`/admin/users/${id}/approve`);
  return data.data;
};

export const rejectUser = async (id, reason) => {
  const { data } = await api.post(`/admin/users/${id}/reject`, { reason });
  return data.data;
};
