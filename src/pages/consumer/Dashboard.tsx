import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, LogOut } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { BillsList } from "@/components/consumer/BillsList";
import { MeterReadingForm } from "@/components/consumer/MeterReadingForm";
import { ProfileSection } from "@/components/consumer/ProfileSection";

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account"
    });
    navigate("/");
  };

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

        <Tabs defaultValue="meter-reading" className="space-y-4">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3 gap-4">
            <TabsTrigger value="meter-reading">
              Meter Reading
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
                <MeterReadingForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bills">
            <Card>
              <CardHeader>
                <CardTitle>Your Bills</CardTitle>
                <CardDescription>View and download your electricity bills</CardDescription>
              </CardHeader>
              <CardContent>
                <BillsList />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <ProfileSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;