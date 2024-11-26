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
      // Query the users table directly to check credentials
      const { data, error } = await supabase
        .from('users')
        .select('id, email, role, password_hash, is_enabled')
        .eq('email', email);

      if (error) {
        console.error('Database error:', error);
        toast.error("An error occurred while logging in");
        return;
      }

      if (!data || data.length === 0) {
        toast.error("Invalid email or password");
        return;
      }

      const user = data[0];

      if (!user.is_enabled) {
        toast.error("This account has been disabled");
        return;
      }

      // Compare the provided password with the stored password_hash
      if (user.password_hash !== password) {
        toast.error("Invalid email or password");
        return;
      }

      // Set authentication state
      setIsAuthenticated(true);
      setIsAdmin(user.role === 'ADMIN');
      setUser({
        id: user.id,
        email: user.email,
        role: user.role
      });

      // Store session info in localStorage
      localStorage.setItem('user', JSON.stringify({
        id: user.id,
        email: user.email,
        role: user.role
      }));

      // Redirect based on role
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/consumer/dashboard');
      }
      
      toast.success("Login successful");
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