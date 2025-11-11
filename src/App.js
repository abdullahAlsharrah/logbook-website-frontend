import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import { InstitutionProvider } from "./context/InstitutionContext";
import Login from "./components/Login";
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

// Public Route Component
const PublicRoute = ({ children }) => {
  return children;
};

// App Routes Component
const AppRoutes = () => {
  return (
    <div className="App">
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/:userId"
          element={
            <ProtectedRoute>
              <UserDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forms"
          element={
            <ProtectedRoute>
              <Forms />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forms/create"
          element={
            <ProtectedRoute>
              <FormEdit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forms/edit/:formId"
          element={
            <ProtectedRoute>
              <FormEdit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forms/view/:formId"
          element={
            <ProtectedRoute>
              <FormView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/submissions"
          element={
            <ProtectedRoute>
              <Submissions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/submissions/view/:submissionId"
          element={
            <ProtectedRoute>
              <ViewSubmission />
            </ProtectedRoute>
          }
        />
        <Route
          path="/submissions/pdf/:submissionId"
          element={
            <ProtectedRoute>
              <ViewSubmission />
            </ProtectedRoute>
          }
        />
        <Route
          path="/announcements"
          element={
            <ProtectedRoute>
              <Announcements />
            </ProtectedRoute>
          }
        />

        {/* Institution Management Routes */}
        <Route
          path="/institutions"
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
        <Route
          path="/institutions/:institutionId"
          element={
            <ProtectedRoute>
              <InstitutionDetail />
            </ProtectedRoute>
          }
        />

        {/* Analytics and Settings routes (placeholder) */}
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <div className="dashboard-layout">
                <div className="dashboard-main">
                  <div className="dashboard-content">
                    <div className="container-fluid">
                      <h2>Analytics</h2>
                      <p>Analytics page coming soon...</p>
                    </div>
                  </div>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <div className="dashboard-layout">
                <div className="dashboard-main">
                  <div className="dashboard-content">
                    <div className="container-fluid">
                      <h2>Settings</h2>
                      <p>Settings page coming soon...</p>
                    </div>
                  </div>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
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

export default App;
