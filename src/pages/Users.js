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
} from "react-bootstrap";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Building2,
} from "lucide-react";
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useTutorList,
} from "../hooks/useUsers";
import { useInstitution } from "../context/InstitutionContext";
import DashboardLayout from "../components/layout/DashboardLayout";
import "./Users.css";
import { BASE_URL } from "../api/constants";

const Users = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [localInstitutionFilter, setLocalInstitutionFilter] = useState("");

  // Institution context
  const { selectedInstitution, institutions } = useInstitution();

  // Build params with institutionId if selected
  const queryParams = useMemo(() => {
    const params = {};
    if (selectedInstitution) {
      params.institutionId = selectedInstitution;
    }
    return params;
  }, [selectedInstitution]);

  const { data: users, isLoading } = useUsers(queryParams);
  const { data: tutorList, isLoading: tutorListLoading } = useTutorList();
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    roles: [],
    status: "active",
    supervisor: "",
    institutionId: "", // NEW: Institution selection
    image: "",
    imagePreview: null,
  });

  const handleShowModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        username: user.username,
        email: user.email,
        roles: user.roles || [],
        status: user.status,
        supervisor: user.supervisor?._id || "",
        institutionId: user.institutions?.[0]?._id || "",
        image: user.image || "",
        imagePreview: null,
      });
    } else {
      setEditingUser(null);
      setFormData({
        username: "",
        email: "",
        roles: [],
        status: "active",
        supervisor: "",
        institutionId: selectedInstitution || "", // Default to selected institution
        image: "",
        imagePreview: null,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    // Clean up image preview URL if it exists
    if (formData.imagePreview) {
      URL.revokeObjectURL(formData.imagePreview);
    }
    setFormData({
      username: "",
      email: "",
      roles: [],
      status: "active",
      supervisor: "",
      institutionId: "",
      image: "",
      imagePreview: null,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = { ...formData };

      if (editingUser) {
        await updateUserMutation.mutateAsync({
          userId: editingUser?._id,
          userData,
        });
      } else {
        await createUserMutation.mutateAsync(userData);
      }

      handleCloseModal();
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUserMutation.mutateAsync(userId);
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleViewDetails = (user) => {
    navigate(`/users/${user._id}`);
  };

  const filteredUsers =
    users?.filter((user) => {
      const matchesSearch =
        user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = !roleFilter || user?.roles?.includes(roleFilter);
      const matchesInstitution =
        !localInstitutionFilter ||
        user?.institutions?.some((inst) => inst._id === localInstitutionFilter);

      return matchesSearch && matchesRole && matchesInstitution;
    }) || [];

  const getRoleBadge = (roles) => {
    const variants = {
      admin: "danger",
      tutor: "warning",
      resident: "primary",
      "tutor-admin": "danger",
    };
    return (
      <Badge bg={variants[roles.join("-")] || "secondary"}>
        {roles.join(", ")}
      </Badge>
    );
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

  return (
    <DashboardLayout>
      <div className="users-page">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-title">
            <h2>User Management</h2>
            <p>Manage all users in your application</p>
          </div>
          <Button
            variant="primary"
            onClick={() => handleShowModal()}
            className="add-user-btn">
            <Plus size={16} className="me-2" />
            Add New User
          </Button>
        </div>

        {/* Filters and Search */}
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
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col md={2}>
                <Form.Select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}>
                  <option value="">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="tutor">Tutor</option>
                  <option value="resident">Resident</option>
                </Form.Select>
              </Col>
              <Col md={3}>
                <Form.Select
                  value={localInstitutionFilter}
                  onChange={(e) => setLocalInstitutionFilter(e.target.value)}>
                  <option value="">All Institutions</option>
                  {institutions?.map((inst) => (
                    <option key={inst._id} value={inst._id}>
                      {inst.name}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={3}>
                <Button
                  variant="outline-secondary"
                  className="w-100"
                  onClick={() => {
                    setSearchTerm("");
                    setRoleFilter("");
                    setLocalInstitutionFilter("");
                  }}>
                  Clear Filters
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Users Table */}
        <Card>
          <Card.Header>
            <div className="d-flex justify-content-between align-items-center">
              <h5>Users ({filteredUsers.length})</h5>
              <div className="table-actions">
                <Button variant="outline-primary" size="sm">
                  {/* <Users size={16} className="me-1" /> */}
                  Export
                </Button>
              </div>
            </div>
          </Card.Header>
          <Card.Body className="p-0">
            <Table responsive hover className="users-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Institution</th>
                  <th>Submissions</th>
                  <th>Supervisor</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="user-info">
                        <div
                          className="user-avatar"
                          style={{
                            background: user.image
                              ? "white"
                              : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          }}>
                          {user.image ? (
                            <img
                              src={BASE_URL + user.image}
                              alt="User"
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                              }}
                            />
                          ) : (
                            <div className="user-avatar-placeholder">
                              {user.username?.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="user-name">{user.username}</div>
                          <small className="text-muted">ID: {user._id}</small>
                        </div>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>{getRoleBadge(user?.roles)}</td>
                    <td>
                      {user.institutions && user.institutions.length > 0 ? (
                        <div className="d-flex flex-wrap gap-1">
                          {user.institutions.map((inst) => (
                            <Badge
                              key={inst._id}
                              bg="info"
                              className="d-flex align-items-center gap-1">
                              <Building2 size={12} />
                              {inst.name}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {user.totalSubmissions || 0}
                    </td>
                    <td>
                      <small>
                        {user?.roles?.includes("resident") ? (
                          user?.supervisor?.username ? (
                            <Badge bg={"warning"}>
                              {user?.supervisor?.username}
                            </Badge>
                          ) : (
                            "Not assigned"
                          )
                        ) : (
                          "-"
                        )}
                      </small>
                    </td>
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle variant="link" size="sm">
                          <MoreVertical size={16} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => handleShowModal(user)}>
                            <Edit size={16} className="me-2" />
                            Edit
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => handleViewDetails(user)}>
                            <Eye size={16} className="me-2" />
                            View Details
                          </Dropdown.Item>
                          <Dropdown.Divider />
                          {/* {user.status === "active" ? (
                            <Dropdown.Item
                              onClick={() =>
                                handleStatusChange(user?._id, "inactive")
                              }>
                              <UserX size={16} className="me-2" />
                              Deactivate
                            </Dropdown.Item>
                          ) : (
                            <Dropdown.Item
                              onClick={() =>
                                handleStatusChange(user?._id, "active")
                              }>
                              <UserCheck size={16} className="me-2" />
                              Activate
                            </Dropdown.Item>
                          )} */}
                          <Dropdown.Item
                            onClick={() => handleDelete(user?._id)}
                            className="text-danger">
                            <Trash2 size={16} className="me-2" />
                            Delete
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {filteredUsers.length === 0 && (
              <div className="no-data">
                <p>No users found</p>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* User Modal */}
        <Modal show={showModal} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              {editingUser ? "Edit User" : "Add New User"}
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
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
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Institution Selection */}
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Institution</Form.Label>
                    <Form.Select
                      value={formData.institutionId}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          institutionId: e.target.value,
                        })
                      }>
                      <option value="">Default (Your First Institution)</option>
                      {institutions?.map((inst) => (
                        <option key={inst._id} value={inst._id}>
                          {inst.name}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Text className="text-muted">
                      Select which institution this user belongs to
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                {formData.roles.includes("resident") && (
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Supervisor</Form.Label>
                      <Form.Select
                        value={formData.supervisor}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
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
                <Col md={formData.roles.includes("resident") ? 6 : 12}>
                  <Form.Group className="mb-3">
                    <Form.Label>image</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          // Create a preview URL for the selected file
                          const previewUrl = URL.createObjectURL(file);
                          setFormData({
                            ...formData,
                            image: file,
                            imagePreview: previewUrl,
                          });
                        }
                      }}
                    />
                    {formData.imagePreview && (
                      <div className="mt-2">
                        <img
                          src={formData.imagePreview}
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
                    {formData.image &&
                      typeof formData.image === "string" &&
                      !formData.imagePreview && (
                        <div className="mt-2">
                          <img
                            src={BASE_URL + formData.image}
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
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Roles</Form.Label>
                    <div className="roles-selection">
                      {["admin", "tutor", "resident", "moderator"].map(
                        (role) => (
                          <Form.Check
                            key={role}
                            type="checkbox"
                            id={`role-${role}`}
                            label={role}
                            checked={formData.roles.includes(role)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({
                                  ...formData,
                                  roles: [...formData.roles, role],
                                });
                              } else {
                                const newRoles = formData.roles.filter(
                                  (r) => r !== role
                                );
                                setFormData({
                                  ...formData,
                                  roles: newRoles,
                                  // Clear supervisor if resident role is removed
                                  supervisor:
                                    role === "resident"
                                      ? ""
                                      : formData.supervisor,
                                });
                              }
                            }}
                            className="role-checkbox"
                          />
                        )
                      )}
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={
                  createUserMutation.isPending || updateUserMutation.isPending
                }>
                {createUserMutation.isPending ||
                updateUserMutation.isPending ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Saving...
                  </>
                ) : (
                  "Save User"
                )}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Users;
