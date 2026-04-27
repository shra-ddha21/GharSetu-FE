import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../contexts/AuthContext';
import { useAuth } from '../../contexts/AuthContext';
import { CloudCog, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Register() {
  const [role, setRole] = useState('user');
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
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
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

      <div className="w-full max-w-6xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10 min-h-[700px] border border-slate-200">
        {/* Close Button */}
        <Link 
          to="/home" 
          className="absolute top-6 right-6 z-30 p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all duration-300 group"
        >
          <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
        </Link>

        {/* Left Section: Branding */}
        <div className="md:w-5/12 bg-indigo-600 text-white p-20 flex flex-col justify-start items-start text-left relative overflow-hidden pt-32">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-white rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10 flex flex-col items-start w-full max-w-md">
            <h1 className="text-5xl font-extrabold mb-4 tracking-tight">GharSetu</h1>
            <div className="w-full h-1.5 bg-white/30 rounded-full mb-8"></div>
            <p className="text-xl text-indigo-100 leading-snug font-medium">
              Join thousands of households and verified service providers. Bridge the gap with quality.
            </p>
          </div>
          <div className="absolute bottom-12 flex gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-1.5 rounded-full ${i === 2 ? 'w-8 bg-white' : 'w-2 bg-white/30'}`}></div>
            ))}
          </div>
        </div>

        {/* Right Section: Form */}
        <div className="flex-1 p-8 md:p-20 md:pt-32 flex items-start justify-center bg-white overflow-y-auto">
          <div className="w-full max-w-2xl">
            <div className="mb-8">
               <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Create an Account</h2>
               <p className="text-sm text-slate-500 mt-2 font-medium">Join GharSetu today and start exploring.</p>
            </div>

            <div className="flex bg-slate-100 p-1 rounded-xl mb-8">
              {['user', 'provider'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => { setRole(r); setSuccess(''); setError(''); }}
                  className={`flex-1 py-2.5 text-sm font-bold rounded-lg capitalize transition-all ${
                    role === r ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'
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
                            required 
                            placeholder="+1 234 567 890"
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
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">Service Type</label>
                      <select 
                        name="serviceType" 
                        required 
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm" 
                        value={formData.serviceType}
                        onChange={handleChange}
                      >
                        <option value="">Select Service...</option>
                        <option value="Plumbing">Plumbing</option>
                        <option value="Electrical">Electrical</option>
                        <option value="Carpentry">Carpentry</option>
                        <option value="Building">Building</option>
                        <option value="Painting">Painting</option>
                        <option value="Cleaning">Cleaning</option>
                      </select>
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
                    <input 
                      name="password" 
                      type="password" 
                      required 
                      placeholder="••••••••"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm" 
                      value={formData.password}
                      onChange={handleChange} 
                      minLength={8} 
                      autoComplete="new-password"
                    />
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