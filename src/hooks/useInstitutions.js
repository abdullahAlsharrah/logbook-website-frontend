import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getInstitutions,
  getInstitution,
  createInstitution,
  updateInstitution,
  deleteInstitution,
  getInstitutionStats,
  getInstitutionAdmins,
  addAdminToInstitution,
  removeAdminFromInstitution,
} from "../api/institutions";

// Hook to fetch all institutions
export const useInstitutions = () => {
  return useQuery({
    queryKey: ["institutions"],
    queryFn: getInstitutions,
    enabled: !!localStorage.getItem("token"),
  });
};

// Hook to fetch single institution
export const useInstitution = (id) => {
  return useQuery({
    queryKey: ["institution", id],
    queryFn: () => getInstitution(id),
    enabled: !!id && !!localStorage.getItem("token"),
  });
};

// Hook to fetch institution stats
export const useInstitutionStats = (id) => {
  return useQuery({
    queryKey: ["institutionStats", id],
    queryFn: () => getInstitutionStats(id),
    enabled: !!id && !!localStorage.getItem("token"),
  });
};

// Hook to fetch institution admins
export const useInstitutionAdmins = (id) => {
  return useQuery({
    queryKey: ["institutionAdmins", id],
    queryFn: () => getInstitutionAdmins(id),
    enabled: !!id && !!localStorage.getItem("token"),
  });
};

// Hook to create institution
export const useCreateInstitution = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInstitution,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["institutions"] });
    },
  });
};

// Hook to update institution
export const useUpdateInstitution = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateInstitution(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["institutions"] });
      queryClient.invalidateQueries({
        queryKey: ["institution", variables.id],
      });
    },
  });
};

// Hook to delete institution
export const useDeleteInstitution = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteInstitution,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["institutions"] });
    },
  });
};

// Hook to add admin to institution
export const useAddAdminToInstitution = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ institutionId, userId }) =>
      addAdminToInstitution(institutionId, userId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["institutionAdmins", variables.institutionId],
      });
      queryClient.invalidateQueries({
        queryKey: ["institution", variables.institutionId],
      });
    },
  });
};

// Hook to remove admin from institution
export const useRemoveAdminFromInstitution = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ institutionId, userId }) =>
      removeAdminFromInstitution(institutionId, userId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["institutionAdmins", variables.institutionId],
      });
      queryClient.invalidateQueries({
        queryKey: ["institution", variables.institutionId],
      });
    },
  });
};
