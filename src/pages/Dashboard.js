import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Row, Col, Card, Badge, ProgressBar } from "react-bootstrap";
import {
  Users,
  FileText,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Activity,
  Eye,
  Plus,
  UserPlus,
  FilePlus,
  Award,
  BarChart3,
} from "lucide-react";
import { useDashboard } from "../hooks/useDashboard";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/layout/DashboardLayout";
import "./Dashboard.css";

const Dashboard = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const { institutionId } = useParams();

  // Fetch comprehensive dashboard data
  const { data: dashboardData, isLoading: dashboardLoading } =
    useDashboard(institutionId);

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

  const StatCard = ({ title, value, icon: Icon, color, change, subtitle }) => {
    const isPositive = change > 0;
    const TrendIcon = isPositive ? TrendingUp : TrendingDown;

    return (
      <Card className={`stat-card stat-card-${color}`}>
        <Card.Body>
          <div className="stat-content">
            <div className="stat-info">
              <h6 className="stat-title">{title}</h6>
              <h3 className="stat-value">{value?.toLocaleString() || 0}</h3>
              {subtitle && <p className="stat-subtitle">{subtitle}</p>}
              {change !== undefined && change !== null && (
                <div
                  className={`stat-change ${
                    isPositive ? "positive" : "negative"
                  }`}>
                  <TrendIcon size={14} />
                  <span>{Math.abs(change).toFixed(1)}%</span>
                  <span className="stat-change-label">
                    {isPositive ? "increase" : "decrease"}
                  </span>
                </div>
              )}
            </div>
            <div className={`stat-icon stat-icon-${color}`}>
              <Icon size={28} />
            </div>
          </div>
        </Card.Body>
      </Card>
    );
  };

  const ActivityItem = ({ activity }) => {
    const getActivityIcon = () => {
      switch (activity.type) {
        case "submission":
          return <FileText size={16} />;
        case "user":
          return <UserPlus size={16} />;
        case "form":
          return <FilePlus size={16} />;
        case "level":
          return <Award size={16} />;
        default:
          return <Activity size={16} />;
      }
    };

    const getActivityColor = () => {
      switch (activity.type) {
        case "submission":
          return "activity-icon-submission";
        case "user":
          return "activity-icon-user";
        case "form":
          return "activity-icon-form";
        case "level":
          return "activity-icon-level";
        default:
          return "";
      }
    };

    return (
      <div className="activity-item">
        <div className={`activity-icon ${getActivityColor()}`}>
          {getActivityIcon()}
        </div>
        <div className="activity-content">
          <div className="activity-text">{activity.description}</div>
          <div className="activity-time">{activity.time}</div>
        </div>
      </div>
    );
  };

  // Bar Chart Component for Monthly Submissions
  const MonthlyChart = ({ data }) => {
    if (!data || data.length === 0) {
      return (
        <div className="chart-empty">
          <p>No submission data available</p>
        </div>
      );
    }

    const maxCount = Math.max(...data.map((d) => d.count), 1);

    return (
      <div className="monthly-chart">
        <div className="chart-bars">
          {data.map((month, index) => {
            const height = (month.count / maxCount) * 100;
            return (
              <div key={index} className="chart-bar-item">
                <div className="chart-bar-wrapper">
                  <div
                    className="chart-bar"
                    style={{ height: `${height}%` }}
                    title={`${month.count} submissions`}>
                    <div className="chart-bar-value">{month.count}</div>
                  </div>
                </div>
                <div className="chart-bar-label">{month.monthName}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Distribution Chart Component
  const DistributionChart = ({ data, title, colors }) => {
    if (!data) return null;

    const entries = Object.entries(data).filter(([_, value]) => value > 0);
    const total = entries.reduce((sum, [_, value]) => sum + value, 0);

    return (
      <div className="distribution-chart">
        <h6 className="distribution-title">{title}</h6>
        <div className="distribution-items">
          {entries.map(([key, value], index) => {
            const percentage = total > 0 ? (value / total) * 100 : 0;
            const color = colors?.[key] || "#667eea";
            return (
              <div key={key} className="distribution-item">
                <div className="distribution-header">
                  <span className="distribution-label">{key}</span>
                  <span className="distribution-value">{value}</span>
                </div>
                <div className="distribution-bar-wrapper">
                  <div
                    className="distribution-bar"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
                <small className="distribution-percentage">
                  {percentage.toFixed(1)}%
                </small>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (dashboardLoading) {
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

  // Extract data from dashboard response
  const stats = dashboardData?.stats || {};
  const trends = dashboardData?.trends || {};
  const completionRates = dashboardData?.completionRates || {};
  const monthlySubmissions = dashboardData?.monthlySubmissions || [];
  const recentActivities = dashboardData?.recentActivities || [];
  const pendingItems = dashboardData?.pendingItems || {};
  const topForms = dashboardData?.topForms || [];
  const userDistribution = dashboardData?.userDistribution || {};
  const levelDistribution = dashboardData?.levelDistribution || {};

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
              value={stats.totalUsers || 0}
              icon={Users}
              color="primary"
              change={trends.usersChange}
              subtitle="Active users"
            />
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <StatCard
              title="Total Forms"
              value={stats.totalForms || 0}
              icon={FileText}
              color="success"
              change={trends.formsChange}
              subtitle="Published forms"
            />
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <StatCard
              title="Completed Submissions"
              value={stats.completedSubmissions || 0}
              icon={CheckCircle}
              color="info"
              change={trends.submissionsChange}
              subtitle="This month"
            />
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <StatCard
              title="Pending Submissions"
              value={pendingItems.pendingSubmissions || 0}
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
              <Card.Header className="chart-header">
                <div className="d-flex align-items-center gap-2">
                  <BarChart3 size={20} className="text-primary" />
                  <h5 className="mb-0">Submission Trends</h5>
                </div>
                <small className="text-muted">Last 6 months</small>
              </Card.Header>
              <Card.Body>
                <MonthlyChart data={monthlySubmissions} />
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
                  <div className="progress-label">
                    Forms Completed
                    <span className="progress-percentage">
                      {completionRates.formsCompleted?.toFixed(1) || 0}%
                    </span>
                  </div>
                  <ProgressBar
                    now={completionRates.formsCompleted || 0}
                    className="mb-3 custom-progress"
                    variant="success"
                  />
                </div>
                <div className="progress-item">
                  <div className="progress-label">
                    User Engagement
                    <span className="progress-percentage">
                      {completionRates.userEngagement?.toFixed(1) || 0}%
                    </span>
                  </div>
                  <ProgressBar
                    now={completionRates.userEngagement || 0}
                    className="mb-3 custom-progress"
                    variant="info"
                  />
                </div>
                {completionRates.averageSubmissionsPerUser && (
                  <div className="metrics-summary">
                    <div className="metric-item">
                      <span className="metric-label">Avg. per User</span>
                      <span className="metric-value">
                        {completionRates.averageSubmissionsPerUser.toFixed(1)}
                      </span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-label">Avg. per Form</span>
                      <span className="metric-value">
                        {completionRates.averageSubmissionsPerForm?.toFixed(
                          1
                        ) || 0}
                      </span>
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Distribution Charts and Top Forms */}
        <Row className="mb-4">
          <Col lg={4} className="mb-3">
            <Card className="distribution-card">
              <Card.Header>
                <h5>User Distribution</h5>
              </Card.Header>
              <Card.Body>
                <DistributionChart
                  data={userDistribution}
                  title="By Role"
                  colors={{
                    residents: "#667eea",
                    tutors: "#f093fb",
                    admins: "#4facfe",
                  }}
                />
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4} className="mb-3">
            <Card className="distribution-card">
              <Card.Header>
                <h5>Resident Levels</h5>
              </Card.Header>
              <Card.Body>
                <DistributionChart
                  data={levelDistribution}
                  title="Level Distribution"
                  colors={{
                    R1: "#11998e",
                    R2: "#38ef7d",
                    R3: "#667eea",
                    R4: "#764ba2",
                    R5: "#f093fb",
                  }}
                />
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4} className="mb-3">
            <Card className="top-forms-card">
              <Card.Header>
                <h5>Top Forms</h5>
                <small className="text-muted">By submission count</small>
              </Card.Header>
              <Card.Body>
                {topForms.length > 0 ? (
                  <div className="top-forms-list">
                    {topForms.map((form, index) => (
                      <div key={form.formId} className="top-form-item">
                        <div className="top-form-rank">
                          <Badge bg={index === 0 ? "warning" : "secondary"}>
                            #{index + 1}
                          </Badge>
                        </div>
                        <div className="top-form-info">
                          <div className="top-form-name">{form.formName}</div>
                          <div className="top-form-stats">
                            <span className="top-form-count">
                              {form.submissionCount} submissions
                            </span>
                            <span className="top-form-rate">
                              {form.completionRate.toFixed(1)}% complete
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-data-message">
                    <p>No form data available</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Recent Activities and Quick Actions */}
        <Row>
          <Col lg={8} className="mb-3">
            <Card className="activities-card">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-2">
                  <Activity size={20} className="text-primary" />
                  <h5 className="mb-0">Recent Activities</h5>
                </div>
                <Badge bg="primary" pill>
                  {recentActivities?.length || 0}
                </Badge>
              </Card.Header>
              <Card.Body>
                <div className="activities-list">
                  {recentActivities && recentActivities.length > 0 ? (
                    recentActivities
                      .slice(0, 10)
                      .map((activity, index) => (
                        <ActivityItem
                          key={activity.id || index}
                          activity={activity}
                        />
                      ))
                  ) : (
                    <div className="no-activities">
                      <Activity size={48} className="text-muted mb-3" />
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
                  <button
                    className="btn btn-primary w-100 mb-2"
                    onClick={() =>
                      navigate(`/institution/${institutionId}/forms/create`)
                    }>
                    <Plus size={16} className="me-2" />
                    Create New Form
                  </button>
                  <button
                    className="btn btn-outline-primary w-100 mb-2"
                    onClick={() =>
                      navigate(`/institution/${institutionId}/users`)
                    }>
                    <Users size={16} className="me-2" />
                    Add New User
                  </button>
                  <button
                    className="btn btn-outline-success w-100 mb-2"
                    onClick={() =>
                      navigate(`/institution/${institutionId}/submissions`)
                    }>
                    <FileText size={16} className="me-2" />
                    View Submissions
                  </button>
                  <button
                    className="btn btn-outline-info w-100"
                    onClick={() =>
                      navigate(`/institution/${institutionId}/forms`)
                    }>
                    <Eye size={16} className="me-2" />
                    View Forms
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
