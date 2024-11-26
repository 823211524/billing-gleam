import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    try {
      // First check if user exists and get their role
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('role, password_hash')
        .eq('email', email)
        .single();

      if (userError || !user) {
        toast.error("Invalid credentials");
        return;
      }

      // Simple password check (in production, use proper password hashing)
      if (user.password_hash !== password) {
        toast.error("Invalid credentials");
        return;
      }

      setIsAuthenticated(true);
      setIsAdmin(user.role === 'ADMIN');
      
      // Redirect based on role
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/consumer/dashboard');
      }
      
      toast.success("Login successful");
    } catch (error) {
      toast.error("An error occurred during login");
    }
  };

  const logout = async () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    navigate('/');
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};