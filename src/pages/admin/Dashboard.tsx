import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Users, FileText, Settings, UserPlus } from "lucide-react";
import { AddCustomerForm } from "@/components/admin/AddCustomerForm";
import { CustomerList } from "@/components/admin/CustomerList";
import { ReadingValidation } from "@/components/admin/ReadingValidation";

const AdminDashboard = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("customers");

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">WeBill™ Admin Dashboard</h1>
          <Button variant="outline" onClick={() => {
            // TODO: Implement logout
            toast({
              title: "Logged out",
              description: "You have been successfully logged out"
            });
          }}>
            Logout
          </Button>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-4 gap-4">
            <TabsTrigger value="customers">
              <Users className="w-4 h-4 mr-2" />
              Customers
            </TabsTrigger>
            <TabsTrigger value="readings">
              <FileText className="w-4 h-4 mr-2" />
              Readings
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