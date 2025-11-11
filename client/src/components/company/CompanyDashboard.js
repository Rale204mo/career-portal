import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

const CompanyDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    jobs: 0,
    applicants: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('token');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/company/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch company stats');
      }

      const data = await response.json();
      setStats({
        jobs: data.jobs || 0,
        applicants: data.applicants || 0,
        interviews: data.interviews || 0,
        offers: data.offers || 0
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to load dashboard statistics');
      // Fallback to mock data
      setStats({
        jobs: 0,
        applicants: 0,
        interviews: 0,
        offers: 0
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-4 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="display-4 fw-bold text-dark mb-2">🏢 Company Dashboard</h1>
          <p className="text-muted lead">Welcome back! Here's an overview of your recruitment activities.</p>
        </div>
        <Button variant="outline-danger" onClick={handleLogout} className="px-4">
          🚪 Logout
        </Button>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="text-center">
              <div className="mb-3">
                <span className="display-4 text-primary">💼</span>
              </div>
              <h3 className="h2 fw-bold text-primary">{stats.jobs}</h3>
              <p className="text-muted mb-0">Active Jobs</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="text-center">
              <div className="mb-3">
                <span className="display-4 text-success">👥</span>
              </div>
              <h3 className="h2 fw-bold text-success">{stats.applicants}</h3>
              <p className="text-muted mb-0">Total Applicants</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="text-center">
              <div className="mb-3">
                <span className="display-4 text-info">📅</span>
              </div>
              <h3 className="h2 fw-bold text-info">{stats.interviews}</h3>
              <p className="text-muted mb-0">Interviews Scheduled</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="text-center">
              <div className="mb-3">
                <span className="display-4 text-warning">🎯</span>
              </div>
              <h3 className="h2 fw-bold text-warning">{stats.offers}</h3>
              <p className="text-muted mb-0">Offers Made</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card className="shadow-sm border-0 mb-4">
        <Card.Header className="bg-light border-0">
          <h2 className="h4 mb-0 fw-bold">⚡ Quick Actions</h2>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={4} className="mb-3">
              <Link to="/company/jobs/post" className="text-decoration-none">
                <Card className="h-100 border-0 shadow-sm hover-shadow transition-all">
                  <Card.Body className="text-center">
                    <div className="mb-3">
                      <span className="display-4 text-primary">📝</span>
                    </div>
                    <h5 className="fw-bold text-primary">Post New Job</h5>
                    <p className="text-muted small mb-3">Create a comprehensive job posting with detailed requirements</p>
                    <Button variant="primary" className="w-100">
                      Get Started
                    </Button>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
            <Col md={4} className="mb-3">
              <Link to="/company/applicants" className="text-decoration-none">
                <Card className="h-100 border-0 shadow-sm hover-shadow transition-all">
                  <Card.Body className="text-center">
                    <div className="mb-3">
                      <span className="display-4 text-success">👥</span>
                    </div>
                    <h5 className="fw-bold text-success">View Applicants</h5>
                    <p className="text-muted small mb-3">Review and manage job applications with AI matching</p>
                    <Button variant="success" className="w-100">
                      View Now
                    </Button>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
            <Col md={4} className="mb-3">
              <Link to="/company/jobs" className="text-decoration-none">
                <Card className="h-100 border-0 shadow-sm hover-shadow transition-all">
                  <Card.Body className="text-center">
                    <div className="mb-3">
                      <span className="display-4 text-info">⚙️</span>
                    </div>
                    <h5 className="fw-bold text-info">Manage Jobs</h5>
                    <p className="text-muted small mb-3">Edit, update, or close your job postings</p>
                    <Button variant="info" className="w-100">
                      Manage
                    </Button>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Recent Activity */}
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-light border-0">
          <h2 className="h4 mb-0 fw-bold">📊 Recent Activity</h2>
        </Card.Header>
        <Card.Body>
          <div className="list-group list-group-flush">
            <div className="list-group-item border-0 px-0">
              <div className="d-flex justify-content-between align-items-start">
                <div className="flex-grow-1">
                  <h6 className="mb-1 fw-bold">📄 New application received</h6>
                  <p className="mb-1 text-muted small">John Doe applied for Senior Developer position</p>
                  <small className="text-muted">2 hours ago</small>
                </div>
                <Badge bg="success" className="ms-2">New</Badge>
              </div>
            </div>
            <div className="list-group-item border-0 px-0">
              <div className="d-flex justify-content-between align-items-start">
                <div className="flex-grow-1">
                  <h6 className="mb-1 fw-bold">📅 Interview scheduled</h6>
                  <p className="mb-1 text-muted small">Interview with Jane Smith scheduled for tomorrow at 10:00 AM</p>
                  <small className="text-muted">4 hours ago</small>
                </div>
                <Badge bg="info" className="ms-2">Scheduled</Badge>
              </div>
            </div>
            <div className="list-group-item border-0 px-0">
              <div className="d-flex justify-content-between align-items-start">
                <div className="flex-grow-1">
                  <h6 className="mb-1 fw-bold">🔄 Job posting updated</h6>
                  <p className="mb-1 text-muted small">Data Analyst position requirements and salary updated</p>
                  <small className="text-muted">1 day ago</small>
                </div>
                <Badge bg="secondary" className="ms-2">Updated</Badge>
              </div>
            </div>
            <div className="list-group-item border-0 px-0">
              <div className="d-flex justify-content-between align-items-start">
                <div className="flex-grow-1">
                  <h6 className="mb-1 fw-bold">🎯 Offer extended</h6>
                  <p className="mb-1 text-muted small">Job offer sent to Mike Johnson for Product Manager role</p>
                  <small className="text-muted">2 days ago</small>
                </div>
                <Badge bg="warning" className="ms-2">Offer</Badge>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CompanyDashboard;
