import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { profileAPI } from '../../services/api';
import { Camera, Save, User, GraduationCap, Briefcase, FileText } from 'lucide-react';

const SeekerProfile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    qualification: user?.qualification || '',
    experience: user?.experience || 'fresher' as 'fresher' | 'experienced',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const updatedUser = await profileAPI.updateProfile(formData);
      updateUser(updatedUser);
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePic', file);

    try {
      const updatedUser = await profileAPI.uploadProfilePic(formData);
      updateUser(updatedUser);
      setMessage('Profile picture updated successfully!');
    } catch (error) {
      setMessage('Error uploading profile picture');
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const updatedUser = await profileAPI.uploadResume(formData);
      updateUser(updatedUser);
      setMessage('Resume uploaded successfully!');
    } catch (error) {
      setMessage('Error uploading resume');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-12">
          <div className="flex items-center space-x-6">
            <div className="relative">
              {user?.profilePic ? (
                <img
                  src={`http://localhost:5000${user.profilePic}`}
                  alt={user.name}
                  className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <User className="h-12 w-12 text-gray-400" />
                </div>
              )}
              <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <Camera className="h-4 w-4 text-gray-600" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePicUpload}
                  className="hidden"
                />
              </label>
            </div>
            <div className="text-white">
              <h1 className="text-3xl font-bold">{user?.name}</h1>
              <p className="text-purple-100 text-lg">Job Seeker</p>
              <p className="text-purple-200">{user?.email}</p>
              {user?.qualification && (
                <p className="text-purple-200">{user.qualification}</p>
              )}
            </div>
          </div>
        </div>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>
          
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.includes('Error') 
                ? 'bg-red-50 text-red-700 border border-red-200' 
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline h-4 w-4 mr-2" />
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <GraduationCap className="inline h-4 w-4 mr-2" />
                Qualification
              </label>
              <textarea
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                placeholder="e.g., Bachelor's in Computer Science, Master's in Software Engineering"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Briefcase className="inline h-4 w-4 mr-2" />
                Experience Level
              </label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="fresher">Fresher</option>
                <option value="experienced">Experienced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="inline h-4 w-4 mr-2" />
                Resume
              </label>
              <div className="flex items-center space-x-4">
                <label className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg cursor-pointer transition-colors flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Upload Resume</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeUpload}
                    className="hidden"
                  />
                </label>
                {user?.resume && (
                  <a
                    href={`http://localhost:5000${user.resume}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-purple-800 underline"
                  >
                    View Current Resume
                  </a>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{loading ? 'Updating...' : 'Update Profile'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SeekerProfile;