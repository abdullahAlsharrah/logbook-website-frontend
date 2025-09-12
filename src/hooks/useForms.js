import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as formApi from "../api/forms";

export const useForms = (params = {}) => {
  return useQuery({
    queryKey: ["forms", params],
    queryFn: () => formApi.getForms(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useForm = (formId) => {
  return useQuery({
    queryKey: ["form", formId],
    queryFn: () => formApi.getFormById(formId),
    enabled: !!formId,
  });
};

export const useFormSubmissions = (formId, params = {}) => {
  return useQuery({
    queryKey: ["formSubmissions", formId, params],
    queryFn: () => formApi.getFormSubmissions(formId, params),
    enabled: !!formId,
  });
};

export const useSubmission = (submissionId) => {
  return useQuery({
    queryKey: ["submission", submissionId],
    queryFn: () => formApi.getSubmissionById(submissionId),
    enabled: !!submissionId,
  });
};

export const useAllSubmissions = (params = {}) => {
  return useQuery({
    queryKey: ["allSubmissions", params],
    queryFn: () => formApi.getAllSubmissions(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useFormStats = () => {
  return useQuery({
    queryKey: ["formStats"],
    queryFn: formApi.getFormStats,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCreateForm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: formApi.createForm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forms"] });
      queryClient.invalidateQueries({ queryKey: ["formStats"] });
    },
  });
};

export const useUpdateForm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ formId, formData }) => formApi.updateForm(formId, formData),
    onSuccess: (data, { formId }) => {
      queryClient.invalidateQueries({ queryKey: ["forms"] });
      queryClient.invalidateQueries({ queryKey: ["form", formId] });
      queryClient.invalidateQueries({ queryKey: ["formStats"] });
    },
  });
};

export const useDeleteForm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: formApi.deleteForm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forms"] });
      queryClient.invalidateQueries({ queryKey: ["formStats"] });
    },
  });
};

export const useUpdateSubmissionStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ submissionId, status }) =>
      formApi.updateSubmissionStatus(submissionId, status),
    onSuccess: (data, { submissionId }) => {
      queryClient.invalidateQueries({ queryKey: ["submission", submissionId] });
      queryClient.invalidateQueries({ queryKey: ["formSubmissions"] });
      queryClient.invalidateQueries({ queryKey: ["allSubmissions"] });
    },
  });
};
