import { api } from "@/lib/api";

export const listTags = async () => {
  const { data } = await api.get("/admin/tags");
  return data.data; // array
};

export const createTag = async (payload) => {
  const { data } = await api.post("/admin/tags", payload);
  return data.data;
};

export const updateTag = async (id, payload) => {
  const { data } = await api.put(`/admin/tags/${id}`, payload);
  return data.data;
};

export const deleteTag = async (id) => {
  await api.delete(`/admin/tags/${id}`);
};
