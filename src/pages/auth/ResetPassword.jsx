import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { X, Loader2, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call for resetting password
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Password reset successfully!');
      navigate('/password-reset-success');
    } catch (err) {
      toast.error('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 font-sans text-slate-900 p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-50 rounded-full blur-3xl opacity-50"></div>

      <div className="w-full max-w-6xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10 min-h-[600px] border border-slate-200">
        <Link to="/login" className="absolute top-6 right-6 z-30 p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all duration-300 group">
          <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
        </Link>

        {/* Branding Section */}
        <div className="md:w-5/12 bg-indigo-600 text-white p-20 flex flex-col justify-start items-start text-left relative overflow-hidden pt-32">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-white rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10 flex flex-col items-start w-full max-w-md">
            <h1 className="text-5xl font-extrabold mb-4 tracking-tight">GharSetu</h1>
            <div className="w-full h-1.5 bg-white/30 rounded-full mb-8"></div>
            <p className="text-xl text-indigo-100 leading-snug font-medium">
              Create a strong new password to protect your account.
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="flex-1 p-8 md:p-20 md:pt-32 flex items-start justify-center bg-white overflow-y-auto">
          <div className="w-full max-w-md">
            <div className="mb-8">
               <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Create New Password</h2>
               <p className="text-sm text-slate-500 mt-2 font-medium">Please enter and confirm your new strong password.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="password" 
                    required 
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="password" 
                    required 
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-4 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Updating Password...
                    </>
                  ) : 'Reset Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
