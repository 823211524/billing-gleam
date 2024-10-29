import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, User, FileText, Upload, AlertCircle, Home, LogOut } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: Implement actual logout logic (clear session, etc.)
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account"
    });
    navigate("/");
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if the device supports geolocation
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Your device doesn't support location services",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);

      // Get location
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      // TODO: Implement actual photo upload with location data
      console.log("Photo:", file);
      console.log("Location:", {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });

      toast({
        title: "Success",
        description: "Meter reading uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload meter reading",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Welcome to WeBill™</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => navigate("/consumer/dashboard")}
            >
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <Button 
              variant="outline" 
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="meter-reading" className="space-y-4">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3 gap-4">
            <TabsTrigger value="meter-reading">
              <Camera className="w-4 h-4 mr-2" />
              Meter Reading
            </TabsTrigger>
            <TabsTrigger value="bills">
              <FileText className="w-4 h-4 mr-2" />
              Bills
            </TabsTrigger>
            <TabsTrigger value="profile">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="meter-reading">
            <Card>
              <CardHeader>
                <CardTitle>Upload Meter Reading</CardTitle>
                <CardDescription>
                  Take a clear photo of your electricity meter
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-yellow-50 p-4 rounded-lg flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium">Important:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Ensure the meter display is clearly visible</li>
                      <li>Allow location access when prompted</li>
                      <li>Photo must be taken within the submission window</li>
                    </ul>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button
                    disabled={isUploading}
                    className="relative"
                    size="lg"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handlePhotoUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="w-4 h-4 mr-2" />
                    {isUploading ? "Uploading..." : "Take Meter Photo"}
                  </Button>
                </div>
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
                <p className="text-center text-gray-500 py-8">
                  Your bills will appear here once processed
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Manage your account information</CardDescription>
              </CardHeader>
              <CardContent>
                {/* TODO: Implement profile management */}
                <p className="text-center text-gray-500 py-8">
                  Profile management coming soon
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;