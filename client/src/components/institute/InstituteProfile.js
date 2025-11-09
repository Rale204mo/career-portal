// src/components/institute/InstituteProfile.js
import React, { useState, useEffect } from 'react';
import { Button, Card, Container, Row, Col, Badge, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { realApi } from '../../api/config';

export default function InstituteProfile() {
  const navigate = useNavigate();
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const fetchInstitutions = async () => {
    try {
      setLoading(true);
      const response = await realApi.getInstitutions();
      
      if (response.data && Array.isArray(response.data)) {
        // Filter to only show active institutions
        const activeInstitutions = response.data.filter(inst => 
          inst.status === 'active' || inst.status === undefined
        );
        setInstitutions(activeInstitutions);
      } else {
        setInstitutions([]);
      }
    } catch (err) {
      console.error('Error fetching institutions:', err);
      setError('Failed to load institutions');
      // Fallback to default institutions if API fails
      setInstitutions(getDefaultInstitutions());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultInstitutions = () => {
    return [
      {
        id: 'nationaluniversityoflesotho',
        name: "National University of Lesotho",
        code: "NUL",
        location: "Roma, Lesotho",
        type: "Public University",
        established: "1945",
        programs: ["Undergraduate", "Postgraduate", "Research"],
        description: "The premier institution of higher learning in Lesotho offering diverse academic programs.",
        status: "active"
      },
      {
        id: 'limkokwinguniversity',
        name: "Limkokwing University",
        code: "LUCT",
        location: "Maseru, Lesotho",
        type: "Private University",
        established: "1991",
        programs: ["Creative Technology", "Business", "Communication"],
        description: "Innovative university focusing on creative industry and technology education.",
        status: "active"
      },
      {
        id: 'bothouniversity',
        name: "Botho University",
        code: "BOTHO",
        location: "Maseru, Lesotho",
        type: "Private University",
        established: "1997",
        programs: ["Computing", "Business", "Accounting", "Hospitality"],
        description: "Leading private university known for professional and vocational education.",
        status: "active"
      }
    ];
  };

  const handleViewDetails = (institution) => {
    // Navigate to institution details page
    navigate(`/university/${institution.id}`);
  };

  const handleContact = (institution) => {
    // You can implement contact logic here
    alert(`Contacting ${institution.name}`);
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading institutions...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="row">
        <div className="col-12">
          <h3 className="text-primary mb-4">Higher Education Institutions in Lesotho</h3>
        </div>
      </div>

      {error && (
        <Alert variant="warning" className="mb-4">
          {error}
        </Alert>
      )}

      <div className="row">
        {institutions.map((institution) => (
          <div className="col-lg-4 col-md-6 mb-4" key={institution.id}>
            <Card className="h-100 shadow-sm border-0">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h5 className="card-title text-dark">{institution.name}</h5>
                  <Badge bg="secondary">{institution.code}</Badge>
                </div>
                <p className="card-text text-muted">{institution.description}</p>
                
                <div className="university-details mt-3">
                  <div className="mb-2">
                    <strong>Location:</strong> {institution.location}
                  </div>
                  <div className="mb-2">
                    <strong>Type:</strong> {institution.type}
                  </div>
                  <div className="mb-2">
                    <strong>Established:</strong> {institution.established}
                  </div>
                  <div className="mb-2">
                    <strong>Programs:</strong>
                    <div className="mt-1">
                      {Array.isArray(institution.programs) ? (
                        institution.programs.map((program, i) => (
                          <span key={i} className="badge bg-light text-dark me-1 mb-1">
                            {program}
                          </span>
                        ))
                      ) : (
                        <span className="badge bg-light text-dark">Various Programs</span>
                      )}
                    </div>
                  </div>
                </div>
              </Card.Body>
              <Card.Footer className="bg-transparent border-0">
                <div className="d-flex gap-2">
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => handleViewDetails(institution)}
                  >
                    View Details
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    size="sm"
                    onClick={() => handleContact(institution)}
                  >
                    Contact
                  </Button>
                </div>
              </Card.Footer>
            </Card>
          </div>
        ))}
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <Card className="bg-light">
            <Card.Body>
              <h5 className="card-title">About Lesotho Higher Education</h5>
              <p className="card-text">
                Lesotho offers diverse higher education opportunities through both public and private institutions. 
                These universities provide quality education in various fields including technology, business, 
                and creative arts, contributing to the nation's development.
              </p>
              <p className="card-text mb-0">
                <strong>Total Institutions:</strong> {institutions.length} registered institutions
              </p>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
}