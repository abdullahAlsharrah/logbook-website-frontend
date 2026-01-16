import { useQuery } from "@tanstack/react-query";
import * as constantsApi from "../api/constants";

export const useAssessmentOptions = () => {
  return useQuery({
    queryKey: ["assessmentOptions"],
    queryFn: constantsApi.getAssessmentOptions,
    staleTime: 30 * 60 * 1000, // 30 minutes - cache for a while since these don't change often
    retry: 2,
  });
};

export const useConstants = () => {
  return useQuery({
    queryKey: ["constants"],
    queryFn: constantsApi.getConstants,
    staleTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
  });
};
