import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Modal,
  Spinner,
  Alert,
} from "react-bootstrap";
import { Building2, Plus, ArrowRight, LogOut } from "lucide-react";
import {
  useInstitutions,
  useCreateInstitution,
} from "../hooks/useInstitutions";

import "./InstitutionSelector.css";
import { useAuth } from "../context/AuthContext";

const InstitutionSelector = () => {
  const navigate = useNavigate();

  const { logout, isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    navigate("/login");
  }
  const { data: institutions, isLoading } = useInstitutions();
  const createInstitutionMutation = useCreateInstitution();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    address: "",
    contactEmail: "",
    contactPhone: "",
  });

  const handleSelectInstitution = (institutionId) => {
    localStorage.setItem("selectedInstitution", institutionId);
    navigate(`/institution/${institutionId}/dashboard`);
  };

  const handleCreateInstitution = async (e) => {
    e.preventDefault();
    try {
      const newInstitution = await createInstitutionMutation.mutateAsync(
        formData
      );
      setShowCreateModal(false);
      setFormData({
        name: "",
        code: "",
        description: "",
        address: "",
        contactEmail: "",
        contactPhone: "",
      });
      // Automatically select the newly created institution
      handleSelectInstitution(newInstitution._id);
    } catch (error) {
      console.error("Error creating institution:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (isLoading) {
    return (
      <div className="institution-selector-loading">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading institutions...</p>
      </div>
    );
  }

  return (
    <div className="institution-selector-page">
      <Container>
        <div className="selector-header">
          <div>
            <h1 className="selector-title">Select Institution</h1>
            <p className="selector-subtitle">
              Choose an institution to manage or create a new one
            </p>
          </div>
          <Button variant="outline-secondary" onClick={handleLogout}>
            <LogOut size={18} className="me-2" />
            Logout
          </Button>
        </div>

        {institutions && institutions.length === 0 ? (
          <Alert variant="info" className="text-center">
            <Building2 size={48} className="mb-3" />
            <h4>No Institutions Found</h4>
            <p>Get started by creating your first institution.</p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => setShowCreateModal(true)}>
              <Plus size={20} className="me-2" />
              Create Institution
            </Button>
          </Alert>
        ) : (
          <>
            <Row className="g-4">
              {institutions?.map((institution) => (
                <Col key={institution._id} md={6} lg={4}>
                  <Card className="institution-card">
                    <Card.Body>
                      <div className="institution-icon">
                        <Building2 size={40} />
                      </div>
                      <h3 className="institution-name">{institution.name}</h3>
                      <p className="institution-code">{institution.code}</p>
                      {institution.description && (
                        <p className="institution-description">
                          {institution.description}
                        </p>
                      )}
                      <div className="institution-stats">
                        <div className="stat-item">
                          <span className="stat-value">
                            {institution.usersCount || 0}
                          </span>
                          <span className="stat-label">Users</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-value">
                            {institution.formsCount || 0}
                          </span>
                          <span className="stat-label">Forms</span>
                        </div>
                      </div>
                      <Button
                        variant="primary"
                        className="w-100 mt-3"
                        onClick={() =>
                          handleSelectInstitution(institution._id)
                        }>
                        Enter
                        <ArrowRight size={18} className="ms-2" />
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}

              {/* Create New Institution Card */}
              <Col md={6} lg={4}>
                <Card className="institution-card create-card">
                  <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                    <div className="create-icon">
                      <Plus size={48} />
                    </div>
                    <h3 className="mt-3">Create New Institution</h3>
                    <p className="text-muted text-center">
                      Set up a new institution to manage
                    </p>
                    <Button
                      variant="outline-primary"
                      className="mt-3"
                      onClick={() => setShowCreateModal(true)}>
                      <Plus size={18} className="me-2" />
                      Create
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        )}
      </Container>

      {/* Create Institution Modal */}
      <Modal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Create New Institution</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateInstitution}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Institution Name <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., City Medical Center"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Institution Code <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., CMC001"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Brief description of the institution"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Institution address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Contact Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="contact@institution.com"
                    value={formData.contactEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, contactEmail: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Contact Phone</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="+1234567890"
                    value={formData.contactPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, contactPhone: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={
                createInstitutionMutation.isPending ||
                !formData.name ||
                !formData.code
              }>
              {createInstitutionMutation.isPending ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    className="me-2"
                  />
                  Creating...
                </>
              ) : (
                <>
                  <Plus size={18} className="me-2" />
                  Create Institution
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default InstitutionSelector;
