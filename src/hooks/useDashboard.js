import { useQuery } from "@tanstack/react-query";
import * as dashboardApi from "../api/dashboard";

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: dashboardApi.getDashboardStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useRecentActivities = (params = {}) => {
  return useQuery({
    queryKey: ["recentActivities", params],
    queryFn: () => dashboardApi.getRecentActivities(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useChartData = (type, params = {}) => {
  return useQuery({
    queryKey: ["chartData", type, params],
    queryFn: () => dashboardApi.getChartData(type, params),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const usePendingItems = () => {
  return useQuery({
    queryKey: ["pendingItems"],
    queryFn: dashboardApi.getPendingItems,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
