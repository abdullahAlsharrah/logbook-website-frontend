import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Button,
  Form,
  Dropdown,
  InputGroup,
  Badge,
} from "react-bootstrap";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  FileText,
  Copy,
  Archive,
  Settings,
  Building2,
} from "lucide-react";
import { useForms, useDeleteForm } from "../hooks/useForms";
import { useInstitution } from "../context/InstitutionContext";
// import LevelBadge from "../components/LevelBadge";
import DashboardLayout from "../components/layout/DashboardLayout";
import "./Forms.css";

const Forms = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

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

  const { data: forms, isLoading } = useForms(queryParams);
  const deleteFormMutation = useDeleteForm();

  const handleCreateForm = () => {
    navigate("/forms/create");
  };

  const handleEditForm = (form) => {
    navigate(`/forms/edit/${form._id}`);
  };

  const handleDelete = async (formId) => {
    if (window.confirm("Are you sure you want to delete this form?")) {
      try {
        await deleteFormMutation.mutateAsync(formId);
      } catch (error) {
        console.error("Error deleting form:", error);
      }
    }
  };

  const filteredForms =
    forms?.filter((form) => {
      const matchesSearch =
        form?.formName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        form?.scaleDescription
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      return matchesSearch;
    }) || [];

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
      <div className="forms-page">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-title">
            <h2>Form Management</h2>
            <p>Create and manage forms for your application</p>
          </div>
          <Button
            variant="primary"
            onClick={handleCreateForm}
            className="add-form-btn">
            <Plus size={16} className="me-2" />
            Create New Form
          </Button>
        </div>

        {/* Filters and Search */}
        <Card className="mb-4">
          <Card.Body>
            <Row>
              <Col md={6}>
                <InputGroup>
                  <InputGroup.Text>
                    <Search size={16} />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search forms..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col md={6}>
                <Button
                  variant="outline-secondary"
                  onClick={() => {
                    setSearchTerm("");
                  }}>
                  Clear
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Forms Grid */}
        <Row>
          {filteredForms.map((form) => (
            <Col lg={4} md={6} className="mb-4" key={form.id}>
              <Card className="form-card">
                <Card.Body>
                  <div className="form-header">
                    <div className="form-icon">
                      <FileText size={24} />
                    </div>
                  </div>

                  <h5
                    className="form-card-title"
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}>
                    {form?.formName}
                  </h5>

                  {/* Institution Badge */}
                  <div className="mb-2">
                    {form?.institution && (
                      <Badge
                        bg="info"
                        className="me-1 d-inline-flex align-items-center gap-1">
                        <Building2 size={12} />
                        {form.institution.name}
                      </Badge>
                    )}
                    {form?.levelRestricted && form?.minLevel && (
                      <Badge
                        bg="warning"
                        className="d-inline-flex align-items-center gap-1">
                        Level: {form.minLevel}+
                      </Badge>
                    )}
                  </div>

                  <p className="form-description">{form?.scaleDescription}</p>

                  <div className="form-stats">
                    <div className="stat">
                      <span className="stat-label">Score</span>
                      <span className="stat-value">{form?.score || "N/A"}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Fields</span>
                      <span className="stat-value">
                        {form?.fieldTemplates?.length || 0}
                      </span>
                    </div>
                  </div>

                  <div className="form-actions">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => navigate(`/forms/view/${form._id}`)}>
                      <Eye size={14} className="me-1" />
                      View
                    </Button>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEditForm(form)}>
                      <Edit size={14} className="me-1" />
                      Edit
                    </Button>
                    <Dropdown>
                      <Dropdown.Toggle variant="outline-secondary" size="sm">
                        <MoreVertical size={14} />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item>
                          <Copy size={16} className="me-2" />
                          Duplicate
                        </Dropdown.Item>
                        <Dropdown.Item>
                          <Archive size={16} className="me-2" />
                          Archive
                        </Dropdown.Item>
                        <Dropdown.Item>
                          <Settings size={16} className="me-2" />
                          Settings
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item
                          onClick={() => handleDelete(form?._id)}
                          className="text-danger">
                          <Trash2 size={16} className="me-2" />
                          Delete
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </Card.Body>
                <Card.Footer>
                  <small className="text-muted">
                    Created: {new Date(form?.createdAt).toLocaleDateString()}
                  </small>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>

        {filteredForms.length === 0 && (
          <Card>
            <Card.Body className="text-center py-5">
              <FileText size={48} className="text-muted mb-3" />
              <h5>No forms found</h5>
              <p className="text-muted">
                Create your first form to get started
              </p>
              <Button variant="primary" onClick={handleCreateForm}>
                <Plus size={16} className="me-2" />
                Create New Form
              </Button>
            </Card.Body>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Forms;
