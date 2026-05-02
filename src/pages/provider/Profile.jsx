import { useState, useEffect } from 'react';
import { useAuth, api } from '../../contexts/AuthContext';
import { Camera, Trash2, UploadCloud, Save, Loader2, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import LocationPicker from '../../components/LocationPicker';

export default function Profile() {
  const { user, updateUser } = useAuth();
  
  const [formData, setFormData] = useState({
    businessName: '',
    serviceType: '',
    email: '',
    phone: '',
    location: '',
    experience: '',
    description: '',
    servicesOffered: '',
    coordinates: null
  });
  
  const [portfolioImages, setPortfolioImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showServiceSuggestions, setShowServiceSuggestions] = useState(false);
  const [serviceTypeQuery, setServiceTypeQuery] = useState('');

  const ALL_SERVICE_TYPES = [
    'General Labour', 'Mason', 'Centering Labour', 'Plumber', 'Electrician',
    'Painter', 'Carpenter', 'Tile Fitting', 'Fabricator', 'Stone Work',
    'Contractor', 'Architect', 'Structural Designer', 'Interior Designer',
    'Estimation & Costing', 'Waterproofing', 'Survey', 'Core Cutting',
    'Pest Control', 'CCTV Services', 'Borewell Service', 'Kitchen Services',
    'Ceiling', 'Repairing Services', 'Equipment Rent', 'Railing Work',
    'Roofing', 'Furniture', 'Earthmovers', 'Solar Services', 'Cement',
    'Steel', 'Bricks', 'Plumbing', 'Aggregate', 'Sand', 'Electrical',
    'Hardware', 'Tile/Paving Block', 'Paint', 'Fabrication',
    'Concrete Articles', 'Murum & Construction Waste', 'Plywood/Laminate',
    'Chemical/Adhesive', 'Home Decor', 'Nursery', 'Doors & Windows',
    'Tools & Machinery',
  ];

  const filteredServices = ALL_SERVICE_TYPES.filter(s =>
    s.toLowerCase().includes(serviceTypeQuery.toLowerCase())
  );

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/providers/profile');
      const profile = data.data;
      setFormData({
        businessName: profile.businessName || '',
        serviceType: profile.serviceType || '',
        email: profile.email || '',
        phone: profile.phone || '',
        location: profile.location || '',
        experience: profile.experience || '',
        description: profile.description || '',
        servicesOffered: profile.servicesOffered?.join(', ') || '',
        coordinates: profile.coordinates || null
      });
      setServiceTypeQuery(profile.serviceType || '');
      setPortfolioImages(profile.portfolioImages || []);
      // Update global context so the notification dot goes away if complete
      updateUser(profile);
    } catch (error) {
      toast.error('Failed to load profile');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        businessName: formData.businessName,
        serviceType: formData.serviceType,
        location: formData.location,
        experience: Number(formData.experience),
        description: formData.description,
        servicesOffered: formData.servicesOffered.split(',').map(s => s.trim()).filter(s => s),
        coordinates: formData.coordinates
      };
      
      const { data } = await api.put('/providers/profile', payload);
      toast.success('Profile updated successfully');
      setFormData(prev => ({
        ...prev,
        servicesOffered: data.data.servicesOffered.join(', ')
      }));
      updateUser(data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    setUploading(true);
    try {
      const { data } = await api.post('/providers/profile/portfolio', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Images uploaded successfully');
      setPortfolioImages(data.data);
      // Fetch latest profile to update context
      fetchProfile();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload images');
    } finally {
      setUploading(false);
      e.target.value = ''; // reset input
    }
  };

  const handleDeleteImage = (publicId) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-slate-800 font-medium">Are you sure you want to delete this image?</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const { data } = await api.delete(`/providers/profile/portfolio/${encodeURIComponent(publicId)}`);
                toast.success('Image deleted');
                setPortfolioImages(data.data);
                fetchProfile();
              } catch (error) {
                toast.error('Failed to delete image');
              }
            }}
            className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  return (
    <div className="flex flex-col gap-6 h-full max-w-4xl mx-auto w-full px-1">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Provider Profile</h1>
          <p className="text-slate-500 text-sm">Manage your business information and portfolio.</p>
        </div>
      </header>

      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-6 border-b pb-4">Basic Information</h2>
        
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Business Name *</label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
              />
            </div>

            <div className="space-y-2 relative">
              <label className="text-sm font-semibold text-slate-700">Primary Category *</label>
              <input
                type="text"
                value={serviceTypeQuery}
                onChange={(e) => {
                  setServiceTypeQuery(e.target.value);
                  setShowServiceSuggestions(true);
                }}
                onFocus={() => setShowServiceSuggestions(true)}
                onBlur={() => setTimeout(() => setShowServiceSuggestions(false), 200)}
                placeholder="Search primary category..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
              />
              {showServiceSuggestions && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                  {filteredServices.map(s => (
                    <button
                      key={s}
                      type="button"
                      className="w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 transition-colors"
                      onClick={() => {
                        setFormData({ ...formData, serviceType: s });
                        setServiceTypeQuery(s);
                        setShowServiceSuggestions(false);
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Services Offered *</label>
              <input
                type="text"
                name="servicesOffered"
                value={formData.servicesOffered}
                onChange={handleChange}
                required
                placeholder="e.g. Plumber, Electrician (comma separated)"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Email (View Only)</label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Phone (View Only)</label>
              <input
                type="text"
                value={formData.phone}
                disabled
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Location Text</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" /> Pin Exact Location on Map
              </label>
              <LocationPicker 
                value={formData.coordinates} 
                onChange={(coords) => setFormData({...formData, coordinates: coords})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Experience (Years)</label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Tell customers about your business..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow resize-none"
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Save Profile
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b pb-4">
          <h2 className="text-xl font-bold text-slate-800">Portfolio Images</h2>
          
          <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
            {uploading ? 'Uploading...' : 'Upload Images'}
            <input 
              type="file" 
              multiple 
              accept="image/jpeg, image/png, image/jpg" 
              className="hidden" 
              onChange={handleImageUpload}
              disabled={uploading}
            />
          </label>
        </div>

        {portfolioImages.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
            <Camera className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No images in your portfolio yet.</p>
            <p className="text-slate-400 text-sm mt-1">Upload pictures of your past work to attract more customers.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {portfolioImages.map((img) => (
              <div key={img.publicId} className="group relative aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
                <img src={img.url} alt="Portfolio item" className="w-full h-full object-cover" />
                
                {/* Delete Button - Always visible for better accessibility */}
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => handleDeleteImage(img.publicId)}
                    className="p-2 bg-red-500/90 backdrop-blur-sm text-white rounded-lg hover:bg-red-600 transition-all shadow-md active:scale-90"
                    title="Delete Image"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
