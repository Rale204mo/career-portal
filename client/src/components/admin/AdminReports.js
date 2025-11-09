// src/components/admin/AdminReports.js
import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Table, Button, Alert } from 'react-bootstrap';
import { realApi } from '../../api/config';

const AdminReports = () => {
  const [applications, setApplications] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      const [applicationsResponse, institutionsResponse] = await Promise.all([
        realApi.getApplications(),
        realApi.getInstitutions()
      ]);

      setApplications(applicationsResponse.data || []);
      setInstitutions(institutionsResponse.data || []);

    } catch (err) {
      setError('Failed to load report data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getApplicationStats = () => {
    const total = applications.length;
    const pending = applications.filter(app => app.status === 'pending').length;
    const approved = applications.filter(app => app.status === 'approved').length;
    const rejected = applications.filter(app => app.status === 'rejected').length;
    
    return { total, pending, approved, rejected };
  };

  const getInstitutionStats = () => {
    return institutions.map(institution => {
      const institutionApps = applications.filter(app => app.institutionId === institution);
      return {
        name: institution,
        total: institutionApps.length,
        pending: institutionApps.filter(app => app.status === 'pending').length,
        approved: institutionApps.filter(app => app.status === 'approved').length,
        rejected: institutionApps.filter(app => app.status === 'rejected').length
      };
    });
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading reports...</p>
        </div>
      </Container>
    );
  }

  const appStats = getApplicationStats();
  const institutionStats = getInstitutionStats();

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>System Reports</h1>
        <Button variant="primary" onClick={fetchData}>
          Refresh Reports
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Application Statistics */}
      <Row className="mb-4">
        <Col md={12}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Application Statistics</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3}>
                  <div className="text-center">
                    <h3 className="text-primary">{appStats.total}</h3>
                    <p>Total Applications</p>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center">
                    <h3 className="text-warning">{appStats.pending}</h3>
                    <p>Pending</p>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center">
                    <h3 className="text-success">{appStats.approved}</h3>
                    <p>Approved</p>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center">
                    <h3 className="text-danger">{appStats.rejected}</h3>
                    <p>Rejected</p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Institution-wise Reports */}
      <Row>
        <Col md={12}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Institution Performance</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Institution</th>
                    <th>Total Applications</th>
                    <th>Pending</th>
                    <th>Approved</th>
                    <th>Rejected</th>
                    <th>Approval Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {institutionStats.map((stats) => (
                    <tr key={stats.name}>
                      <td>{stats.name}</td>
                      <td>{stats.total}</td>
                      <td>{stats.pending}</td>
                      <td>{stats.approved}</td>
                      <td>{stats.rejected}</td>
                      <td>
                        {stats.total > 0 ? 
                          ((stats.approved / stats.total) * 100).toFixed(1) + '%' : 
                          '0%'
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* System Summary */}
      <Row className="mt-4">
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">System Summary</h5>
            </Card.Header>
            <Card.Body>
              <p><strong>Total Institutions:</strong> {institutions.length}</p>
              <p><strong>Total Applications:</strong> {applications.length}</p>
              <p><strong>Unique Students:</strong> {[...new Set(applications.map(app => app.studentId))].length}</p>
              <p><strong>Data Last Updated:</strong> {new Date().toLocaleString()}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Button variant="outline-primary">
                  Export Applications CSV
                </Button>
                <Button variant="outline-success">
                  Generate Full Report
                </Button>
                <Button variant="outline-warning">
                  System Analytics
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminReports;