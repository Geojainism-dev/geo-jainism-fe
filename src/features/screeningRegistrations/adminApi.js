import { api } from "@/lib/api";

export const listScreeningRegistrations = async (params = {}) => {
  const { data } = await api.get("/admin/screening-registrations", { params });
  return data.data; // { registrations, pagination }
};

export const getScreeningRegistration = async (id) => {
  const { data } = await api.get(`/admin/screening-registrations/${id}`);
  return data.data;
};

export const resendScreeningRegistration = async (id) => {
  const { data } = await api.post(`/admin/screening-registrations/${id}/resend`);
  return data.data;
};

export const checkInScreeningRegistration = async (registrationCode) => {
  const { data } = await api.post("/admin/screening-registrations/checkin", { registrationCode });
  return data.data;
};

export const getExportUrl = ({ screeningId, format = "xlsx" } = {}) => {
  const params = new URLSearchParams();
  if (screeningId) params.set("screeningId", screeningId);
  params.set("format", format);
  return `${import.meta.env.VITE_API_BASE_URL}/admin/screening-registrations/export?${params.toString()}`;
};
