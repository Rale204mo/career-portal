import React, { useEffect, useState } from "react";
import { Card, Row, Col, Spinner, Button } from "react-bootstrap";
import axios from "axios";
import { useAuth } from '../contexts/AuthContext';

export default function CompanyDashboard() {
  const { logout } = useAuth();
  const [stats, setStats] = useState({ jobs: 0, applicants: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("/api/company/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching company stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 className="fw-bold text-dark mb-2">Company Dashboard</h2>
          <p className="text-muted">Manage your hiring process</p>
        </div>
        <Button variant="outline-danger" onClick={() => logout()}>
          Logout
        </Button>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Row className="g-4">
          <Col md={6} lg={4}>
            <Card className="text-center border-0 shadow-sm h-100">
              <Card.Body className="p-4">
                <div className="text-primary mb-3">
                  <h3 className="fw-bold display-6">{stats.jobs}</h3>
                </div>
                <h5 className="text-dark mb-3">Active Jobs</h5>
                <p className="text-muted mb-3">Currently posted job openings</p>
                <Button variant="primary" href="/company/jobs" className="w-100">
                  Manage Jobs
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={4}>
            <Card className="text-center border-0 shadow-sm h-100">
              <Card.Body className="p-4">
                <div className="text-success mb-3">
                  <h3 className="fw-bold display-6">{stats.applicants}</h3>
                </div>
                <h5 className="text-dark mb-3">Total Applicants</h5>
                <p className="text-muted mb-3">All applications received</p>
                <Button variant="success" href="/company/applicants" className="w-100">
                  View Applicants
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={4}>
            <Card className="text-center border-0 shadow-sm h-100">
              <Card.Body className="p-4">
                <div className="text-warning mb-3">
                  <h3 className="fw-bold display-6">+</h3>
                </div>
                <h5 className="text-dark mb-3">Post New Job</h5>
                <p className="text-muted mb-3">Create a new job opening</p>
                <Button variant="warning" href="/company/post-job" className="w-100">
                  Create Job
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={4}>
            <Card className="text-center border-0 shadow-sm h-100">
              <Card.Body className="p-4">
                <div className="text-info mb-3">
                  <h3 className="fw-bold display-6">⚙️</h3>
                </div>
                <h5 className="text-dark mb-3">Company Profile</h5>
                <p className="text-muted mb-3">Update company information</p>
                <Button variant="info" href="/company/profile" className="w-100">
                  Manage Profile
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
}
