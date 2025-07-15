import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { profileAPI } from '../../services/api';
import { Camera, Save, User, Briefcase, GraduationCap } from 'lucide-react';

const EmployerProfile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    designation: user?.designation || '',
    education: user?.education || '',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12">
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
              <p className="text-blue-100 text-lg">{user?.designation || 'Employer'}</p>
              <p className="text-blue-200">{user?.email}</p>
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Briefcase className="inline h-4 w-4 mr-2" />
                Designation
              </label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="e.g., HR Manager, Talent Acquisition Lead"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <GraduationCap className="inline h-4 w-4 mr-2" />
                Education
              </label>
              <textarea
                name="education"
                value={formData.education}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="e.g., MBA in Human Resources, Bachelor's in Business Administration"
              />
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 flex items-center space-x-2"
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

export default EmployerProfile;