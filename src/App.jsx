import { Toaster } from 'react-hot-toast';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  Link,
  useLocation,
} from "react-router-dom";
// import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { cn } from "./lib/utils.jsx";
import { LogOut, Home, Users, Briefcase, FileText, Search } from "lucide-react";

// Page Imports
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyOTP from "./pages/auth/VerifyOTP";
import ResetPassword from "./pages/auth/ResetPassword";
import ResetSuccess from "./pages/auth/ResetSuccess";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProviders from "./pages/admin/Providers";
import AdminRequests from "./pages/admin/Requests";
import UserDashboard from "./pages/user/Dashboard";
import UserSearch from "./pages/user/Search";
import UserRequests from "./pages/user/Requests";
import ProviderDashboard from "./pages/provider/Dashboard";
import ProviderIncoming from "./pages/provider/Incoming";
import ProviderAssigned from "./pages/provider/Assigned";
import GuestHomepage from "./pages/guest/GuestHomepage";
import ContactPage from "./pages/guest/ContactPage";
import AboutPage from "./pages/guest/AboutPage";
import ServicesPage from "./pages/guest/ServicesPage";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="p-8 text-center font-medium text-slate-500">
        Loading...
      </div>
    );

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

const SidebarLayout = ({ links }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900 border-slate-200">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col p-6 shrink-0">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl uppercase">
            {user?.role ? user.role[0] : "G"}
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">
            GharSetu
          </span>
        </div>

        <nav className="flex-1 space-y-1">
          {links.map((link) => {
            const isActive = location.pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "p-3 rounded-xl flex items-center gap-3 transition-colors cursor-pointer",
                  isActive
                    ? "bg-indigo-50 text-indigo-700 font-semibold"
                    : "text-slate-500 hover:bg-slate-50 font-medium",
                )}
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto">
          <div className="p-4 bg-slate-900 rounded-2xl text-white">
            <p className="text-xs text-slate-400 mb-1 font-medium uppercase tracking-wider">
              Active {user?.role}
            </p>
            <p className="text-sm font-semibold truncate">
              {user?.name || user?.businessName || user?.email}
            </p>
            <button
              onClick={logout}
              className="mt-3 w-full py-2 flex items-center justify-center gap-2 bg-slate-800 rounded-lg text-xs hover:bg-slate-700 transition-colors font-medium border border-slate-700"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto flex flex-col p-8 gap-6">
        <div className="max-w-6xl mx-auto w-full flex flex-col gap-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};


export default function App() {
  return (
    <AuthProvider>
      <Toaster 
        position="top-center" 
        reverseOrder={false} 
        toastOptions={{
          duration: 4000,
          style: {
            padding: '24px 32px',
            color: '#1e293b',
            background: '#ffffff',
            borderRadius: '2rem',
            fontSize: '1.125rem',
            fontWeight: '700',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
            border: '1px solid #f1f5f9',
            maxWidth: '600px',
            width: 'max-content'
          },
          success: {
            iconTheme: {
              primary: '#4f46e5',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/password-reset-success" element={<ResetSuccess />} />
          <Route path="/home" element={<GuestHomepage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route
              element={
                <SidebarLayout
                  links={[
                    {
                      label: "Dashboard",
                      href: "/admin/dashboard",
                      icon: Home,
                    },
                    {
                      label: "Providers",
                      href: "/admin/providers",
                      icon: Users,
                    },
                    {
                      label: "Requests",
                      href: "/admin/requests",
                      icon: FileText,
                    },
                  ]}
                />
              }
            >
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/providers" element={<AdminProviders />} />
              <Route path="/admin/requests" element={<AdminRequests />} />
            </Route>
          </Route>

          {/* User Routes */}
          <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
            <Route
              element={
                <SidebarLayout
                  links={[
                    { label: "Dashboard", href: "/user/dashboard", icon: Home },
                    {
                      label: "Search Providers",
                      href: "/user/search",
                      icon: Search,
                    },
                    {
                      label: "My Requests",
                      href: "/user/requests",
                      icon: FileText,
                    },
                  ]}
                />
              }
            >
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/user/search" element={<UserSearch />} />
              <Route path="/user/requests" element={<UserRequests />} />
            </Route>
          </Route>

          {/* Provider Routes */}
          <Route element={<ProtectedRoute allowedRoles={["provider"]} />}>
            <Route
              element={
                <SidebarLayout
                  links={[
                    {
                      label: "Dashboard",
                      href: "/provider/dashboard",
                      icon: Home,
                    },
                    {
                      label: "Incoming Requests",
                      href: "/provider/incoming-requests",
                      icon: Briefcase,
                    },
                    {
                      label: "Assigned Requests",
                      href: "/provider/assigned-requests",
                      icon: FileText,
                    },
                  ]}
                />
              }
            >
              <Route
                path="/provider/dashboard"
                element={<ProviderDashboard />}
              />
              <Route
                path="/provider/incoming-requests"
                element={<ProviderIncoming />}
              />
              <Route
                path="/provider/assigned-requests"
                element={<ProviderAssigned />}
              />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
