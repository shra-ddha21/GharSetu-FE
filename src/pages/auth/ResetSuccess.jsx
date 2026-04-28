import { useNavigate, Link } from 'react-router-dom';
import { X, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ResetSuccess() {
  const navigate = useNavigate();

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
              Password updated successfully.
            </p>
          </div>
        </div>

        {/* Success Section */}
        <div className="flex-1 p-8 md:p-20 flex items-center justify-center bg-white overflow-y-auto">
          <div className="w-full max-w-md text-center">
            <div className="mb-8 flex justify-center">
               <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center border-4 border-emerald-100 animate-[bounce_2s_infinite]">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500" />
               </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">Updated!</h2>
            <p className="text-slate-500 font-medium text-xs mb-8">
              Your password has been reset. You can now log in.
            </p>

            <Link 
              to="/login" 
              className="w-full py-4 px-6 bg-slate-900 hover:bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-slate-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
            >
              Go to Login <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
