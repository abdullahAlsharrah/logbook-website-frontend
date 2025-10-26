import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as announcementApi from "../api/announcements";

export const useAnnouncements = (params = {}) => {
  return useQuery({
    queryKey: ["announcements", params],
    queryFn: () => announcementApi.getAnnouncements(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAnnouncement = (announcementId) => {
  return useQuery({
    queryKey: ["announcement", announcementId],
    queryFn: () => announcementApi.getAnnouncementById(announcementId),
    enabled: !!announcementId,
  });
};

export const useCreateAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: announcementApi.createAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
  });
};

export const useUpdateAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ announcementId, announcementData }) =>
      announcementApi.updateAnnouncement(announcementId, announcementData),
    onSuccess: (data, { announcementId }) => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      queryClient.invalidateQueries({
        queryKey: ["announcement", announcementId],
      });
    },
  });
};

export const useDeleteAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: announcementApi.deleteAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
  });
};

export const useUpdateAnnouncementStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ announcementId, status }) =>
      announcementApi.updateAnnouncementStatus(announcementId, status),
    onSuccess: (data, { announcementId }) => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      queryClient.invalidateQueries({
        queryKey: ["announcement", announcementId],
      });
    },
  });
};
