import React from "react";
import { Container } from "react-bootstrap";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./DashboardLayout.css";

const DashboardLayout = ({ children }) => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <Header />
        <main className="dashboard-content">
          <Container fluid>{children}</Container>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
