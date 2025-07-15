import React, { useState, useEffect } from 'react';
import { Users, Briefcase, UserCheck, UserX, Edit, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { adminAPI } from '../../services/api';
import { User, Job } from '../../types';

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEmployers: 0,
    totalSeekers: 0,
    totalJobs: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'overview' | 'users' | 'jobs'>('overview');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [expandedSections, setExpandedSections] = useState({
    totalUsers: false,
    totalEmployers: false,
    totalSeekers: false,
    totalJobs: false,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersData, jobsData, statsData] = await Promise.all([
        adminAPI.getAllUsers(),
        adminAPI.getAllJobs(),
        adminAPI.getStats(),
      ]);
      setUsers(usersData);
      setJobs(jobsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminAPI.deleteUser(userId);
        await fetchData();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleUpdateUser = async (userData: Partial<User>) => {
    if (!editingUser) return;
    
    try {
      await adminAPI.updateUser(editingUser.id, userData);
      setEditingUser(null);
      await fetchData();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getFilteredUsers = (role?: string) => {
    if (!role) return users;
    return users.filter(user => user.role === role);
  };

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">Manage users and job postings</p>
      </div>

      {/* Navigation */}
      <div className="mb-6">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveSection('overview')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeSection === 'overview'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveSection('users')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeSection === 'users'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveSection('jobs')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeSection === 'jobs'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Jobs
          </button>
        </nav>
      </div>

      {activeSection === 'overview' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Total Users</h3>
                    <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleSection('totalUsers')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {expandedSections.totalUsers ? <ChevronUp /> : <ChevronDown />}
                </button>
              </div>
              {expandedSections.totalUsers && (
                <div className="mt-4 space-y-2">
                  {getFilteredUsers().map(user => (
                    <div key={user.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center space-x-2">
                        {user.profilePic ? (
                          <img src={`http://localhost:5000${user.profilePic}`} alt={user.name} className="h-6 w-6 rounded-full" />
                        ) : (
                          <div className="h-6 w-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                            {user.name.charAt(0)}
                          </div>
                        )}
                        <span className="text-sm">{user.name}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        user.role === 'admin' ? 'bg-red-100 text-red-800' :
                        user.role === 'employer' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <UserCheck className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Employers</h3>
                    <p className="text-3xl font-bold text-green-600">{stats.totalEmployers}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleSection('totalEmployers')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {expandedSections.totalEmployers ? <ChevronUp /> : <ChevronDown />}
                </button>
              </div>
              {expandedSections.totalEmployers && (
                <div className="mt-4 space-y-2">
                  {getFilteredUsers('employer').map(user => (
                    <div key={user.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center space-x-2">
                        {user.profilePic ? (
                          <img src={`http://localhost:5000${user.profilePic}`} alt={user.name} className="h-6 w-6 rounded-full" />
                        ) : (
                          <div className="h-6 w-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                            {user.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          {user.designation && <p className="text-xs text-gray-500">{user.designation}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <UserX className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Job Seekers</h3>
                    <p className="text-3xl font-bold text-purple-600">{stats.totalSeekers}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleSection('totalSeekers')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {expandedSections.totalSeekers ? <ChevronUp /> : <ChevronDown />}
                </button>
              </div>
              {expandedSections.totalSeekers && (
                <div className="mt-4 space-y-2">
                  {getFilteredUsers('seeker').map(user => (
                    <div key={user.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center space-x-2">
                        {user.profilePic ? (
                          <img src={`http://localhost:5000${user.profilePic}`} alt={user.name} className="h-6 w-6 rounded-full" />
                        ) : (
                          <div className="h-6 w-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs">
                            {user.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          {user.qualification && <p className="text-xs text-gray-500">{user.qualification}</p>}
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        user.experience === 'experienced' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.experience || 'N/A'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Briefcase className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Total Jobs</h3>
                    <p className="text-3xl font-bold text-orange-600">{stats.totalJobs}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleSection('totalJobs')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {expandedSections.totalJobs ? <ChevronUp /> : <ChevronDown />}
                </button>
              </div>
              {expandedSections.totalJobs && (
                <div className="mt-4 space-y-2">
                  {jobs.slice(0, 5).map(job => (
                    <div key={job.id} className="p-2 bg-gray-50 rounded">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{job.title}</p>
                          <p className="text-xs text-gray-500">{job.company}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          job.jobType === 'fulltime' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {job.jobType}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeSection === 'users' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">User Management</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {user.profilePic ? (
                            <img src={`http://localhost:5000${user.profilePic}`} alt={user.name} className="h-10 w-10 rounded-full" />
                          ) : (
                            <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                              <span className="text-gray-600 font-medium">{user.name.charAt(0)}</span>
                            </div>
                          )}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === 'admin' ? 'bg-red-100 text-red-800' :
                          user.role === 'employer' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.role === 'employer' && (
                          <div>
                            <p>Designation: {user.designation || 'N/A'}</p>
                            <p>Education: {user.education || 'N/A'}</p>
                          </div>
                        )}
                        {user.role === 'seeker' && (
                          <div>
                            <p>Qualification: {user.qualification || 'N/A'}</p>
                            <p>Experience: {user.experience || 'N/A'}</p>
                            {user.resume && <p>Resume: Available</p>}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => setEditingUser(user)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'jobs' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Job Management</h2>
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="border rounded-lg p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          job.jobType === 'fulltime' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {job.jobType === 'fulltime' ? 'Full Time' : 'Part Time'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{job.company} • {job.location}</p>
                      <p className="text-gray-700 mb-2">{job.description}</p>
                      <p className="text-sm text-gray-500">
                        Posted on {new Date(job.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Edit User</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              handleUpdateUser({
                name: formData.get('name') as string,
                designation: formData.get('designation') as string,
                education: formData.get('education') as string,
                qualification: formData.get('qualification') as string,
                experience: formData.get('experience') as 'fresher' | 'experienced',
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingUser.name}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                
                {editingUser.role === 'employer' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Designation</label>
                      <input
                        type="text"
                        name="designation"
                        defaultValue={editingUser.designation || ''}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Education</label>
                      <input
                        type="text"
                        name="education"
                        defaultValue={editingUser.education || ''}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                  </>
                )}
                
                {editingUser.role === 'seeker' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Qualification</label>
                      <input
                        type="text"
                        name="qualification"
                        defaultValue={editingUser.qualification || ''}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Experience</label>
                      <select
                        name="experience"
                        defaultValue={editingUser.experience || 'fresher'}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      >
                        <option value="fresher">Fresher</option>
                        <option value="experienced">Experienced</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;