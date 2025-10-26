import api from "./axios";

// Get all users with pagination and filters
export const getUsers = async (params = {}) => {
  const { data } = await api.get("/users", { params });
  return data;
};

// Get user by ID
export const getUserById = async (userId) => {
  const { data } = await api.get(`/users/${userId}`);
  return data;
};

// Create new user
export const createUser = async (userData) => {
  const formData = new FormData();
  for (const key in userData) {
    if (key === "image" && userData.image instanceof File) {
      formData.append(key, userData.image);
    } else {
      formData.append(key, userData[key]);
    }
  }
  const { data } = await api.post("/users", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

// Update user
export const updateUser = async (userId, userData) => {
  const formData = new FormData();
  for (const key in userData) {
    if (key === "image" && userData.image instanceof File) {
      formData.append(key, userData.image);
    } else {
      formData.append(key, userData[key]);
    }
  }
  const { data } = await api.put(`/users/${userId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

// Delete user
export const deleteUser = async (userId) => {
  const { data } = await api.delete(`/users/${userId}`);
  return data;
};

// Get users by role
export const getUsersByRole = async (role) => {
  const { data } = await api.get(`/users/role/${role}`);
  return data;
};

// Get user statistics
export const getUserStats = async () => {
  const { data } = await api.get("/users/stats");
  return data;
};

// Get user submissions count
export const getUserSubmissions = async (userId) => {
  const { data } = await api.get(`/users/${userId}/submissions`);
  return data;
};

// Update user status
export const updateUserStatus = async (userId, status) => {
  const { data } = await api.patch(`/users/${userId}/status`, { status });
  return data;
};

// Get tutor list for supervisor selection
export const getTutorList = async () => {
  const { data } = await api.get("/users/tutor-list");
  return data;
};

export const getUser = async () => {
  try {
    const { data } = await api.get(`/users/me`);
    console.log("getUser data", data);
    return data;
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
};
