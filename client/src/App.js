// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from 'react-bootstrap';
import Home from './pages/Home';
import StudentDashboard from './components/student/StudentDashboard';
import StudentProfile from './components/student/StudentProfile';
import Documents from './components/student/Documents';
import JobPostings from './components/student/JobPostings';
import CompanyDashboard from './components/company/CompanyDashboard';
import InstituteDashboard from './components/institute/InstituteDashboard';
import CourseManagement from './components/institute/CourseManagement';
import ApplicationReview from './components/institute/ApplicationReview';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import './styles/styles.css';
import Signup from './pages/Signup';
import JobManagement from './components/company/JobManagement';
import JobPosting from './components/company/JobPosting';
import ApplicantView from './components/company/ApplicantView';
import CompanyProfile from './components/company/CompanyProfile';
import Universities from './components/student/Universities';



// Admin Components
import AdminDashboard from './components/admin/AdminDashboard';
import AdminInstitutions from './components/admin/AdminInstitutions';
import AdminUsers from './components/admin/AdminUsers';
import AdminCompanies from './components/admin/AdminCompanies';
import AdminReports from './components/admin/AdminReports';
import AdminAdmissions from './components/admin/AdminAdmissions';
import AdminSecurity from './components/admin/AdminSecurity';
import AdminLogin from './components/auth/AdminLogin';

// Auth Context
import ProtectedRoute from './components/shared/ProtectedRoute';
import Unauthorized from './components/shared/Unauthorized';
import { AuthProvider } from './components/contexts/AuthContext';


function App() {
  return (
      <AuthProvider>
        <Router>
          <div className="App">
            <Navbar />
            <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Student Routes */}
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/student/profile" element={<StudentProfile />} />
            <Route path="/student/documents" element={<Documents />} />
            <Route path="/student/jobs" element={<JobPostings />} />
            <Route path="/universities" element={<Universities />} />

            {/* Institute Routes */}
            <Route path="/institute-dashboard" element={<InstituteDashboard />} />
            <Route path="/course-management" element={<CourseManagement />} />
            <Route path="/application-review" element={<ApplicationReview />} />

            {/* Company Routes */}
            <Route path="/company-dashboard" element={<CompanyDashboard />} />
            <Route path="/company/applicants" element={<ApplicantView />} />
            <Route path="/company/profile" element={<CompanyProfile />} />
            <Route path="company/jobs" element={<JobManagement />} />
            <Route path="company/post-job" element={<JobPosting />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/institutions" element={<AdminInstitutions />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/companies" element={<AdminCompanies />} />
            <Route path="/admin/admissions" element={<AdminAdmissions />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/security" element={<AdminSecurity />} />

            {/* Catch-all route */}
            <Route path="*" element={<div className="container mt-5 text-center"><h1>404 - Page Not Found</h1></div>} />
          </Routes>
          </div>
        </Router>
      </AuthProvider>
  );
}

export default App;
