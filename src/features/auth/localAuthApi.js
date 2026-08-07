import { api } from "@/lib/api";

export const registerLocalUser = async (payload) => {
  const { data } = await api.post("/admin/auth/register", payload);
  return data.data.user;
};

export const loginLocalUser = async (payload) => {
  const { data } = await api.post("/admin/auth/login", payload);
  return data.data.user;
};

export const logoutUser = async () => {
  await api.post("/admin/auth/logout");
};

export const updateProfile = async (payload) => {
  const { data } = await api.patch("/admin/auth/profile", payload);
  return data.data.user;
};
