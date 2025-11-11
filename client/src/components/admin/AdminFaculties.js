// src/components/admin/AdminFaculties.js
import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Badge, Alert, Modal, Form, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { realApi } from '../../api/config';
import { useAuth } from '../contexts/AuthContext';

const AdminFaculties = () => {
  const { logout } = useAuth();
  const [faculties, setFaculties] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFaculty, setNewFaculty] = useState({
    name: '',
    code: '',
    description: '',
    institutionId: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch institutions first
      const institutionsQuery = query(collection(db, 'institutions'));
      const institutionsSnapshot = await getDocs(institutionsQuery);
      const institutionsData = institutionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setInstitutions(institutionsData);

      // Fetch faculties from Firestore
      const facultiesQuery = query(collection(db, 'faculties'));
      const facultiesSnapshot = await getDocs(facultiesQuery);
      const facultiesData = facultiesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Enrich faculties with institution names
      const enrichedFaculties = facultiesData.map(faculty => ({
        ...faculty,
        institutionName: institutionsData.find(inst => inst.id === faculty.institutionId)?.name || 'Unknown Institution'
      }));

      setFaculties(enrichedFaculties);
      console.log('Loaded faculties from Firestore:', enrichedFaculties.length);

    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFaculty = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Add to Firestore
      const docRef = await addDoc(collection(db, 'faculties'), {
        ...newFaculty,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      console.log('Faculty added with ID:', docRef.id);

      // Reset form and close modal
      setNewFaculty({
        name: '',
        code: '',
        description: '',
        institutionId: ''
      });
      setShowAddModal(false);

      // Refresh data
      fetchData();

      alert('Faculty added successfully!');
    } catch (err) {
      console.error('Error adding faculty:', err);
      setError('Failed to add faculty: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateFaculty = async (facultyId, updates) => {
    try {
      const facultyRef = doc(db, 'faculties', facultyId);
      await updateDoc(facultyRef, {
        ...updates,
        updatedAt: new Date()
      });

      alert('Faculty updated successfully!');
      fetchData();
    } catch (err) {
      console.error('Error updating faculty:', err);
      setError('Failed to update faculty: ' + err.message);
    }
  };

  const handleDeleteFaculty = async (facultyId) => {
    if (!window.confirm('Are you sure you want to delete this faculty? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'faculties', facultyId));
      alert('Faculty deleted successfully!');
      fetchData();
    } catch (err) {
      console.error('Error deleting faculty:', err);
      setError('Failed to delete faculty: ' + err.message);
    }
  };

  const handleViewDetails = (faculty) => {
    setSelectedFaculty(faculty);
    setShowModal(true);
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading faculties...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-3">
          <Button as={Link} to="/admin" variant="outline-secondary">
            ← Back to Dashboard
          </Button>
          <h1>Faculty Management</h1>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-danger" onClick={() => logout()}>
            Logout
          </Button>
          <Button variant="success" onClick={() => setShowAddModal(true)} className="me-2">
            + Add Faculty
          </Button>
          <Button variant="primary" onClick={fetchData}>
            Refresh
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card>
        <Card.Header>
          <h5 className="mb-0">All Faculties ({faculties.length})</h5>
        </Card.Header>
        <Card.Body>
          {faculties.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted">No faculties found</p>
              <Button variant="primary" onClick={() => setShowAddModal(true)}>
                Add First Faculty
              </Button>
            </div>
          ) : (
            <Table responsive>
              <thead>
                <tr>
                  <th>Faculty Name</th>
                  <th>Code</th>
                  <th>Institution</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {faculties.map((faculty) => (
                  <tr key={faculty.id}>
                    <td>
                      <div>
                        <strong>{faculty.name}</strong>
                      </div>
                    </td>
                    <td>
                      <Badge bg="info">{faculty.code || 'N/A'}</Badge>
                    </td>
                    <td>{faculty.institutionName}</td>
                    <td>
                      <div className="text-truncate" style={{ maxWidth: '200px' }}>
                        {faculty.description || 'No description'}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleViewDetails(faculty)}
                        >
                          View
                        </Button>
                        <Button
                          variant="outline-warning"
                          size="sm"
                          onClick={() => {
                            const newName = prompt('Enter new faculty name:', faculty.name);
                            if (newName && newName !== faculty.name) {
                              handleUpdateFaculty(faculty.id, { name: newName });
                            }
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteFaculty(faculty.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Faculty Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Faculty Details: {selectedFaculty?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedFaculty && (
            <div>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Name:</strong> {selectedFaculty.name}
                </Col>
                <Col md={6}>
                  <strong>Code:</strong> {selectedFaculty.code}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Institution:</strong> {selectedFaculty.institutionName}
                </Col>
                <Col md={6}>
                  <strong>Created:</strong> {selectedFaculty.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={12}>
                  <strong>Description:</strong>
                  <p className="mt-2">{selectedFaculty.description || 'No description available'}</p>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Faculty Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Faculty</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddFaculty}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Faculty Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={newFaculty.name}
                    onChange={(e) => setNewFaculty({...newFaculty, name: e.target.value})}
                    required
                    placeholder="Enter faculty name"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Faculty Code *</Form.Label>
                  <Form.Control
                    type="text"
                    value={newFaculty.code}
                    onChange={(e) => setNewFaculty({...newFaculty, code: e.target.value.toUpperCase()})}
                    required
                    placeholder="Short code (e.g., SCI)"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Institution *</Form.Label>
              <Form.Select
                value={newFaculty.institutionId}
                onChange={(e) => setNewFaculty({...newFaculty, institutionId: e.target.value})}
                required
              >
                <option value="">Select Institution</option>
                {institutions.map((institution) => (
                  <option key={institution.id} value={institution.id}>
                    {institution.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newFaculty.description}
                onChange={(e) => setNewFaculty({...newFaculty, description: e.target.value})}
                placeholder="Enter faculty description"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Faculty'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default AdminFaculties;
