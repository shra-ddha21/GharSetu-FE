import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { api } from '../../contexts/AuthContext';
import { useAuth } from '../../contexts/AuthContext';
import { CloudCog, X, Loader2, Eye, EyeOff, Home } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Register() {
  const location = useLocation();
  const preSelectedRole = location.state?.selectedRole;

  const [role, setRole] = useState(preSelectedRole || 'user');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    businessName: '',
    ownerName: '',
    phone: '',
    location: '',
    serviceType: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [serviceTypeQuery, setServiceTypeQuery] = useState('');
  const [showServiceSuggestions, setShowServiceSuggestions] = useState(false);

  const ALL_SERVICE_TYPES = [
    'General Labour', 'Mason', 'Centering Labour', 'Plumber', 'Electrician',
    'Painter', 'Carpenter', 'Tile Fitting', 'Fabricator', 'Stone Work',
    'Contractor', 'Architect', 'Structural Designer', 'Interior Designer',
    'Estimation & Costing', 'Waterproofing', 'Survey', 'Core Cutting',
    'Pest Control', 'CCTV Services', 'Borewell Service', 'Kitchen Services',
    'Ceiling', 'Repairing Services', 'Equipment Rent', 'Railing Work',
    'Roofing', 'Furniture', 'Earthmovers', 'Solar Services', 'Cement',
    'Steel', 'Bricks', 'Plumbing', 'Aggregate', 'Sand', 'Electrical',
    'Hardware', 'Tile/Paving Block', 'Paint', 'Fabrication',
    'Concrete Articles', 'Murum & Construction Waste', 'Plywood/Laminate',
    'Chemical/Adhesive', 'Home Decor', 'Nursery', 'Doors & Windows',
    'Tools & Machinery',
  ];

  const filteredServices = ALL_SERVICE_TYPES.filter(s =>
    s.toLowerCase().includes(serviceTypeQuery.toLowerCase())
  );

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const numericValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const endpoint = role === 'provider' ? '/providers/register' : '/users/register';
      const payload = role === 'provider' ? formData : { name: formData.name, email: formData.email, password: formData.password };

      const { data } = await api.post(endpoint, payload);

      if (role === 'user') {
        const userData = data.user;
        login(data.token, { ...userData, role: 'user' });
        toast.success('Registration successful! Welcome to GharSetu.');
        navigate('/user/dashboard');
      } else {
        setSuccess('Registration successful! Please wait for Admin approval to login.');
        toast.success('Registration request sent! Awaiting admin approval.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 font-sans text-slate-900 p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-50 rounded-full blur-3xl opacity-50"></div>

      <div className="w-full max-w-3xl bg-white rounded-[1.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10 min-h-[500px] border border-slate-200">
        {/* Close Button */}
        <Link
          to="/home"
          className="absolute top-6 right-6 z-30 p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all duration-300 group"
        >
          <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
        </Link>

        {/* Left Section: Branding */}
        <div className="md:w-5/12 bg-indigo-600 text-white p-6 md:p-10 flex flex-col justify-start items-start text-left relative overflow-hidden pt-10 md:pt-16">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-white rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10 flex flex-col items-start w-full max-w-md">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white outline outline-4 outline-white/20 rounded-xl flex items-center justify-center text-indigo-600 transform hover:rotate-12 transition-transform duration-300">
                <Home className="w-5 h-5" />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight">GharSetu</h1>
            </div>
            <div className="w-full h-1 bg-white/30 rounded-full mb-6"></div>
            <p className="text-lg text-indigo-100 leading-snug font-medium">
              Join our network of verified professionals.
            </p>
          </div>
          <div className="absolute bottom-12 flex gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-1.5 rounded-full ${i === 2 ? 'w-8 bg-white' : 'w-2 bg-white/30'}`}></div>
            ))}
          </div>
        </div>

        {/* Right Section: Form */}
        <div className="flex-1 p-6 md:p-8 md:pt-12 flex items-start justify-center bg-white overflow-y-auto">
          <div className="w-full max-w-lg">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Create Account</h2>
              <p className="text-xs text-slate-500 mt-1 font-medium">Join GharSetu today and start exploring.</p>
            </div>

            <div className="flex bg-slate-100 p-1 rounded-xl mb-8">
              {(preSelectedRole ? [preSelectedRole] : ['user', 'provider']).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => { setRole(r); setSuccess(''); setError(''); }}
                  className={`flex-1 py-2.5 text-sm font-bold rounded-lg capitalize transition-all ${role === r ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                  Register as {r}
                </button>
              ))}
            </div>

            {success ? (
              <div className="text-center py-12">
                <div className="p-6 bg-emerald-50 text-emerald-700 rounded-2xl mb-8 font-semibold text-lg border border-emerald-100">
                  {success}
                </div>
                <Link to="/login" className="px-8 py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">
                  Go to Login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && <div className="p-4 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100 font-medium">{error}</div>}

                {role === 'user' ? (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">Full Name</label>
                      <input
                        name="name"
                        required
                        placeholder="John Doe"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm"
                        value={formData.name}
                        onChange={handleChange}
                        autoComplete="off"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">Business Name</label>
                        <input
                          name="businessName"
                          required
                          placeholder="HomeCare Solutions"
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm"
                          value={formData.businessName}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">Owner Name</label>
                        <input
                          name="ownerName"
                          required
                          placeholder="Jane Smith"
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm"
                          value={formData.ownerName}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">Phone</label>
                        <input
                          name="phone"
                          type="tel"
                          required
                          pattern="[0-9]{10}"
                          title="Please enter exactly 10 digits"
                          placeholder="+91 0000000000"
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm"
                          value={formData.phone}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">Location</label>
                        <input
                          name="location"
                          required
                          placeholder="New York, NY"
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm"
                          value={formData.location}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </div>
                    </div>
                    <div className="relative">
                      <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">Service Type</label>
                      <input
                        name="serviceType"
                        required
                        autoComplete="off"
                        placeholder="Search service type..."
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm"
                        value={serviceTypeQuery || formData.serviceType}
                        onChange={(e) => {
                          setServiceTypeQuery(e.target.value);
                          setFormData(prev => ({ ...prev, serviceType: '' }));
                          setShowServiceSuggestions(true);
                        }}
                        onFocus={() => setShowServiceSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowServiceSuggestions(false), 150)}
                      />
                      {showServiceSuggestions && filteredServices.length > 0 && (
                        <ul className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-52 overflow-y-auto">
                          {filteredServices.map((service) => (
                            <li
                              key={service}
                              className="px-4 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer transition-colors"
                              onMouseDown={() => {
                                setFormData(prev => ({ ...prev, serviceType: service }));
                                setServiceTypeQuery(service);
                                setShowServiceSuggestions(false);
                              }}
                            >
                              {service}
                            </li>
                          ))}
                        </ul>
                      )}
                      {showServiceSuggestions && serviceTypeQuery && filteredServices.length === 0 && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3 text-sm text-slate-400">
                          No matching services found.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">Email Address</label>
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="email@example.com"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm"
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="off"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">Password</label>
                    <div className="relative">
                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        pattern="(?=.*\d)(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}"
                        title="Password must be at least 8 characters long and include at least one uppercase letter, one number, and one special character."
                        placeholder="••••••••"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm pr-12"
                        value={formData.password}
                        onChange={handleChange}
                        minLength={8}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {formData.password && (
                      <ul className="mt-1.5 ml-1 space-y-0.5">
                        {formData.password.length < 8 && (
                          <li className="text-xs text-red-500">• At least 8 characters</li>
                        )}
                        {!/[A-Z]/.test(formData.password) && (
                          <li className="text-xs text-red-500">• At least one uppercase letter</li>
                        )}
                        {!/\d/.test(formData.password) && (
                          <li className="text-xs text-red-500">• At least one number</li>
                        )}
                        {!/[^a-zA-Z0-9]/.test(formData.password) && (
                          <li className="text-xs text-red-500">• At least one special character</li>
                        )}
                      </ul>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl mt-8 shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating account...
                    </>
                  ) : 'Create Account'}
                </button>
              </form>
            )}

            {!success && (
              <p className="mt-8 text-center text-sm text-slate-500 font-medium">
                Already have an account?{' '}
                <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-bold hover:underline">
                  Sign In
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}