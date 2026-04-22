import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../contexts/AuthContext';
import { useAuth } from '../../contexts/AuthContext';
import { CloudCog } from 'lucide-react';

export default function Login() {
  const [role, setRole] = useState('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    console.log("inside theh handle submit");
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = role === 'admin' ? '/admin/login' : role === 'provider' ? '/providers/login' : '/users/login';
      const { data } = await api.post(endpoint, { email, password });
      
      const userData = data.user || data.admin || data.provider;
      login(data.token, { ...userData, role });
      
      navigate(`/${role}/dashboard`);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-slate-50 font-sans text-slate-900 border border-slate-200">
      <div className="hidden md:flex flex-col justify-center items-center bg-indigo-600 text-white p-12">
        <h1 className="text-4xl font-bold mb-4 tracking-tight">GharSetu</h1>
        <p className="text-lg text-indigo-100 max-w-md text-center font-medium">Your trusted bridge between reliable service providers and households.</p>
      </div>
      <div className="flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="mb-8">
             <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
             <p className="text-sm text-slate-500 mt-1 font-medium">Please enter your details to sign in.</p>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
            {['user', 'provider', 'admin'].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex-1 py-2 text-sm font-bold rounded-lg capitalize transition-colors ${
                  role === r ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-xl font-medium">{error}</div>}
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
              <input 
                type="email" 
                required 
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-shadow text-sm"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
              <input 
                type="password" 
                required 
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-shadow text-sm"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl mt-6 transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {role !== 'admin' && (
            <p className="mt-6 text-center text-sm text-slate-500 font-medium">
              Don't have an account?{' '}
              <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-bold">
                Register as {role === 'provider' ? 'a Provider' : 'a User'}
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}