import { useState, useEffect } from 'react';
import { useAuth, api } from '../../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalUsers: '--', pendingProviders: '--', activeRequests: '--' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center relative overflow-hidden">
           {loading && <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10"><Loader2 className="w-6 h-6 text-indigo-600 animate-spin" /></div>}
           <p className="text-slate-500 text-sm font-medium">Total Users</p>
           <p className="text-3xl font-bold mt-1 text-slate-900">{stats.totalUsers}</p>
           <span className="text-emerald-500 text-xs font-bold mt-2">Active accounts</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center relative overflow-hidden">
           {loading && <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10"><Loader2 className="w-6 h-6 text-indigo-600 animate-spin" /></div>}
           <p className="text-slate-500 text-sm font-medium">Pending Providers</p>
           <p className="text-3xl font-bold mt-1 text-slate-900">{stats.pendingProviders}</p>
           <span className="text-slate-400 text-xs mt-2 font-medium">Awaiting approval</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center relative overflow-hidden">
           {loading && <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10"><Loader2 className="w-6 h-6 text-indigo-600 animate-spin" /></div>}
           <p className="text-slate-500 text-sm font-medium">Active Requests</p>
           <p className="text-3xl font-bold mt-1 text-slate-900">{stats.activeRequests}</p>
           <span className="text-indigo-500 text-xs font-bold mt-2">In progress</span>
        </div>
      </div>
    </div>
  );
}