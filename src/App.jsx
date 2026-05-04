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
import { useState, useRef, useEffect } from "react";
// import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { BookingProvider } from "./contexts/BookingContext";
import { cn } from "./lib/utils.jsx";
import { LogOut, Home, Users, Briefcase, FileText, Search, User, ChevronDown, Menu as MenuIcon, X, Layers } from "lucide-react";

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
import AdminProfile from "./pages/admin/Profile";
import AdminServices from "./pages/admin/Services";
import UserDashboard from "./pages/user/Dashboard";
import UserProfile from "./pages/user/Profile";
import UserSearch from "./pages/user/Search";
import UserRequests from "./pages/user/Requests";
import UserProviderProfile from "./pages/user/ProviderProfile";
import CreateRequest from "./pages/user/CreateRequest";
import ProviderDashboard from "./pages/provider/Dashboard";
import ProviderIncoming from "./pages/provider/Incoming";
import ProviderAssigned from "./pages/provider/Assigned";
import ProviderProfile from "./pages/provider/Profile";
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dropdownRef = useRef(null);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && !event.target.closest('.mobile-menu-toggle')) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900 border-slate-200">
      {/* Sidebar Backdrop for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        ref={sidebarRef}
        className={cn(
          "w-64 bg-white border-r border-slate-200 flex flex-col p-6 shrink-0 fixed inset-y-0 left-0 z-50 transition-transform duration-300 lg:sticky lg:translate-x-0 h-screen overflow-y-auto",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
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
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {link.id === 'provider-profile' && user?.role === 'provider' && (user.completionPercentage < 100) && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                  )}
                  {link.id === 'user-profile' && user?.role === 'user' && (!user.phone || !user.address) && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                  )}
                </div>
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
      <main className="flex-1 overflow-x-hidden flex flex-col relative bg-slate-50/50">
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md px-4 sm:px-8 py-4 flex justify-between items-center pt-6 pb-2">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg mobile-menu-toggle"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight line-clamp-1">
                Welcome, <span className="text-indigo-600 capitalize">{user?.name || user?.businessName || user?.role}</span>
              </h2>
              <p className="hidden sm:block text-sm text-slate-500 mt-1 font-medium">
              {user?.role === 'admin' && 'Overview of service ecosystem and provider status.'}
              {user?.role === 'provider' && 'Manage your service requests and assignments.'}
              {user?.role === 'user' && 'What do you need help with today?'}
            </p>
          </div>
        </div>

        <div className="relative ml-2" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 p-1.5 pr-3 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-all shadow-sm group"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm transform group-hover:scale-105 transition-transform">
                {user?.name ? user.name[0].toUpperCase() : (user?.businessName ? user.businessName[0].toUpperCase() : (user?.role ? user.role[0].toUpperCase() : 'U'))}
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <Link
                  to="/home"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <Home className="w-4 h-4" />
                  Guest Home
                </Link>
                <button
                  onClick={() => { setIsDropdownOpen(false); logout(); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="p-4 sm:p-8 max-w-6xl mx-auto w-full flex flex-col gap-6">
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
              primary: '#DC2626',
              secondary: '#ffffff',
            },
          },
        }}
      />
      <BrowserRouter>
        <BookingProvider>
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
            {/* <Route path="/user/book" element={<div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-slate-400">Booking Page Coming Soon...</div>} /> */}
            <Route path="/blank" element={<div className="min-h-screen bg-white"></div>} />

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
                      {
                        label: "Services",
                        href: "/admin/services",
                        icon: Layers,
                      },
                      {
                        label: "Profile",
                        href: "/admin/profile",
                        icon: User,
                      },
                    ]}
                  />
                }
              >
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/providers" element={<AdminProviders />} />
                <Route path="/admin/requests" element={<AdminRequests />} />
                <Route path="/admin/services" element={<AdminServices />} />
                <Route path="/admin/profile" element={<AdminProfile />} />
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
                      {
                        label: "Profile",
                        id: "user-profile",
                        href: "/user/profile",
                        icon: User,
                      },
                    ]}
                  />
                }
              >
                <Route path="/user/dashboard" element={<UserDashboard />} />
                <Route path="/user/search" element={<UserSearch />} />
                <Route path="/user/requests" element={<UserRequests />} />
                <Route path="/user/provider/:id" element={<UserProviderProfile />} />
                <Route path="/user/book" element={<CreateRequest />} />
                <Route path="/user/profile" element={<UserProfile />} />
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
                      {
                        id: "provider-profile",
                        label: "Profile",
                        href: "/provider/profile",
                        icon: User,
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
                <Route
                  path="/provider/profile"
                  element={<ProviderProfile />}
                />
              </Route>
            </Route>
          </Routes>
        </BookingProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}
