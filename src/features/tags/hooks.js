import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listTags, createTag, updateTag, deleteTag } from "@/features/tags/api";

export const useTags = () => useQuery({ queryKey: ["tags"], queryFn: listTags });

const invalidate = (queryClient) => queryClient.invalidateQueries({ queryKey: ["tags"] });

export const useCreateTag = () => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: createTag, onSuccess: () => invalidate(queryClient) });
};

export const useUpdateTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }) => updateTag(id, payload),
    onSuccess: () => invalidate(queryClient),
  });
};

export const useDeleteTag = () => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: deleteTag, onSuccess: () => invalidate(queryClient) });
};
