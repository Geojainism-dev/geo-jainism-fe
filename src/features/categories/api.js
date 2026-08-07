import { api } from "@/lib/api";

export const listCategories = async () => {
  const { data } = await api.get("/admin/categories");
  return data.data; // array
};

export const createCategory = async (payload) => {
  const { data } = await api.post("/admin/categories", payload);
  return data.data;
};

export const updateCategory = async (id, payload) => {
  const { data } = await api.put(`/admin/categories/${id}`, payload);
  return data.data;
};

export const deleteCategory = async (id) => {
  await api.delete(`/admin/categories/${id}`);
};
