import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Building2,
  Users,
  // FileText,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import {
  useInstitutions,
  useDeleteInstitution,
} from "../hooks/useInstitutions";
import "./Institutions.css";

const Institutions = () => {
  const navigate = useNavigate();
  const {
    data: institutions = [],
    isLoading,
    error,
    refetch,
  } = useInstitutions();
  const deleteInstitution = useDeleteInstitution();
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this institution?")) {
      try {
        setDeletingId(id);
        await deleteInstitution.mutateAsync(id);
        refetch();
      } catch (error) {
        console.error("Error deleting institution:", error);
        alert(error.response?.data?.message || "Failed to delete institution");
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <Container className="py-4">
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Loading institutions...</p>
          </div>
        </Container>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <Container className="py-4">
          <Alert variant="danger">
            <Alert.Heading>Error Loading Institutions</Alert.Heading>
            <p>{error.message || "Failed to load institutions"}</p>
            <Button variant="outline-danger" onClick={() => refetch()}>
              Try Again
            </Button>
          </Alert>
        </Container>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Container fluid className="institutions-page py-4">
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="page-title mb-2">
                  <Building2 size={32} className="me-2" />
                  My Institutions
                </h2>
                <p className="text-muted">Manage institutions you administer</p>
              </div>
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate("/institutions/create")}
                className="d-flex align-items-center gap-2">
                <Plus size={20} />
                Create Institution
              </Button>
            </div>
          </Col>
        </Row>

        {/* Institutions Grid */}
        {institutions.length === 0 ? (
          <Row>
            <Col>
              <Card className="text-center py-5">
                <Card.Body>
                  <Building2 size={64} className="text-muted mb-3" />
                  <h4>No Institutions Yet</h4>
                  <p className="text-muted">
                    Create your first institution to get started
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => navigate("/institutions/create")}>
                    <Plus size={16} className="me-2" />
                    Create Institution
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        ) : (
          <Row className="g-4">
            {institutions.map((institution) => (
              <Col key={institution._id} xs={12} md={6} lg={4}>
                <Card className="institution-card h-100">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="institution-logo">
                        {institution.logo ? (
                          <img
                            src={institution.logo}
                            alt={institution.name}
                            className="img-fluid"
                          />
                        ) : (
                          <div className="institution-logo-placeholder">
                            <Building2 size={32} />
                          </div>
                        )}
                      </div>
                      <Badge
                        bg={institution.isActive ? "success" : "secondary"}
                        className="status-badge">
                        {institution.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>

                    <h5 className="institution-name mb-2">
                      {institution.name}
                    </h5>
                    <p className="institution-code text-muted mb-3">
                      Code: {institution.code}
                    </p>

                    {institution.description && (
                      <p className="institution-description text-muted small mb-3">
                        {institution.description.length > 100
                          ? `${institution.description.substring(0, 100)}...`
                          : institution.description}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="institution-stats mb-3">
                      <div className="stat-item">
                        <Users size={16} />
                        <span>{institution.admins?.length || 0} Admins</span>
                      </div>
                    </div>

                    {/* Contact Info */}
                    {institution.contactEmail && (
                      <div className="contact-info mb-3">
                        <small className="text-muted">
                          {institution.contactEmail}
                        </small>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="institution-actions d-flex gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() =>
                          navigate(`/institutions/${institution._id}`)
                        }
                        className="flex-fill">
                        <Eye size={16} />
                        View
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() =>
                          navigate(`/institutions/edit/${institution._id}`)
                        }>
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(institution._id)}
                        disabled={deletingId === institution._id}>
                        {deletingId === institution._id ? (
                          <Spinner animation="border" size="sm" as="span" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </DashboardLayout>
  );
};

export default Institutions;
