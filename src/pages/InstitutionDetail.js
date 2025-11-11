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
  Tabs,
  Tab,
  ListGroup,
  Modal,
  Form,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Users,
  FileText,
  ClipboardList,
  Edit,
  UserPlus,
  UserMinus,
} from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import {
  useInstitution,
  useInstitutionStats,
  useInstitutionAdmins,
  useAddAdminToInstitution,
  useRemoveAdminFromInstitution,
} from "../hooks/useInstitutions";
import { useUsers } from "../hooks/useUsers";
import "./InstitutionDetail.css";

const InstitutionDetail = () => {
  const navigate = useNavigate();
  const { institutionId } = useParams();

  // Hooks
  const { data: institution, isLoading: loadingInstitution } =
    useInstitution(institutionId);
  const { data: stats, isLoading: loadingStats } =
    useInstitutionStats(institutionId);
  const {
    data: adminsData,
    isLoading: loadingAdmins,
    refetch: refetchAdmins,
  } = useInstitutionAdmins(institutionId);
  const { data: allUsers = [] } = useUsers();

  const addAdmin = useAddAdminToInstitution();
  const removeAdmin = useRemoveAdminFromInstitution();

  // State
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [removingAdminId, setRemovingAdminId] = useState(null);

  const admins = adminsData?.admins || [];

  // Filter out users who are already admins
  const availableUsers = allUsers.filter(
    (user) => !admins.some((admin) => admin._id === user._id)
  );

  const handleAddAdmin = async () => {
    if (!selectedUserId) {
      alert("Please select a user");
      return;
    }

    try {
      await addAdmin.mutateAsync({
        institutionId,
        userId: selectedUserId,
      });
      alert("Admin added successfully!");
      setShowAddAdminModal(false);
      setSelectedUserId("");
      refetchAdmins();
    } catch (error) {
      console.error("Error adding admin:", error);
      alert(error.response?.data?.message || "Failed to add admin");
    }
  };

  const handleRemoveAdmin = async (userId) => {
    if (
      window.confirm(
        "Are you sure you want to remove this admin? They will lose access to this institution."
      )
    ) {
      try {
        setRemovingAdminId(userId);
        await removeAdmin.mutateAsync({
          institutionId,
          userId,
        });
        alert("Admin removed successfully!");
        refetchAdmins();
      } catch (error) {
        console.error("Error removing admin:", error);
        alert(error.response?.data?.message || "Failed to remove admin");
      } finally {
        setRemovingAdminId(null);
      }
    }
  };

  if (loadingInstitution) {
    return (
      <DashboardLayout>
        <Container className="py-4">
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Loading institution...</p>
          </div>
        </Container>
      </DashboardLayout>
    );
  }

  if (!institution) {
    return (
      <DashboardLayout>
        <Container className="py-4">
          <Alert variant="danger">Institution not found</Alert>
          <Button onClick={() => navigate("/institutions")}>
            Back to Institutions
          </Button>
        </Container>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Container fluid className="institution-detail-page py-4">
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <Button
              variant="link"
              onClick={() => navigate("/institutions")}
              className="p-0 mb-3 text-decoration-none">
              <ArrowLeft size={20} className="me-2" />
              Back to Institutions
            </Button>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h2 className="page-title mb-2">
                  <Building2 size={32} className="me-2" />
                  {institution.name}
                  <Badge
                    bg={institution.isActive ? "success" : "secondary"}
                    className="ms-3">
                    {institution.isActive ? "Active" : "Inactive"}
                  </Badge>
                </h2>
                <p className="text-muted mb-2">Code: {institution.code}</p>
                {institution.description && (
                  <p className="text-muted">{institution.description}</p>
                )}
              </div>
              <Button
                variant="outline-primary"
                onClick={() => navigate(`/institutions/edit/${institutionId}`)}>
                <Edit size={16} className="me-2" />
                Edit Institution
              </Button>
            </div>
          </Col>
        </Row>

        {/* Tabs */}
        <Tabs defaultActiveKey="overview" className="mb-4">
          {/* Overview Tab */}
          <Tab eventKey="overview" title="Overview">
            <Row className="g-4 mt-2">
              {/* Statistics Cards */}
              {loadingStats ? (
                <Col xs={12}>
                  <div className="text-center py-3">
                    <Spinner animation="border" size="sm" />
                  </div>
                </Col>
              ) : (
                <>
                  <Col md={6} lg={3}>
                    <Card className="stat-card">
                      <Card.Body>
                        <div className="stat-icon bg-primary">
                          <Users size={24} />
                        </div>
                        <div className="stat-content">
                          <div className="stat-value">
                            {stats?.usersCount || 0}
                          </div>
                          <div className="stat-label">Total Users</div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6} lg={3}>
                    <Card className="stat-card">
                      <Card.Body>
                        <div className="stat-icon bg-success">
                          <Users size={24} />
                        </div>
                        <div className="stat-content">
                          <div className="stat-value">
                            {stats?.adminsCount || 0}
                          </div>
                          <div className="stat-label">Admins</div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6} lg={3}>
                    <Card className="stat-card">
                      <Card.Body>
                        <div className="stat-icon bg-info">
                          <FileText size={24} />
                        </div>
                        <div className="stat-content">
                          <div className="stat-value">
                            {stats?.formTemplatesCount || 0}
                          </div>
                          <div className="stat-label">Form Templates</div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6} lg={3}>
                    <Card className="stat-card">
                      <Card.Body>
                        <div className="stat-icon bg-warning">
                          <ClipboardList size={24} />
                        </div>
                        <div className="stat-content">
                          <div className="stat-value">
                            {stats?.formSubmitionsCount || 0}
                          </div>
                          <div className="stat-label">Submissions</div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6} lg={3}>
                    <Card className="stat-card">
                      <Card.Body>
                        <div className="stat-icon bg-secondary">
                          <Users size={24} />
                        </div>
                        <div className="stat-content">
                          <div className="stat-value">
                            {stats?.tutorsCount || 0}
                          </div>
                          <div className="stat-label">Tutors</div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6} lg={3}>
                    <Card className="stat-card">
                      <Card.Body>
                        <div className="stat-icon bg-danger">
                          <Users size={24} />
                        </div>
                        <div className="stat-content">
                          <div className="stat-value">
                            {stats?.residentsCount || 0}
                          </div>
                          <div className="stat-label">Residents</div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </>
              )}

              {/* Institution Details */}
              <Col lg={6}>
                <Card>
                  <Card.Header>
                    <h5 className="mb-0">Contact Information</h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="info-group">
                      <strong>Email:</strong>
                      <span>{institution.contactEmail || "Not provided"}</span>
                    </div>
                    <div className="info-group">
                      <strong>Phone:</strong>
                      <span>{institution.contactPhone || "Not provided"}</span>
                    </div>
                    <div className="info-group">
                      <strong>Address:</strong>
                      <span>{institution.address || "Not provided"}</span>
                    </div>
                    <div className="info-group">
                      <strong>Created:</strong>
                      <span>
                        {institution.createdAt
                          ? new Date(institution.createdAt).toLocaleDateString()
                          : "Unknown"}
                      </span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab>

          {/* Admins Tab */}
          <Tab eventKey="admins" title="Admins">
            <Card className="mt-2">
              <Card.Header>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Institution Admins</h5>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setShowAddAdminModal(true)}>
                    <UserPlus size={16} className="me-2" />
                    Add Admin
                  </Button>
                </div>
              </Card.Header>
              <Card.Body>
                {loadingAdmins ? (
                  <div className="text-center py-3">
                    <Spinner animation="border" />
                  </div>
                ) : admins.length === 0 ? (
                  <Alert variant="info">
                    No admins assigned to this institution
                  </Alert>
                ) : (
                  <ListGroup variant="flush">
                    {admins.map((admin) => (
                      <ListGroup.Item
                        key={admin._id}
                        className="d-flex justify-content-between align-items-center">
                        <div>
                          <div className="fw-bold">{admin.username}</div>
                          <div className="text-muted small">{admin.email}</div>
                          <div className="mt-1">
                            {admin.roles?.map((role) => (
                              <Badge key={role} bg="secondary" className="me-1">
                                {role}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleRemoveAdmin(admin._id)}
                          disabled={removingAdminId === admin._id}>
                          {removingAdminId === admin._id ? (
                            <Spinner animation="border" size="sm" />
                          ) : (
                            <>
                              <UserMinus size={16} />
                            </>
                          )}
                        </Button>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </Card.Body>
            </Card>
          </Tab>
        </Tabs>

        {/* Add Admin Modal */}
        <Modal
          show={showAddAdminModal}
          onHide={() => setShowAddAdminModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add Admin to Institution</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Select User</Form.Label>
              <Form.Select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}>
                <option value="">Choose a user...</option>
                {availableUsers.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.username} ({user.email}) - {user.roles?.join(", ")}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowAddAdminModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddAdmin}>
              Add Admin
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </DashboardLayout>
  );
};

export default InstitutionDetail;
