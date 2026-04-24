import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../contexts/AuthContext';
import { useAuth } from '../../contexts/AuthContext';

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
        navigate('/user/dashboard');
      } else {
        setSuccess('Registration successful! Please wait for Admin approval to login.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-slate-50 font-sans text-slate-900 border border-slate-200">
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900">Create an Account</h2>
            <p className="text-sm text-slate-500 mt-1 font-medium">Join GharSetu today</p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl mb-8">
          {['user', 'provider'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => { setRole(r); setSuccess(''); setError(''); }}
              className={`flex-1 py-2 text-sm font-bold rounded-lg capitalize transition-colors ${
                role === r ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Register as {r}
            </button>
          ))}
        </div>

        {success ? (
          <div className="text-center">
            <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl mb-6 font-medium">{success}</div>
            <Link to="/login" className="text-indigo-600 font-bold hover:underline">Go to Login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-xl font-medium">{error}</div>}
            
            {role === 'user' ? (
              <>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                  <input 
                    name="name" 
                    required 
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-shadow text-sm" 
                    onChange={handleChange} 
                  />
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Business Name</label>
                    <input 
                        name="businessName" 
                        required 
                        className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-shadow text-sm" 
                        onChange={handleChange} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Owner Name</label>
                    <input 
                        name="ownerName" 
                        required 
                        className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-shadow text-sm" 
                        onChange={handleChange} 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Phone</label>
                    <input 
                        name="phone" 
                        required 
                        className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-shadow text-sm" 
                        onChange={handleChange} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Location</label>
                    <input 
                        name="location" 
                        required 
                        className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-shadow text-sm" 
                        onChange={handleChange} 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Service Type</label>
                  <select 
                    name="serviceType" 
                    required 
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-shadow text-sm" 
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
              </>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Email address</label>
              <input 
                name="email" 
                type="email" 
                required 
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-shadow text-sm" 
                onChange={handleChange} 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
              <input 
                name="password" 
                type="password" 
                required 
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-shadow text-sm" 
                onChange={handleChange} 
                minLength={8} 
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl mt-6 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        )}

        {!success && (
          <p className="mt-6 text-center text-sm text-slate-500 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-bold">
              Sign In
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}