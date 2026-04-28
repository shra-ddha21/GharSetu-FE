import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { X, Loader2, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../contexts/AuthContext';

export default function VerifyOTP() {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const inputs = useRef([]);

  // Redirect guard — if no email in state, go back to forgot-password
  useEffect(() => {
    if (!email) {
      navigate('/forgot-password', { replace: true });
    }
  }, [email, navigate]);

  // 30-second countdown timer
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.value !== '' && index < 3) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && index > 0 && otp[index] === '') {
      inputs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length < 4) {
      toast.error('Please enter the full 4-digit code');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/verify-otp', { email, otp: otpValue });
      const { resetToken } = res.data;
      
      toast.success('OTP Verified!');
      navigate('/reset-password', { state: { email, resetToken } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await api.post('/forgot-password', { email });
      setTimer(30);
      setOtp(['', '', '', '']);
      if (inputs.current[0]) inputs.current[0].focus();
      toast.success('New OTP sent!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend OTP.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 font-sans text-slate-900 p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-50 rounded-full blur-3xl opacity-50"></div>

      <div className="w-full max-w-2xl bg-white rounded-[1.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10 min-h-[400px] border border-slate-200">
        <Link to="/login" className="absolute top-6 right-6 z-30 p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all duration-300 group">
          <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
        </Link>

        {/* Branding Section */}
        <div className="md:w-5/12 bg-indigo-600 text-white p-6 md:p-10 flex flex-col justify-start items-start text-left relative overflow-hidden pt-10 md:pt-16">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-white rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10 flex flex-col items-start w-full max-w-md">
            <h1 className="text-3xl font-extrabold mb-3 tracking-tight">GharSetu</h1>
            <div className="w-full h-1 bg-white/30 rounded-full mb-6"></div>
            <p className="text-lg text-indigo-100 leading-snug font-medium">
              Verify your account.
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="flex-1 p-6 md:p-10 md:pt-16 flex items-start justify-center bg-white overflow-y-auto">
          <div className="w-full max-w-md text-center md:text-left">
            <div className="mb-10">
               <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Verify Account</h2>
               <p className="text-xs text-slate-500 mt-1 font-medium">
                 Enter the 4-digit code we sent to <span className="text-indigo-600 font-bold">{email}</span>
               </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="flex justify-center md:justify-start gap-4">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    ref={(el) => (inputs.current[index] = el)}
                    className="w-16 h-20 text-center text-3xl font-bold bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-600/5 outline-none transition-all"
                    value={data}
                    onChange={(e) => handleChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                  />
                ))}
              </div>

              {/* Timer Display */}
              <div className="flex justify-center md:justify-start">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
                  timer > 0 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'bg-red-50 text-red-500'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${timer > 0 ? 'bg-indigo-500 animate-pulse' : 'bg-red-400'}`}></div>
                  {timer > 0 
                    ? `00:${timer.toString().padStart(2, '0')} remaining` 
                    : 'OTP Expired'}
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={loading || timer <= 0}
                  className="w-full py-4 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Verifying...
                    </>
                  ) : 'Verify Code'}
                </button>
              </div>

              <div className="text-center md:text-left space-y-4">
                <p className="text-sm text-slate-500 font-medium">
                  Didn't receive the code?{' '}
                  <button 
                    type="button" 
                    className="text-indigo-600 font-bold hover:underline disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed"
                    onClick={handleResend}
                    disabled={timer > 0 || resending}
                  >
                    {resending ? 'Sending...' : timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}
                  </button>
                </p>
                <Link to="/forgot-password" title="Go back to email entry" className="inline-block text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors">
                  ← Back to Email
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
