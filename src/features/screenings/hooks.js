import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listScreenings,
  getScreening,
  createScreening,
  updateScreening,
  deleteScreening,
  updateScreeningRsvpFields,
} from "@/features/screenings/api";

export const useScreenings = (params = {}) =>
  useQuery({
    queryKey: ["screenings", params],
    queryFn: () => listScreenings(params),
  });

export const useScreening = (id) =>
  useQuery({
    queryKey: ["screenings", id],
    queryFn: () => getScreening(id),
    enabled: !!id,
  });

export const useCreateScreening = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createScreening,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["screenings"] }),
  });
};

export const useUpdateScreening = (id) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => updateScreening(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["screenings"] }),
  });
};

export const useDeleteScreening = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteScreening,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["screenings"] }),
  });
};

export const useUpdateScreeningRsvpFields = (id) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (customFields) => updateScreeningRsvpFields(id, customFields),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["screenings"] });
      queryClient.invalidateQueries({ queryKey: ["screenings", id] });
    },
  });
};
