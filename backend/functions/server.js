const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Load service account
const serviceAccount = require('./serviceAccountKey.json');

let db;
try {
  console.log('Initializing Firebase with project:', serviceAccount.project_id);
  
  // Initialize Firebase Admin
  initializeApp({
    credential: cert(serviceAccount),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
  });

  db = getFirestore();
  console.log('✅ Firebase Admin initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization failed:', error.message);
  console.log('Please make sure serviceAccountKey.json exists in the functions folder');
  process.exit(1);
}

app.use(cors({ origin: true }));
app.use(express.json());

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Test database connection
    await db.collection('applications').limit(1).get();
    
    res.json({
      status: 'OK',
      firebase: 'Connected',
      timestamp: new Date().toISOString(),
      projectId: serviceAccount.project_id
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      status: 'ERROR',
      firebase: 'Disconnected',
      error: error.message
    });
  }
});

// ==================== INSTITUTIONS MANAGEMENT ====================

// Get all institutions
app.get('/institutions', async (req, res) => {
  try {
    console.log('Fetching all institutions...');
    const snapshot = await db.collection('institutions').get();
    
    const institutions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log(`Found ${institutions.length} institutions`);
    res.json({
      success: true,
      data: institutions
    });
  } catch (error) {
    console.error('Error fetching institutions:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Add new institution
app.post('/institutions', async (req, res) => {
  try {
    const { name, code, type, location, contactEmail, description } = req.body;
    
    console.log('Adding new institution:', { name, code, type });
    
    // Check if institution with same code already exists
    const existingInstitution = await db.collection('institutions')
      .where('code', '==', code.toUpperCase())
      .get();
    
    if (!existingInstitution.empty) {
      return res.status(400).json({
        success: false,
        error: 'Institution with this code already exists'
      });
    }

    const institutionData = {
      name,
      code: code.toUpperCase(),
      type,
      location,
      contactEmail,
      description: description || '',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await db.collection('institutions').add(institutionData);
    
    res.json({
      success: true,
      message: 'Institution added successfully',
      data: {
        id: docRef.id,
        ...institutionData
      }
    });
  } catch (error) {
    console.error('Error adding institution:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update institution
app.put('/institutions/:institutionId', async (req, res) => {
  try {
    const { institutionId } = req.params;
    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };
    
    console.log(`Updating institution ${institutionId}:`, updateData);
    
    await db.collection('institutions').doc(institutionId).update(updateData);
    
    res.json({
      success: true,
      message: 'Institution updated successfully'
    });
  } catch (error) {
    console.error('Error updating institution:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Delete institution
app.delete('/institutions/:institutionId', async (req, res) => {
  try {
    const { institutionId } = req.params;
    
    console.log(`Deleting institution: ${institutionId}`);
    
    await db.collection('institutions').doc(institutionId).delete();
    
    res.json({
      success: true,
      message: 'Institution deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting institution:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ==================== FACULTIES MANAGEMENT ====================

// Get faculties by institution
app.get('/institutions/:institutionId/faculties', async (req, res) => {
  try {
    const { institutionId } = req.params;
    
    console.log(`Fetching faculties for institution: ${institutionId}`);
    
    const snapshot = await db.collection('faculties')
      .where('institutionId', '==', institutionId)
      .get();
    
    const faculties = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log(`Found ${faculties.length} faculties`);
    res.json({
      success: true,
      data: faculties
    });
  } catch (error) {
    console.error('Error fetching faculties:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Add faculty to institution
app.post('/institutions/:institutionId/faculties', async (req, res) => {
  try {
    const { institutionId } = req.params;
    const { name, description, code } = req.body;
    
    console.log(`Adding faculty to institution ${institutionId}:`, { name, code });
    
    const facultyData = {
      institutionId,
      name,
      code: code.toUpperCase(),
      description: description || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await db.collection('faculties').add(facultyData);
    
    res.json({
      success: true,
      message: 'Faculty added successfully',
      data: {
        id: docRef.id,
        ...facultyData
      }
    });
  } catch (error) {
    console.error('Error adding faculty:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ==================== COURSES MANAGEMENT ====================

// Get courses by faculty
app.get('/faculties/:facultyId/courses', async (req, res) => {
  try {
    const { facultyId } = req.params;
    
    console.log(`Fetching courses for faculty: ${facultyId}`);
    
    const snapshot = await db.collection('courses')
      .where('facultyId', '==', facultyId)
      .get();
    
    const courses = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log(`Found ${courses.length} courses`);
    res.json({
      success: true,
      data: courses
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Add course to faculty
app.post('/faculties/:facultyId/courses', async (req, res) => {
  try {
    const { facultyId } = req.params;
    const { name, code, duration, requirements, description, capacity } = req.body;
    
    console.log(`Adding course to faculty ${facultyId}:`, { name, code });
    
    const courseData = {
      facultyId,
      name,
      code: code.toUpperCase(),
      duration: duration || '4 years',
      requirements: requirements || '',
      description: description || '',
      capacity: capacity || 100,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await db.collection('courses').add(courseData);
    
    res.json({
      success: true,
      message: 'Course added successfully',
      data: {
        id: docRef.id,
        ...courseData
      }
    });
  } catch (error) {
    console.error('Error adding course:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ==================== COMPANIES MANAGEMENT ====================

// Get all companies
app.get('/companies', async (req, res) => {
  try {
    const { status } = req.query;
    
    console.log('Fetching companies with status:', status);
    
    let query = db.collection('companies');
    
    if (status) {
      query = query.where('status', '==', status);
    }
    
    const snapshot = await query.get();
    
    const companies = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log(`Found ${companies.length} companies`);
    res.json({
      success: true,
      data: companies
    });
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update company status (approve, suspend, delete)
app.patch('/companies/:companyId/status', async (req, res) => {
  try {
    const { companyId } = req.params;
    const { status } = req.body;
    
    console.log(`Updating company ${companyId} status to: ${status}`);
    
    const updateData = {
      status: status,
      updatedAt: new Date()
    };
    
    // If approving, set approved date
    if (status === 'approved') {
      updateData.approvedAt = new Date();
    }
    
    await db.collection('companies').doc(companyId).update(updateData);
    
    res.json({
      success: true,
      message: `Company status updated to ${status}`
    });
  } catch (error) {
    console.error('Error updating company status:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ==================== ADMISSIONS MANAGEMENT ====================

// Publish admissions for institution
app.post('/institutions/:institutionId/publish-admissions', async (req, res) => {
  try {
    const { institutionId } = req.params;
    const { academicYear, deadline } = req.body;
    
    console.log(`Publishing admissions for institution ${institutionId}`);
    
    const admissionData = {
      institutionId,
      academicYear: academicYear || new Date().getFullYear(),
      deadline: deadline ? new Date(deadline) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days default
      status: 'published',
      publishedAt: new Date(),
      createdAt: new Date()
    };

    await db.collection('admissions').add(admissionData);
    
    // Update institution to show admissions are published
    await db.collection('institutions').doc(institutionId).update({
      admissionsPublished: true,
      admissionsUpdatedAt: new Date()
    });
    
    res.json({
      success: true,
      message: 'Admissions published successfully'
    });
  } catch (error) {
    console.error('Error publishing admissions:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ==================== SYSTEM REPORTS ====================

// Get system statistics
app.get('/admin/stats', async (req, res) => {
  try {
    console.log('Generating system statistics...');
    
    // Get counts from all collections
    const [
      applicationsSnapshot,
      institutionsSnapshot,
      companiesSnapshot,
      usersSnapshot
    ] = await Promise.all([
      db.collection('applications').get(),
      db.collection('institutions').get(),
      db.collection('companies').get(),
      db.collection('users').get()
    ]);

    const applications = applicationsSnapshot.docs.map(doc => doc.data());
    const pendingApplications = applications.filter(app => app.status === 'pending').length;
    const approvedApplications = applications.filter(app => app.status === 'approved').length;
    const rejectedApplications = applications.filter(app => app.status === 'rejected').length;

    const companies = companiesSnapshot.docs.map(doc => doc.data());
    const pendingCompanies = companies.filter(company => company.status === 'pending').length;
    const activeCompanies = companies.filter(company => company.status === 'approved').length;
    const suspendedCompanies = companies.filter(company => company.status === 'suspended').length;

    const stats = {
      totalUsers: usersSnapshot.size,
      totalInstitutions: institutionsSnapshot.size,
      totalCompanies: companiesSnapshot.size,
      totalApplications: applicationsSnapshot.size,
      pendingApplications,
      approvedApplications,
      rejectedApplications,
      pendingCompanies,
      activeCompanies,
      suspendedCompanies
    };

    console.log('System stats generated:', stats);
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error generating system stats:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ==================== EXISTING APPLICATION ENDPOINTS (KEEP THESE) ====================

// Get ALL applications
app.get('/applications', async (req, res) => {
  try {
    console.log('Fetching all applications...');
    const snapshot = await db.collection('applications').get();
    
    const applications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log(`Found ${applications.length} applications`);
    res.json({
      success: true,
      data: applications
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get applications by institute
app.get('/applications/institute/:instituteId', async (req, res) => {
  try {
    const { instituteId } = req.params;
    console.log(`Fetching applications for institute: ${instituteId}`);
    
    const snapshot = await db
      .collection('applications')
      .where('institutionId', '==', instituteId)
      .get();
    
    const applications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log(`Found ${applications.length} applications for institute ${instituteId}`);
    res.json({
      success: true,
      data: applications
    });
  } catch (error) {
    console.error('Error fetching applications by institute:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get applications by institution
app.get('/applications/institution/:institutionId', async (req, res) => {
  try {
    const { institutionId } = req.params;
    console.log(`Fetching applications for institution: ${institutionId}`);
    
    const snapshot = await db
      .collection('applications')
      .where('institutionId', '==', institutionId)
      .get();
    
    const applications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log(`Found ${applications.length} applications for institution ${institutionId}`);
    res.json({
      success: true,
      data: applications
    });
  } catch (error) {
    console.error('Error fetching applications by institution:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update application status
app.patch('/applications/:applicationId/status', async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;
    
    console.log(`Updating application ${applicationId} to status: ${status}`);
    
    await db.collection('applications').doc(applicationId).update({
      status: status,
      updatedAt: new Date()
    });
    
    res.json({
      success: true,
      message: `Application status updated to ${status}`
    });
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get application by ID
app.get('/applications/:applicationId', async (req, res) => {
  try {
    const { applicationId } = req.params;
    
    const doc = await db.collection('applications').doc(applicationId).get();
    
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }
    
    res.json({
      success: true,
      data: {
        id: doc.id,
        ...doc.data()
      }
    });
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get all unique institution IDs (from applications)
app.get('/institutions-list', async (req, res) => {
  try {
    console.log('Fetching all institutions from applications...');
    const snapshot = await db.collection('applications').get();
    
    const institutions = [...new Set(snapshot.docs.map(doc => doc.data().institutionId).filter(Boolean))];
    
    console.log(`Found ${institutions.length} institutions:`, institutions);
    res.json({
      success: true,
      data: institutions
    });
  } catch (error) {
    console.error('Error fetching institutions:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ==================== JOB POSTING MANAGEMENT ====================

// Get all jobs
app.get('/jobs', async (req, res) => {
  try {
    const { companyId, status } = req.query;
    
    console.log('Fetching jobs with filters:', { companyId, status });
    
    let query = db.collection('jobs');
    
    if (companyId) {
      query = query.where('companyId', '==', companyId);
    }
    
    if (status) {
      query = query.where('status', '==', status);
    }
    
    const snapshot = await query.orderBy('createdAt', 'desc').get();
    
    const jobs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log(`Found ${jobs.length} jobs`);
    res.json({
      success: true,
      data: jobs
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get job by ID
app.get('/jobs/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    
    const doc = await db.collection('jobs').doc(jobId).get();
    
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }
    
    res.json({
      success: true,
      data: {
        id: doc.id,
        ...doc.data()
      }
    });
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Create new job posting
app.post('/jobs', async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      category,
      companyId,
      companyName,
      requirements,
      salaryRange,
      jobType,
      applicationDeadline,
      contactEmail
    } = req.body;
    
    console.log('Creating new job posting:', { title, companyId, companyName });
    
    // Validation
    if (!title || !description || !companyId) {
      return res.status(400).json({
        success: false,
        error: 'Title, description, and companyId are required'
      });
    }

    const jobData = {
      title,
      description,
      location: location || 'Remote',
      category: category || 'Other',
      companyId,
      companyName: companyName || 'Unknown Company',
      requirements: requirements || '',
      salaryRange: salaryRange || 'Negotiable',
      jobType: jobType || 'Full-time',
      applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days default
      contactEmail: contactEmail || '',
      status: 'active',
      views: 0,
      applications: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await db.collection('jobs').add(jobData);
    
    console.log('Job created successfully with ID:', docRef.id);
    
    res.status(201).json({
      success: true,
      message: 'Job posted successfully',
      data: {
        id: docRef.id,
        ...jobData
      }
    });
    
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update job posting
app.put('/jobs/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };
    
    console.log(`Updating job ${jobId}:`, updateData);
    
    // Check if job exists
    const jobDoc = await db.collection('jobs').doc(jobId).get();
    if (!jobDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }
    
    await db.collection('jobs').doc(jobId).update(updateData);
    
    res.json({
      success: true,
      message: 'Job updated successfully'
    });
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update job status (active, closed, draft)
app.patch('/jobs/:jobId/status', async (req, res) => {
  try {
    const { jobId } = req.params;
    const { status } = req.body;
    
    console.log(`Updating job ${jobId} status to: ${status}`);
    
    const validStatuses = ['active', 'closed', 'draft'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be: active, closed, or draft'
      });
    }
    
    const updateData = {
      status: status,
      updatedAt: new Date()
    };
    
    await db.collection('jobs').doc(jobId).update(updateData);
    
    res.json({
      success: true,
      message: `Job status updated to ${status}`
    });
  } catch (error) {
    console.error('Error updating job status:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Delete job posting
app.delete('/jobs/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    
    console.log(`Deleting job: ${jobId}`);
    
    await db.collection('jobs').doc(jobId).delete();
    
    res.json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get jobs by company
app.get('/companies/:companyId/jobs', async (req, res) => {
  try {
    const { companyId } = req.params;
    const { status } = req.query;
    
    console.log(`Fetching jobs for company: ${companyId}`);
    
    let query = db.collection('jobs')
      .where('companyId', '==', companyId)
      .orderBy('createdAt', 'desc');
    
    if (status) {
      query = query.where('status', '==', status);
    }
    
    const snapshot = await query.get();
    
    const jobs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log(`Found ${jobs.length} jobs for company ${companyId}`);
    res.json({
      success: true,
      data: jobs
    });
  } catch (error) {
    console.error('Error fetching company jobs:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ==================== JOB APPLICATIONS ====================

// Apply for a job
app.post('/jobs/:jobId/apply', async (req, res) => {
  try {
    const { jobId } = req.params;
    const {
      studentId,
      studentName,
      studentEmail,
      coverLetter,
      resumeUrl
    } = req.body;
    
    console.log(`Student ${studentId} applying for job ${jobId}`);
    
    // Check if job exists
    const jobDoc = await db.collection('jobs').doc(jobId).get();
    if (!jobDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }
    
    const job = jobDoc.data();
    
    // Check if already applied
    const existingApplication = await db.collection('jobApplications')
      .where('jobId', '==', jobId)
      .where('studentId', '==', studentId)
      .get();
    
    if (!existingApplication.empty) {
      return res.status(400).json({
        success: false,
        error: 'You have already applied for this job'
      });
    }
    
    const applicationData = {
      jobId,
      jobTitle: job.title,
      companyId: job.companyId,
      companyName: job.companyName,
      studentId,
      studentName,
      studentEmail,
      coverLetter: coverLetter || '',
      resumeUrl: resumeUrl || '',
      status: 'pending',
      appliedAt: new Date(),
      createdAt: new Date()
    };

    // Create application
    const applicationRef = await db.collection('jobApplications').add(applicationData);
    
    // Increment application count on job
    await db.collection('jobs').doc(jobId).update({
      applications: (job.applications || 0) + 1,
      updatedAt: new Date()
    });
    
    console.log('Job application created with ID:', applicationRef.id);
    
    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: {
        id: applicationRef.id,
        ...applicationData
      }
    });
    
  } catch (error) {
    console.error('Error applying for job:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get job applications for a company
app.get('/companies/:companyId/applications', async (req, res) => {
  try {
    const { companyId } = req.params;
    const { status, jobId } = req.query;
    
    console.log(`Fetching job applications for company: ${companyId}`);
    
    let query = db.collection('jobApplications')
      .where('companyId', '==', companyId)
      .orderBy('appliedAt', 'desc');
    
    if (status) {
      query = query.where('status', '==', status);
    }
    
    if (jobId) {
      query = query.where('jobId', '==', jobId);
    }
    
    const snapshot = await query.get();
    
    const applications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log(`Found ${applications.length} job applications for company ${companyId}`);
    res.json({
      success: true,
      data: applications
    });
  } catch (error) {
    console.error('Error fetching job applications:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update job application status
app.patch('/job-applications/:applicationId/status', async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;
    
    console.log(`Updating job application ${applicationId} to status: ${status}`);
    
    const validStatuses = ['pending', 'reviewed', 'accepted', 'rejected', 'interview'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status'
      });
    }
    
    await db.collection('jobApplications').doc(applicationId).update({
      status: status,
      updatedAt: new Date()
    });
    
    res.json({
      success: true,
      message: `Application status updated to ${status}`
    });
  } catch (error) {
    console.error('Error updating job application:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});



// ==================== ADMIN AUTH ====================

// Admin login
app.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Admin login attempt:', email);
    
    // For demo - in production, use proper authentication
    const demoAdmins = [
      {
        email: "admin@limkokwing.ac.ls",
        password: "admin123",
        name: "System Administrator",
        role: "admin"
      },
      {
        email: "liteboho.molaoa@limkokwing.ac.ls",
        password: "lecturer123",
        name: "Mr. Liteboho Molaoa",
        role: "admin"
      },
      {
        email: "tsekiso.thokoana@limkokwing.ac.ls",
        password: "lecturer123",
        name: "Mr. Tsekiso Thokoana",
        role: "admin"
      }
    ];

    const admin = demoAdmins.find(a => a.email === email && a.password === password);
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password"
      });
    }

    // In production, generate a proper JWT token
    const token = `admin-token-${Date.now()}`;

    res.json({
      success: true,
      message: "Login successful",
      token: token,
      admin: {
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});


// ==================== ADMIN AUTH ====================

// Create initial admin account (run once)
app.post('/admin/setup', async (req, res) => {
  try {
    const adminData = {
      email: "admin@limkokwing.ac.ls",
      password: "$2b$10$8A2B7C9D0E1F2G3H4I5J6K7L8M9N0O1P2Q3R4S5T6U7V8W9X0Y1Z2", // admin123
      name: "System Administrator",
      role: "super_admin",
      createdAt: new Date(),
      isActive: true
    };

    // Check if admin already exists
    const existingAdmin = await db.collection('admins')
      .where('email', '==', adminData.email)
      .get();

    if (!existingAdmin.empty) {
      return res.json({
        success: true,
        message: 'Admin account already exists'
      });
    }

    await db.collection('admins').add(adminData);

    res.json({
      success: true,
      message: 'Admin account created successfully'
    });
  } catch (error) {
    console.error('Admin setup error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Admin login with real authentication
app.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Admin login attempt:', email);
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required"
      });
    }

    // Find admin in Firestore
    const adminSnapshot = await db.collection('admins')
      .where('email', '==', email)
      .where('isActive', '==', true)
      .get();

    if (adminSnapshot.empty) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password"
      });
    }

    const adminDoc = adminSnapshot.docs[0];
    const admin = adminDoc.data();

    // In production, use bcrypt for password verification
    // For now, using simple password check (replace with bcrypt in production)
    const validPassword = await verifyPassword(password, admin.password);
    
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password"
      });
    }

    // Generate token (in production, use JWT)
    const token = generateAdminToken(adminDoc.id, admin.role);

    res.json({
      success: true,
      message: "Login successful",
      token: token,
      admin: {
        id: adminDoc.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Password verification helper (replace with bcrypt in production)
async function verifyPassword(inputPassword, storedPassword) {
  // Simple demo verification - REPLACE WITH BCRYPT IN PRODUCTION
  const demoPasswords = {
    "admin123": "$2b$10$8A2B7C9D0E1F2G3H4I5J6K7L8M9N0O1P2Q3R4S5T6U7V8W9X0Y1Z2",
    "lecturer123": "$2b$10$9B8C7D6E5F4G3H2I1J0K9L8M7N6O5P4Q3R2S1T0U9V8W7X6Y5Z4"
  };
  
  for (const [plain, hashed] of Object.entries(demoPasswords)) {
    if (storedPassword === hashed && inputPassword === plain) {
      return true;
    }
  }
  return false;
}

// Token generation helper
function generateAdminToken(adminId, role) {
  // In production, use jsonwebtoken library
  const payload = {
    adminId: adminId,
    role: role,
    timestamp: Date.now()
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

// Verify admin token middleware
const verifyAdminToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Access token required"
      });
    }

    // In production, verify JWT token
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    
    // Check if admin exists and is active
    const adminDoc = await db.collection('admins').doc(payload.adminId).get();
    
    if (!adminDoc.exists) {
      return res.status(401).json({
        success: false,
        error: "Invalid token"
      });
    }

    const admin = adminDoc.data();
    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        error: "Admin account deactivated"
      });
    }

    req.admin = {
      id: adminDoc.id,
      ...admin
    };
    
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({
      success: false,
      error: "Invalid token"
    });
  }
};

// Get current admin profile
app.get('/admin/profile', verifyAdminToken, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        id: req.admin.id,
        email: req.admin.email,
        name: req.admin.name,
        role: req.admin.role,
        createdAt: req.admin.createdAt
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Create new admin account (protected)
app.post('/admin/accounts', verifyAdminToken, async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    if (req.admin.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        error: "Only super admins can create admin accounts"
      });
    }

    // Check if admin already exists
    const existingAdmin = await db.collection('admins')
      .where('email', '==', email)
      .get();

    if (!existingAdmin.empty) {
      return res.status(400).json({
        success: false,
        error: "Admin with this email already exists"
      });
    }

    const adminData = {
      email,
      password: `$2b$10${Buffer.from(password).toString('base64')}`, // Simple hashing
      name,
      role: role || 'admin',
      createdAt: new Date(),
      isActive: true,
      createdBy: req.admin.id
    };

    const docRef = await db.collection('admins').add(adminData);

    res.status(201).json({
      success: true,
      message: 'Admin account created successfully',
      data: {
        id: docRef.id,
        email: adminData.email,
        name: adminData.name,
        role: adminData.role
      }
    });

  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🎉 Admin Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📍 All jobs: http://localhost:${PORT}/jobs`);
  console.log(`📍 Post job: POST http://localhost:${PORT}/jobs`);
  console.log(`📍 All applications: http://localhost:${PORT}/applications`);
  console.log(`📍 All institutions: http://localhost:${PORT}/institutions`);
  console.log(`📍 All companies: http://localhost:${PORT}/companies`);
  console.log(`📍 System stats: http://localhost:${PORT}/admin/stats`);
  console.log(`📍 Institute apps: http://localhost:${PORT}/applications/institute/limkokwing`);
});

module.exports = app;
