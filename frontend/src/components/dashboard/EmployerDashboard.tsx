import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Briefcase, Eye } from 'lucide-react';
import { jobAPI } from '../../services/api';
import { Job, JobFormData, Application } from '../../types';
import JobForm from '../jobs/JobForm';

const EmployerDashboard: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [viewingApplications, setViewingApplications] = useState<string | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const data = await jobAPI.getMyJobs();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async (jobId: string) => {
    try {
      const data = await jobAPI.getJobApplications(jobId);
      setApplications(data);
      setViewingApplications(jobId);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleCreateJob = async (jobData: JobFormData) => {
    try {
      await jobAPI.createJob(jobData);
      await fetchJobs();
      setShowForm(false);
    } catch (error) {
      console.error('Error creating job:', error);
    }
  };

  const handleUpdateJob = async (jobData: JobFormData) => {
    if (!editingJob) return;
    
    try {
      await jobAPI.updateJob(editingJob.id, jobData);
      await fetchJobs();
      setEditingJob(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error updating job:', error);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await jobAPI.deleteJob(jobId);
        await fetchJobs();
      } catch (error) {
        console.error('Error deleting job:', error);
      }
    }
  };

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingJob(null);
  };

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Job Postings</h1>
          <p className="mt-2 text-gray-600">Manage your job listings and applications</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 flex items-center space-x-2 transition-all transform hover:scale-105"
        >
          <Plus className="h-5 w-5" />
          <span>Post New Job</span>
        </button>
      </div>

      {showForm && (
        <JobForm
          job={editingJob}
          onSubmit={editingJob ? handleUpdateJob : handleCreateJob}
          onCancel={handleCloseForm}
        />
      )}

      {jobs.length === 0 ? (
        <div className="text-center py-12">
          <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No jobs posted yet</h3>
          <p className="text-gray-600 mb-6">Get started by posting your first job opening.</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Post Your First Job
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        job.jobType === 'fulltime' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {job.jobType === 'fulltime' ? 'Full Time' : 'Part Time'}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{job.company} • {job.location}</p>
                    <p className="text-gray-700 mb-4 line-clamp-3">{job.description}</p>
                    <p className="text-sm text-gray-500">
                      Posted on {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <button
                    onClick={() => fetchApplications(job.id)}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Applications ({job.applications?.length || 0})</span>
                  </button>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditJob(job)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Job"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Job"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Applications Modal */}
      {viewingApplications && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Job Applications</h2>
              <button
                onClick={() => setViewingApplications(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="p-6">
              {applications.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No applications yet</p>
              ) : (
                <div className="space-y-4">
                  {applications.map((application) => (
                    <div key={application.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {application.applicant.profilePic ? (
                            <img
                              src={`http://localhost:5000${application.applicant.profilePic}`}
                              alt={application.applicant.name}
                              className="h-12 w-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-12 w-12 bg-gray-300 rounded-full flex items-center justify-center">
                              <span className="text-gray-600 font-medium">
                                {application.applicant.name.charAt(0)}
                              </span>
                            </div>
                          )}
                          <div>
                            <h4 className="font-medium text-gray-900">{application.applicant.name}</h4>
                            <p className="text-sm text-gray-600">{application.applicant.email}</p>
                            <p className="text-sm text-gray-500">
                              Applied on {new Date(application.appliedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            Qualification: {application.applicant.qualification || 'N/A'}
                          </p>
                          <p className="text-sm text-gray-600">
                            Experience: {application.applicant.experience || 'N/A'}
                          </p>
                          {application.applicant.resume && (
                            <a
                              href={`http://localhost:5000${application.applicant.resume}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              View Resume
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerDashboard;