import { useState, useEffect } from 'react';
import { api, useAuth } from '../../contexts/AuthContext';
import { User, Mail, Phone, MapPin, Camera, Save, Activity, LayoutDashboard, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import Skeleton from '../../components/Skeleton';

export default function UserProfile() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    profileImage: null
  });
  const [countryCode, setCountryCode] = useState('+91');
  const [stats, setStats] = useState({ totalRequests: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { updateUser } = useAuth();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, requestsRes] = await Promise.all([
          api.get('/users/profile'),
          api.get('/users/requests/me')
        ]);
        // Handle undefined values gracefully by merging with empty strings
        const userData = {
          name: profileRes.data.name || '',
          email: profileRes.data.email || '',
          // Take only the last 10 digits for the local number
          phone: (profileRes.data.phone || '').slice(-10),
          address: profileRes.data.address || '',
          profileImage: profileRes.data.profileImage || null
        };
        // Extract country code (everything except the last 10 digits)
        const fullPhone = profileRes.data.phone || '';
        if (fullPhone.length > 10) {
          setCountryCode(fullPhone.slice(0, -10));
        }
        setProfile(userData);
        setStats({ totalRequests: requestsRes.data.length });
        updateUser(profileRes.data); // Initial sync
      } catch (err) {
        console.error('Failed to fetch profile data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      // Only allow digits and max 10 characters
      const numericValue = value.replace(/\D/g, '').slice(0, 10);
      setProfile({ ...profile, [name]: numericValue });
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    if (profile.phone && !/^[0-9]{10}$/.test(profile.phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      setSaving(false);
      return;
    }

    try {
      const { data } = await api.put('/users/profile', {
        name: profile.name,
        // Prepend selected country code
        phone: profile.phone ? `${countryCode}${profile.phone}` : '',
        address: profile.address
      });
      // Sync local state with returned data (but keep it stripped for local use)
      setProfile(prev => ({
        ...prev, 
        name: data.name, 
        phone: (data.phone || '').slice(-10), 
        address: data.address
      }));
      if (data.phone && data.phone.length > 10) {
        setCountryCode(data.phone.slice(0, -10));
      }
      updateUser(data); // Sync with global AuthContext
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
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
      const { data } = await api.post('/users/profile/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProfile(prev => ({ ...prev, profileImage: data }));
      updateUser({ ...profile, profileImage: data }); // Sync with global AuthContext
      toast.success('Profile image updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700 pb-12">
        <div className="space-y-2">
          <Skeleton variant="title" className="w-64" />
          <Skeleton variant="text" className="w-96" />
        </div>
        <div className="grid lg:grid-cols-[1fr,350px] gap-8">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden h-fit">
            <Skeleton className="h-40 w-full" />
            <div className="px-8 pb-8 space-y-6">
              <Skeleton variant="circle" className="w-32 h-32 -mt-16 border-[6px] border-white" />
              <div className="grid md:grid-cols-2 gap-6">
                {Array(4).fill(0).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton variant="text" className="w-24" />
                    <Skeleton className="h-12 w-full rounded-2xl" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
              <Skeleton variant="avatar" className="rounded-2xl" />
              <Skeleton variant="title" className="w-3/4" />
              <Skeleton variant="text" />
              <Skeleton className="h-32 w-full rounded-3xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div className="px-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Account Settings</h1>
        <p className="text-slate-500 mt-1 text-base sm:text-lg">Update your personal information to get better service.</p>
      </div>

      <div className="grid lg:grid-cols-[1fr,350px] gap-8">
        
        {/* Main Profile Form */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden h-fit">
          {/* Cover Banner */}
          <div className="h-40 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 relative overflow-hidden">
             {/* Decorative circles */}
             <div className="absolute -top-24 -right-24 w-48 h-48 bg-white opacity-10 rounded-full blur-2xl"></div>
             <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-white opacity-10 rounded-full blur-2xl"></div>
          </div>
          
          <div className="px-4 sm:px-8 pb-8 relative">
            {/* Avatar Upload */}
            <div className="relative w-32 h-32 -mt-16 mb-8 rounded-full border-[6px] border-white bg-slate-50 shadow-xl group">
              {profile.profileImage?.url ? (
                <img src={profile.profileImage.url} alt="Profile" className="w-full h-full object-cover rounded-full" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-indigo-300 bg-indigo-50 rounded-full">
                  <User className="w-12 h-12" />
                </div>
              )}
              
              <label className="absolute inset-0 flex items-center justify-center bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-300 backdrop-blur-sm">
                <Camera className="w-8 h-8" />
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
              </label>
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/90 rounded-full backdrop-blur-sm">
                  <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-slate-700 tracking-wide uppercase">Full Name</label>
                  <div className="relative group">
                    <User className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input 
                      type="text" name="name" value={profile.name} onChange={handleChange} required
                      className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
                      placeholder="Your full name"
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
                  <p className="text-[11px] text-slate-400 font-medium">Email address cannot be changed.</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-slate-700 tracking-wide uppercase">Phone Number</label>
                  <div className="group">
                    <div className="flex">
                      <select 
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="bg-slate-100 border border-slate-200 border-r-0 rounded-l-2xl px-3 py-3 text-slate-700 font-bold text-sm outline-none focus:ring-4 focus:ring-indigo-600/5 transition-all"
                      >
                        <option value="+91">+91 (IN)</option>
                        <option value="+1">+1 (US)</option>
                        <option value="+44">+44 (UK)</option>
                        <option value="+971">+971 (UAE)</option>
                      </select>
                      <input 
                        type="tel" name="phone" value={profile.phone} onChange={handleChange}
                        maxLength={10}
                        className="w-full pl-4 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-r-2xl focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
                        placeholder="9876543210"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-slate-700 tracking-wide uppercase">Primary Address</label>
                  <div className="relative group">
                    <MapPin className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input 
                      type="text" name="address" value={profile.address} onChange={handleChange} 
                      className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
                      placeholder="Full address for services"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex justify-end">
                <button 
                  type="submit" 
                  disabled={saving || uploading}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-2xl font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/20 active:scale-95"
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
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6 sm:p-8 relative overflow-hidden group">
             {/* Decorative Background Icon */}
             <div className="absolute -right-8 -bottom-8 opacity-[0.03] text-indigo-600 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
               <Activity className="w-64 h-64" />
             </div>
             
             <div className="relative z-10">
               <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
                 <LayoutDashboard className="w-6 h-6 text-indigo-600" />
               </div>
               
               <h3 className="font-extrabold text-slate-900 text-xl tracking-tight mb-2">Service Activity</h3>
               <p className="text-slate-500 text-sm font-medium mb-8">A quick look at your historical service request data.</p>
               
               <div className="bg-gradient-to-br from-indigo-500 to-violet-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-600/20">
                  <div className="flex flex-col items-center justify-center text-center">
                    <p className="text-sm font-bold uppercase tracking-widest text-indigo-100/80 mb-2">Total Requests Made</p>
                    <p className="text-6xl font-black tracking-tight">{stats.totalRequests}</p>
                  </div>
               </div>

               <div className="mt-6 flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/50 transition-colors cursor-pointer" onClick={() => window.location.href = '/user/requests'}>
                 <span className="font-bold text-slate-700 text-sm">View All Requests</span>
                 <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center">
                   <ChevronRight className="w-4 h-4 text-indigo-600" />
                 </div>
               </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
