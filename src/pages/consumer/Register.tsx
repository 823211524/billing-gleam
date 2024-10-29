import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Camera, Smartphone, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const requirements = [
    {
      title: "Cleanergy Customer",
      description: "You must be an existing Cleanergy customer",
      icon: CheckCircle2,
      critical: true
    },
    {
      title: "Camera Requirements",
      description: "Device with camera (min. 600x600 resolution) and GPS capability",
      icon: Camera,
      critical: true
    },
    {
      title: "Internet Connection",
      description: "Stable internet connection for uploading meter photos",
      icon: Globe,
      critical: true
    },
    {
      title: "Compatible Device",
      description: "Smartphone or tablet with web browser support",
      icon: Smartphone,
      critical: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Register for WeBill™</h1>
          <p className="text-gray-600">
            Check your eligibility and register through Cleanergy's system
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Registration Requirements</CardTitle>
            <CardDescription>
              Please ensure you meet all the following requirements before proceeding
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              {requirements.map((req, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-4 border rounded-lg"
                >
                  <req.icon className={`w-5 h-5 ${req.critical ? 'text-red-500' : 'text-green-500'}`} />
                  <div>
                    <h3 className="font-medium">{req.title}</h3>
                    <p className="text-sm text-gray-600">{req.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  Once registered through Cleanergy's system, you'll receive your WeBill™ credentials via email.
                </p>
              </div>
              
              <div className="flex flex-col space-y-4">
                <Button
                  size="lg"
                  onClick={() => window.location.href = "https://register.cleanergy.com"}
                >
                  Proceed to Cleanergy Registration
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/consumer/login")}
                >
                  Already have credentials? Sign In
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;