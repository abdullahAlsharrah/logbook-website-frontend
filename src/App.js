import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "./context/UserProvider";
import Login from "./components/Login";
import Home from "./components/Home";
import ChangePassword from "./components/ChangePassword";
import Privacy from "./components/Privacy";
import PrivacyAr from "./components/PrivacyAr";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/privacy/ar" element={<PrivacyAr />} />
            {/* <Route path="/" element={<Navigate to="/login" replace />} /> */}
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
