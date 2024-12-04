import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const menuItems = [
    { title: "Manage Users", path: "/admin/users" },
    { title: "View Meters", path: "/admin/meters" },
    { title: "Review Readings", path: "/admin/readings" },
    { title: "Generate Bills", path: "/admin/bills" },
    { title: "System Settings", path: "/admin/settings" },
    { title: "View Reports", path: "/admin/reports" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Card className="mx-auto max-w-4xl">
        <CardHeader>
          <CardTitle className="text-2xl">Admin Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Quick Actions</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {menuItems.map((item) => (
                  <Button
                    key={item.path}
                    className="h-24 text-lg"
                    onClick={() => navigate(item.path)}
                  >
                    {item.title}
                  </Button>
                ))}
              </div>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">System Overview</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">0</div>
                    <div className="text-sm text-gray-500">Total Users</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">0</div>
                    <div className="text-sm text-gray-500">Active Meters</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">0</div>
                    <div className="text-sm text-gray-500">Pending Readings</div>
                  </CardContent>
                </Card>
              </div>
            </section>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;