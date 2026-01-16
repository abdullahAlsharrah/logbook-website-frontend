import api from "./axios";

// Get comprehensive dashboard data for an institution
// institutionId is REQUIRED
export const getDashboard = async (institutionId) => {
  if (!institutionId) {
    throw new Error("institutionId is required");
  }
  const { data } = await api.get("/institutions/dashboard", {
    params: { institutionId },
  });
  return data;
};
