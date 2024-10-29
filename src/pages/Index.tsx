import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Welcome to WeBill™</h1>
          <p className="text-xl text-gray-600">Your Smart Electricity Billing Solution</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Consumer Portal</CardTitle>
              <CardDescription>Access your bills and submit meter readings</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full"
                onClick={() => navigate("/consumer/login")}
              >
                Login as Consumer
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Administrator Portal</CardTitle>
              <CardDescription>Manage meters and validate readings</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full"
                variant="secondary"
                onClick={() => navigate("/admin/login")}
              >
                Login as Administrator
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;