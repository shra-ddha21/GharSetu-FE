import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { X, Loader2, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../contexts/AuthContext';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await api.post('/forgot-password', { email });
      
      toast.success('OTP sent to your email!');
      // Navigate to verify-otp and pass the email in state
      navigate('/verify-otp', { state: { email } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP. Please try again.');
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
              Secure access to your account. Let's get you back in.
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="flex-1 p-8 md:p-20 md:pt-32 flex items-start justify-center bg-white overflow-y-auto">
          <div className="w-full max-w-md">
            <div className="mb-8">
               <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Forgot Password?</h2>
               <p className="text-sm text-slate-500 mt-2 font-medium">Enter your email and we'll send you an OTP to reset your password.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="email" 
                    required 
                    placeholder="name@example.com"
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl mt-4 shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending OTP...
                  </>
                ) : 'Send OTP'}
              </button>

              <div className="text-center mt-6">
                <Link to="/login" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">
                  ← Back to Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
