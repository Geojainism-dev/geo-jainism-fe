import { useQuery } from "@tanstack/react-query";
import { listPublicScreenings, getPublicScreening } from "@/features/publicScreenings/api";

export const usePublicScreenings = (params = {}) =>
  useQuery({
    queryKey: ["publicScreenings", params],
    queryFn: () => listPublicScreenings(params),
  });

export const usePublicScreening = (id) =>
  useQuery({
    queryKey: ["publicScreenings", id],
    queryFn: () => getPublicScreening(id),
    enabled: !!id,
  });
