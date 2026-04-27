import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../contexts/AuthContext';
import { useAuth } from '../../contexts/AuthContext';
import { CloudCog, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const [role, setRole] = useState('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = role === 'admin' ? '/admin/login' : role === 'provider' ? '/providers/login' : '/users/login';
      const { data } = await api.post(endpoint, { email, password });
      
      const userData = data.user || data.admin || data.provider;
      login(data.token, { ...userData, role });
      
      toast.success('Successfully logged in!');
      navigate(`/${role}/dashboard`);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 font-sans text-slate-900 p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-50 rounded-full blur-3xl opacity-50"></div>

      <div className="w-full max-w-6xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10 min-h-[650px] border border-slate-200">
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
              Your trusted bridge between reliable service providers and households.
            </p>
          </div>
          <div className="absolute bottom-12 flex gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-1.5 rounded-full ${i === 1 ? 'w-8 bg-white' : 'w-2 bg-white/30'}`}></div>
            ))}
          </div>
        </div>

        {/* Right Section: Form */}
        <div className="flex-1 p-8 md:p-20 md:pt-32 flex items-start justify-center bg-white overflow-y-auto">
          <div className="w-full max-w-md">
            <div className="mb-8">
               <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome Back</h2>
               <p className="text-sm text-slate-500 mt-2 font-medium">Please enter your details to sign in.</p>
            </div>

            <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
              {['user', 'provider', 'admin'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg capitalize transition-all ${
                    role === r ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="p-4 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100 font-medium">{error}</div>}
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">Email Address</label>
                <input 
                  type="email" 
                  required 
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm"
                  autoComplete="off"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">Password</label>
                <input 
                  type="password" 
                  required 
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm"
                  autoComplete="new-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <div className="flex justify-end mt-3">
                  <Link 
                    to="/forgot-password" 
                    className="text-sm font-bold text-indigo-600 hover:text-indigo-700 hover:underline transition-all mr-1"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl mt-4 shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing in...
                  </>
                ) : 'Sign In'}
              </button>
            </form>

            {role !== 'admin' && (
              <p className="mt-8 text-center text-sm text-slate-500 font-medium">
                Don't have an account?{' '}
                <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-bold hover:underline">
                  Register as {role === 'provider' ? 'a Provider' : 'a User'}
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}