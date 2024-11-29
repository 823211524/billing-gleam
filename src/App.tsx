import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from './contexts/AuthContext';
import AdminDashboard from './pages/admin/Dashboard';
import AdminLogin from './pages/admin/Login';
import ConsumerDashboard from './pages/consumer/Dashboard';
import ConsumerLogin from './pages/consumer/Login';
import ConsumerRegister from './pages/consumer/Register';
import Index from './pages/Index';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/consumer/login" element={<ConsumerLogin />} />
          <Route path="/consumer/register" element={<ConsumerRegister />} />
          <Route path="/consumer/dashboard" element={<ConsumerDashboard />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;