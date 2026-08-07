import { api } from "@/lib/api";

export const listPublicScreenings = async (params = {}) => {
  const { data } = await api.get("/screenings", { params });
  return data.data; // { screenings, pagination }
};

export const getPublicScreening = async (id) => {
  const { data } = await api.get(`/screenings/${id}`);
  return data.data;
};
