import api from "./axios";

// Get all announcements
export const getAnnouncements = async (params = {}) => {
  const { data } = await api.get("/announcements", { params });
  return data;
};

// Get announcement by ID
export const getAnnouncementById = async (announcementId) => {
  const { data } = await api.get(`/announcements/${announcementId}`);
  return data;
};

// Create new announcement
export const createAnnouncement = async (announcementData) => {
  const { data } = await api.post("/announcements", announcementData);
  return data;
};

// Update announcement
export const updateAnnouncement = async (announcementId, announcementData) => {
  const { data } = await api.put(
    `/announcements/${announcementId}`,
    announcementData
  );
  return data;
};

// Delete announcement
export const deleteAnnouncement = async (announcementId) => {
  const { data } = await api.delete(`/announcements/${announcementId}`);
  return data;
};

// Update announcement status
export const updateAnnouncementStatus = async (announcementId, status) => {
  const { data } = await api.patch(`/announcements/${announcementId}/status`, {
    status,
  });
  return data;
};
