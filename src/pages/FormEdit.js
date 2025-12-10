import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Row, Col, Card, Button, Form, Alert, Badge } from "react-bootstrap";
import { ArrowLeft, Save, Plus, Trash2, Edit, Eye } from "lucide-react";
import { useForm, useUpdateForm, useCreateForm } from "../hooks/useForms";
import DashboardLayout from "../components/layout/DashboardLayout";
import "./FormEdit.css";

const FormEdit = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const isEditing = !!formId;

  const { data: form, isLoading } = useForm(formId);
  const updateFormMutation = useUpdateForm();
  const createFormMutation = useCreateForm();

  const [formData, setFormData] = useState({
    formName: "",
    score: "",
    scaleDescription: "",
    fieldTemplates: [],
    levelRestricted: false,
    minLevel: "",
    maxLevel: "",
  });

  const [errors, setErrors] = useState({});

  // Load form data when editing
  useEffect(() => {
    if (form && isEditing) {
      // Convert old options format to new optionsWithLevels format
      const convertedFieldTemplates = (form.fieldTemplates || []).map(
        (field) => {
          // If field has old options array but no optionsWithLevels, convert it
          if (
            field.type === "select" &&
            field.options &&
            !field.optionsWithLevels
          ) {
            return {
              ...field,
              optionsWithLevels: field.options.map((opt) => ({
                value: opt,
                label: opt,
                minLevel: "",
              })),
            };
          }
          // If field has optionsWithLevels but it's empty and has old options, convert
          if (
            field.type === "select" &&
            field.options &&
            field.optionsWithLevels &&
            field.optionsWithLevels.length === 0
          ) {
            return {
              ...field,
              optionsWithLevels: field.options.map((opt) => ({
                value: opt,
                label: opt,
                minLevel: "",
              })),
            };
          }
          return field;
        }
      );

      setFormData({
        formName: form.formName || "",
        score: form.score || "",
        scaleDescription: form.scaleDescription || "",
        fieldTemplates: convertedFieldTemplates,
        levelRestricted: form.levelRestricted || false,
        minLevel: form.minLevel || "",
        maxLevel: form.maxLevel || "",
      });
    }
  }, [form, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors = {};
    if (!formData.formName.trim()) {
      newErrors.formName = "Form name is required";
    }
    if (!formData.scaleDescription.trim()) {
      newErrors.scaleDescription = "Scale description is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      if (isEditing) {
        await updateFormMutation.mutateAsync({
          formId: formId,
          formData: formData,
        });
      } else {
        await createFormMutation.mutateAsync(formData);
      }
      navigate("/forms");
    } catch (error) {
      console.error("Error saving form:", error);
      setErrors({ submit: "Failed to save form. Please try again." });
    }
  };

  const handleCancel = () => {
    navigate("/forms");
  };

  const addFieldTemplate = () => {
    const newField = {
      name: "",
      type: "text",
      hasDetails: false,
      details: "",
      scaleOptions: [],
      position: "left",
      response: "resident",
      section: "1",
      optionsWithLevels: [], // Default for select fields
    };

    setFormData({
      ...formData,
      fieldTemplates: [...formData.fieldTemplates, newField],
    });
  };

  const updateFieldTemplate = (index, field) => {
    const updatedFields = [...formData.fieldTemplates];
    updatedFields[index] = field;
    setFormData({
      ...formData,
      fieldTemplates: updatedFields,
    });
  };

  const removeFieldTemplate = (index) => {
    const updatedFields = formData.fieldTemplates.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      fieldTemplates: updatedFields,
    });
  };

  if (isLoading && isEditing) {
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
      <div className="form-edit-page">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-title">
            <Button
              variant="link"
              onClick={handleCancel}
              className="back-btn p-0 mb-2">
              <ArrowLeft size={20} className="me-2" />
              Back to Forms
            </Button>
            <h2>{isEditing ? "Edit Form" : "Create New Form"}</h2>
            <p>
              {isEditing
                ? "Update form details and field templates"
                : "Create a new form with custom fields and validation"}
            </p>
          </div>
          <div className="page-actions">
            <Button variant="outline-secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={
                createFormMutation.isPending || updateFormMutation.isPending
              }>
              {createFormMutation.isPending || updateFormMutation.isPending ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} className="me-2" />
                  Save Form
                </>
              )}
            </Button>
          </div>
        </div>

        {errors.submit && (
          <Alert variant="danger" className="mb-4">
            {errors.submit}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          {/* Basic Form Information */}
          <Card className="mb-4">
            <Card.Header>
              <h5>Basic Information</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Form Name *</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.formName}
                      onChange={(e) =>
                        setFormData({ ...formData, formName: e.target.value })
                      }
                      placeholder="Enter form name"
                      isInvalid={!!errors.formName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.formName}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Score Type</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.score}
                      onChange={(e) =>
                        setFormData({ ...formData, score: e.target.value })
                      }
                      placeholder="e.g., SCORE, GRADE, RATING"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Scale Description *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={6}
                  value={formData.scaleDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      scaleDescription: e.target.value,
                    })
                  }
                  placeholder="Enter detailed scale description..."
                  isInvalid={!!errors.scaleDescription}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.scaleDescription}
                </Form.Control.Feedback>
              </Form.Group>
            </Card.Body>
          </Card>

          {/* Level Restrictions */}
          <Card className="mb-4">
            <Card.Header>
              <h5>Resident Level Restrictions</h5>
            </Card.Header>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  id="levelRestricted"
                  label="Enable Level Restrictions"
                  checked={formData.levelRestricted}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      levelRestricted: e.target.checked,
                    })
                  }
                />
                <Form.Text className="text-muted">
                  Restrict this form to specific resident levels
                </Form.Text>
              </Form.Group>

              {formData.levelRestricted && (
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Minimum Level</Form.Label>
                      <Form.Select
                        value={formData.minLevel}
                        onChange={(e) =>
                          setFormData({ ...formData, minLevel: e.target.value })
                        }>
                        <option value="">No Minimum</option>
                        <option value="R1">R1 - First Year</option>
                        <option value="R2">R2 - Second Year</option>
                        <option value="R3">R3 - Third Year</option>
                        <option value="R4">R4 - Fourth Year</option>
                        <option value="R5">R5 - Fifth Year</option>
                      </Form.Select>
                      <Form.Text className="text-muted">
                        Residents below this level won't see this form
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Maximum Level (Optional)</Form.Label>
                      <Form.Select
                        value={formData.maxLevel}
                        onChange={(e) =>
                          setFormData({ ...formData, maxLevel: e.target.value })
                        }>
                        <option value="">No Maximum</option>
                        <option value="R1">R1 - First Year</option>
                        <option value="R2">R2 - Second Year</option>
                        <option value="R3">R3 - Third Year</option>
                        <option value="R4">R4 - Fourth Year</option>
                        <option value="R5">R5 - Fifth Year</option>
                      </Form.Select>
                      <Form.Text className="text-muted">
                        Optional upper limit for form access
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>
              )}

              {formData.levelRestricted && (
                <Alert variant="info" className="mt-3">
                  <strong>Access:</strong>{" "}
                  {!formData.minLevel && !formData.maxLevel && "All residents"}
                  {formData.minLevel &&
                    !formData.maxLevel &&
                    `Residents ${formData.minLevel} and above`}
                  {formData.minLevel &&
                    formData.maxLevel &&
                    `Residents from ${formData.minLevel} to ${formData.maxLevel}`}
                  {!formData.minLevel &&
                    formData.maxLevel &&
                    `Residents up to ${formData.maxLevel}`}
                </Alert>
              )}
            </Card.Body>
          </Card>

          {/* Field Templates */}
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5>Form Fields</h5>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={addFieldTemplate}>
                <Plus size={16} className="me-2" />
                Add Field
              </Button>
            </Card.Header>
            <Card.Body>
              {formData.fieldTemplates.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted">No fields added yet</p>
                  <Button variant="outline-primary" onClick={addFieldTemplate}>
                    <Plus size={16} className="me-2" />
                    Add Your First Field
                  </Button>
                </div>
              ) : (
                <div className="field-templates-list">
                  {formData.fieldTemplates.map((field, index) => (
                    <FieldTemplateCard
                      key={index}
                      field={field}
                      index={index}
                      onUpdate={(updatedField) =>
                        updateFieldTemplate(index, updatedField)
                      }
                      onRemove={() => removeFieldTemplate(index)}
                    />
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Form>
      </div>
    </DashboardLayout>
  );
};

// Field Template Card Component
const FieldTemplateCard = ({ field, index, onUpdate, onRemove }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFieldChange = (key, value) => {
    onUpdate({ ...field, [key]: value });
  };

  const fieldTypeOptions = [
    { value: "text", label: "Text Input" },
    { value: "textarea", label: "Text Area" },
    { value: "select", label: "Dropdown" },
    { value: "scale", label: "Scale" },
    { value: "date", label: "Date" },
    { value: "number", label: "Number" },
  ];

  const responseOptions = [
    { value: "resident", label: "Resident" },
    { value: "tutor", label: "Tutor" },
  ];

  const positionOptions = [
    { value: "left", label: "Left" },
    { value: "right", label: "Right" },
  ];

  return (
    <Card className="field-template-card mb-3">
      <Card.Body>
        <div className="field-header">
          <div className="field-info">
            <h6 className="field-name">{field.name || `Field ${index + 1}`}</h6>
            <div className="field-meta">
              <Badge bg="secondary" className="me-2">
                {field.type}
              </Badge>
              <Badge bg="info" className="me-2">
                {field.response}
              </Badge>
              <Badge bg="warning">Section {field.section}</Badge>
            </div>
          </div>
          <div className="field-actions">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? <Eye size={16} /> : <Edit size={16} />}
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={onRemove}
              className="ms-2">
              <Trash2 size={16} />
            </Button>
          </div>
        </div>

        {isExpanded && (
          <div className="field-details mt-3">
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Field Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={field.name}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                    placeholder="Enter field name"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Field Type</Form.Label>
                  <Form.Select
                    value={field.type}
                    onChange={(e) => handleFieldChange("type", e.target.value)}>
                    {fieldTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Response Type</Form.Label>
                  <Form.Select
                    value={field.response}
                    onChange={(e) =>
                      handleFieldChange("response", e.target.value)
                    }>
                    {responseOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Position</Form.Label>
                  <Form.Select
                    value={field.position}
                    onChange={(e) =>
                      handleFieldChange("position", e.target.value)
                    }>
                    {positionOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Section</Form.Label>
                  <Form.Control
                    type="text"
                    value={field.section}
                    onChange={(e) =>
                      handleFieldChange("section", e.target.value)
                    }
                    placeholder="Section number"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Has Details"
                checked={field.hasDetails}
                onChange={(e) =>
                  handleFieldChange("hasDetails", e.target.checked)
                }
              />
            </Form.Group>

            {field.hasDetails && (
              <Form.Group className="mb-3">
                <Form.Label>Details</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={field.details}
                  onChange={(e) => handleFieldChange("details", e.target.value)}
                  placeholder="Enter field details"
                />
              </Form.Group>
            )}

            {field.type === "select" && (
              <OptionsWithLevelsEditor
                options={field.optionsWithLevels || []}
                onChange={(newOptions) =>
                  handleFieldChange("optionsWithLevels", newOptions)
                }
              />
            )}

            {field.type === "scale" && (
              <Form.Group className="mb-3">
                <Form.Label>Scale Options</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={field.scaleOptions?.join("\n") || ""}
                  onChange={(e) => {
                    const options = e.target.value
                      .split("\n")
                      .filter((opt) => opt.trim());
                    handleFieldChange("scaleOptions", options);
                  }}
                  placeholder="Enter scale options (one per line)"
                />
              </Form.Group>
            )}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

// Options with Levels Editor Component
const OptionsWithLevelsEditor = ({ options, onChange }) => {
  const addOption = () => {
    const newOption = { value: "", label: "", minLevel: "" };
    onChange([...options, newOption]);
  };

  const updateOption = (index, field, value) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    onChange(newOptions);
  };

  const removeOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    onChange(newOptions);
  };

  return (
    <div className="options-with-levels-editor mb-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <Form.Label className="mb-0">Select Options</Form.Label>
        <Button variant="outline-primary" size="sm" onClick={addOption}>
          <Plus size={14} className="me-1" />
          Add Option
        </Button>
      </div>

      {options.length === 0 ? (
        <Alert variant="info" className="mb-0">
          No options added yet. Click "Add Option" to start.
        </Alert>
      ) : (
        <div className="options-list">
          {options.map((option, index) => (
            <Card key={index} className="option-card mb-2">
              <Card.Body className="p-3">
                <Row className="align-items-center">
                  <Col md={4}>
                    <Form.Group className="mb-2 mb-md-0">
                      <Form.Label className="small">Value *</Form.Label>
                      <Form.Control
                        size="sm"
                        type="text"
                        placeholder="Option value"
                        value={option.value}
                        onChange={(e) =>
                          updateOption(index, "value", e.target.value)
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-2 mb-md-0">
                      <Form.Label className="small">Label</Form.Label>
                      <Form.Control
                        size="sm"
                        type="text"
                        placeholder="Display label (optional)"
                        value={option.label}
                        onChange={(e) =>
                          updateOption(index, "label", e.target.value)
                        }
                      />
                      <Form.Text
                        className="text-muted"
                        style={{ fontSize: "0.7rem" }}>
                        Leave empty to use value
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-2 mb-md-0">
                      <Form.Label className="small">
                        Min Level (Optional)
                      </Form.Label>
                      <Form.Select
                        size="sm"
                        value={option.minLevel || ""}
                        onChange={(e) =>
                          updateOption(index, "minLevel", e.target.value)
                        }>
                        <option value="">All Levels</option>
                        <option value="R1">R1+</option>
                        <option value="R2">R2+</option>
                        <option value="R3">R3+</option>
                        <option value="R4">R4+</option>
                        <option value="R5">R5+</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={2} className="text-end">
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => removeOption(index)}
                      className="mt-md-4">
                      <Trash2 size={14} />
                    </Button>
                  </Col>
                </Row>
                {option.minLevel && (
                  <Row className="mt-2">
                    <Col>
                      <Alert variant="warning" className="py-1 px-2 mb-0 small">
                        <strong>Restricted:</strong> Only residents{" "}
                        {option.minLevel} and above can select this option
                      </Alert>
                    </Col>
                  </Row>
                )}
              </Card.Body>
            </Card>
          ))}
        </div>
      )}

      <Form.Text className="text-muted">
        💡 Tip: Leave "Min Level" as "All Levels" for options available to all
        residents. Set a minimum level to restrict advanced options to senior
        residents.
      </Form.Text>
    </div>
  );
};

export default FormEdit;
