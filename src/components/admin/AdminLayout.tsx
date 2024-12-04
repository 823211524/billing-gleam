import { Link, Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AdminLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/admin/dashboard" className="flex items-center px-2 py-2 text-gray-900 hover:text-gray-600">
                Admin Dashboard
              </Link>
            </div>
            <div className="flex items-center">
              <Link to="/admin/login">
                <Button variant="outline">Logout</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;