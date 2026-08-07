import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listScreeningRegistrations,
  getScreeningRegistration,
  resendScreeningRegistration,
  checkInScreeningRegistration,
} from "@/features/screeningRegistrations/adminApi";

export const useScreeningRegistrations = (params = {}) =>
  useQuery({
    queryKey: ["adminScreeningRegistrations", params],
    queryFn: () => listScreeningRegistrations(params),
  });

export const useScreeningRegistration = (id) =>
  useQuery({
    queryKey: ["adminScreeningRegistrations", id],
    queryFn: () => getScreeningRegistration(id),
    enabled: !!id,
  });

export const useResendScreeningRegistration = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: resendScreeningRegistration,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminScreeningRegistrations"] }),
  });
};

export const useCheckInScreeningRegistration = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: checkInScreeningRegistration,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminScreeningRegistrations"] }),
  });
};
