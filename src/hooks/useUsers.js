import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as userApi from "../api/users";
import * as formApi from "../api/forms";
import { useAuth } from "../context/AuthContext";

export const useUsers = (institutionId, params = {}) => {
  return useQuery({
    queryKey: ["users", institutionId, params],
    queryFn: () => userApi.getUsers(institutionId, params),
    enabled: !!institutionId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUser = (userId) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => userApi.getUserById(userId),
    enabled: !!userId,
  });
};

export const useUsersByRole = (role) => {
  return useQuery({
    queryKey: ["users", "role", role],
    queryFn: () => userApi.getUsersByRole(role),
    enabled: !!role,
  });
};

export const useUserStats = () => {
  return useQuery({
    queryKey: ["userStats"],
    queryFn: userApi.getUserStats,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useUserSubmissions = (userId, role) => {
  return useQuery({
    queryKey: ["userSubmissions", userId],
    queryFn: () => formApi.getSubmissionsByUserId(userId, role),
    enabled: !!userId,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({ userId, userData }) => userApi.updateUser(userId, userData),
    onSuccess: (data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      if (userId === user?._id) {
        queryClient.invalidateQueries({ queryKey: ["me"] });
      }
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
    },
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, status }) =>
      userApi.updateUserStatus(userId, status),
    onSuccess: (data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
    },
  });
};

export const useTutorList = (institutionId) => {
  return useQuery({
    queryKey: ["tutorList", institutionId],
    queryFn: () => userApi.getTutorList(institutionId),
    enabled: !!institutionId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useUpdateUserLevel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, levelData }) =>
      userApi.updateUserLevel(userId, levelData),
    onSuccess: (data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
    },
  });
};
