import React, { useState, useEffect } from 'react';
import { realApi } from '../../api/config';

import './CourseManagement.css';

const CourseManagement = ({ onBack }) => {
  const [courses, setCourses] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    facultyId: '',
    requirements: '',
    duration: '',
    fees: '',
    seats: ''
  });
  const [editingCourse, setEditingCourse] = useState(null);

  // Get instituteId with better error handling
  const getInstituteId = () => {
    const instituteId = localStorage.getItem('instituteId');
    if (!instituteId) {
      setError('Institute ID not found. Please log in again.');
      return null;
    }
    return instituteId;
  };

  // Fetch courses and faculties on component mount
  useEffect(() => {
    console.log('Component mounted, fetching data...');
    console.log('Institute ID from localStorage:', localStorage.getItem('instituteId'));
    fetchCourses();
    fetchFaculties();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError('');
      const instituteId = getInstituteId();
      if (!instituteId) return;

      // Get all faculties first, then get courses for each faculty
      const facultiesResponse = await realApi.getFaculties(instituteId);
      if (!facultiesResponse.success) {
        setError('Failed to fetch faculties for courses');
        return;
      }

      const allCourses = [];
      for (const faculty of facultiesResponse.data) {
        try {
          const coursesResponse = await realApi.getCourses(faculty.id);
          if (coursesResponse.success) {
            // Add faculty info to each course
            const coursesWithFaculty = coursesResponse.data.map(course => ({
              ...course,
              facultyId: faculty.id,
              facultyName: faculty.name
            }));
            allCourses.push(...coursesWithFaculty);
          }
        } catch (error) {
          console.error(`Error fetching courses for faculty ${faculty.id}:`, error);
        }
      }

      setCourses(allCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to load courses. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const fetchFaculties = async () => {
    try {
      const instituteId = getInstituteId();
      if (!instituteId) return;

      const response = await realApi.getFaculties(instituteId);
      if (response.success) {
        setFaculties(response.data);
      } else {
        setError('Failed to load faculties.');
      }
    } catch (error) {
      console.error('Error fetching faculties:', error);
      setError('Failed to load faculties.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const instituteId = getInstituteId();
      if (!instituteId) return;

      // Validate numeric fields
      const fees = parseFloat(formData.fees);
      const seats = parseInt(formData.seats);

      if (isNaN(fees) || isNaN(seats)) {
        setError('Please enter valid numbers for fees and seats');
        return;
      }

      if (fees < 0 || seats < 1) {
        setError('Fees must be positive and seats must be at least 1');
        return;
      }

      // Prepare course data for API (matching backend expectations)
      const courseData = {
        name: formData.name,
        code: formData.name.toUpperCase().replace(/\s+/g, '_').substring(0, 10), // Generate code from name
        duration: formData.duration,
        requirements: formData.requirements,
        description: formData.description,
        capacity: seats,
        // Store additional data that frontend needs
        fees: fees,
        institutionId: instituteId,
        isActive: true
      };

      let response;
      if (editingCourse) {
        // Update existing course
        response = await realApi.updateCourse(editingCourse.id, courseData);
        if (response.success) {
          alert('Course updated successfully!');
        } else {
          setError(response.error || 'Failed to update course');
          return;
        }
      } else {
        // Add new course
        response = await realApi.addCourse(formData.facultyId, courseData);
        if (response.success) {
          alert('Course added successfully!');
        } else {
          setError(response.error || 'Failed to add course');
          return;
        }
      }

      // Reset form and refresh data
      setFormData({
        name: '',
        description: '',
        facultyId: '',
        requirements: '',
        duration: '',
        fees: '',
        seats: ''
      });
      setEditingCourse(null);
      fetchCourses();
    } catch (error) {
      console.error('Error saving course:', error);
      setError('Failed to save course: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      name: course.name,
      description: course.description || '',
      facultyId: course.facultyId || '',
      requirements: course.requirements || '',
      duration: course.duration || '',
      fees: course.fees ? course.fees.toString() : '',
      seats: course.capacity ? course.capacity.toString() : ''
    });
    setError(''); // Clear any previous errors
  };

  const handleDelete = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        const response = await realApi.deleteCourse(courseId);
        if (response.success) {
          alert('Course deleted successfully!');
          fetchCourses();
        } else {
          setError(response.error || 'Failed to delete course');
        }
      } catch (error) {
        console.error('Error deleting course:', error);
        setError('Failed to delete course: ' + error.message);
      }
    }
  };

  const toggleCourseStatus = async (course) => {
    try {
      const updatedData = {
        ...course,
        status: course.status === 'active' ? 'inactive' : 'active'
      };
      const response = await realApi.updateCourse(course.id, updatedData);
      if (response.success) {
        fetchCourses();
      } else {
        setError(response.error || 'Failed to update course status');
      }
    } catch (error) {
      console.error('Error updating course status:', error);
      setError('Failed to update course status: ' + error.message);
    }
  };

  const cancelEdit = () => {
    setEditingCourse(null);
    setFormData({
      name: '',
      description: '',
      facultyId: '',
      requirements: '',
      duration: '',
      fees: '',
      seats: ''
    });
    setError('');
  };

  return (
    <div className="course-management">
      <div className="course-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
          <button
            onClick={onBack}
            className="btn-secondary"
            style={{ padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            ← Back to Dashboard
          </button>
          <h3>Course Management</h3>
        </div>
        <p>Add and manage courses for your institution</p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-message">
          {error}
          <button
            onClick={() => setError('')}
            className="error-close"
          >
            ×
          </button>
        </div>
      )}

      {/* Course Form */}
      <div className="course-form-section">
        <h4>{editingCourse ? 'Edit Course' : 'Add New Course'}</h4>
        <form onSubmit={handleSubmit} className="course-form">
          <div className="form-row">
            <div className="form-group">
              <label>Course Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label>Faculty *</label>
              <select
                value={formData.facultyId}
                onChange={(e) => setFormData({...formData, facultyId: e.target.value})}
                required
                disabled={loading || faculties.length === 0}
              >
                <option value="">Select Faculty</option>
                {faculties.map(faculty => (
                  <option key={faculty.id} value={faculty.id}>
                    {faculty.name}
                  </option>
                ))}
              </select>
              {faculties.length === 0 && !loading && (
                <small className="form-hint">No faculties found. Please add faculties first.</small>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
              rows="3"
              disabled={loading}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Requirements *</label>
              <input
                type="text"
                value={formData.requirements}
                onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                placeholder="e.g., Mathematics, English, Science"
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label>Duration *</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                placeholder="e.g., 4 years"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Fees (LSL) *</label>
              <input
                type="number"
                value={formData.fees}
                onChange={(e) => setFormData({...formData, fees: e.target.value})}
                required
                min="0"
                step="0.01"
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label>Available Seats *</label>
              <input
                type="number"
                value={formData.seats}
                onChange={(e) => setFormData({...formData, seats: e.target.value})}
                required
                min="1"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Saving...' : (editingCourse ? 'Update Course' : 'Add Course')}
            </button>
            {editingCourse && (
              <button
                type="button"
                onClick={cancelEdit}
                disabled={loading}
                className="btn-secondary"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Courses List */}
      <div className="courses-list-section">
        <div className="section-header">
          <h4>Your Courses ({courses.length})</h4>
          <button
            onClick={fetchCourses}
            disabled={loading}
            className="btn-refresh"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading courses...</div>
        ) : courses.length === 0 ? (
          <div className="no-courses">
            <p>No courses added yet</p>
            <p className="hint">Add your first course using the form above</p>
          </div>
        ) : (
          <div className="courses-grid">
            {courses.map(course => (
              <div key={course.id} className={`course-card ${course.status !== 'active' ? 'inactive' : ''}`}>
                <div className="course-header">
                  <h5>{course.name}</h5>
                  <span className={`status ${course.status === 'active' ? 'active' : 'inactive'}`}>
                    {course.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="course-description">{course.description}</p>
                <div className="course-details">
                  <span><strong>Duration:</strong> {course.duration}</span>
                  <span><strong>Capacity:</strong> {course.capacity}</span>
                  <span><strong>Faculty:</strong> {course.facultyName || faculties.find(f => f.id === course.facultyId)?.name || 'Unknown'}</span>
                </div>
                <div className="course-requirements">
                  <strong>Requirements:</strong> {course.requirements || 'None'}
                </div>
                <div className="course-actions">
                  <button
                    onClick={() => handleEdit(course)}
                    className="btn-edit"
                    disabled={loading}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => toggleCourseStatus(course)}
                    className={course.status === 'active' ? 'btn-warning' : 'btn-success'}
                    disabled={loading}
                  >
                    {course.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDelete(course.id)}
                    className="btn-danger"
                    disabled={loading}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseManagement;
