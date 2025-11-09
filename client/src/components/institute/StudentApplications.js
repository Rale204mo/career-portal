// src/components/institute/StudentApplications.js
import React from 'react';
import { Container, Card, Table, Button, Badge } from 'react-bootstrap';

const StudentApplications = () => {
  return (
    <Container className="mt-4">
      <h2>Student Applications</h2>
      <Card>
        <Card.Body>
          <Table responsive>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Course</th>
                <th>Applied Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>No applications yet</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default StudentApplications;