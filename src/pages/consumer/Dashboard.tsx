import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, LogOut, Activity } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { BillsList } from "@/components/consumer/BillsList";
import { MeterReadingForm } from "@/components/consumer/MeterReadingForm";
import { ProfileSection } from "@/components/consumer/ProfileSection";
import { ReadingsHistory } from "@/components/consumer/ReadingsHistory";
import { useConsumerData } from "@/hooks/useConsumerData";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("meter-reading");

  const { data: { user } } = await supabase.auth.getUser();
  const { meters, readings, bills, isLoading } = useConsumerData(user?.id);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account"
    });
    navigate("/");
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      Loading...
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Welcome to WeBill™</h1>
          <Button 
            variant="outline" 
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Active Meters</CardTitle>
              <CardDescription>Your registered meters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{meters.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Pending Bills</CardTitle>
              <CardDescription>Unpaid bills</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {bills.filter(bill => !bill.paid).length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Latest Reading</CardTitle>
              <CardDescription>Most recent meter reading</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {readings[0]?.reading || "No readings"}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-4 gap-4">
            <TabsTrigger value="meter-reading">
              <Activity className="w-4 h-4 mr-2" />
              Meter Reading
            </TabsTrigger>
            <TabsTrigger value="readings-history">
              Reading History
            </TabsTrigger>
            <TabsTrigger value="bills">
              <FileText className="w-4 h-4 mr-2" />
              Bills
            </TabsTrigger>
            <TabsTrigger value="profile">
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="meter-reading">
            <Card>
              <CardHeader>
                <CardTitle>Upload Meter Reading</CardTitle>
                <CardDescription>
                  Take a clear photo of your electricity meter and enter the reading
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MeterReadingForm meters={meters} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="readings-history">
            <ReadingsHistory readings={readings} />
          </TabsContent>

          <TabsContent value="bills">
            <Card>
              <CardHeader>
                <CardTitle>Your Bills</CardTitle>
                <CardDescription>View and download your electricity bills</CardDescription>
              </CardHeader>
              <CardContent>
                <BillsList bills={bills} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <ProfileSection user={user} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;