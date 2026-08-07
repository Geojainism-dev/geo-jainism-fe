import { api } from "@/lib/api";

export const createScreeningRegistration = async (payload) => {
  const { data } = await api.post("/screening-registrations", payload);
  return data.data;
};

export const getScreeningRegistrationByCode = async (code) => {
  const { data } = await api.get(`/screening-registrations/${code}`);
  return data.data;
};
