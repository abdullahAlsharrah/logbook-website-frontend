import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Card, Badge, ProgressBar } from "react-bootstrap";
import {
  Users,
  FileText,
  CheckCircle,
  Clock,
  TrendingUp,
  Activity,
  Eye,
  Plus,
} from "lucide-react";
import {
  useDashboardStats,
  useRecentActivities,
  usePendingItems,
} from "../hooks/useDashboard";
import { useUserStats } from "../hooks/useUsers";
import { useFormStats } from "../hooks/useForms";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/layout/DashboardLayout";
import "./Dashboard.css";

const Dashboard = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  // All hooks must be called before any early returns
  const { data: dashboardStats, isLoading: statsLoading } = useDashboardStats();
  const { data: recentActivities } = useRecentActivities();
  const { data: pendingItems } = usePendingItems();
  const { data: userStats, isLoading: userStatsLoading } = useUserStats();
  const { data: formStats, isLoading: formStatsLoading } = useFormStats();

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated()) {
      navigate("/login", { replace: true });
    }
  }, [loading, isAuthenticated, navigate]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated()) {
    return null;
  }

  const StatCard = ({ title, value, icon: Icon, color, change, subtitle }) => (
    <Card className="stat-card">
      <Card.Body>
        <div className="stat-content">
          <div className="stat-info">
            <h6 className="stat-title">{title}</h6>
            <h3 className="stat-value">{value || 0}</h3>
            {subtitle && <p className="stat-subtitle">{subtitle}</p>}
            {change && (
              <div
                className={`stat-change ${
                  change > 0 ? "positive" : "negative"
                }`}>
                <TrendingUp size={16} />
                {Math.abs(change)}%
              </div>
            )}
          </div>
          <div className={`stat-icon ${color}`}>
            <Icon size={24} />
          </div>
        </div>
      </Card.Body>
    </Card>
  );

  const ActivityItem = ({ activity }) => (
    <div className="activity-item">
      <div className="activity-icon">
        <Activity size={16} />
      </div>
      <div className="activity-content">
        <div className="activity-text">{activity.description}</div>
        <div className="activity-time">{activity.time}</div>
      </div>
    </div>
  );

  if (statsLoading || userStatsLoading || formStatsLoading) {
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
      <div className="dashboard-page">
        {/* Page Header */}
        <div className="page-header">
          <h2>Dashboard Overview</h2>
          <p>Welcome back! Here's what's happening with your application.</p>
        </div>

        {/* Statistics Cards */}
        <Row className="mb-4">
          <Col lg={3} md={6} className="mb-3">
            <StatCard
              title="Total Users"
              value={userStats?.totalUsers || 0}
              icon={Users}
              color="primary"
              change={12}
              subtitle="Active users"
            />
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <StatCard
              title="Total Forms"
              value={formStats?.totalForms || 0}
              icon={FileText}
              color="success"
              change={8}
              subtitle="Published forms"
            />
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <StatCard
              title="Completed Submissions"
              value={dashboardStats?.completedSubmissions || 0}
              icon={CheckCircle}
              color="info"
              change={15}
              subtitle="This month"
            />
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <StatCard
              title="Pending Submissions"
              value={pendingItems?.pendingSubmissions || 0}
              icon={Clock}
              color="warning"
              subtitle="Requires attention"
            />
          </Col>
        </Row>

        {/* Charts and Analytics */}
        <Row className="mb-4">
          <Col lg={8} className="mb-3">
            <Card className="chart-card">
              <Card.Header>
                <h5>Submission Trends</h5>
              </Card.Header>
              <Card.Body>
                <div className="chart-placeholder">
                  <div className="chart-info">
                    <h6>Monthly Submissions</h6>
                    <p>Chart visualization will be implemented here</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4} className="mb-3">
            <Card className="progress-card">
              <Card.Header>
                <h5>Completion Rate</h5>
              </Card.Header>
              <Card.Body>
                <div className="progress-item">
                  <div className="progress-label">Forms Completed</div>
                  <ProgressBar now={75} className="mb-2" variant="success" />
                  <small className="text-muted">75% of total forms</small>
                </div>
                <div className="progress-item">
                  <div className="progress-label">User Engagement</div>
                  <ProgressBar now={60} className="mb-2" variant="info" />
                  <small className="text-muted">60% active users</small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Recent Activities and Quick Actions */}
        <Row>
          <Col lg={8} className="mb-3">
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5>Recent Activities</h5>
                <Badge bg="primary">{recentActivities?.length || 0}</Badge>
              </Card.Header>
              <Card.Body>
                <div className="activities-list">
                  {recentActivities
                    ?.slice(0, 5)
                    .map((activity, index) => (
                      <ActivityItem key={index} activity={activity} />
                    )) || (
                    <div className="no-activities">
                      <p>No recent activities</p>
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4} className="mb-3">
            <Card>
              <Card.Header>
                <h5>Quick Actions</h5>
              </Card.Header>
              <Card.Body>
                <div className="quick-actions">
                  <button className="btn btn-primary w-100 mb-2">
                    <Plus size={16} className="me-2" />
                    Create New Form
                  </button>
                  <button className="btn btn-outline-primary w-100 mb-2">
                    <Users size={16} className="me-2" />
                    Add New User
                  </button>
                  <button className="btn btn-outline-success w-100 mb-2">
                    <FileText size={16} className="me-2" />
                    View Submissions
                  </button>
                  <button className="btn btn-outline-info w-100">
                    <Eye size={16} className="me-2" />
                    View Analytics
                  </button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
