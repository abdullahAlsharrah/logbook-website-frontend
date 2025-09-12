import api from "./axios";

// Get all forms
export const getForms = async (params = {}) => {
  try {
    const { data } = await api.get("/formTemplates", { params });
    return data;
  } catch (error) {
    console.error("Error fetching forms:", error);
    throw error;
  }
};

// Get form by ID
export const getFormById = async (formId) => {
  try {
    const { data } = await api.get(`/formTemplates/${formId}`);
    return data;
  } catch (error) {
    console.error("Error fetching form by ID:", error);
    throw error;
  }
};

// Create new form
export const createForm = async (formData) => {
  try {
    const { data } = await api.post("/formTemplates", formData);
    return data;
  } catch (error) {
    console.error("Error creating form:", error);
    throw error;
  }
};

// Update form
export const updateForm = async (formId, formData) => {
  try {
    const { data } = await api.put(`/formTemplates/${formId}`, formData);
    return data;
  } catch (error) {
    console.error("Error updating form:", error);
    throw error;
  }
};

// Delete form
export const deleteForm = async (formId) => {
  try {
    const { data } = await api.delete(`/formTemplates/${formId}`);
    return data;
  } catch (error) {
    console.error("Error deleting form:", error);
    throw error;
  }
};

// Get form submissions
export const getFormSubmissions = async (formId, params = {}) => {
  try {
    const { data } = await api.get(`/formTemplates/${formId}/formSubmitions`, {
      params,
    });
    return data;
  } catch (error) {
    console.error("Error fetching form submissions:", error);
    throw error;
  }
};

// Get submission by ID
export const getSubmissionById = async (submissionId) => {
  try {
    const { data } = await api.get(`/formSubmitions/${submissionId}`);
    return data;
  } catch (error) {
    console.error("Error fetching submission by ID:", error);
    throw error;
  }
};

// Update submission status
export const updateSubmissionStatus = async (submissionId, status) => {
  try {
    const { data } = await api.patch(`/formSubmitions/${submissionId}/status`, {
      status,
    });
    return data;
  } catch (error) {
    console.error("Error updating submission status:", error);
    throw error;
  }
};

// Get form statistics
export const getFormStats = async () => {
  try {
    const { data } = await api.get("/forms/stats");
    return data;
  } catch (error) {
    console.error("Error fetching form statistics:", error);
    throw error;
  }
};

// Get all submissions
export const getAllSubmissions = async (params = {}) => {
  try {
    const { data } = await api.get("/formSubmitions?formPlatform=web", {
      params,
    });
    return data;
  } catch (error) {
    console.error("Error fetching all submissions:", error);
    throw error;
  }
};

// Get all submissions
export const getSubmissionsByUserId = async (
  userId,
  role = "user",
  params = {}
) => {
  try {
    const { data } = await api.get(`/formSubmitions/user/${userId}`, {
      params,
    });
    return data;
  } catch (error) {
    console.error("Error fetching all submissions:", error);
    throw error;
  }
};
