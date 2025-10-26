import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Row, Col, Card, Button } from "react-bootstrap";
import { ArrowLeft, Edit, FileText } from "lucide-react";
import { useForm } from "../hooks/useForms";
import DashboardLayout from "../components/layout/DashboardLayout";
import "./FormView.css";

const FormView = () => {
  const { formId } = useParams();
  const navigate = useNavigate();

  const { data: form, isLoading } = useForm(formId);

  const handleEdit = () => {
    navigate(`/forms/edit/${formId}`);
  };

  const handleBack = () => {
    navigate("/forms");
  };

  const getFieldTypeLabel = (type) => {
    const typeLabels = {
      text: "Text Input",
      textarea: "Text Area",
      select: "Dropdown",
      scale: "Scale",
      date: "Date",
      number: "Number",
    };
    return typeLabels[type] || type;
  };

  const getResponseLabel = (response) => {
    return response === "resident" ? "Resident" : "Tutor";
  };

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

  if (!form) {
    return (
      <DashboardLayout>
        <div className="error-container">
          <h3>Form Not Found</h3>
          <p>The requested form could not be found.</p>
          <Button variant="primary" onClick={handleBack}>
            Back to Forms
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="form-view-page">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-title">
            <Button
              variant="link"
              onClick={handleBack}
              className="back-btn p-0 mb-2">
              <ArrowLeft size={20} className="me-2" />
              Back to Forms
            </Button>
            <h2>Form Details</h2>
            <p>View form information and field templates</p>
          </div>
          <div className="page-actions">
            <Button variant="outline-secondary" onClick={handleBack}>
              Back
            </Button>
            <Button variant="primary" onClick={handleEdit}>
              <Edit size={16} className="me-2" />
              Edit Form
            </Button>
          </div>
        </div>

        {/* Form Information */}
        <Card className="mb-4">
          <Card.Header>
            <h5>Basic Information</h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <div className="info-item">
                  <label className="info-label">Form Name:</label>
                  <p className="info-value">{form.formName}</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="info-item">
                  <label className="info-label">Score Type:</label>
                  <p className="info-value">{form.score || "Not specified"}</p>
                </div>
              </Col>
            </Row>
            <div className="info-item">
              <label className="info-label">Scale Description:</label>
              <div className="info-value description-box">
                {form.scaleDescription ? (
                  form.scaleDescription.split("\n").map((line, index) => (
                    <p key={index} className="mb-1">
                      {line}
                    </p>
                  ))
                ) : (
                  <p className="text-muted">No description provided</p>
                )}
              </div>
            </div>
            <Row>
              <Col md={4}>
                <div className="info-item">
                  <label className="info-label">Total Fields:</label>
                  <p className="info-value">
                    {form.fieldTemplates?.length || 0} fields
                  </p>
                </div>
              </Col>
              <Col md={4}>
                <div className="info-item">
                  <label className="info-label">Created:</label>
                  <p className="info-value">
                    {form.createdAt
                      ? new Date(form.createdAt).toLocaleDateString()
                      : "Unknown"}
                  </p>
                </div>
              </Col>
              <Col md={4}>
                <div className="info-item">
                  <label className="info-label">Last Updated:</label>
                  <p className="info-value">
                    {form.updatedAt
                      ? new Date(form.updatedAt).toLocaleDateString()
                      : "Unknown"}
                  </p>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Form Preview */}
        <div className="form-preview-container">
          {!form.fieldTemplates || form.fieldTemplates.length === 0 ? (
            <Card>
              <Card.Body>
                <div className="text-center py-4">
                  <FileText size={48} className="text-muted mb-3" />
                  <h6>No Fields</h6>
                  <p className="text-muted">
                    This form has no field templates yet.
                  </p>
                </div>
              </Card.Body>
            </Card>
          ) : (
            <FormLayout
              form={form}
              getFieldTypeLabel={getFieldTypeLabel}
              getResponseLabel={getResponseLabel}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

// Form Layout Component
const FormLayout = ({ form, getFieldTypeLabel, getResponseLabel }) => {
  // Group fields by section
  const groupedFields = form.fieldTemplates.reduce((acc, field) => {
    const section = field.section || "1";
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(field);
    return acc;
  }, {});

  // Sort sections
  const sortedSections = Object.keys(groupedFields).sort((a, b) => {
    return parseInt(a) - parseInt(b);
  });

  return (
    <div className="realistic-form-container">
      {/* Form Paper */}
      <div className="form-paper">
        {/* Form Header */}
        <div className="form-header">
          <div className="form-letterhead">
            <h1 className="form-title">{form.formName}</h1>
            {form.score && (
              <div className="form-metadata">
                <span className="score-type">{form.score}</span>
              </div>
            )}
          </div>

          {form.scaleDescription && (
            <div className="form-instructions">
              <h6>Instructions:</h6>
              <div className="instructions-content">
                {form.scaleDescription.split("\n").map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Form Content */}
        <div className="form-content">
          {sortedSections.map((sectionKey, sectionIndex) => (
            <FormSection
              key={sectionKey}
              sectionKey={sectionKey}
              sectionIndex={sectionIndex}
              fields={groupedFields[sectionKey]}
              getFieldTypeLabel={getFieldTypeLabel}
              getResponseLabel={getResponseLabel}
            />
          ))}
        </div>

        {/* Form Footer */}
        <div className="form-footer">
          <div className="form-signature-section">
            <Row>
              <Col md={6}>
                <div className="signature-field">
                  <div className="signature-line"></div>
                  <label>Resident Signature</label>
                  <small className="text-muted">Date: ___________</small>
                </div>
              </Col>
              <Col md={6}>
                <div className="signature-field">
                  <div className="signature-line"></div>
                  <label>Tutor Signature</label>
                  <small className="text-muted">Date: ___________</small>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
};

// Form Section Component
const FormSection = ({
  sectionKey,
  sectionIndex,
  fields,
  getFieldTypeLabel,
  getResponseLabel,
}) => {
  // Sort fields by position (left first, then right)
  const sortedFields = fields.sort((a, b) => {
    if (a.position === "left" && b.position === "right") return -1;
    if (a.position === "right" && b.position === "left") return 1;
    return 0;
  });

  return (
    <div className="form-section">
      {/* Section Header */}
      <div className="section-header">
        <h3 className="section-title">
          {sectionKey === "1" ? "PART" : "SECTION"} {sectionKey}
        </h3>
        <div className="section-underline"></div>
      </div>

      {/* Section Fields */}
      <div className="section-fields">
        {(() => {
          const leftFields = sortedFields.filter(
            (field) => field.position === "left"
          );
          const rightFields = sortedFields.filter(
            (field) => field.position === "right"
          );
          const hasLeftFields = leftFields.length > 0;
          const hasRightFields = rightFields.length > 0;

          // If only one column has fields, make it full width
          if (hasLeftFields && !hasRightFields) {
            return (
              <div className="single-column-layout">
                {leftFields.map((field, index) => (
                  <FormField
                    key={field._id || index}
                    field={field}
                    fieldNumber={index + 1}
                    getFieldTypeLabel={getFieldTypeLabel}
                    getResponseLabel={getResponseLabel}
                  />
                ))}
              </div>
            );
          }

          if (hasRightFields && !hasLeftFields) {
            return (
              <div className="single-column-layout">
                {rightFields.map((field, index) => (
                  <FormField
                    key={field._id || index}
                    field={field}
                    fieldNumber={index + 1}
                    getFieldTypeLabel={getFieldTypeLabel}
                    getResponseLabel={getResponseLabel}
                  />
                ))}
              </div>
            );
          }

          // Two column layout when both have fields
          return (
            <Row className="g-4">
              <Col lg={6}>
                <div className="field-column">
                  {leftFields.map((field, index) => (
                    <FormField
                      key={field._id || index}
                      field={field}
                      fieldNumber={index + 1}
                      getFieldTypeLabel={getFieldTypeLabel}
                      getResponseLabel={getResponseLabel}
                    />
                  ))}
                </div>
              </Col>
              <Col lg={6}>
                <div className="field-column">
                  {rightFields.map((field, index) => (
                    <FormField
                      key={field._id || index}
                      field={field}
                      fieldNumber={leftFields.length + index + 1}
                      getFieldTypeLabel={getFieldTypeLabel}
                      getResponseLabel={getResponseLabel}
                    />
                  ))}
                </div>
              </Col>
            </Row>
          );
        })()}
      </div>
    </div>
  );
};

// Form Field Component
const FormField = ({
  field,
  fieldNumber,
  getFieldTypeLabel,
  getResponseLabel,
}) => {
  const renderFieldInput = () => {
    switch (field.type) {
      case "text":
        return (
          <div className="field-input-container">
            <div className="input-line"></div>
            <div className="field-type-indicator">
              <small>({getFieldTypeLabel(field.type)})</small>
            </div>
          </div>
        );
      case "textarea":
        return (
          <div className="field-input-container">
            <div className="textarea-lines">
              <div className="input-line"></div>
              <div className="input-line"></div>
              <div className="input-line"></div>
            </div>
            <div className="field-type-indicator">
              <small>({getFieldTypeLabel(field.type)})</small>
            </div>
          </div>
        );
      case "select":
        return (
          <div className="field-input-container">
            <div className="select-container">
              <div className="select-box">
                {/* <span className="select-placeholder">Select an option ▼</span> */}
                {field.options && field.options.length > 0 && (
                  <div className="select-options">
                    {field.options.map((option, index) => (
                      <div key={index} className="select-option">
                        □ {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="field-type-indicator">
              <small>({getFieldTypeLabel(field.type)})</small>
            </div>
          </div>
        );
      case "scale":
        return (
          <div className="field-input-container">
            <div className="scale-container">
              {field.scaleOptions?.map((option, index) => (
                <div key={index} className="scale-option">
                  <span className="radio-circle">○</span>
                  <span className="scale-label">{option}</span>
                </div>
              ))}
            </div>
            <div className="field-type-indicator">
              <small>({getFieldTypeLabel(field.type)})</small>
            </div>
          </div>
        );
      case "date":
        return (
          <div className="field-input-container">
            <div className="date-input">
              <span className="date-placeholder">DD/MM/YYYY</span>
              <div className="input-line"></div>
            </div>
            <div className="field-type-indicator">
              <small>({getFieldTypeLabel(field.type)})</small>
            </div>
          </div>
        );
      case "number":
        return (
          <div className="field-input-container">
            <div className="input-line number-line"></div>
            <div className="field-type-indicator">
              <small>({getFieldTypeLabel(field.type)})</small>
            </div>
          </div>
        );
      default:
        return (
          <div className="field-input-container">
            <div className="input-line"></div>
            <div className="field-type-indicator">
              <small>({getFieldTypeLabel(field.type)})</small>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="realistic-form-field">
      <div className="field-question">
        <span className="question-number">{fieldNumber}.</span>
        <span className="question-text">{field.name}</span>
        {field.response && (
          <span className="response-indicator">
            [{getResponseLabel(field.response)}]
          </span>
        )}
      </div>

      {field.hasDetails && field.details && (
        <div className="field-instructions">
          <em>{field.details}</em>
        </div>
      )}

      {renderFieldInput()}
    </div>
  );
};

export default FormView;
