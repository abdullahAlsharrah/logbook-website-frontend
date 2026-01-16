import React from "react";
import { Link } from "react-router-dom";

/**
 * PublicLayout - Simple layout wrapper for public pages (privacy, support)
 * This ensures these pages are accessible without authentication
 */
function PublicLayout({ children, title = "KIMS Surgilog" }) {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <nav
        style={{
          backgroundColor: "#fff",
          padding: "1rem 2rem",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          marginBottom: "2rem",
        }}>
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
          <Link
            to="/login"
            style={{
              textDecoration: "none",
              color: "#2c3e50",
              fontSize: "1.25rem",
              fontWeight: "bold",
            }}>
            {title}
          </Link>
          <div style={{ display: "flex", gap: "1rem" }}>
            <Link
              to="/privacy"
              style={{ textDecoration: "none", color: "#666" }}>
              Privacy
            </Link>
            <Link
              to="/privacy-ar"
              style={{ textDecoration: "none", color: "#666" }}>
              الخصوصية
            </Link>
            <Link
              to="/support"
              style={{ textDecoration: "none", color: "#666" }}>
              Support
            </Link>
            <Link
              to="/login"
              style={{ textDecoration: "none", color: "#3498db" }}>
              Login
            </Link>
          </div>
        </div>
      </nav>
      <main
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 2rem 2rem",
        }}>
        {children}
      </main>
      <footer
        style={{
          marginTop: "4rem",
          padding: "2rem",
          textAlign: "center",
          color: "#666",
          borderTop: "1px solid #e0e0e0",
        }}>
        <p>© 2025 KIMS Surgilog. All rights reserved.</p>
        <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
          <Link to="/privacy" style={{ textDecoration: "none", color: "#666" }}>
            Privacy Policy
          </Link>
          {" | "}
          <Link to="/support" style={{ textDecoration: "none", color: "#666" }}>
            Support
          </Link>
        </p>
      </footer>
    </div>
  );
}

export default PublicLayout;
