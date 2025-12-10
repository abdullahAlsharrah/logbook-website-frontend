import React from "react";
import { Container, Row, Col, Badge, Dropdown } from "react-bootstrap";
import { Bell, User, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import InstitutionSelector from "../InstitutionSelector";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="dashboard-header">
      <Container fluid>
        <Row className="align-items-center">
          <Col>
            <div className="header-content">
              <div className="header-left">
                <h1 className="page-title">Admin Dashboard</h1>
              </div>

              <div className="header-right">
                {/* Institution Selector */}
                <div className="header-item">
                  <InstitutionSelector />
                </div>

                {/* Notifications */}
                <div className="header-item">
                  <button className="btn btn-link position-relative">
                    <Bell size={20} />
                    <Badge
                      bg="danger"
                      className="position-absolute top-0 start-100 translate-middle"
                      style={{ fontSize: "0.6rem" }}>
                      3
                    </Badge>
                  </button>
                </div>

                {/* User Menu */}
                <div className="header-item">
                  <Dropdown>
                    <Dropdown.Toggle variant="link" className="user-dropdown">
                      <div className="user-avatar">
                        {user?.username?.charAt(0)?.toUpperCase() || "A"}
                      </div>
                      <span className="user-name d-none d-md-inline m-0 p-0">
                        {user?.username || "Admin"}
                      </span>
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="user-dropdown-menu">
                      <Dropdown.Header>
                        <div className="dropdown-user-info">
                          <div className="dropdown-user-name">
                            {user?.username || "Admin"}
                          </div>
                          <div className="dropdown-user-email">
                            {user?.email || "admin@example.com"}
                          </div>
                        </div>
                      </Dropdown.Header>
                      <Dropdown.Divider />
                      <Dropdown.Item>
                        <User size={16} />
                        Profile
                      </Dropdown.Item>
                      <Dropdown.Item>
                        <Settings size={16} />
                        Settings
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item
                        onClick={handleLogout}
                        className="text-danger">
                        <LogOut size={16} />
                        Logout
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </header>
  );
};

export default Header;
