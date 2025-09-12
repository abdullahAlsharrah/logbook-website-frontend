import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { getUser } from "../api/users";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: userData,
    isLoading: userLoading,
    error: userError,
  } = useQuery({
    queryKey: ["me"],
    queryFn: () => {
      console.log("useQuery getUser function called");
      return getUser();
    },
    enabled: !!localStorage.getItem("token"), // Only fetch if token exists
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Update user state when data is fetched
  useEffect(() => {
    if (userData) {
      console.log("AuthContext userData:", userData);
      setUser(userData);
    }
  }, [userData]);

  // Debug logging
  useEffect(() => {
    console.log("AuthContext token exists:", !!localStorage.getItem("token"));
    console.log("AuthContext userLoading:", userLoading);
    console.log("AuthContext userError:", userError);
    console.log("AuthContext userData:", userData);
  }, [userLoading, userError, userData]);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;

          if (decoded.exp > currentTime) {
            console.log(
              "Valid token found, user data will be fetched automatically"
            );
            setLoading(false);
          } else {
            console.log("Token expired, removing...");
            localStorage.removeItem("token");
            setUser(null);
            setLoading(false);
          }
        } else {
          console.log("No token found");
          setLoading(false);
        }
      } catch (error) {
        console.error("Token decode error:", error);
        localStorage.removeItem("token");
        setUser(null);
        setLoading(false);
      }
    };

    // Small delay to ensure router is ready
    const timer = setTimeout(initializeAuth, 0);
    return () => clearTimeout(timer);
  }, []);

  const login = async (token) => {
    try {
      console.log("AuthContext login called with token:", token);
      localStorage.setItem("token", token);
      console.log("Token stored in localStorage");

      // Invalidate and refetch user data
      console.log("Invalidating and refetching user data...");
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      console.log("User data invalidated and refetch triggered");

      navigate("/dashboard", { replace: true });
      setLoading(false);
    } catch (error) {
      console.error("Login error:", error);
      setLoading(false);
      throw error;
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem("token");
      setUser(null);
      // Clear the user query cache
      queryClient.removeQueries({ queryKey: ["me"] });
      console.log("User logged out and cache cleared");
      // Navigation will be handled by components that call logout
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("token");
      setUser(null);
      queryClient.removeQueries({ queryKey: ["me"] });
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = () => {
    return !!localStorage.getItem("token");
  };

  const hasRole = (role) => {
    return user?.roles?.includes(role) || false;
  };

  const hasPermission = (permission) => {
    return user?.permissions?.includes(permission) || false;
  };

  const refreshUser = async () => {
    console.log("Refreshing user data...");
    await queryClient.invalidateQueries({ queryKey: ["me"] });
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    hasRole,
    hasPermission,
    setUser,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
