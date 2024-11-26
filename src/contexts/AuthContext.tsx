import { createContext, useContext, useState, useEffect } from "react";
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
      // Temporary: Allow any credentials, determine role based on email
      const isAdminUser = email.includes('admin');
      
      // Create a mock user for development
      const mockUser = {
        id: 1,
        email: email,
        role: isAdminUser ? 'ADMIN' : 'CONSUMER'
      };

      // Set authentication state
      setIsAuthenticated(true);
      setIsAdmin(isAdminUser);
      setUser(mockUser);

      // Store session info in localStorage
      localStorage.setItem('user', JSON.stringify(mockUser));

      // Redirect based on role
      if (isAdminUser) {
        navigate('/admin/dashboard');
        toast.success("Logged in as Administrator");
      } else {
        navigate('/consumer/dashboard');
        toast.success("Logged in as Consumer");
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error("An error occurred during login");
    }
  };

  const logout = async () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUser(null);
    localStorage.removeItem('user');
    navigate('/');
    toast.success("Logged out successfully");
  };

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setIsAuthenticated(true);
      setIsAdmin(parsedUser.role === 'ADMIN');
      setUser(parsedUser);
    }
  }, []);

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