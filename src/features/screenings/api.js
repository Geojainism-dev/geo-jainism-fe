import { api } from "@/lib/api";

export const listScreenings = async (params = {}) => {
  const { data } = await api.get("/admin/screenings", { params });
  return data.data; // { screenings, pagination }
};

export const getScreening = async (id) => {
  const { data } = await api.get(`/admin/screenings/${id}`);
  return data.data;
};

export const createScreening = async (payload) => {
  const { data } = await api.post("/admin/screenings", payload);
  return data.data;
};

export const updateScreening = async (id, payload) => {
  const { data } = await api.put(`/admin/screenings/${id}`, payload);
  return data.data;
};

export const deleteScreening = async (id) => {
  await api.delete(`/admin/screenings/${id}`);
};

export const uploadScreeningImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  const { data } = await api.post("/admin/upload/screening", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data; // { id, url, type, size, createdAt }
};

// SUPER_ADMIN only — always a full replace of the screening's custom fields.
export const updateScreeningRsvpFields = async (id, customFields) => {
  const { data } = await api.put(`/admin/screenings/${id}/rsvp-fields`, { customFields });
  return data.data;
};
