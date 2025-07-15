import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AdminDashboard from './AdminDashboard';
import EmployerDashboard from './EmployerDashboard';
import SeekerDashboard from './SeekerDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'employer':
      return <EmployerDashboard />;
    case 'seeker':
      return <SeekerDashboard />;
    default:
      return <div>Invalid role</div>;
  }
};

export default Dashboard;