import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Badge,
  Form,
  Modal,
  // Alert,
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
  Megaphone,
  Calendar,
  User,
  Globe,
  Target,
} from "lucide-react";
import {
  useAnnouncements,
  useCreateAnnouncement,
  useUpdateAnnouncement,
  useDeleteAnnouncement,
  useUpdateAnnouncementStatus,
} from "../hooks/useAnnouncements";
import DashboardLayout from "../components/layout/DashboardLayout";
import "./Announcements.css";

const Announcements = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const { data: announcements, isLoading } = useAnnouncements();
  const createAnnouncementMutation = useCreateAnnouncement();
  const updateAnnouncementMutation = useUpdateAnnouncement();
  const deleteAnnouncementMutation = useDeleteAnnouncement();
  const updateStatusMutation = useUpdateAnnouncementStatus();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    status: "draft",
    priority: "normal",
    targetAudience: "all",
  });

  const handleShowModal = (announcement = null) => {
    if (announcement) {
      setEditingAnnouncement(announcement);
      setFormData({
        title: announcement.title,
        content: announcement.content,
        status: announcement.status,
        priority: announcement.priority || "normal",
        targetAudience: announcement.targetAudience || "all",
      });
    } else {
      setEditingAnnouncement(null);
      setFormData({
        title: "",
        content: "",
        status: "draft",
        priority: "normal",
        targetAudience: "all",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAnnouncement(null);
    setFormData({
      title: "",
      content: "",
      status: "draft",
      priority: "normal",
      targetAudience: "all",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingAnnouncement) {
        await updateAnnouncementMutation.mutateAsync({
          announcementId: editingAnnouncement.id,
          announcementData: formData,
        });
      } else {
        await createAnnouncementMutation.mutateAsync(formData);
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error saving announcement:", error);
    }
  };

  const handleDelete = async (announcementId) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      try {
        await deleteAnnouncementMutation.mutateAsync(announcementId);
      } catch (error) {
        console.error("Error deleting announcement:", error);
      }
    }
  };

  const handleStatusChange = async (announcementId, newStatus) => {
    try {
      await updateStatusMutation.mutateAsync({
        announcementId,
        status: newStatus,
      });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const filteredAnnouncements =
    announcements?.filter((announcement) => {
      const matchesSearch =
        announcement?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        announcement?.content?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        !statusFilter || announcement.status === statusFilter;

      return matchesSearch && matchesStatus;
    }) || [];

  const getStatusBadge = (status) => {
    const variants = {
      published: "success",
      draft: "secondary",
      archived: "warning",
      scheduled: "info",
    };
    return <Badge bg={variants[status] || "secondary"}>{status}</Badge>;
  };

  const getPriorityBadge = (priority) => {
    const variants = {
      high: "danger",
      normal: "primary",
      low: "secondary",
    };
    return <Badge bg={variants[priority] || "secondary"}>{priority}</Badge>;
  };

  const getTargetAudienceIcon = (audience) => {
    switch (audience) {
      case "all":
        return <Globe size={16} />;
      case "users":
        return <User size={16} />;
      case "admins":
        return <Target size={16} />;
      default:
        return <Globe size={16} />;
    }
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
      <div className="announcements-page">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-title">
            <h2>Announcements</h2>
            <p>Create and manage announcements for your users</p>
          </div>
          <Button
            variant="primary"
            onClick={() => handleShowModal()}
            className="add-announcement-btn">
            <Plus size={16} className="me-2" />
            Create Announcement
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
                    placeholder="Search announcements..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col md={4}>
                <Form.Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                  <option value="scheduled">Scheduled</option>
                </Form.Select>
              </Col>
              <Col md={2}>
                <Button
                  variant="outline-secondary"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("");
                  }}>
                  Clear
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Announcements Grid */}
        <Row>
          {filteredAnnouncements.map((announcement) => (
            <Col lg={6} md={12} className="mb-4" key={announcement.id}>
              <Card className="announcement-card">
                <Card.Body>
                  <div className="announcement-header">
                    <div className="announcement-icon">
                      <Megaphone size={24} />
                    </div>
                    <div className="announcement-meta">
                      <div className="announcement-status">
                        {getStatusBadge(announcement.status)}
                      </div>
                      <div className="announcement-priority">
                        {getPriorityBadge(announcement.priority)}
                      </div>
                    </div>
                  </div>

                  <h5 className="announcement-title">{announcement.title}</h5>
                  <p className="announcement-content">
                    {announcement?.content?.length > 150
                      ? `${announcement?.content?.substring(0, 150)}...`
                      : announcement?.content}
                  </p>

                  <div className="announcement-info">
                    <div className="info-item">
                      <Calendar size={14} />
                      <span>
                        {new Date(announcement?.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="info-item">
                      {getTargetAudienceIcon(announcement?.targetAudience)}
                      <span>{announcement?.targetAudience}</span>
                    </div>
                  </div>

                  <div className="announcement-actions">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2">
                      <Eye size={14} className="me-1" />
                      Preview
                    </Button>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleShowModal(announcement)}>
                      <Edit size={14} className="me-1" />
                      Edit
                    </Button>
                    <Dropdown>
                      <Dropdown.Toggle variant="outline-secondary" size="sm">
                        <MoreVertical size={14} />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {announcement.status === "draft" && (
                          <Dropdown.Item
                            onClick={() =>
                              handleStatusChange(announcement?._id, "published")
                            }>
                            Publish
                          </Dropdown.Item>
                        )}
                        {announcement.status === "published" && (
                          <Dropdown.Item
                            onClick={() =>
                              handleStatusChange(announcement?._id, "archived")
                            }>
                            Archive
                          </Dropdown.Item>
                        )}
                        <Dropdown.Divider />
                        <Dropdown.Item
                          onClick={() => handleDelete(announcement?._id)}
                          className="text-danger">
                          <Trash2 size={16} className="me-2" />
                          Delete
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {filteredAnnouncements.length === 0 && (
          <Card>
            <Card.Body className="text-center py-5">
              <Megaphone size={48} className="text-muted mb-3" />
              <h5>No announcements found</h5>
              <p className="text-muted">
                Create your first announcement to get started
              </p>
              <Button variant="primary" onClick={() => handleShowModal()}>
                <Plus size={16} className="me-2" />
                Create Announcement
              </Button>
            </Card.Body>
          </Card>
        )}

        {/* Announcement Modal */}
        <Modal show={showModal} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              {editingAnnouncement
                ? "Edit Announcement"
                : "Create New Announcement"}
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <Row>
                <Col md={8}>
                  <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Enter announcement title"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }>
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="archived">Archived</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Priority</Form.Label>
                    <Form.Select
                      value={formData.priority}
                      onChange={(e) =>
                        setFormData({ ...formData, priority: e.target.value })
                      }>
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Target Audience</Form.Label>
                    <Form.Select
                      value={formData.targetAudience}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          targetAudience: e.target.value,
                        })
                      }>
                      <option value="all">All Users</option>
                      <option value="users">Regular Users</option>
                      <option value="admins">Administrators</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Content</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={6}
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="Enter announcement content..."
                  required
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={
                  createAnnouncementMutation.isPending ||
                  updateAnnouncementMutation.isPending
                }>
                {createAnnouncementMutation.isPending ||
                updateAnnouncementMutation.isPending ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Saving...
                  </>
                ) : (
                  "Save Announcement"
                )}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Announcements;
