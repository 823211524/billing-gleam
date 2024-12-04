import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

  const { data: totalUsers = 0 } = useQuery({
    queryKey: ['totalUsers'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'CONSUMER');
      
      if (error) throw error;
      return count || 0;
    }
  });

  const { data: totalMeters = 0 } = useQuery({
    queryKey: ['totalMeters'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('meters')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return count || 0;
    }
  });

  const { data: pendingReadings = 0 } = useQuery({
    queryKey: ['pendingReadings'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('readings')
        .select('*', { count: 'exact', head: true })
        .eq('validated', false);
      
      if (error) throw error;
      return count || 0;
    }
  });

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
                    <div className="text-2xl font-bold">{totalUsers}</div>
                    <div className="text-sm text-gray-500">Total Users</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{totalMeters}</div>
                    <div className="text-sm text-gray-500">Active Meters</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{pendingReadings}</div>
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