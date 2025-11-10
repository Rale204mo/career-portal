import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Badge,
  Spinner
} from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ApplicantView = () => {
  const [applicants, setApplicants] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    minScore: 0,
    status: 'all'
  });

  useEffect(() => {
    fetchJobs();
    fetchApplicants();
  }, [selectedJob, filters]);

  const fetchJobs = async () => {
    // Mock data - replace with API call
    setJobs([
      { id: 1, title: 'Senior Developer', department: 'Engineering' },
      { id: 2, title: 'Data Analyst', department: 'Analytics' },
      { id: 3, title: 'Product Manager', department: 'Product' }
    ]);
  };

  const fetchApplicants = async () => {
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      // Mock data - replace with API call
      const mockApplicants = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          jobTitle: 'Senior Developer',
          matchScore: 85,
          status: 'qualified',
          academicPerformance: 'GPA: 3.8/4.0',
          experience: '3 years',
          certificates: ['AWS Certified', 'Google Cloud'],
          lastUpdated: '2024-01-15'
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          jobTitle: 'Data Analyst',
          matchScore: 92,
          status: 'highly-qualified',
          academicPerformance: 'GPA: 3.9/4.0',
          experience: '2 years',
          certificates: ['Data Science Specialization'],
          lastUpdated: '2024-01-14'
        },
        {
          id: 3,
          name: 'Mike Johnson',
          email: 'mike@example.com',
          jobTitle: 'Senior Developer',
          matchScore: 78,
          status: 'qualified',
          academicPerformance: 'GPA: 3.6/4.0',
          experience: '4 years',
          certificates: ['Java Certification', 'Spring Framework'],
          lastUpdated: '2024-01-13'
        },
        {
          id: 4,
          name: 'Sarah Wilson',
          email: 'sarah@example.com',
          jobTitle: 'Product Manager',
          matchScore: 95,
          status: 'highly-qualified',
          academicPerformance: 'GPA: 3.9/4.0',
          experience: '5 years',
          certificates: ['PMP Certification', 'Agile Scrum Master'],
          lastUpdated: '2024-01-16'
        }
      ];

      // Filter applicants based on selection - only show highly-qualified by default
      let filtered = mockApplicants.filter(app => app.status === 'highly-qualified');
      if (selectedJob) {
        filtered = filtered.filter(app => app.jobTitle === selectedJob);
      }
      if (filters.minScore > 0) {
        filtered = filtered.filter(app => app.matchScore >= filters.minScore);
      }
      if (filters.status !== 'all') {
        filtered = filtered.filter(app => app.status === filters.status);
      }

      setApplicants(filtered);
      setLoading(false);
    }, 1000);
  };

  const getStatusVariant = (status) => {
    const variants = {
      'qualified': 'warning',
      'highly-qualified': 'success',
      'not-qualified': 'danger'
    };
    return variants[status] || 'secondary';
  };

  const getScoreVariant = (score) => {
    if (score >= 90) return 'success';
    if (score >= 80) return 'primary';
    if (score >= 70) return 'warning';
    return 'danger';
  };

  const scheduleInterview = (applicantId) => {
    // API call to schedule interview
    console.log('Schedule interview for:', applicantId);
    alert(`Interview scheduled for applicant #${applicantId}`);
  };

  const viewFullProfile = (applicantId) => {
    console.log('View full profile for:', applicantId);
    // Navigate to applicant detail page
  };

  const downloadResume = (applicantId) => {
    console.log('Download resume for:', applicantId);
    // Implement resume download
  };

  return (
    <Container className="py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div className="text-center flex-grow-1">
          <h2 className="fw-bold text-dark mb-2">Interview-Ready Applicants</h2>
          <p className="text-muted">View and manage applicants ready for interview consideration</p>
        </div>
        <Button as={Link} to="/company-dashboard" variant="outline-secondary">
          ← Back to Dashboard
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={3}>
              <Form.Group>
                <Form.Label className="fw-semibold">Filter by Job</Form.Label>
                <Form.Select
                  value={selectedJob}
                  onChange={(e) => setSelectedJob(e.target.value)}
                >
                  <option value="">All Jobs</option>
                  {jobs.map(job => (
                    <option key={job.id} value={job.title}>{job.title}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group>
                <Form.Label className="fw-semibold">Minimum Match Score</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  max="100"
                  value={filters.minScore}
                  onChange={(e) => setFilters({...filters, minScore: parseInt(e.target.value) || 0})}
                />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group>
                <Form.Label className="fw-semibold">Status</Form.Label>
                <Form.Select
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                >
                  <option value="all">All Status</option>
                  <option value="qualified">Qualified</option>
                  <option value="highly-qualified">Highly Qualified</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={3} className="d-flex align-items-end">
              <Button
                variant="primary"
                onClick={fetchApplicants}
                className="w-100"
              >
                Apply Filters
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Applicants List */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="text-muted mt-2">Loading applicants...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {applicants.map(applicant => (
            <Card key={applicant.id} className="border-0 shadow-sm">
              <Card.Body>
                <Row className="align-items-start">
                  <Col md={8}>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h5 className="fw-bold text-dark mb-1">{applicant.name}</h5>
                        <p className="text-muted mb-2">{applicant.email}</p>
                      </div>
                      <div className="text-end">
                        <Badge bg={getStatusVariant(applicant.status)} className="mb-2">
                          {applicant.status.replace('-', ' ').toUpperCase()}
                        </Badge>
                        <div>
                          <h4 className="fw-bold text-primary mb-0">{applicant.matchScore}%</h4>
                          <small className="text-muted">Match Score</small>
                        </div>
                      </div>
                    </div>

                    <Row className="mb-3">
                      <Col sm={4}>
                        <strong>Applied for:</strong>
                        <br />
                        <span className="text-muted">{applicant.jobTitle}</span>
                      </Col>
                      <Col sm={4}>
                        <strong>Academic Performance:</strong>
                        <br />
                        <span className="text-muted">{applicant.academicPerformance}</span>
                      </Col>
                      <Col sm={4}>
                        <strong>Experience:</strong>
                        <br />
                        <span className="text-muted">{applicant.experience}</span>
                      </Col>
                    </Row>

                    <div className="mb-3">
                      <strong>Certificates:</strong>
                      <div className="d-flex flex-wrap gap-2 mt-1">
                        {applicant.certificates.map((cert, index) => (
                          <Badge key={index} bg="light" text="dark" className="px-2 py-1">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Col>

                  <Col md={4}>
                    <div className="d-grid gap-2">
                      <Button
                        variant="success"
                        onClick={() => scheduleInterview(applicant.id)}
                        className="mb-2"
                      >
                        Schedule Interview
                      </Button>
                      <Button
                        variant="outline-primary"
                        onClick={() => viewFullProfile(applicant.id)}
                        className="mb-2"
                      >
                        View Full Profile
                      </Button>
                      <Button
                        variant="outline-dark"
                        onClick={() => downloadResume(applicant.id)}
                      >
                        Download Resume
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}

          {applicants.length === 0 && (
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center py-5">
                <h5 className="text-muted">No applicants found</h5>
                <p className="text-muted mb-3">No applicants match your current filter criteria.</p>
                <Button
                  variant="outline-primary"
                  onClick={() => {
                    setSelectedJob('');
                    setFilters({ minScore: 0, status: 'all' });
                  }}
                >
                  Clear Filters
                </Button>
              </Card.Body>
            </Card>
          )}
        </div>
      )}
    </Container>
  );
};

export default ApplicantView;
