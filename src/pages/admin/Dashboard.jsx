import { useAuth } from '../../contexts/AuthContext';
import { Search } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-6 h-full">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 text-sm">Overview of service ecosystem and provider status.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" 
            />
          </div>
          <button className="bg-white border border-slate-200 p-2 rounded-xl text-slate-600 flex items-center justify-center">
            <Search className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
           <p className="text-slate-500 text-sm font-medium">Total Users</p>
           <p className="text-3xl font-bold mt-1 text-slate-900">--</p>
           <span className="text-emerald-500 text-xs font-bold mt-2">Active accounts</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
           <p className="text-slate-500 text-sm font-medium">Pending Providers</p>
           <p className="text-3xl font-bold mt-1 text-slate-900">--</p>
           <span className="text-slate-400 text-xs mt-2 font-medium">Awaiting approval</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
           <p className="text-slate-500 text-sm font-medium">Active Requests</p>
           <p className="text-3xl font-bold mt-1 text-slate-900">--</p>
           <span className="text-indigo-500 text-xs font-bold mt-2">In progress</span>
        </div>
      </div>
    </div>
  );
}