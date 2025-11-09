import React, { useState, useEffect } from 'react';

const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    // Mock data - replace with API call
    setJobs([
      {
        id: 1,
        title: 'Senior Developer',
        department: 'Engineering',
        location: 'Remote',
        jobType: 'full-time',
        applicants: 15,
        status: 'active',
        postedDate: '2024-01-10',
        deadline: '2024-02-10'
      },
      {
        id: 2,
        title: 'Data Analyst',
        department: 'Analytics',
        location: 'New York, NY',
        jobType: 'full-time',
        applicants: 8,
        status: 'active',
        postedDate: '2024-01-12',
        deadline: '2024-02-12'
      }
    ]);
  };

  const updateJobStatus = async (jobId, status) => {
    // API call to update job status
    console.log(`Updating job ${jobId} to ${status}`);
  };

  const deleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      // API call to delete job
      console.log('Deleting job:', jobId);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'active': 'bg-green-100 text-green-800',
      'paused': 'bg-yellow-100 text-yellow-800',
      'closed': 'bg-red-100 text-red-800',
      'draft': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Job Management</h1>
        <p className="text-gray-600">Manage your job postings and applications</p>
      </div>

      {/* Jobs List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Job Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Applicants
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Deadline
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {jobs.map((job) => (
              <tr key={job.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{job.title}</div>
                    <div className="text-sm text-gray-500">{job.location} • {job.jobType}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {job.department}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900">{job.applicants}</span>
                  <span className="text-sm text-gray-500 ml-1">applicants</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(job.status)}`}>
                    {job.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(job.deadline).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button 
                    onClick={() => setSelectedJob(job)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    View
                  </button>
                  <button 
                    onClick={() => updateJobStatus(job.id, job.status === 'active' ? 'paused' : 'active')}
                    className="text-yellow-600 hover:text-yellow-900"
                  >
                    {job.status === 'active' ? 'Pause' : 'Activate'}
                  </button>
                  <button 
                    onClick={() => deleteJob(job.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {jobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No job postings found.</p>
          </div>
        )}
      </div>

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">{selectedJob.title}</h2>
                <button 
                  onClick={() => setSelectedJob(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>Department:</strong> {selectedJob.department}
                  </div>
                  <div>
                    <strong>Location:</strong> {selectedJob.location}
                  </div>
                  <div>
                    <strong>Job Type:</strong> {selectedJob.jobType}
                  </div>
                  <div>
                    <strong>Status:</strong> 
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(selectedJob.status)}`}>
                      {selectedJob.status}
                    </span>
                  </div>
                </div>
                
                <div>
                  <strong>Posted Date:</strong> {new Date(selectedJob.postedDate).toLocaleDateString()}
                </div>
                <div>
                  <strong>Application Deadline:</strong> {new Date(selectedJob.deadline).toLocaleDateString()}
                </div>
                <div>
                  <strong>Total Applicants:</strong> {selectedJob.applicants}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  View Applicants
                </button>
                <button className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">
                  Edit Job
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobManagement;