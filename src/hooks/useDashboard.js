import { useQuery } from "@tanstack/react-query";
import * as dashboardApi from "../api/dashboard";

// Get comprehensive dashboard data for an institution
export const useDashboard = (institutionId) => {
  return useQuery({
    queryKey: ["dashboard", institutionId],
    queryFn: () => dashboardApi.getDashboard(institutionId),
    enabled: !!institutionId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
