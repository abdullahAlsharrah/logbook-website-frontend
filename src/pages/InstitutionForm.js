import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  // Alert,
  Spinner,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Building2 } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import {
  useInstitution,
  useCreateInstitution,
  useUpdateInstitution,
} from "../hooks/useInstitutions";
import "./InstitutionForm.css";

const InstitutionForm = () => {
  const navigate = useNavigate();
  const { institutionId } = useParams();
  const isEditMode = !!institutionId;

  // Hooks
  const { data: institution, isLoading: loadingInstitution } =
    useInstitution(institutionId);
  const createInstitution = useCreateInstitution();
  const updateInstitution = useUpdateInstitution();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    logo: "",
    isActive: true,
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Load institution data in edit mode
  useEffect(() => {
    if (institution && isEditMode) {
      setFormData({
        name: institution.name || "",
        code: institution.code || "",
        description: institution.description || "",
        contactEmail: institution.contactEmail || "",
        contactPhone: institution.contactPhone || "",
        address: institution.address || "",
        logo: institution.logo || "",
        isActive:
          institution.isActive !== undefined ? institution.isActive : true,
      });
    }
  }, [institution, isEditMode]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Institution name is required";
    }

    if (!formData.code.trim()) {
      newErrors.code = "Institution code is required";
    }

    if (formData.contactEmail && !/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);

      if (isEditMode) {
        await updateInstitution.mutateAsync({
          id: institutionId,
          data: formData,
        });
        alert("Institution updated successfully!");
      } else {
        await createInstitution.mutateAsync(formData);
        alert("Institution created successfully!");
      }

      navigate("/institutions");
    } catch (error) {
      console.error("Error saving institution:", error);
      alert(
        error.response?.data?.message ||
          `Failed to ${isEditMode ? "update" : "create"} institution`
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingInstitution && isEditMode) {
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

  return (
    <DashboardLayout>
      <Container fluid className="institution-form-page py-4">
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
            <h2 className="page-title">
              <Building2 size={32} className="me-2" />
              {isEditMode ? "Edit Institution" : "Create New Institution"}
            </h2>
          </Col>
        </Row>

        {/* Form */}
        <Row>
          <Col lg={8}>
            <Card>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  {/* Basic Information */}
                  <h5 className="mb-3">Basic Information</h5>

                  <Form.Group className="mb-3">
                    <Form.Label>
                      Institution Name <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      isInvalid={!!errors.name}
                      placeholder="Enter institution name"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.name}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>
                      Institution Code <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleChange}
                      isInvalid={!!errors.code}
                      placeholder="e.g., MED001"
                      disabled={isEditMode} // Usually don't change code after creation
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.code}
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted">
                      A unique identifier for this institution
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Enter a brief description of the institution"
                    />
                  </Form.Group>

                  {/* Contact Information */}
                  <h5 className="mb-3 mt-4">Contact Information</h5>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Contact Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="contactEmail"
                          value={formData.contactEmail}
                          onChange={handleChange}
                          isInvalid={!!errors.contactEmail}
                          placeholder="contact@example.com"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.contactEmail}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Contact Phone</Form.Label>
                        <Form.Control
                          type="tel"
                          name="contactPhone"
                          value={formData.contactPhone}
                          onChange={handleChange}
                          placeholder="+1234567890"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-4">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter full address"
                    />
                  </Form.Group>

                  {/* Logo URL */}
                  <h5 className="mb-3 mt-4">Branding</h5>

                  <Form.Group className="mb-4">
                    <Form.Label>Logo URL</Form.Label>
                    <Form.Control
                      type="text"
                      name="logo"
                      value={formData.logo}
                      onChange={handleChange}
                      placeholder="https://example.com/logo.png"
                    />
                    <Form.Text className="text-muted">
                      Enter the URL of the institution's logo image
                    </Form.Text>
                  </Form.Group>

                  {/* Status */}
                  <Form.Group className="mb-4">
                    <Form.Check
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      label="Active Institution"
                    />
                    <Form.Text className="text-muted d-block mt-1">
                      Inactive institutions will be hidden from most views
                    </Form.Text>
                  </Form.Group>

                  {/* Submit Buttons */}
                  <div className="d-flex gap-2 mt-4">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={submitting}
                      className="d-flex align-items-center gap-2">
                      {submitting ? (
                        <>
                          <Spinner animation="border" size="sm" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={20} />
                          {isEditMode
                            ? "Update Institution"
                            : "Create Institution"}
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline-secondary"
                      onClick={() => navigate("/institutions")}
                      disabled={submitting}>
                      Cancel
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* Preview/Help */}
          <Col lg={4}>
            <Card className="sticky-top" style={{ top: "2rem" }}>
              <Card.Body>
                <h6 className="mb-3">Information</h6>
                <div className="help-text">
                  <p className="small text-muted">
                    {isEditMode
                      ? "Update the institution's information. Changes will be reflected immediately."
                      : "Create a new institution. You will be automatically assigned as an admin."}
                  </p>
                  <p className="small text-muted">
                    <strong>Required fields:</strong>
                  </p>
                  <ul className="small text-muted">
                    <li>Institution Name</li>
                    <li>Institution Code</li>
                  </ul>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </DashboardLayout>
  );
};

export default InstitutionForm;
