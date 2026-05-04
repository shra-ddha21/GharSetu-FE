import { useState, useEffect, useRef } from 'react';
import { useAuth, api } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Users, Briefcase, FileText, CheckCircle, Clock, TrendingUp,
  AlertCircle, ArrowRight, BadgeCheck, Loader2
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import Skeleton from '../../components/Skeleton';

// --- Count-Up Hook ---
function useCountUp(target, duration = 1200) {
  const [count, setCount] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (target === null || target === undefined || target === '--') {
      setCount('--');
      return;
    }
    const numTarget = Number(target);
    if (isNaN(numTarget)) { setCount(target); return; }

    const startTime = performance.now();
    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * numTarget));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return count;
}

// --- Animated Stat Card ---
const StatCard = ({ label, value, sub, icon: Icon, gradient, loading, delay = 0 }) => {
  const animatedValue = useCountUp(loading ? null : value, 1400);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-6 flex flex-col justify-between min-h-[140px] ${gradient}
        transition-all duration-700 ease-out
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
    >
      <div className="absolute right-4 top-4 w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
        <Icon className="w-8 h-8 text-white/80" />
      </div>
      <div className="absolute -left-6 -bottom-6 w-24 h-24 rounded-full bg-white/5"></div>
      {loading ? (
        <div className="space-y-3">
          <div className="h-4 w-24 rounded bg-white/20 relative overflow-hidden">
            <div className="absolute inset-0 shimmer opacity-50" />
          </div>
          <div className="h-10 w-20 rounded bg-white/20 relative overflow-hidden">
            <div className="absolute inset-0 shimmer opacity-50" />
          </div>
          <div className="h-4 w-32 rounded bg-white/20 relative overflow-hidden mt-6">
            <div className="absolute inset-0 shimmer opacity-50" />
          </div>
        </div>
      ) : (
        <>
          <div>
            <p className="text-white/70 text-sm font-semibold uppercase tracking-wider">{label}</p>
            <p className="text-4xl font-black text-white mt-1 tracking-tight tabular-nums">
              {animatedValue}
            </p>
          </div>
          <p className="text-white/80 text-sm font-semibold mt-4">{sub}</p>
        </>
      )}
    </div>
  );
};

// --- Custom Bar Shape with animation-ready fill ---
const RoundedBar = (props) => {
  const { x, y, width, height, fill } = props;
  if (!height || height <= 0) return null;
  const radius = 8;
  return (
    <path
      d={`M${x + radius},${y} h${width - radius * 2} a${radius},${radius} 0 0 1 ${radius},${radius} v${height - radius} h${-width} v${-(height - radius)} a${radius},${radius} 0 0 1 ${radius},${-radius} z`}
      fill={fill}
    />
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-2xl">
        <p className="font-bold text-slate-800 mb-2">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.fill }} className="text-sm font-semibold">
            {p.name}: <span className="font-black">{p.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
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

  const platformChartData = stats ? [
    { name: 'Users', value: stats.totalUsers, fill: '#6366f1' },
    { name: 'Approved\nProviders', value: stats.approvedProviders, fill: '#10b981' },
    { name: 'Pending\nProviders', value: stats.pendingProviders, fill: '#f59e0b' },
    { name: 'Active\nRequests', value: stats.activeRequests, fill: '#3b82f6' },
    { name: 'Completed', value: stats.completedRequests, fill: '#8b5cf6' },
  ] : [];

  return (
    <div className="flex flex-col gap-8 pb-12">

      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 p-8 text-white shadow-2xl shadow-indigo-200">
        <div className="absolute -right-10 -top-10 w-52 h-52 bg-white/5 rounded-full"></div>
        <div className="absolute right-24 top-8 w-28 h-28 bg-white/5 rounded-full"></div>
        <div className="relative z-10">
          <p className="text-indigo-200 text-sm font-bold uppercase tracking-widest mb-2">Admin Control Center</p>
          <h1 className="text-3xl font-black tracking-tight mb-3">
            Welcome back, {user?.name || 'Admin'} 👋
          </h1>
          <p className="text-indigo-200 font-medium max-w-lg">
            Here's a full overview of the GharSetu platform. Monitor providers, requests, and manage your service ecosystem from one place.
          </p>
          {stats?.pendingProviders > 0 && (
            <button
              onClick={() => navigate('/admin/providers')}
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-white text-indigo-700 font-extrabold rounded-xl text-sm hover:bg-indigo-50 transition-all active:scale-95 shadow-lg"
            >
              <AlertCircle className="w-4 h-4" />
              {stats.pendingProviders} Provider{stats.pendingProviders > 1 ? 's' : ''} Awaiting Approval
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Total Users"
          value={stats?.totalUsers ?? '--'}
          sub="Registered on platform"
          icon={Users}
          gradient="bg-gradient-to-br from-indigo-500 to-indigo-700"
          loading={loading}
          delay={0}
        />
        <StatCard
          label="Approved Providers"
          value={stats?.approvedProviders ?? '--'}
          sub="Active & verified"
          icon={BadgeCheck}
          gradient="bg-gradient-to-br from-emerald-500 to-emerald-700"
          loading={loading}
          delay={100}
        />
        <StatCard
          label="Active Requests"
          value={stats?.activeRequests ?? '--'}
          sub="Currently in progress"
          icon={Clock}
          gradient="bg-gradient-to-br from-sky-500 to-blue-700"
          loading={loading}
          delay={200}
        />
        <StatCard
          label="Completed Requests"
          value={stats?.completedRequests ?? '--'}
          sub="Successfully resolved"
          icon={CheckCircle}
          gradient="bg-gradient-to-br from-violet-500 to-purple-700"
          loading={loading}
          delay={300}
        />
      </div>

      {/* Chart + Activity Row */}
      <div className="grid lg:grid-cols-5 gap-6">

        {/* Bar Chart */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Platform Overview</h2>
              <p className="text-sm font-medium text-slate-500 mt-0.5">Live breakdown of all platform entities</p>
            </div>
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          {loading ? (
            <div className="h-56 w-full flex items-end gap-4 px-4 pb-2">
              {Array(6).fill(0).map((_, i) => (
                <Skeleton key={i} className="flex-1" style={{ height: `${20 + Math.random() * 60}%` }} />
              ))}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={platformChartData} barSize={40} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 700, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc', radius: 8 }} />
                <Bar
                  dataKey="value"
                  name="Count"
                  shape={<RoundedBar />}
                  isAnimationActive={true}
                  animationDuration={1200}
                  animationEasing="ease-out"
                >
                  {platformChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pending Providers Feed */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Pending Approvals</h2>
              <p className="text-sm font-medium text-slate-500 mt-0.5">Providers awaiting review</p>
            </div>
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-3">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-slate-50">
                  <Skeleton variant="avatar" className="h-10 w-10" />
                  <div className="flex-1 space-y-2">
                    <Skeleton variant="text" className="w-3/4 h-3" />
                    <Skeleton variant="text" className="w-1/2 h-2" />
                  </div>
                </div>
              ))
            ) : stats?.recentPendingProviders?.length > 0 ? (
              stats.recentPendingProviders.map(p => (
                <div key={p._id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white flex items-center justify-center font-black text-lg shrink-0">
                    {p.businessName?.[0]?.toUpperCase() || 'P'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 text-sm truncate">{p.businessName}</p>
                    <p className="text-xs font-medium text-slate-500 truncate">{p.serviceType}</p>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-[10px] font-black rounded-full border border-amber-100 uppercase tracking-wide shrink-0">Pending</span>
                </div>
              ))
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                <div className="w-14 h-14 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-3">
                  <CheckCircle className="w-7 h-7" />
                </div>
                <p className="font-bold text-slate-700 text-sm">All caught up!</p>
                <p className="text-xs font-medium text-slate-400 mt-1">No pending provider approvals.</p>
              </div>
            )}
          </div>

          {(stats?.pendingProviders ?? 0) > 0 && (
            <button
              onClick={() => navigate('/admin/providers')}
              className="mt-4 w-full py-3 flex items-center justify-center gap-2 text-sm font-extrabold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl border border-indigo-100 transition-all active:scale-95"
            >
              Review All Providers <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Summary Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Providers', value: stats?.totalProviders, icon: Briefcase, color: 'text-violet-600 bg-violet-50' },
          { label: 'Total Requests', value: stats?.totalRequests, icon: FileText, color: 'text-sky-600 bg-sky-50' },
          { label: 'Pending Approvals', value: stats?.pendingProviders, icon: AlertCircle, color: 'text-amber-600 bg-amber-50' },
        ].map(item => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center shrink-0`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                {loading ? (
                  <Skeleton variant="text" className="h-6 w-12" />
                ) : (
                  <p className="text-2xl font-black text-slate-900">{item.value ?? '--'}</p>
                )}
                <p className="text-xs font-semibold text-slate-500">{item.label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}