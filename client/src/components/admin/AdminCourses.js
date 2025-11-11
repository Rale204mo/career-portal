// src/components/admin/AdminCourses.js
import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Badge, Alert, Modal, Form, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { realApi } from '../../api/config';
import { useAuth } from '../contexts/AuthContext';

const AdminCourses = () => {
  const { logout } = useAuth();
  const [courses, setCourses] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCourse, setNewCourse] = useState({
    name: '',
    code: '',
    description: '',
    facultyId: '',
    duration: '',
    requirements: ''
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

      // Fetch faculties
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

      // Fetch courses from Firestore
      const coursesQuery = query(collection(db, 'courses'));
      const coursesSnapshot = await getDocs(coursesQuery);
      const coursesData = coursesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Enrich courses with faculty and institution names
      const enrichedCourses = coursesData.map(course => {
        const faculty = enrichedFaculties.find(f => f.id === course.facultyId);
        return {
          ...course,
          facultyName: faculty?.name || 'Unknown Faculty',
          institutionName: faculty?.institutionName || 'Unknown Institution'
        };
      });

      setCourses(enrichedCourses);
      console.log('Loaded courses from Firestore:', enrichedCourses.length);

    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Add to Firestore
      const docRef = await addDoc(collection(db, 'courses'), {
        ...newCourse,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      console.log('Course added with ID:', docRef.id);

      // Reset form and close modal
      setNewCourse({
        name: '',
        code: '',
        description: '',
        facultyId: '',
        duration: '',
        requirements: ''
      });
      setShowAddModal(false);

      // Refresh data
      fetchData();

      alert('Course added successfully!');
    } catch (err) {
      console.error('Error adding course:', err);
      setError('Failed to add course: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCourse = async (courseId, updates) => {
    try {
      const courseRef = doc(db, 'courses', courseId);
      await updateDoc(courseRef, {
        ...updates,
        updatedAt: new Date()
      });

      alert('Course updated successfully!');
      fetchData();
    } catch (err) {
      console.error('Error updating course:', err);
      setError('Failed to update course: ' + err.message);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'courses', courseId));
      alert('Course deleted successfully!');
      fetchData();
    } catch (err) {
      console.error('Error deleting course:', err);
      setError('Failed to delete course: ' + err.message);
    }
  };

  const handleViewDetails = (course) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading courses...</p>
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
          <h1>Course Management</h1>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-danger" onClick={() => logout()}>
            Logout
          </Button>
          <Button variant="success" onClick={() => setShowAddModal(true)} className="me-2">
            + Add Course
          </Button>
          <Button variant="primary" onClick={fetchData}>
            Refresh
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card>
        <Card.Header>
          <h5 className="mb-0">All Courses ({courses.length})</h5>
        </Card.Header>
        <Card.Body>
          {courses.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted">No courses found</p>
              <Button variant="primary" onClick={() => setShowAddModal(true)}>
                Add First Course
              </Button>
            </div>
          ) : (
            <Table responsive>
              <thead>
                <tr>
                  <th>Course Name</th>
                  <th>Code</th>
                  <th>Faculty</th>
                  <th>Institution</th>
                  <th>Duration</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td>
                      <div>
                        <strong>{course.name}</strong>
                      </div>
                    </td>
                    <td>
                      <Badge bg="info">{course.code || 'N/A'}</Badge>
                    </td>
                    <td>{course.facultyName}</td>
                    <td>{course.institutionName}</td>
                    <td>{course.duration || 'N/A'}</td>
                    <td>
                      <div className="d-flex gap-1">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleViewDetails(course)}
                        >
                          View
                        </Button>
                        <Button
                          variant="outline-warning"
                          size="sm"
                          onClick={() => {
                            const newName = prompt('Enter new course name:', course.name);
                            if (newName && newName !== course.name) {
                              handleUpdateCourse(course.id, { name: newName });
                            }
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteCourse(course.id)}
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

      {/* Course Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Course Details: {selectedCourse?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCourse && (
            <div>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Name:</strong> {selectedCourse.name}
                </Col>
                <Col md={6}>
                  <strong>Code:</strong> {selectedCourse.code}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Faculty:</strong> {selectedCourse.facultyName}
                </Col>
                <Col md={6}>
                  <strong>Institution:</strong> {selectedCourse.institutionName}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Duration:</strong> {selectedCourse.duration}
                </Col>
                <Col md={6}>
                  <strong>Created:</strong> {selectedCourse.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={12}>
                  <strong>Description:</strong>
                  <p className="mt-2">{selectedCourse.description || 'No description available'}</p>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={12}>
                  <strong>Requirements:</strong>
                  <p className="mt-2">{selectedCourse.requirements || 'No requirements specified'}</p>
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

      {/* Add Course Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Course</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddCourse}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Course Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={newCourse.name}
                    onChange={(e) => setNewCourse({...newCourse, name: e.target.value})}
                    required
                    placeholder="Enter course name"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Course Code *</Form.Label>
                  <Form.Control
                    type="text"
                    value={newCourse.code}
                    onChange={(e) => setNewCourse({...newCourse, code: e.target.value.toUpperCase()})}
                    required
                    placeholder="Short code (e.g., CS101)"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Faculty *</Form.Label>
              <Form.Select
                value={newCourse.facultyId}
                onChange={(e) => setNewCourse({...newCourse, facultyId: e.target.value})}
                required
              >
                <option value="">Select Faculty</option>
                {faculties.map((faculty) => (
                  <option key={faculty.id} value={faculty.id}>
                    {faculty.name} ({faculty.institutionName})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Duration</Form.Label>
                  <Form.Control
                    type="text"
                    value={newCourse.duration}
                    onChange={(e) => setNewCourse({...newCourse, duration: e.target.value})}
                    placeholder="e.g., 4 years, 2 semesters"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Requirements</Form.Label>
                  <Form.Control
                    type="text"
                    value={newCourse.requirements}
                    onChange={(e) => setNewCourse({...newCourse, requirements: e.target.value})}
                    placeholder="Entry requirements"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newCourse.description}
                onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                placeholder="Enter course description"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Course'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default AdminCourses;
