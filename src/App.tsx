import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ConsumerLogin from "./pages/consumer/Login";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import ConsumerRegister from "./pages/consumer/Register";
import ConsumerDashboard from "./pages/consumer/Dashboard";
import AdminLayout from "./components/admin/AdminLayout";
import ManageUsers from "./pages/admin/users/ManageUsers";
import ViewMeters from "./pages/admin/meters/ViewMeters";
import ReviewReadings from "./pages/admin/readings/ReviewReadings";
import GenerateBills from "./pages/admin/bills/GenerateBills";
import SystemSettings from "./pages/admin/settings/SystemSettings";
import ViewReports from "./pages/admin/reports/ViewReports";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/consumer/login" element={<ConsumerLogin />} />
            <Route path="/consumer/register" element={<ConsumerRegister />} />
            <Route path="/consumer/dashboard" element={<ConsumerDashboard />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<ManageUsers />} />
              <Route path="meters" element={<ViewMeters />} />
              <Route path="readings" element={<ReviewReadings />} />
              <Route path="bills" element={<GenerateBills />} />
              <Route path="settings" element={<SystemSettings />} />
              <Route path="reports" element={<ViewReports />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;