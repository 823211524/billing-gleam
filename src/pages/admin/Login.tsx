import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingCredentials, setIsSendingCredentials] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRequestCredentials = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsSendingCredentials(true);

    try {
      const { error } = await supabase.functions.invoke('send-login-credentials', {
        body: { email },
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Temporary login credentials have been sent to your email",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send credentials",
        variant: "destructive",
      });
    } finally {
      setIsSendingCredentials(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // First, sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Then check if user exists in our users table and is an admin
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role, is_enabled')
          .eq('email', email)
          .single();

        if (userError) throw userError;

        if (!userData) {
          throw new Error('User not found in database');
        }

        if (userData.role !== 'ADMIN') {
          throw new Error('Unauthorized access. Admin privileges required.');
        }

        if (!userData.is_enabled) {
          throw new Error('This account has been disabled.');
        }

        toast({
          title: "Success",
          description: "Logged in successfully",
        });

        navigate("/admin/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to login",
        variant: "destructive",
      });
      
      // Sign out if there was an error after authentication
      await supabase.auth.signOut();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="w-full max-w-md space-y-8 rounded-lg border p-6 shadow-lg bg-white">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Admin Login</h1>
          <p className="text-gray-500">Enter your credentials to access the admin dashboard</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or</span>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleRequestCredentials}
              disabled={isSendingCredentials}
            >
              <Mail className="mr-2 h-4 w-4" />
              {isSendingCredentials ? "Sending..." : "Request Temporary Credentials"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;