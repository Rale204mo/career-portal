// src/api/config.js
const API_BASE_URL = 'http://localhost:5000';

export const realApi = {
  // Health check
  checkHealth: async () => {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  },

  // Applications (existing)
  getApplications: async (instituteId = null) => {
    let url = `${API_BASE_URL}/applications`;
    if (instituteId) url = `${API_BASE_URL}/applications/institute/${instituteId}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch applications: ${response.status}`);
    return await response.json();
  },

  updateApplicationStatus: async (applicationId, status) => {
    const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error(`Failed to update application: ${response.status}`);
    return await response.json();
  },

  // Institutions Management
  getInstitutions: async () => {
    const response = await fetch(`${API_BASE_URL}/institutions`);
    if (!response.ok) throw new Error(`Failed to fetch institutions: ${response.status}`);
    return await response.json();
  },

  addInstitution: async (institutionData) => {
    const response = await fetch(`${API_BASE_URL}/institutions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(institutionData)
    });
    if (!response.ok) throw new Error(`Failed to add institution: ${response.status}`);
    return await response.json();
  },

  updateInstitution: async (institutionId, updateData) => {
    const response = await fetch(`${API_BASE_URL}/institutions/${institutionId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });
    if (!response.ok) throw new Error(`Failed to update institution: ${response.status}`);
    return await response.json();
  },

  deleteInstitution: async (institutionId) => {
    const response = await fetch(`${API_BASE_URL}/institutions/${institutionId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error(`Failed to delete institution: ${response.status}`);
    return await response.json();
  },

  // ==================== FACULTIES MANAGEMENT ====================

  // Get faculties by institution
  getFaculties: async (institutionId) => {
    const response = await fetch(`${API_BASE_URL}/institutions/${institutionId}/faculties`);
    if (!response.ok) throw new Error(`Failed to fetch faculties: ${response.status}`);
    return await response.json();
  },

  // Add faculty to institution
  addFaculty: async (institutionId, facultyData) => {
    const response = await fetch(`${API_BASE_URL}/institutions/${institutionId}/faculties`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(facultyData)
    });
    if (!response.ok) throw new Error(`Failed to add faculty: ${response.status}`);
    return await response.json();
  },

  // Update faculty
  updateFaculty: async (facultyId, updateData) => {
    const response = await fetch(`${API_BASE_URL}/faculties/${facultyId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });
    if (!response.ok) throw new Error(`Failed to update faculty: ${response.status}`);
    return await response.json();
  },

  // Delete faculty
  deleteFaculty: async (facultyId) => {
    const response = await fetch(`${API_BASE_URL}/faculties/${facultyId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error(`Failed to delete faculty: ${response.status}`);
    return await response.json();
  },

  // ==================== COURSES MANAGEMENT ====================

  // Get courses by faculty
  getCourses: async (facultyId) => {
    const response = await fetch(`${API_BASE_URL}/faculties/${facultyId}/courses`);
    if (!response.ok) throw new Error(`Failed to fetch courses: ${response.status}`);
    return await response.json();
  },

  // Add course to faculty
  addCourse: async (facultyId, courseData) => {
    const response = await fetch(`${API_BASE_URL}/faculties/${facultyId}/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(courseData)
    });
    if (!response.ok) throw new Error(`Failed to add course: ${response.status}`);
    return await response.json();
  },

  // Update course
  updateCourse: async (courseId, updateData) => {
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });
    if (!response.ok) throw new Error(`Failed to update course: ${response.status}`);
    return await response.json();
  },

  // Delete course
  deleteCourse: async (courseId) => {
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error(`Failed to delete course: ${response.status}`);
    return await response.json();
  },

  // Companies Management
  getCompanies: async (status = null) => {
    let url = `${API_BASE_URL}/companies`;
    if (status) url += `?status=${status}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch companies: ${response.status}`);
    return await response.json();
  },

  updateCompanyStatus: async (companyId, status) => {
    const response = await fetch(`${API_BASE_URL}/companies/${companyId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error(`Failed to update company: ${response.status}`);
    return await response.json();
  },

  // System Stats
  getSystemStats: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/stats`);
    if (!response.ok) throw new Error(`Failed to fetch system stats: ${response.status}`);
    return await response.json();
  },

  // Admissions Management
  publishAdmissions: async (institutionId, admissionData) => {
    const response = await fetch(`${API_BASE_URL}/institutions/${institutionId}/publish-admissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(admissionData)
    });
    if (!response.ok) throw new Error(`Failed to publish admissions: ${response.status}`);
    return await response.json();
  },

  // ==================== JOB POSTING MANAGEMENT ====================

  // Get all jobs
  getJobs: async (companyId = null, status = null) => {
    let url = `${API_BASE_URL}/jobs`;
    const params = new URLSearchParams();

    if (companyId) params.append('companyId', companyId);
    if (status) params.append('status', status);

    if (params.toString()) url += `?${params.toString()}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch jobs: ${response.status}`);
    return await response.json();
  },

  // Get job by ID
  getJob: async (jobId) => {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`);
    if (!response.ok) throw new Error(`Failed to fetch job: ${response.status}`);
    return await response.json();
  },

  // Create new job posting
  postJob: async (jobData) => {
    const response = await fetch(`${API_BASE_URL}/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobData)
    });
    if (!response.ok) throw new Error(`Failed to post job: ${response.status}`);
    return await response.json();
  },

  // Update job posting
  updateJob: async (jobId, updateData) => {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });
    if (!response.ok) throw new Error(`Failed to update job: ${response.status}`);
    return await response.json();
  },

  // Update job status
  updateJobStatus: async (jobId, status) => {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error(`Failed to update job status: ${response.status}`);
    return await response.json();
  },

  // Delete job posting
  deleteJob: async (jobId) => {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error(`Failed to delete job: ${response.status}`);
    return await response.json();
  },

  // Get jobs by company
  getCompanyJobs: async (companyId, status = null) => {
    let url = `${API_BASE_URL}/companies/${companyId}/jobs`;
    if (status) url += `?status=${status}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch company jobs: ${response.status}`);
    return await response.json();
  },

  // ==================== JOB APPLICATIONS ====================

  // Apply for a job
  applyForJob: async (jobId, applicationData) => {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(applicationData)
    });
    if (!response.ok) throw new Error(`Failed to apply for job: ${response.status}`);
    return await response.json();
  },

  // Get job applications for a company
  getJobApplications: async (companyId, status = null, jobId = null) => {
    let url = `${API_BASE_URL}/companies/${companyId}/applications`;
    const params = new URLSearchParams();

    if (status) params.append('status', status);
    if (jobId) params.append('jobId', jobId);

    if (params.toString()) url += `?${params.toString()}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch job applications: ${response.status}`);
    return await response.json();
  },

  // Update job application status
  updateJobApplicationStatus: async (applicationId, status) => {
    const response = await fetch(`${API_BASE_URL}/job-applications/${applicationId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error(`Failed to update job application: ${response.status}`);
    return await response.json();
  }
};

export default realApi;
