import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Briefcase, Users, PlusCircle, User, Settings } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/dashboard" className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  TEKFIX Job Board
                </span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              {user?.role === 'admin' && (
                <Link
                  to="/admin/dashboard"
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-colors"
                >
                  <Users className="h-4 w-4" />
                  <span>Admin Panel</span>
                </Link>
              )}
              
              {user?.role === 'employer' && (
                <>
                  <Link
                    to="/employer/jobs"
                    className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-colors"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>My Jobs</span>
                  </Link>
                  <Link
                    to="/employer/profile"
                    className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </>
              )}
              
              {user?.role === 'seeker' && (
                <Link
                  to="/seeker/profile"
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
              )}
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {user?.profilePic ? (
                    <img
                      src={`http://localhost:5000${user.profilePic}`}
                      alt={user.name}
                      className="h-8 w-8 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user?.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="text-sm">
                    <p className="text-gray-900 font-medium">{user?.name}</p>
                    <p className="text-gray-500 text-xs capitalize">{user?.role}</p>
                  </div>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;