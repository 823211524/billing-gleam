import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const signInAsAdmin = async () => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: 'admin@webill.app',
          password: 'admin123'
        });

        if (error) throw error;

        if (data.user) {
          toast({
            title: "Welcome Administrator",
            description: "You have been automatically logged in"
          });
          navigate("/admin/dashboard");
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      }
    };

    signInAsAdmin();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Administrator Access</CardTitle>
          <CardDescription className="text-center">
            Accessing administrative dashboard...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button variant="ghost" disabled>
            <UserCheck className="mr-2 h-4 w-4 animate-spin" />
            Authenticating
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;