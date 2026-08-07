import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listPendingUsers, listAdmins, approveUser, rejectUser } from "@/features/users/api";

export const usePendingUsers = (params = {}) =>
  useQuery({ queryKey: ["pendingUsers", params], queryFn: () => listPendingUsers(params) });

export const useAdmins = (params = {}) =>
  useQuery({ queryKey: ["admins", params], queryFn: () => listAdmins(params) });

export const useApproveUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: approveUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingUsers"] });
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });
};

export const useRejectUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }) => rejectUser(id, reason),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["pendingUsers"] }),
  });
};
