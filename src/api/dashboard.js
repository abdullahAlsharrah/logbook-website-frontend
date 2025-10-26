import api from "./axios";

// Get dashboard overview statistics
export const getDashboardStats = async () => {
  const { data } = await api.get("/dashboard/stats");
  return data;
};

// Get recent activities
export const getRecentActivities = async (params = {}) => {
  const { data } = await api.get("/dashboard/activities", { params });
  return data;
};

// Get chart data for analytics
export const getChartData = async (type, params = {}) => {
  const { data } = await api.get(`/dashboard/charts/${type}`, { params });
  return data;
};

// Get pending items count
export const getPendingItems = async () => {
  const { data } = await api.get("/dashboard/pending");
  return data;
};
