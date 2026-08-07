import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  publishBlog,
  archiveBlog,
} from "@/features/blog/api";

export const useBlogs = (params = {}) => useQuery({ queryKey: ["blogs", params], queryFn: () => listBlogs(params) });

export const useBlog = (id) => useQuery({ queryKey: ["blogs", id], queryFn: () => getBlog(id), enabled: !!id });

const invalidateBlogs = (queryClient) => queryClient.invalidateQueries({ queryKey: ["blogs"] });

export const useCreateBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: createBlog, onSuccess: () => invalidateBlogs(queryClient) });
};

export const useUpdateBlog = (id) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => updateBlog(id, payload),
    onSuccess: () => invalidateBlogs(queryClient),
  });
};

export const useDeleteBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: deleteBlog, onSuccess: () => invalidateBlogs(queryClient) });
};

export const usePublishBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: publishBlog, onSuccess: () => invalidateBlogs(queryClient) });
};

export const useArchiveBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: archiveBlog, onSuccess: () => invalidateBlogs(queryClient) });
};
