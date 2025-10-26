import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Button,
  Badge,
  Form,
  Modal,
  Table,
  Image,
  InputGroup,
} from "react-bootstrap";
import {
  ArrowLeft,
  Edit,
  FileText,
  Shield,
  Eye,
  EyeOff,
  Camera,
  Save,
} from "lucide-react";
import {
  useUser,
  useUpdateUser,
  useUserSubmissions,
  useTutorList,
} from "../hooks/useUsers";
import DashboardLayout from "../components/layout/DashboardLayout";
import "./UserDetail.css";
import { BASE_URL } from "../api/constants";
import { useAuth } from "../context/AuthContext";

const UserDetail = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showimageModal, setShowimageModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { data: user, isLoading } = useUser(userId);
  const { data: userSubmissions, isLoading: submissionsLoading } =
    useUserSubmissions(userId, user?.roles);
  const { data: tutorList, isLoading: tutorListLoading } = useTutorList();
  const updateUserMutation = useUpdateUser();
  const { refreshUser } = useAuth();

  const [editFormData, setEditFormData] = useState({
    username: "",
    email: "",
    roles: [],
    status: "active",
    supervisor: "",
    image: "",
    imagePreview: null,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const availableRoles = ["admin", "tutor", "resident", "moderator"];

  const handleBack = () => {
    navigate("/users");
  };

  const handleEditUser = () => {
    if (user) {
      setEditFormData({
        username: user?.username || "",
        email: user?.email || "",
        roles: user?.roles || [],
        status: user?.status || "active",
        supervisor: user?.supervisor?.username || "",
        image: user?.image || "",
      });
      setShowEditModal(true);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUserMutation.mutateAsync({
        userId: user._id,
        userData: editFormData,
      });

      // If this is the current user, refresh the auth context
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      if (currentUser._id === user._id || user._id === "me") {
        console.log("Refreshing current user data in auth context...");
        await refreshUser();
      }

      // Clean up image preview URL if it exists
      if (editFormData.imagePreview) {
        URL.revokeObjectURL(editFormData.imagePreview);
      }
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }
    try {
      await updateUserMutation.mutateAsync({
        userId: user._id,
        userData: { password: passwordData.newPassword },
      });
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error updating password:", error);
    }
  };

  const handleRoleToggle = (role) => {
    setEditFormData((prev) => {
      const newRoles = prev.roles.includes(role)
        ? prev.roles.filter((r) => r !== role)
        : [...prev.roles, role];

      return {
        ...prev,
        roles: newRoles,
        // Clear supervisor if resident role is removed
        supervisor:
          role === "resident" && !newRoles.includes("resident")
            ? ""
            : prev.supervisor,
      };
    });
  };

  const getStatusBadge = (status) => {
    const variants = {
      active: "success",
      inactive: "secondary",
      suspended: "warning",
      pending: "info",
    };
    return <Badge bg={variants[status] || "secondary"}>{status}</Badge>;
  };

  const getSubmissionStatusBadge = (status) => {
    const variants = {
      pending: "warning",
      completed: "success",
      rejected: "danger",
      under_review: "info",
    };
    return <Badge bg={variants[status] || "secondary"}>{status}</Badge>;
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

  if (!user) {
    return (
      <DashboardLayout>
        <div className="error-container">
          <h3>User Not Found</h3>
          <p>The requested user could not be found.</p>
          <Button variant="primary" onClick={handleBack}>
            Back to Users
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="user-detail-page">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-title">
            <Button
              variant="link"
              onClick={handleBack}
              className="back-btn p-0 mb-2">
              <ArrowLeft size={20} className="me-2" />
              Back to Users
            </Button>
            <h2>User Details</h2>
            <p>View and manage user information and submissions</p>
          </div>
          <div className="page-actions">
            <Button variant="outline-secondary" onClick={handleBack}>
              Back
            </Button>
            <Button variant="primary" onClick={handleEditUser}>
              <Edit size={16} className="me-2" />
              Edit User
            </Button>
          </div>
        </div>

        <Row className="g-4">
          {/* User Information Card */}
          <Col lg={4}>
            <Card className="user-profile-card">
              <Card.Body className="text-center">
                <div className="user-avatar-large">
                  {user.image ? (
                    <Image
                      src={BASE_URL + user.image}
                      alt={user.username}
                      roundedCircle
                      className="profile-photo"
                    />
                  ) : (
                    <div className="avatar-placeholder">
                      {user.username?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="image-edit-btn"
                    onClick={() => setShowimageModal(true)}>
                    <Camera size={14} />
                  </Button>
                </div>
                <h4 className="user-name">{user.username}</h4>
                <p className="user-email">{user.email}</p>
                <div className="user-status">{getStatusBadge(user.status)}</div>
                <div className="user-roles mt-2">
                  {user.roles?.map((role) => (
                    <Badge key={role} bg="secondary" className="me-1">
                      {role}
                    </Badge>
                  ))}
                </div>
                {user.supervisor && user.supervisor.username && (
                  <div className="supervisor-info mt-3">
                    <small className="text-muted">Supervisor:</small>
                    <div className="supervisor-name">
                      {user.supervisor.username}
                    </div>
                  </div>
                )}
                <div className="user-actions mt-4">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => setShowPasswordModal(true)}
                    className="me-2">
                    <Shield size={14} className="me-1" />
                    Change Password
                  </Button>
                </div>
              </Card.Body>
            </Card>

            {/* User Statistics */}
            <Card className="mt-4">
              <Card.Header>
                <h6 className="mb-0">Statistics</h6>
              </Card.Header>
              <Card.Body>
                <div className="stat-item">
                  <div className="stat-label">Total Submissions</div>
                  <div className="stat-value">
                    {userSubmissions?.length || 0}
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Completed</div>
                  <div className="stat-value">
                    {userSubmissions?.filter((s) => s.status === "completed")
                      .length || 0}
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Pending</div>
                  <div className="stat-value">
                    {userSubmissions?.filter((s) => s.status === "pending")
                      .length || 0}
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Member Since</div>
                  <div className="stat-value">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* User Submissions */}
          <Col lg={8}>
            <Card>
              <Card.Header>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Form Submissions</h5>
                  <Badge bg="primary">
                    {userSubmissions?.length || 0} submissions
                  </Badge>
                </div>
              </Card.Header>
              <Card.Body className="p-0">
                {submissionsLoading ? (
                  <div className="loading-container p-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : userSubmissions && userSubmissions.length > 0 ? (
                  <Table responsive hover className="submissions-table">
                    <thead>
                      <tr>
                        <th>Form</th>
                        <th>Status</th>
                        <th>Submitted</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userSubmissions.map((submission) => (
                        <tr key={submission._id}>
                          <td>
                            <div className="form-info">
                              <div className="form-title">
                                {submission.formTemplate?.formName ||
                                  "Unknown Form"}
                              </div>
                              <small className="text-muted">
                                {submission.fieldRecord?.length || 0} fields
                                completed
                              </small>
                            </div>
                          </td>
                          <td>{getSubmissionStatusBadge(submission.status)}</td>
                          <td>
                            <div className="date-info">
                              <div>
                                {new Date(
                                  submission.createdAt
                                ).toLocaleDateString()}
                              </div>
                              <small className="text-muted">
                                {new Date(
                                  submission.createdAt
                                ).toLocaleTimeString()}
                              </small>
                            </div>
                          </td>
                          <td>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() =>
                                navigate(
                                  `/submissions/view/${submission._id}`,
                                  {
                                    state: { submission },
                                  }
                                )
                              }>
                              <Eye size={14} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <div className="no-data p-4">
                    <FileText size={48} className="text-muted mb-3" />
                    <p className="text-muted">
                      No submissions found for this user.
                    </p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Edit User Modal */}
        <Modal
          show={showEditModal}
          onHide={() => {
            // Clean up image preview URL if it exists
            if (editFormData.imagePreview) {
              URL.revokeObjectURL(editFormData.imagePreview);
            }
            setShowEditModal(false);
          }}
          size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Edit User Information</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleEditSubmit}>
            <Modal.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      value={editFormData.username}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          username: e.target.value,
                        })
                      }
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={editFormData.email}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          email: e.target.value,
                        })
                      }
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                {editFormData.roles.includes("resident") && (
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Supervisor</Form.Label>
                      <Form.Select
                        value={editFormData.supervisor}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            supervisor: e.target.value,
                          })
                        }>
                        <option value="">Select a supervisor</option>
                        {tutorList?.map((tutor) => (
                          <option key={tutor._id} value={tutor._id}>
                            {tutor.username}
                          </option>
                        ))}
                      </Form.Select>
                      {tutorListLoading && (
                        <small className="text-muted">Loading tutors...</small>
                      )}
                    </Form.Group>
                  </Col>
                )}
                <Col md={editFormData.roles.includes("resident") ? 6 : 12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      value={editFormData.status}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          status: e.target.value,
                        })
                      }>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                      <option value="pending">Pending</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Roles</Form.Label>
                    <div className="roles-selection">
                      {availableRoles.map((role) => (
                        <Form.Check
                          key={role}
                          type="checkbox"
                          id={`role-${role}`}
                          label={role}
                          checked={editFormData.roles.includes(role)}
                          onChange={() => handleRoleToggle(role)}
                          className="role-checkbox"
                        />
                      ))}
                    </div>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Image</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          // Create a preview URL for the selected file
                          const previewUrl = URL.createObjectURL(file);
                          setEditFormData({
                            ...editFormData,
                            image: file,
                            imagePreview: previewUrl,
                          });
                        }
                      }}
                    />
                    {editFormData.imagePreview && (
                      <div className="mt-2">
                        <img
                          src={editFormData.imagePreview}
                          alt="Preview"
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            border: "2px solid #e2e8f0",
                          }}
                        />
                      </div>
                    )}
                    {editFormData.image &&
                      typeof editFormData.image === "string" &&
                      !editFormData.imagePreview && (
                        <div className="mt-2">
                          <img
                            src={BASE_URL + editFormData.image}
                            alt="Current"
                            style={{
                              width: "60px",
                              height: "60px",
                              objectFit: "cover",
                              borderRadius: "8px",
                              border: "2px solid #e2e8f0",
                            }}
                          />
                          <small className="text-muted d-block mt-1">
                            Current image
                          </small>
                        </div>
                      )}
                  </Form.Group>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => {
                  // Clean up image preview URL if it exists
                  if (editFormData.imagePreview) {
                    URL.revokeObjectURL(editFormData.imagePreview);
                  }
                  setShowEditModal(false);
                }}>
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={updateUserMutation.isPending}>
                {updateUserMutation.isPending ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} className="me-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

        {/* Change Password Modal */}
        <Modal
          show={showPasswordModal}
          onHide={() => setShowPasswordModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Change Password</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handlePasswordSubmit}>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Current Password</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                    required
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </InputGroup>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Confirm New Password</Form.Label>
                <Form.Control
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowPasswordModal(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={updateUserMutation.isPending}>
                {updateUserMutation.isPending ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

        {/* image Upload Modal */}
        <Modal show={showimageModal} onHide={() => setShowimageModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Update Profile image</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Select image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    // Create a preview URL for the selected file
                    const previewUrl = URL.createObjectURL(file);
                    setEditFormData({
                      ...editFormData,
                      image: file,
                      imagePreview: previewUrl,
                    });
                  }
                }}
              />
            </Form.Group>
            {editFormData.imagePreview && (
              <div className="image-preview">
                <Image
                  src={editFormData.imagePreview}
                  alt="Preview"
                  roundedCircle
                  style={{ width: "100px", height: "100px" }}
                />
              </div>
            )}
            {editFormData.image &&
              typeof editFormData.image === "string" &&
              !editFormData.imagePreview && (
                <div className="image-preview">
                  <Image
                    src={`${BASE_URL + editFormData.image}`}
                    alt="Current"
                    roundedCircle
                    style={{ width: "100px", height: "100px" }}
                  />
                  <small className="text-muted d-block mt-1">
                    Current image
                  </small>
                </div>
              )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                // Clean up image preview URL if it exists
                if (editFormData.imagePreview) {
                  URL.revokeObjectURL(editFormData.imagePreview);
                }
                setShowimageModal(false);
              }}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={async () => {
                try {
                  await updateUserMutation.mutateAsync({
                    userId: user._id,
                    userData: { image: editFormData.image },
                  });

                  // If this is the current user, refresh the auth context
                  const currentUser = JSON.parse(
                    localStorage.getItem("user") || "{}"
                  );
                  if (currentUser._id === user._id || user._id === "me") {
                    console.log(
                      "Refreshing current user image in auth context..."
                    );
                    await refreshUser();
                  }

                  setShowimageModal(false);
                } catch (error) {
                  console.error("Error updating image:", error);
                }
              }}
              disabled={updateUserMutation.isPending}>
              {updateUserMutation.isPending ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Updating...
                </>
              ) : (
                "Update image"
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default UserDetail;
