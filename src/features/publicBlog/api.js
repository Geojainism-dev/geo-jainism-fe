import { api } from "@/lib/api";

export const listPublicBlogs = async (params = {}) => {
  const { data } = await api.get("/blogs", { params });
  return data.data; // { blogs, pagination }
};

export const getPublicBlogBySlug = async (slug) => {
  const { data } = await api.get(`/blogs/${slug}`);
  return data.data;
};
