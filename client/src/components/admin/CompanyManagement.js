import React, { useEffect, useState } from "react";
import { Card, Button, Table, Modal, Form } from "react-bootstrap";
import axios from "axios";

export default function CompanyManagement() {
  const [companies, setCompanies] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: "",
    email: "",
    location: "",
  });

  // Fetch companies from backend (placeholder)
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const API_BASE =
          process.env.REACT_APP_API_BASE || "http://localhost:5000";
        const res = await axios.get(`${API_BASE}/companies`);
        setCompanies(res.data);
      } catch (err) {
        console.error("Failed to fetch companies:", err);
        // Example placeholder data if backend not ready
        setCompanies([
          { id: 1, name: "Tech Traders Ltd", email: "info@techtraders.com", location: "Maseru" },
          { id: 2, name: "CodeHub Solutions", email: "support@codehub.com", location: "Leribe" },
        ]);
      }
    };

    fetchCompanies();
  }, []);

  // Handle form inputs
  const handleChange = (e) =>
    setNewCompany({ ...newCompany, [e.target.name]: e.target.value });

  // Add a new company
  const handleAddCompany = async (e) => {
    e.preventDefault();
    if (!newCompany.name || !newCompany.email || !newCompany.location) {
      alert("All fields are required");
      return;
    }

    try {
      const API_BASE =
        process.env.REACT_APP_API_BASE || "http://localhost:5000";
      await axios.post(`${API_BASE}/companies`, newCompany);
      setCompanies([...companies, newCompany]);
      setShowAddModal(false);
      setNewCompany({ name: "", email: "", location: "" });
    } catch (err) {
      console.error("Error adding company:", err);
      alert("Failed to add company (check backend).");
    }
  };

  // Delete a company (demo mode)
  const handleDelete = (id) => {
    if (window.confirm("Delete this company?")) {
      setCompanies(companies.filter((c) => c.id !== id));
      // Later: await axios.delete(`${API_BASE}/companies/${id}`);
    }
  };

  return (
    <div className="bg-dark text-light p-4 rounded">
      <h2 className="mb-4 text-center">Company Management</h2>

      {/* Add New Company */}
      <div className="text-end mb-3">
        <Button variant="outline-light" onClick={() => setShowAddModal(true)}>
          + Add Company
        </Button>
      </div>

      {/* Companies Table */}
      <Card className="card-custom p-3">
        <Table striped bordered hover variant="dark" responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Company Name</th>
              <th>Email</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  No companies found.
                </td>
              </tr>
            ) : (
              companies.map((c, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.location}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="outline-warning"
                      className="me-2"
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(c.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card>

      {/* Add Company Modal */}
      <Modal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        centered
      >
        <Modal.Header closeButton className="bg-secondary text-light">
          <Modal.Title>Add New Company</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-light">
          <Form onSubmit={handleAddCompany}>
            <Form.Group className="mb-3">
              <Form.Label>Company Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newCompany.name}
                onChange={handleChange}
                placeholder="Enter company name"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={newCompany.email}
                onChange={handleChange}
                placeholder="Enter company email"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={newCompany.location}
                onChange={handleChange}
                placeholder="Enter location"
              />
            </Form.Group>
            <div className="text-end">
              <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button variant="light" type="submit" className="ms-2">
                Add Company
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
