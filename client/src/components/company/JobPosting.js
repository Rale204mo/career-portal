import React, { useState } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import axios from "axios";

export default function JobPosting() {
  const [job, setJob] = useState({
    title: "",
    description: "",
    location: "",
    category: "",
  });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setLoading(true);

    if (!job.title || !job.description) {
      setStatus("❌ Please fill out all required fields.");
      setLoading(false);
      return;
    }

    try {
      // Add required company fields that the backend expects
      const jobData = {
        ...job,
        companyId: "demo-company-id", // Replace with actual company ID from your auth context
        companyName: "Demo Company"    // Replace with actual company name from your auth context
      };

      // Use the correct backend endpoint
      await axios.post("http://localhost:5000/jobs", jobData);
      setStatus("✅ Job posted successfully!");
      setJob({ title: "", description: "", location: "", category: "" });
    } catch (err) {
      console.error("Error posting job:", err);
      setStatus("❌ Failed to post job. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-dark text-light">
      <Card className="bg-secondary text-light p-4 shadow-lg" style={{ width: "500px" }}>
        <h3 className="text-center mb-4">📝 Job Posting</h3>
        <p className="text-muted small text-center">
          Create and publish new job opportunities for students and graduates.
        </p>

        {status && <Alert variant="info">{status}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Job Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g. Software Engineer Intern"
              name="title"
              value={job.title}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Describe job responsibilities and requirements"
              name="description"
              value={job.description}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Location</Form.Label>
            <Form.Control
              type="text"
              placeholder="City, Country"
              name="location"
              value={job.location}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select
              name="category"
              value={job.category}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              <option value="IT">Information Technology</option>
              <option value="Business">Business & Management</option>
              <option value="Engineering">Engineering</option>
              <option value="Design">Design & Media</option>
              <option value="Other">Other</option>
            </Form.Select>
          </Form.Group>

          <Button
            type="submit"
            variant="outline-light"
            className="w-100"
            disabled={loading}
          >
            {loading ? "Posting..." : "Post Job"}
          </Button>
        </Form>
      </Card>
    </div>
  );
}