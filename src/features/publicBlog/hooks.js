import { useQuery } from "@tanstack/react-query";
import { listPublicBlogs, getPublicBlogBySlug } from "@/features/publicBlog/api";

export const usePublicBlogs = (params = {}) =>
  useQuery({ queryKey: ["publicBlogs", params], queryFn: () => listPublicBlogs(params) });

export const usePublicBlog = (slug) =>
  useQuery({
    queryKey: ["publicBlogs", slug],
    queryFn: () => getPublicBlogBySlug(slug),
    enabled: !!slug,
  });
