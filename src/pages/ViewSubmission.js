import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Row, Col, Button, Badge } from "react-bootstrap";
import { ArrowLeft, Download, Printer } from "lucide-react";
import { useSubmission, useForm } from "../hooks/useForms";
import DashboardLayout from "../components/layout/DashboardLayout";
import "./ViewSubmission.css";

const ViewSubmission = () => {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're in PDF mode
  const isPDFView = location.pathname.includes("/pdf/");
  const submission = location.state?.submission;

  // Use submission data from state or fetch from API
  const { data: submissionData, isLoading: submissionLoading } = useSubmission(
    submission?._id || submissionId
  );

  const finalSubmission = submission || submissionData;

  // Fetch the complete form template using the form template ID
  const { data: formTemplate, isLoading: formLoading } = useForm(
    finalSubmission?.formTemplate?._id
  );

  const isLoading = submissionLoading || formLoading;

  const handleBack = () => {
    navigate("/submissions");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // This would typically call a PDF generation API
    console.log("Downloading PDF...");
    // For now, we'll just trigger print which can save as PDF
    window.print();
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

  if (!finalSubmission || !formTemplate) {
    return (
      <DashboardLayout>
        <div className="error-container">
          <h3>Submission Not Found</h3>
          <p>The requested submission could not be found.</p>
          <Button variant="primary" onClick={handleBack}>
            Back to Submissions
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="view-submission-page">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-title">
            <Button
              variant="link"
              onClick={handleBack}
              className="back-btn p-0 mb-2">
              <ArrowLeft size={20} className="me-2" />
              Back to Submissions
            </Button>
            <h2>Submission Details</h2>
            <p>View submitted form data and responses</p>
          </div>
          <div className="page-actions">
            <Button variant="outline-secondary" onClick={handleBack}>
              Back
            </Button>
            {isPDFView && (
              <>
                <Button variant="outline-primary" onClick={handlePrint}>
                  <Printer size={16} className="me-2" />
                  Print
                </Button>
                <Button variant="primary" onClick={handleDownloadPDF}>
                  <Download size={16} className="me-2" />
                  Download PDF
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Form Preview */}
        <div className="form-preview-container">
          <SubmissionLayout
            form={formTemplate}
            submission={finalSubmission}
            getFieldTypeLabel={getFieldTypeLabel}
            getResponseLabel={getResponseLabel}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

// Submission Layout Component
const SubmissionLayout = ({
  form,
  submission,
  getFieldTypeLabel,
  getResponseLabel,
}) => {
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

  // Create a map of field values for submission view
  const fieldValues = {};
  if (submission?.fieldRecord) {
    submission.fieldRecord.forEach((field) => {
      fieldValues[field.fieldTemplate] = field.value;
    });
  }

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
                <span className="score-type">Score Type: {form.score}</span>
              </div>
            )}
            <div className="submission-metadata">
              <Row>
                <Col md={6}>
                  <div className="metadata-item">
                    <strong>Resident:</strong> {submission.resident?.username}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="metadata-item">
                    <strong>Tutor:</strong> {submission.tutor?.username}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <div className="metadata-item">
                    <strong>Submitted:</strong>{" "}
                    {new Date(submission.createdAt).toLocaleDateString()}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="metadata-item">
                    <strong>Status:</strong>
                    <Badge
                      bg={
                        submission.status === "completed"
                          ? "success"
                          : "warning"
                      }
                      className="ms-2">
                      {submission.status}
                    </Badge>
                  </div>
                </Col>
              </Row>
            </div>
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
            <SubmissionSection
              key={sectionKey}
              sectionKey={sectionKey}
              sectionIndex={sectionIndex}
              fields={groupedFields[sectionKey]}
              fieldValues={fieldValues}
              getFieldTypeLabel={getFieldTypeLabel}
              getResponseLabel={getResponseLabel}
            />
          ))}
        </div>

        {/* Form Footer
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
        </div> */}
      </div>
    </div>
  );
};

// Submission Section Component
const SubmissionSection = ({
  sectionKey,
  sectionIndex,
  fields,
  fieldValues,
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
                  <SubmissionField
                    key={field._id || index}
                    field={field}
                    fieldNumber={index + 1}
                    fieldValue={fieldValues[field._id]}
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
                  <SubmissionField
                    key={field._id || index}
                    field={field}
                    fieldNumber={index + 1}
                    fieldValue={fieldValues[field._id]}
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
                    <SubmissionField
                      key={field._id || index}
                      field={field}
                      fieldNumber={index + 1}
                      fieldValue={fieldValues[field._id]}
                      getFieldTypeLabel={getFieldTypeLabel}
                      getResponseLabel={getResponseLabel}
                    />
                  ))}
                </div>
              </Col>
              <Col lg={6}>
                <div className="field-column">
                  {rightFields.map((field, index) => (
                    <SubmissionField
                      key={field._id || index}
                      field={field}
                      fieldNumber={leftFields.length + index + 1}
                      fieldValue={fieldValues[field._id]}
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

// Submission Field Component
const SubmissionField = ({
  field,
  fieldNumber,
  fieldValue,
  getFieldTypeLabel,
  getResponseLabel,
}) => {
  const renderFieldInput = () => {
    switch (field.type) {
      case "text":
        return (
          <div className="field-input-container">
            {fieldValue ? (
              <div className="submission-value">
                <strong>{fieldValue}</strong>
              </div>
            ) : (
              <div className="input-line"></div>
            )}
            <div className="field-type-indicator">
              <small>({getFieldTypeLabel(field.type)})</small>
            </div>
          </div>
        );
      case "textarea":
        return (
          <div className="field-input-container">
            {fieldValue ? (
              <div className="submission-value textarea-value">
                <strong>{fieldValue}</strong>
              </div>
            ) : (
              <div className="textarea-lines">
                <div className="input-line"></div>
                <div className="input-line"></div>
                <div className="input-line"></div>
              </div>
            )}
            <div className="field-type-indicator">
              <small>({getFieldTypeLabel(field.type)})</small>
            </div>
          </div>
        );
      case "select":
        return (
          <div className="field-input-container">
            {fieldValue ? (
              <div className="submission-value">
                <strong>Selected: {fieldValue}</strong>
              </div>
            ) : (
              <div className="select-container">
                <div className="select-box">
                  <span className="select-placeholder">Select an option ▼</span>
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
            )}
            <div className="field-type-indicator">
              <small>({getFieldTypeLabel(field.type)})</small>
            </div>
          </div>
        );
      case "scale":
        return (
          <div className="field-input-container">
            {fieldValue ? (
              <div className="submission-value">
                <strong>Selected: {fieldValue}</strong>
              </div>
            ) : (
              <div className="scale-container">
                {field.scaleOptions?.map((option, index) => (
                  <div key={index} className="scale-option">
                    <span className="radio-circle">○</span>
                    <span className="scale-label">{option}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="field-type-indicator">
              <small>({getFieldTypeLabel(field.type)})</small>
            </div>
          </div>
        );
      case "date":
        return (
          <div className="field-input-container">
            {fieldValue ? (
              <div className="submission-value">
                <strong>{fieldValue}</strong>
              </div>
            ) : (
              <div className="date-input">
                <span className="date-placeholder">DD/MM/YYYY</span>
                <div className="input-line"></div>
              </div>
            )}
            <div className="field-type-indicator">
              <small>({getFieldTypeLabel(field.type)})</small>
            </div>
          </div>
        );
      case "number":
        return (
          <div className="field-input-container">
            {fieldValue ? (
              <div className="submission-value">
                <strong>{fieldValue}</strong>
              </div>
            ) : (
              <div className="input-line number-line"></div>
            )}
            <div className="field-type-indicator">
              <small>({getFieldTypeLabel(field.type)})</small>
            </div>
          </div>
        );
      default:
        return (
          <div className="field-input-container">
            {fieldValue ? (
              <div className="submission-value">
                <strong>{fieldValue}</strong>
              </div>
            ) : (
              <div className="input-line"></div>
            )}
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

export default ViewSubmission;
