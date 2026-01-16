import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Table,
  Button,
  Badge,
  Form,
  Modal,
  Dropdown,
  InputGroup,
  ProgressBar,
} from "react-bootstrap";
import {
  Search,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  Download,
  MoreVertical,
  FileText,
  Building2,
} from "lucide-react";
import {
  useAllSubmissions,
  useUpdateSubmissionStatus,
  useForms,
} from "../hooks/useForms";
import { useInstitution } from "../context/InstitutionContext";
import DashboardLayout from "../components/layout/DashboardLayout";
import "./Submissions.css";

const Submissions = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [formFilter, setFormFilter] = useState("");
  const [selectedSubmission] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Institution context
  const { selectedInstitution } = useInstitution();

  // Build params with institutionId if selected
  const queryParams = useMemo(() => {
    const params = {};
    if (selectedInstitution) {
      params.institutionId = selectedInstitution;
    }
    return params;
  }, [selectedInstitution]);

  const { data: submissions, isLoading } = useAllSubmissions(queryParams);
  const { data: forms } = useForms(queryParams);
  const updateStatusMutation = useUpdateSubmissionStatus();

  const handleViewForm = (submission) => {
    // Navigate to ViewSubmission with submission data
    navigate(`/submissions/view/${submission._id}`, {
      state: { submission },
    });
  };

  const handleViewPDF = (submission) => {
    // Navigate to ViewSubmission with PDF mode
    navigate(`/submissions/pdf/${submission._id}`, {
      state: { submission },
    });
  };

  const handleStatusChange = async (submissionId, newStatus) => {
    try {
      await updateStatusMutation.mutateAsync({
        submissionId,
        status: newStatus,
      });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const filteredSubmissions =
    submissions?.filter((submission) => {
      const matchesSearch =
        submission.resident?.username
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        submission.tutor?.username
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        submission.formTemplate?.formName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchesStatus = !statusFilter || submission.status === statusFilter;
      const matchesForm =
        !formFilter || submission.formTemplate?._id === formFilter;

      return matchesSearch && matchesStatus && matchesForm;
    }) || [];

  const getStatusBadge = (status) => {
    const variants = {
      pending: "warning",
      completed: "success",
      rejected: "danger",
      under_review: "info",
    };
    return (
      <Badge bg={variants[status] || "secondary"}>
        {status.replace("_", " ")}
      </Badge>
    );
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle size={16} className="text-success" />;
      case "rejected":
        return <XCircle size={16} className="text-danger" />;
      case "pending":
        return <Clock size={16} className="text-warning" />;
      default:
        return <Clock size={16} className="text-info" />;
    }
  };

  const getStatusStats = () => {
    const stats = {
      total: submissions?.length || 0,
      pending: submissions?.filter((s) => s.status === "pending").length || 0,
      completed:
        submissions?.filter((s) => s.status === "completed").length || 0,
      rejected: submissions?.filter((s) => s.status === "rejected").length || 0,
    };

    return {
      ...stats,
      pendingPercentage:
        stats.total > 0 ? (stats.pending / stats.total) * 100 : 0,
      completedPercentage:
        stats.total > 0 ? (stats.completed / stats.total) * 100 : 0,
      rejectedPercentage:
        stats.total > 0 ? (stats.rejected / stats.total) * 100 : 0,
    };
  };

  const stats = getStatusStats();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="loading-container">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="submissions-page">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-title">
            <h2>Submissions</h2>
            <p>Review and manage form submissions</p>
          </div>
          <div className="header-actions">
            <Button variant="outline-primary" size="sm">
              <Download size={16} className="me-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <Row className="mb-4">
          <Col lg={3} md={6} className="mb-3">
            <Card className="stat-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-info">
                    <h6 className="stat-title">Total Submissions</h6>
                    <h3 className="stat-value">{stats.total}</h3>
                  </div>
                  <div className="stat-icon primary">
                    <FileText size={24} />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <Card className="stat-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-info">
                    <h6 className="stat-title">Pending</h6>
                    <h3 className="stat-value">{stats.pending}</h3>
                    <ProgressBar
                      now={stats.pendingPercentage}
                      variant="warning"
                      className="mt-2"
                      style={{ height: "4px" }}
                    />
                  </div>
                  <div className="stat-icon warning">
                    <Clock size={24} />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <Card className="stat-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-info">
                    <h6 className="stat-title">Completed</h6>
                    <h3 className="stat-value">{stats.completed}</h3>
                    <ProgressBar
                      now={stats.completedPercentage}
                      variant="success"
                      className="mt-2"
                      style={{ height: "4px" }}
                    />
                  </div>
                  <div className="stat-icon success">
                    <CheckCircle size={24} />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <Card className="stat-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-info">
                    <h6 className="stat-title">Rejected</h6>
                    <h3 className="stat-value">{stats.rejected}</h3>
                    <ProgressBar
                      now={stats.rejectedPercentage}
                      variant="danger"
                      className="mt-2"
                      style={{ height: "4px" }}
                    />
                  </div>
                  <div className="stat-icon danger">
                    <XCircle size={24} />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Filters */}
        <Card className="mb-4">
          <Card.Body>
            <Row>
              <Col md={4}>
                <InputGroup>
                  <InputGroup.Text>
                    <Search size={16} />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search submissions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col md={3}>
                <Form.Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                  <option value="under_review">Under Review</option>
                </Form.Select>
              </Col>
              <Col md={3}>
                <Form.Select
                  value={formFilter}
                  onChange={(e) => setFormFilter(e.target.value)}>
                  <option value="">All Forms</option>
                  {forms?.map((form) => (
                    <option key={form._id} value={form._id}>
                      {form.formName}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={2}>
                <Button
                  variant="outline-secondary"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("");
                    setFormFilter("");
                  }}>
                  Clear
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Submissions Table */}
        <Card>
          <Card.Header>
            <div className="d-flex justify-content-between align-items-center">
              <h5>Submissions ({filteredSubmissions.length})</h5>
            </div>
          </Card.Header>
          <Card.Body className="p-0">
            <Table responsive hover className="submissions-table">
              <thead>
                <tr>
                  <th style={{ textAlign: "center", width: "20%" }}>User</th>
                  <th style={{ textAlign: "center", width: "25%" }}>Form</th>
                  <th style={{ textAlign: "center", width: "15%" }}>
                    Institution
                  </th>
                  <th style={{ textAlign: "center", width: "10%" }}>Status</th>
                  <th style={{ textAlign: "center", width: "15%" }}>
                    Submitted
                  </th>
                  <th style={{ textAlign: "center", width: "15%" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((submission) => (
                  <tr key={submission._id}>
                    <td style={{ textAlign: "left", verticalAlign: "middle" }}>
                      <div className="user-info">
                        <div className="user-avatar">
                          {submission.resident?.username
                            ?.charAt(0)
                            ?.toUpperCase() || "R"}
                        </div>
                        <div>
                          <div className="user-name">
                            {submission.resident?.username ||
                              "Unknown Resident"}{" "}
                            {/* • Resident */}
                          </div>
                          <small className="text-muted">
                            {submission.tutor?.username || "Unknown Tutor"}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td
                      style={{ textAlign: "center", verticalAlign: "middle" }}>
                      <div className="form-info">
                        <div className="form-title">
                          {submission.formTemplate?.formName || "Unknown Form"}
                        </div>
                        <small className="text-muted">
                          {submission.fieldRecord?.length || 0} fields completed
                        </small>
                      </div>
                    </td>
                    <td
                      style={{ textAlign: "center", verticalAlign: "middle" }}>
                      {submission.formTemplate?.institution ? (
                        <Badge
                          bg="info"
                          className="d-inline-flex align-items-center gap-1">
                          <Building2 size={12} />
                          {submission.formTemplate.institution.name}
                        </Badge>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                    <td
                      style={{ textAlign: "center", verticalAlign: "middle" }}>
                      <div className="status-cell">
                        {getStatusIcon(submission.status)}
                        {getStatusBadge(submission.status)}
                        {submission.assessment && (
                          <div className="mt-1">
                            <Badge
                              bg={
                                submission.assessment === "Satisfactory"
                                  ? "success"
                                  : submission.assessment === "Needs Improvement"
                                  ? "warning"
                                  : "danger"
                              }
                              className="assessment-badge">
                              {submission.assessment}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </td>
                    <td
                      style={{ textAlign: "center", verticalAlign: "middle" }}>
                      <div className="date-info">
                        <div>
                          {new Date(submission.createdAt).toLocaleDateString()}
                        </div>
                        <small className="text-muted">
                          {new Date(submission.createdAt).toLocaleTimeString()}
                        </small>
                      </div>
                    </td>
                    <td
                      style={{ textAlign: "center", verticalAlign: "middle" }}>
                      <div className="actions">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleViewForm(submission)}
                          className="me-2">
                          <Eye size={14} />
                        </Button>
                        <Dropdown>
                          <Dropdown.Toggle
                            variant="outline-secondary"
                            size="sm">
                            <MoreVertical size={14} />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            {submission.status === "pending" && (
                              <>
                                <Dropdown.Item
                                  onClick={() =>
                                    handleStatusChange(
                                      submission._id,
                                      "completed"
                                    )
                                  }>
                                  <CheckCircle size={16} className="me-2" />
                                  Mark Complete
                                </Dropdown.Item>
                                <Dropdown.Item
                                  onClick={() =>
                                    handleStatusChange(
                                      submission._id,
                                      "rejected"
                                    )
                                  }>
                                  <XCircle size={16} className="me-2" />
                                  Reject
                                </Dropdown.Item>
                              </>
                            )}
                            <Dropdown.Item
                              onClick={() => handleViewPDF(submission)}>
                              <FileText size={16} className="me-2" />
                              View PDF
                            </Dropdown.Item>
                            <Dropdown.Item>
                              <Download size={16} className="me-2" />
                              Download PDF
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {filteredSubmissions.length === 0 && (
              <div className="no-data">
                <p>No submissions found</p>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Submission Details Modal */}
        <Modal
          show={showDetailsModal}
          onHide={() => setShowDetailsModal(false)}
          size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Submission Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedSubmission && (
              <div className="submission-details">
                <Row className="mb-3">
                  <Col md={6}>
                    <h6>Participant Information</h6>
                    <p>
                      <strong>Resident:</strong>{" "}
                      {selectedSubmission.resident?.username}
                    </p>
                    <p>
                      <strong>Tutor:</strong>{" "}
                      {selectedSubmission.tutor?.username}
                    </p>
                  </Col>
                  <Col md={6}>
                    <h6>Form Information</h6>
                    <p>
                      <strong>Form:</strong>{" "}
                      {selectedSubmission.formTemplate?.formName}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      {getStatusBadge(selectedSubmission.status)}
                    </p>
                    <p>
                      <strong>Submitted:</strong>{" "}
                      {new Date(selectedSubmission.createdAt).toLocaleString()}
                    </p>
                  </Col>
                </Row>

                <div className="submission-data">
                  <h6>Submission Data</h6>
                  <div className="submission-fields">
                    {selectedSubmission.fieldRecord &&
                    selectedSubmission.fieldRecord.length > 0 ? (
                      selectedSubmission.fieldRecord.map((field) => (
                        <div key={field._id} className="field-item">
                          <strong>{field.fieldName}:</strong> {field.value}
                        </div>
                      ))
                    ) : (
                      <p className="text-muted">No data available</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowDetailsModal(false)}>
              Close
            </Button>
            {selectedSubmission?.status === "pending" && (
              <>
                <Button
                  variant="success"
                  onClick={() => {
                    handleStatusChange(selectedSubmission._id, "completed");
                    setShowDetailsModal(false);
                  }}>
                  <CheckCircle size={16} className="me-2" />
                  Mark Complete
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    handleStatusChange(selectedSubmission._id, "rejected");
                    setShowDetailsModal(false);
                  }}>
                  <XCircle size={16} className="me-2" />
                  Reject
                </Button>
              </>
            )}
          </Modal.Footer>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Submissions;
