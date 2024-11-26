import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: { id: number; email: string; role: string } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<{ id: number; email: string; role: string } | null>(null);
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('id, email, role, password_hash, is_enabled')
        .eq('email', email)
        .single();

      if (error || !user) {
        toast.error("Invalid credentials");
        return;
      }

      if (!user.is_enabled) {
        toast.error("This account has been disabled");
        return;
      }

      // Simple password check (in production, use proper password hashing)
      if (user.password_hash !== password) {
        toast.error("Invalid credentials");
        return;
      }

      setIsAuthenticated(true);
      setIsAdmin(user.role === 'ADMIN');
      setUser({
        id: user.id,
        email: user.email,
        role: user.role
      });

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
    setUser(null);
    navigate('/');
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, user, login, logout }}>
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