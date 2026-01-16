import React, { useState } from "react";
import { Nav, Offcanvas, Button } from "react-bootstrap";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  House,
  User,
  FileText,
  Megaphone,
  BarChart3,
  Settings,
  Menu,
  Building2,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useInstitution } from "../../context/InstitutionContext";
import "./Sidebar.css";
import { BASE_URL } from "../../api/constants";

const Sidebar = () => {
  const [show, setShow] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { institutionId } = useParams();
  const { logout, user, loading } = useAuth();
  const { institutions } = useInstitution();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  console.log("Sidebar user data:", user);
  console.log("Sidebar loading:", loading);

  if (loading) {
    return <div>Loading...</div>;
  }

  const currentInstitution = institutions?.find(
    (inst) => inst._id === institutionId
  );

  const handleChangeInstitution = () => {
    localStorage.removeItem("selectedInstitution");
    navigate("/select-institution");
  };

  const menuItems = [
    {
      path: `/institution/${institutionId}/dashboard`,
      icon: House,
      label: "Dashboard",
    },
    { path: `/institution/${institutionId}/users`, icon: User, label: "Users" },
    {
      path: `/institution/${institutionId}/forms`,
      icon: FileText,
      label: "Forms",
    },
    {
      path: `/institution/${institutionId}/submissions`,
      icon: FileText,
      label: "Submissions",
    },
    {
      path: `/institution/${institutionId}/announcements`,
      icon: Megaphone,
      label: "Announcements",
    },
    {
      path: `/institution/${institutionId}/settings`,
      icon: Settings,
      label: "Settings",
    },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const NavItem = ({ item }) => {
    const Icon = item.icon;
    return (
      <Nav.Link
        as={Link}
        to={item.path}
        className={`sidebar-nav-link ${isActive(item.path) ? "active" : ""}`}
        onClick={handleClose}>
        <Icon size={20} />
        <span>{item.label}</span>
      </Nav.Link>
    );
  };

  // console.log("user", user);

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="d-lg-none mobile-toggle">
        <button className="btn btn-link" onClick={handleShow}>
          <Menu size={24} />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <div className="sidebar d-none d-lg-block">
        <div className="sidebar-header">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h4 className="mb-0">Admin Dashboard</h4>
          </div>
          {currentInstitution && (
            <div className="current-institution">
              <div className="d-flex align-items-center gap-2 mb-2">
                <Building2 size={18} className="text-primary" />
                <span className="institution-name">
                  {currentInstitution.name}
                </span>
              </div>
              <Button
                variant="outline-secondary"
                size="sm"
                className="w-100"
                onClick={handleChangeInstitution}>
                <ArrowLeft size={16} className="me-2" />
                Change Institution
              </Button>
            </div>
          )}
        </div>

        <div className="sidebar-user">
          <div className="user-info">
            {" "}
            <div
              className="user-avatar"
              style={{
                background: user?.image
                  ? "white"
                  : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}>
              {user?.image ? (
                <img
                  src={BASE_URL + user?.image}
                  alt={user?.username}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              ) : (
                user?.username?.charAt(0)?.toUpperCase() || "N"
              )}
            </div>
            <div className="user-info">
              <div className="user-name">{user?.username || "Admin"}</div>
            </div>
          </div>
          <div className="user-role" style={{ marginLeft: "3rem" }}>
            {user?.roles?.join(", ") || "Administrator"}
          </div>
        </div>

        <Nav className="sidebar-nav">
          {menuItems.map((item, index) => (
            <NavItem key={index} item={item} />
          ))}
        </Nav>

        <div className="sidebar-footer">
          <button
            className="btn btn-outline-danger w-100"
            onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Offcanvas */}
      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="start"
        className="sidebar-offcanvas">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <div>
              Admin Dashboard
              {currentInstitution && (
                <div className="mt-2 d-flex align-items-center gap-2">
                  <Building2 size={16} className="text-primary" />
                  <small className="text-muted">
                    {currentInstitution.name}
                  </small>
                </div>
              )}
            </div>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {currentInstitution && (
            <Button
              variant="outline-secondary"
              size="sm"
              className="w-100 mb-3"
              onClick={() => {
                handleChangeInstitution();
                handleClose();
              }}>
              <ArrowLeft size={16} className="me-2" />
              Change Institution
            </Button>
          )}

          <div className="sidebar-user mb-3">
            <div
              className="user-avatar"
              style={{
                background: user?.image
                  ? "white"
                  : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}>
              {user?.image ? (
                <img
                  src={BASE_URL + user?.image}
                  alt={user?.username}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              ) : (
                user?.username?.charAt(0)?.toUpperCase() || "A"
              )}
            </div>
            <div className="user-info">
              <div className="user-name">{user?.username || "Admin"}</div>
              <div className="user-role">
                {user?.roles?.join(", ") || "Administrator"}
              </div>
            </div>
          </div>

          <Nav className="sidebar-nav">
            {menuItems.map((item, index) => (
              <NavItem key={index} item={item} />
            ))}
          </Nav>

          <div className="sidebar-footer mt-auto">
            <button
              className="btn btn-outline-danger w-100"
              onClick={handleLogout}>
              Logout
            </button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Sidebar;
