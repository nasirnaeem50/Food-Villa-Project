import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';

const AdminPanelLayout = () => {
  return (
    // This div sets up the overall structure for the admin section
    <div className="flex min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-900">
      
      {/* The AdminSidebar is always visible on the left */}
      <AdminSidebar />
      
      {/* This container has the left margin to make space for the sidebar.
          The <Outlet> is where the actual admin page content (like Dashboard, Users, etc.) will be rendered. */}
      <div className="flex-1 lg:ml-64">
        <Outlet />
      </div>

    </div>
  );
};

export default AdminPanelLayout;