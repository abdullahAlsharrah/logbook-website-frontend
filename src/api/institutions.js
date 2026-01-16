import api from "./axios";

// Get all institutions (admin sees only theirs, super admin sees all)
export const getInstitutions = async () => {
  try {
    const response = await api.get("/institutions");
    return response.data;
  } catch (error) {
    console.error("Error fetching institutions:", error);
    throw error;
  }
};

// Get single institution
export const getInstitution = async (id) => {
  try {
    const response = await api.get(`/institutions/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching institution ${id}:`, error);
    throw error;
  }
};

// Create institution (admin becomes admin automatically)
export const createInstitution = async (data) => {
  try {
    const response = await api.post("/institutions", data);
    return response.data;
  } catch (error) {
    console.error("Error creating institution:", error);
    throw error;
  }
};

// Update institution
export const updateInstitution = async (id, data) => {
  try {
    const response = await api.put(`/institutions/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating institution ${id}:`, error);
    throw error;
  }
};

// Delete institution
export const deleteInstitution = async (id) => {
  try {
    const response = await api.delete(`/institutions/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting institution ${id}:`, error);
    throw error;
  }
};

// Get institution statistics
export const getInstitutionStats = async (id) => {
  try {
    const response = await api.get(`/institutions/${id}/stats`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching institution ${id} stats:`, error);
    throw error;
  }
};

// Get institution admins
export const getInstitutionAdmins = async (id) => {
  try {
    const response = await api.get(`/institutions/${id}/admins`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching institution ${id} admins:`, error);
    throw error;
  }
};

// Add admin to institution
export const addAdminToInstitution = async (institutionId, userId) => {
  try {
    const response = await api.post(`/institutions/${institutionId}/admins`, {
      userId,
    });
    return response.data;
  } catch (error) {
    console.error(`Error adding admin to institution ${institutionId}:`, error);
    throw error;
  }
};

// Remove admin from institution
export const removeAdminFromInstitution = async (institutionId, userId) => {
  try {
    const response = await api.delete(
      `/institutions/${institutionId}/admins/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error removing admin from institution ${institutionId}:`,
      error
    );
    throw error;
  }
};
