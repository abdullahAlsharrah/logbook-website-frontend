import api from "./axios";

// Get assessment options from backend
export const getAssessmentOptions = async () => {
  try {
    const { data } = await api.get("/constants/assessment-options");
    return data.assessmentOptions || [];
  } catch (error) {
    console.error("Error fetching assessment options:", error);
    // Fallback to default options if API fails
    return ["Satisfactory", "Needs Improvement", "Unsatisfactory"];
  }
};

// Get all constants
export const getConstants = async () => {
  try {
    const { data } = await api.get("/constants");
    return data.constants || {};
  } catch (error) {
    console.error("Error fetching constants:", error);
    throw error;
  }
};
// export const BASE_URL = "http://localhost:8000/";
export const BASE_URL = "https://logbook-backend.onrender.com/";
