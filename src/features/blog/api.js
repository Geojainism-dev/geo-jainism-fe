import { api } from "@/lib/api";

export const listBlogs = async (params = {}) => {
  const { data } = await api.get("/admin/blogs", { params });
  return data.data; // { blogs, pagination }
};

export const getBlog = async (id) => {
  const { data } = await api.get(`/admin/blogs/${id}`);
  return data.data;
};

export const createBlog = async (payload) => {
  const { data } = await api.post("/admin/blogs", payload);
  return data.data;
};

export const updateBlog = async (id, payload) => {
  const { data } = await api.put(`/admin/blogs/${id}`, payload);
  return data.data;
};

export const deleteBlog = async (id) => {
  await api.delete(`/admin/blogs/${id}`);
};

export const publishBlog = async (id) => {
  const { data } = await api.patch(`/admin/blogs/${id}/publish`);
  return data.data;
};

export const archiveBlog = async (id) => {
  const { data } = await api.patch(`/admin/blogs/${id}/archive`);
  return data.data;
};

export const uploadCoverImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  const { data } = await api.post("/admin/upload/cover", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data; // { id, url, type, size, createdAt }
};
