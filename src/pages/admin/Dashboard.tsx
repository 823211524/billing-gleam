import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Users, FileText, Settings, UserPlus, Activity } from "lucide-react";
import { AddCustomerForm } from "@/components/admin/AddCustomerForm";
import { CustomerList } from "@/components/admin/CustomerList";
import { ReadingValidation } from "@/components/admin/ReadingValidation";
import { MeterManagement } from "@/components/admin/meter/MeterManagement";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("customers");
  const { session, loading } = useAuth();

  useEffect(() => {
    if (!loading && !session) {
      navigate("/admin/login");
    }
  }, [session, loading, navigate]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out"
      });
      navigate("/admin/login");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">WeBill™ Admin Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-5 gap-4">
            <TabsTrigger value="customers">
              <Users className="w-4 h-4 mr-2" />
              Customers
            </TabsTrigger>
            <TabsTrigger value="readings">
              <FileText className="w-4 h-4 mr-2" />
              Readings
            </TabsTrigger>
            <TabsTrigger value="meters">
              <Activity className="w-4 h-4 mr-2" />
              Meters
            </TabsTrigger>
            <TabsTrigger value="add-customer">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Customer
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="customers">
            <Card>
              <CardHeader>
                <CardTitle>Customer Management</CardTitle>
                <CardDescription>View and manage registered customers</CardDescription>
              </CardHeader>
              <CardContent>
                <CustomerList />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="readings">
            <Card>
              <CardHeader>
                <CardTitle>Meter Readings</CardTitle>
                <CardDescription>Validate and process meter readings</CardDescription>
              </CardHeader>
              <CardContent>
                <ReadingValidation />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="meters">
            <MeterManagement />
          </TabsContent>

          <TabsContent value="add-customer">
            <Card>
              <CardHeader>
                <CardTitle>Add New Customer</CardTitle>
                <CardDescription>Register a new customer in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <AddCustomerForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure system parameters</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-500 py-8">
                  Settings management coming soon
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;