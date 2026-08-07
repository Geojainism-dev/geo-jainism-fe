import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createScreeningRegistration,
  getScreeningRegistrationByCode,
} from "@/features/screeningRegistrations/publicApi";

export const useCreateScreeningRegistration = () =>
  useMutation({ mutationFn: createScreeningRegistration });

export const useScreeningRegistrationByCode = (code) =>
  useQuery({
    queryKey: ["screeningRegistrationByCode", code],
    queryFn: () => getScreeningRegistrationByCode(code),
    enabled: !!code,
  });
