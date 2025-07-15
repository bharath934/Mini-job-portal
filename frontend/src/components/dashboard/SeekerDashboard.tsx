import React, { useState, useEffect } from 'react';
import { Search, MapPin, Building, Calendar, Clock, CheckCircle } from 'lucide-react';
import { jobAPI } from '../../services/api';
import { Job } from '../../types';

const SeekerDashboard: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const data = await jobAPI.getAllJobs();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyToJob = async (jobId: string) => {
    try {
      await jobAPI.applyToJob(jobId);
      setAppliedJobs(prev => new Set(prev).add(jobId));
    } catch (error) {
      console.error('Error applying to job:', error);
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Find Your Dream Job</h1>
        <p className="mt-2 text-gray-600">Discover opportunities that match your skills and interests</p>
      </div>

      <div className="mb-8">
        <div className="relative max-w-2xl">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search jobs by title, company, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          />
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="text-center py-16">
          <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No jobs found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or check back later for new opportunities.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredJobs.map((job) => (
            <div key={job.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        job.jobType === 'fulltime' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {job.jobType === 'fulltime' ? 'Full Time' : 'Part Time'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4" />
                        <span>{job.company}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4 line-clamp-3">{job.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  {appliedJobs.has(job.id) ? (
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">Applied</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleApplyToJob(job.id)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 font-medium"
                    >
                      Apply Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SeekerDashboard;