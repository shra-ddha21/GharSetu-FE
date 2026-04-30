import { useState, useEffect, useMemo } from 'react';
import { api } from '../../contexts/AuthContext';
import { Shield, Mail, Phone, MapPin, Camera, Save, Activity, Users, Briefcase, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function AdminProfile() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    profileImage: null
  });
  const [stats, setStats] = useState({ 
    totalUsers: 0,
    totalProviders: 0,
    totalRequests: 0
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, statsRes] = await Promise.all([
          api.get('/admin/profile'),
          api.get('/admin/stats')
        ]);
        // Handle undefined values gracefully by merging with empty strings
        setProfile({
          name: profileRes.data.name || '',
          email: profileRes.data.email || '',
          phone: profileRes.data.phone || '',
          address: profileRes.data.address || '',
          profileImage: profileRes.data.profileImage || null
        });
        setStats(statsRes.data);
      } catch (err) {
        console.error('Failed to fetch admin profile data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/admin/profile', {
        name: profile.name,
        phone: profile.phone,
        address: profile.address
      });
      setProfile(prev => ({...prev, name: data.name, phone: data.phone, address: data.address}));
      alert('Admin profile updated successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      const { data } = await api.post('/admin/profile/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProfile(prev => ({ ...prev, profileImage: data }));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const chartData = useMemo(() => [
    { name: 'Users', value: stats.totalUsers, color: '#3b82f6' },
    { name: 'Providers', value: stats.totalProviders, color: '#4f46e5' },
    { name: 'Requests', value: stats.totalRequests, color: '#10b981' }
  ], [stats]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-4 border-slate-300 border-t-slate-800 rounded-full animate-spin"></div>
      <p className="mt-4 text-slate-500 font-medium animate-pulse">Loading Admin Profile...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Dashboard</h1>
        <p className="text-slate-500 mt-1 text-lg">Manage your profile and monitor platform analytics.</p>
      </div>

      <div className="grid xl:grid-cols-[1fr,450px] gap-8">
        
        {/* Main Profile Form */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden h-fit flex flex-col">
          {/* Cover Banner */}
          <div className="h-40 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
             <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
          </div>
          
          <div className="px-8 pb-8 relative flex-1">
            {/* Avatar Upload */}
            <div className="relative w-32 h-32 -mt-16 mb-8 rounded-full border-[6px] border-white bg-slate-100 shadow-lg group">
              {profile.profileImage?.url ? (
                <img src={profile.profileImage.url} alt="Profile" className="w-full h-full object-cover rounded-full" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100 rounded-full">
                  <Shield className="w-12 h-12 text-slate-400" />
                </div>
              )}
              
              <label className="absolute inset-0 flex items-center justify-center bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-300 backdrop-blur-sm">
                <Camera className="w-8 h-8" />
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
              </label>
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/90 rounded-full backdrop-blur-sm">
                  <div className="w-6 h-6 border-2 border-slate-800 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-slate-700 tracking-wide uppercase">Admin Name</label>
                  <div className="relative group">
                    <Shield className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-800 transition-colors" />
                    <input 
                      type="text" name="name" value={profile.name} onChange={handleChange} required
                      className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-slate-900/5 focus:border-slate-800 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-slate-700 tracking-wide uppercase">Email Address</label>
                  <div className="relative group">
                    <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="email" value={profile.email} disabled
                      className="w-full pl-11 pr-4 py-3 bg-slate-100 border border-slate-200 text-slate-500 rounded-2xl outline-none cursor-not-allowed font-medium"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium">Super admin email cannot be changed.</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-slate-700 tracking-wide uppercase">Phone Number</label>
                  <div className="relative group">
                    <Phone className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-800 transition-colors" />
                    <input 
                      type="tel" name="phone" value={profile.phone} onChange={handleChange} 
                      className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-slate-900/5 focus:border-slate-800 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-slate-700 tracking-wide uppercase">Office Address</label>
                  <div className="relative group">
                    <MapPin className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-800 transition-colors" />
                    <input 
                      type="text" name="address" value={profile.address} onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-slate-900/5 focus:border-slate-800 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
                      placeholder="Corporate HQ Location"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex justify-end">
                <button 
                  type="submit" 
                  disabled={saving || uploading}
                  className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-2xl font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-slate-900/20 active:scale-95"
                >
                  {saving ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : <Save className="w-5 h-5" />}
                  {saving ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Side Stats Section */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-8">
             <div className="flex items-center justify-between mb-8">
               <h3 className="font-extrabold text-slate-900 text-xl tracking-tight">Platform Metrics</h3>
               <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                 <Activity className="w-5 h-5 text-emerald-600" />
               </div>
             </div>
             
             {/* Chart */}
             <div className="h-[220px] w-full mb-8">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={chartData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} dy={10} />
                   <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                   <Tooltip 
                     cursor={{fill: '#f8fafc'}}
                     contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'}}
                   />
                   <Bar dataKey="value" radius={[6, 6, 6, 6]} barSize={40}>
                     {chartData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry.color} />
                     ))}
                   </Bar>
                 </BarChart>
               </ResponsiveContainer>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100/50">
                   <div className="flex items-center gap-2 mb-2">
                     <Users className="w-4 h-4 text-blue-600" />
                     <p className="text-[11px] font-bold text-blue-900/60 uppercase tracking-wider">Total Users</p>
                   </div>
                   <p className="text-3xl font-black text-blue-900">{stats.totalUsers}</p>
                </div>

                <div className="bg-indigo-50/50 rounded-2xl p-4 border border-indigo-100/50">
                   <div className="flex items-center gap-2 mb-2">
                     <Briefcase className="w-4 h-4 text-indigo-600" />
                     <p className="text-[11px] font-bold text-indigo-900/60 uppercase tracking-wider">Providers</p>
                   </div>
                   <p className="text-3xl font-black text-indigo-900">{stats.totalProviders}</p>
                </div>

                <div className="col-span-2 bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100/50 flex justify-between items-center">
                   <div>
                     <div className="flex items-center gap-2 mb-1">
                       <FileText className="w-4 h-4 text-emerald-600" />
                       <p className="text-[11px] font-bold text-emerald-900/60 uppercase tracking-wider">Total Requests</p>
                     </div>
                     <p className="text-3xl font-black text-emerald-900">{stats.totalRequests}</p>
                   </div>
                   <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center">
                     <Activity className="w-5 h-5 text-emerald-500" />
                   </div>
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
