import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listCategories, createCategory, updateCategory, deleteCategory } from "@/features/categories/api";

export const useCategories = () => useQuery({ queryKey: ["categories"], queryFn: listCategories });

const invalidate = (queryClient) => queryClient.invalidateQueries({ queryKey: ["categories"] });

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: createCategory, onSuccess: () => invalidate(queryClient) });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }) => updateCategory(id, payload),
    onSuccess: () => invalidate(queryClient),
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: deleteCategory, onSuccess: () => invalidate(queryClient) });
};
