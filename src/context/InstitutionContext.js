import { createContext, useContext, useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getInstitutions } from "../api/institutions";

const InstitutionContext = createContext();

export const useInstitution = () => {
  const context = useContext(InstitutionContext);
  if (!context) {
    throw new Error(
      "useInstitution must be used within an InstitutionProvider"
    );
  }
  return context;
};

export const InstitutionProvider = ({ children }) => {
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const queryClient = useQueryClient();

  // Fetch institutions (only when authenticated)
  const {
    data: institutions = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["institutions"],
    queryFn: getInstitutions,
    enabled: !!localStorage.getItem("token"),
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Initialize selected institution from localStorage or default to first
  useEffect(() => {
    if (institutions.length > 0 && !selectedInstitution) {
      const savedInstitution = localStorage.getItem("selectedInstitution");

      if (
        savedInstitution &&
        institutions.some((inst) => inst._id === savedInstitution)
      ) {
        // Use saved institution if it exists in the list
        setSelectedInstitution(savedInstitution);
      } else {
        // Default to first institution
        setSelectedInstitution(institutions[0]._id);
      }
    }
  }, [institutions, selectedInstitution]);

  // Persist selected institution to localStorage
  useEffect(() => {
    if (selectedInstitution) {
      localStorage.setItem("selectedInstitution", selectedInstitution);
    }
  }, [selectedInstitution]);

  // Handle institution change
  const handleInstitutionChange = (institutionId) => {
    setSelectedInstitution(institutionId);

    // Invalidate all data queries that depend on institution
    queryClient.invalidateQueries({ queryKey: ["users"] });
    queryClient.invalidateQueries({ queryKey: ["forms"] });
    queryClient.invalidateQueries({ queryKey: ["submissions"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard"] });
  };

  // Clear institution selection (for "All Institutions" option)
  const clearInstitutionSelection = () => {
    setSelectedInstitution(null);
    localStorage.removeItem("selectedInstitution");

    // Invalidate queries to fetch all data
    queryClient.invalidateQueries({ queryKey: ["users"] });
    queryClient.invalidateQueries({ queryKey: ["forms"] });
    queryClient.invalidateQueries({ queryKey: ["submissions"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard"] });
  };

  // Get current institution object
  const currentInstitution = institutions.find(
    (inst) => inst._id === selectedInstitution
  );

  // Refresh institutions list
  const refreshInstitutions = async () => {
    await queryClient.invalidateQueries({ queryKey: ["institutions"] });
  };

  const value = {
    institutions,
    selectedInstitution,
    currentInstitution,
    isLoading,
    error,
    setSelectedInstitution: handleInstitutionChange,
    clearInstitutionSelection,
    refreshInstitutions,
    refetch,
  };

  return (
    <InstitutionContext.Provider value={value}>
      {children}
    </InstitutionContext.Provider>
  );
};
