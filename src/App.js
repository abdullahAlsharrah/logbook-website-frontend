import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import { InstitutionProvider } from "./context/InstitutionContext";
import Login from "./components/Login";
import InstitutionSelector from "./pages/InstitutionSelector";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Forms from "./pages/Forms";
import FormEdit from "./pages/FormEdit";
import FormView from "./pages/FormView";
import ViewSubmission from "./pages/ViewSubmission";
import Submissions from "./pages/Submissions";
import UserDetail from "./pages/UserDetail";
import Announcements from "./pages/Announcements";
import Institutions from "./pages/Institutions";
import InstitutionForm from "./pages/InstitutionForm";
import InstitutionDetail from "./pages/InstitutionDetail";
import Privacy from "./components/Privacy";
import PrivacyAr from "./components/PrivacyAr";
import Support from "./components/support";
import PublicLayout from "./components/PublicLayout";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  return children;
};

// Public Route Component - No authentication required
const PublicRoute = ({ children }) => {
  return <>{children}</>;
};

// App Routes Component
const AppRoutes = () => {
  return (
    <div className="App">
      <Routes>
        {/* Public Routes - Accessible without authentication */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/privacy"
          element={
            <PublicRoute>
              <PublicLayout>
                <Privacy />
              </PublicLayout>
            </PublicRoute>
          }
        />
        <Route
          path="/privacy-ar"
          element={
            <PublicRoute>
              <PublicLayout>
                <PrivacyAr />
              </PublicLayout>
            </PublicRoute>
          }
        />
        <Route
          path="/support"
          element={
            <PublicRoute>
              <PublicLayout>
                <Support />
              </PublicLayout>
            </PublicRoute>
          }
        />

        {/* Institution Selection (No Sidebar) */}
        <Route
          path="/select-institution"
          element={
            <ProtectedRoute>
              <InstitutionSelector />
            </ProtectedRoute>
          }
        />

        {/* All routes nested under institution */}
        <Route path="/institution/:institutionId">
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="users"
            element={
              <ProtectedRoute>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route
            path="users/:userId"
            element={
              <ProtectedRoute>
                <UserDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="forms"
            element={
              <ProtectedRoute>
                <Forms />
              </ProtectedRoute>
            }
          />
          <Route
            path="forms/create"
            element={
              <ProtectedRoute>
                <FormEdit />
              </ProtectedRoute>
            }
          />
          <Route
            path="forms/edit/:formId"
            element={
              <ProtectedRoute>
                <FormEdit />
              </ProtectedRoute>
            }
          />
          <Route
            path="forms/view/:formId"
            element={
              <ProtectedRoute>
                <FormView />
              </ProtectedRoute>
            }
          />
          <Route
            path="submissions"
            element={
              <ProtectedRoute>
                <Submissions />
              </ProtectedRoute>
            }
          />
          <Route
            path="submissions/view/:submissionId"
            element={
              <ProtectedRoute>
                <ViewSubmission />
              </ProtectedRoute>
            }
          />
          <Route
            path="submissions/pdf/:submissionId"
            element={
              <ProtectedRoute>
                <ViewSubmission />
              </ProtectedRoute>
            }
          />
          <Route
            path="announcements"
            element={
              <ProtectedRoute>
                <Announcements />
              </ProtectedRoute>
            }
          />
          <Route
            path="settings"
            element={
              <ProtectedRoute>
                <InstitutionDetail />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Global Institution Management (with sidebar) */}
        <Route
          path="/institutions/manage"
          element={
            <ProtectedRoute>
              <Institutions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/institutions/create"
          element={
            <ProtectedRoute>
              <InstitutionForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/institutions/edit/:institutionId"
          element={
            <ProtectedRoute>
              <InstitutionForm />
            </ProtectedRoute>
          }
        />

        {/* Default redirect - but exclude public routes */}
        <Route
          path="/"
          element={<Navigate to="/select-institution" replace />}
        />
        {/* Catch-all route - redirect to login for unknown routes, but preserve public routes */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <InstitutionProvider>
            <AppRoutes />
          </InstitutionProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

// Export for potential server-side routing configuration
export { AppRoutes };

export default App;
