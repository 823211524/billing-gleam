import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AdminLogin = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/admin/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 rounded-lg border p-6 shadow-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-500">Click to enter the admin dashboard</p>
        </div>
        <Button onClick={handleLogin} className="w-full">
          Enter Dashboard
        </Button>
      </div>
    </div>
  );
};

export default AdminLogin;