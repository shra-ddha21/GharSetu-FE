import { useState, useEffect } from 'react';
import { useAuth, api } from '../../contexts/AuthContext';
import { Camera, Trash2, UploadCloud, Save, Loader2, MapPin, BadgeCheck, Phone, FileText, Image as ImageIcon, CheckCircle, AlertCircle, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import LocationPicker from '../../components/LocationPicker';
import Skeleton from '../../components/Skeleton';

export default function Profile() {
  const { user, updateUser } = useAuth();
  
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    serviceType: '',
    servicesOffered: [],
    experience: '',
    description: '',
    address: {
      street: '',
      state: '',
      district: '',
      city: '',
      pincode: ''
    },
    coordinates: null
  });
  
  const [profileDocs, setProfileDocs] = useState({
    profileImage: null,
    governmentId: null
  });

  const [portfolioImages, setPortfolioImages] = useState([]);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [isVerifiedProfile, setIsVerifiedProfile] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);

  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [uploadingDocs, setUploadingDocs] = useState(false);
  const [uploadingPortfolio, setUploadingPortfolio] = useState(false);
  const [fetchingPincode, setFetchingPincode] = useState(false);
  const [missingFields, setMissingFields] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);

  const formatMissingField = (field) => {
    const map = {
      'businessName': 'Business Name',
      'ownerName': 'Owner Name',
      'email': 'Email Address',
      'phone': 'Phone Number',
      'experience': 'Years of Experience',
      'description': 'Business Description',
      'address.street': 'Street Address',
      'address.state': 'State',
      'address.district': 'District',
      'address.city': 'City / Locality',
      'address.pincode': 'Pincode',
      'profileImage.url': 'Profile Picture',
      'governmentId.frontImage': 'Govt ID (Front)',
      'governmentId.backImage': 'Govt ID (Back)',
      'coordinates': 'Map Location (Pin on Map)',
      'phoneVerified': 'Verify Phone Number',
      'servicesOffered': 'Services Offered'
    };
    return map[field] || field;
  };

  // OTP Modal State
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  // Pincode Data State
  const [cityOptions, setCityOptions] = useState([]);

  // Document Upload State
  const [selectedDocs, setSelectedDocs] = useState({
    profileImage: null,
    frontImage: null,
    backImage: null
  });

  useEffect(() => {
    fetchProfile();
    // Fetch the full service taxonomy for the dropdown
    api.get('/services/categories').then(({ data }) => {
      setAllServices(data.flatMap(cat => cat.subcategories || []));
    }).catch(() => {});
  }, []);

  // Pincode auto-fill effect
  useEffect(() => {
    const pincode = formData.address.pincode;
    if (pincode && pincode.length === 6 && /^\d+$/.test(pincode)) {
      handlePincodeLookup(pincode);
    }
  }, [formData.address.pincode]);

  const fetchProfile = async (keepFormData = false) => {
    try {
      const { data } = await api.get('/providers/profile');
      const profile = data.data;
      
      if (!keepFormData) {
        setFormData({
          businessName: profile.businessName || '',
          ownerName: profile.ownerName || '',
          email: profile.email || '',
          phone: profile.phone || '',
          serviceType: profile.serviceType || '',
          servicesOffered: profile.servicesOffered || [],
          experience: profile.experience || '',
          description: profile.description || '',
          address: {
            street: profile.address?.street || '',
            state: profile.address?.state || '',
            district: profile.address?.district || '',
            city: profile.address?.city || '',
            pincode: profile.address?.pincode || ''
          },
          coordinates: profile.coordinates || null
        });
      }
      
      setPortfolioImages(profile.portfolioImages || []);
      setProfileDocs({
        profileImage: profile.profileImage || null,
        governmentId: profile.governmentId || null
      });
      setCompletionPercentage(profile.completionPercentage || 0);
      setIsVerifiedProfile(profile.isVerifiedProfile || false);
      setPhoneVerified(profile.phoneVerified || false);

      if (profile.missingFields && profile.missingFields.length > 0) {
        setMissingFields(profile.missingFields);
      } else {
        setMissingFields([]);
      }

      updateUser(profile);
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoadingProfile(false);
    }
  };

  const handlePincodeLookup = async (pincode) => {
    setFetchingPincode(true);
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();

      if (data[0].Status === "Success") {
        const offices = data[0].PostOffice;
        const state = offices[0].State;
        const district = offices[0].District;
        const cities = offices.map(office => office.Name);

        setFormData(prev => ({
          ...prev,
          address: {
            ...prev.address,
            state,
            district,
            city: cities.includes(prev.address.city) ? prev.address.city : cities[0]
          }
        }));
        setCityOptions(cities);
        toast.success(`Location found: ${district}, ${state}`);
      } else {
        toast.error("Invalid pincode or data not found");
        setCityOptions([]);
      }
    } catch (error) {
      console.error("Pincode lookup error:", error);
    } finally {
      setFetchingPincode(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData({ 
      ...formData, 
      address: { ...formData.address, [name]: value } 
    });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        businessName: formData.businessName,
        ownerName: formData.ownerName,
        phone: formData.phone,
        experience: Number(formData.experience),
        description: formData.description,
        servicesOffered: Array.isArray(formData.servicesOffered)
          ? formData.servicesOffered
          : formData.servicesOffered.split(',').map(s => s.trim()).filter(s => s),
        address: formData.address,
        coordinates: formData.coordinates
      };
      
      const { data } = await api.put('/providers/profile', payload);
      toast.success('Profile updated successfully');
      setCompletionPercentage(data.data.completionPercentage);
      setIsVerifiedProfile(data.data.isVerifiedProfile);
      updateUser(data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentSelect = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedDocs(prev => ({ ...prev, [type]: file }));
    }
  };

  const handleUploadDocuments = async () => {
    if (!selectedDocs.profileImage && !selectedDocs.frontImage && !selectedDocs.backImage) {
      toast.error('Please select at least one document to upload');
      return;
    }

    setUploadingDocs(true);
    const formData = new FormData();
    if (selectedDocs.profileImage) formData.append('profileImage', selectedDocs.profileImage);
    if (selectedDocs.frontImage) formData.append('frontImage', selectedDocs.frontImage);
    if (selectedDocs.backImage) formData.append('backImage', selectedDocs.backImage);

    try {
      const { data } = await api.post('/providers/profile/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Documents uploaded successfully');
      fetchProfile(true);
      setSelectedDocs({ profileImage: null, frontImage: null, backImage: null });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload documents');
    } finally {
      setUploadingDocs(false);
    }
  };

  const handlePortfolioUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    setUploadingPortfolio(true);
    try {
      const { data } = await api.post('/providers/profile/portfolio', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Images uploaded successfully');
      setPortfolioImages(data.data);
      fetchProfile(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload images');
    } finally {
      setUploadingPortfolio(false);
      e.target.value = '';
    }
  };

  const handleDeletePortfolioImage = async (publicId) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    
    try {
      const { data } = await api.delete(`/providers/profile/portfolio/${publicId}`);
      toast.success('Image deleted');
      setPortfolioImages(data.data);
      fetchProfile(true);
    } catch (error) {
      toast.error('Failed to delete image');
    }
  };

  const handleSendOtp = async () => {
    // Check if phone starts with +
    if (!formData.phone.startsWith('+')) {
      toast.error("Please add country code (e.g. +91) to your phone number for SMS delivery.");
      return;
    }

    setSendingOtp(true);
    try {
      await api.post('/providers/profile/send-phone-otp', { phone: formData.phone });
      toast.success('OTP sent via SMS!');
      setShowOtpModal(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpValue || otpValue.length < 4) {
      toast.error('Please enter a valid OTP');
      return;
    }
    setVerifyingOtp(true);
    try {
      const { data } = await api.post('/providers/profile/verify-phone-otp', { otp: otpValue });
      toast.success('Phone verified successfully!');
      setShowOtpModal(false);
      setPhoneVerified(true);
      setCompletionPercentage(data.data.completionPercentage);
      setIsVerifiedProfile(data.data.isVerifiedProfile);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setVerifyingOtp(false);
    }
  };

  if (loadingProfile) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 pb-12">
        {/* Skeleton Header */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-8">
          <Skeleton variant="circle" className="w-32 h-32" />
          <div className="flex-1 space-y-3 text-center md:text-left">
            <Skeleton variant="title" className="w-64 mx-auto md:mx-0" />
            <Skeleton variant="text" className="w-48 mx-auto md:mx-0" />
            <div className="flex gap-2 justify-center md:justify-start">
              <Skeleton className="w-24 h-6 rounded-full" />
              <Skeleton className="w-24 h-6 rounded-full" />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Skeleton Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-4">
              <Skeleton variant="text" className="w-1/2 h-6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
          </div>

          {/* Skeleton Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
              <Skeleton variant="title" className="w-48" />
              <div className="grid md:grid-cols-2 gap-6">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton variant="text" className="w-24" />
                    <Skeleton className="h-12 w-full rounded-xl" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 h-full max-w-4xl mx-auto w-full pb-12">
      {/* Header & Verification Status */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            Provider Profile
            {isVerifiedProfile && (
              <span className="flex items-center gap-1 bg-green-50 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full border border-green-200">
                <BadgeCheck className="w-4 h-4" /> VERIFIED
              </span>
            )}
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage your business information, location, and documents.</p>
        </div>

        {/* Circular Progress Bar */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-700">Profile Status</p>
            <p className="text-xs text-slate-500">{completionPercentage}% Completed</p>
          </div>
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="none" className="text-slate-100" strokeWidth="3" stroke="currentColor" />
              <circle
                cx="18" cy="18" r="16" fill="none"
                className={`${completionPercentage === 100 ? 'text-green-500' : 'text-indigo-600'} transition-all duration-1000 ease-out`}
                strokeWidth="3"
                strokeDasharray="100"
                strokeDashoffset={100 - completionPercentage}
                strokeLinecap="round"
                stroke="currentColor"
              />
            </svg>
            <span className="absolute text-xs font-bold text-slate-700">{completionPercentage}%</span>
          </div>
        </div>
      </div>

      {/* Missing Fields Checklist */}
      {completionPercentage < 100 && missingFields.length > 0 && (
        <div className="bg-amber-50 rounded-2xl border border-amber-200 p-6 shadow-sm">
          <h3 className="text-amber-800 font-bold mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Complete your profile to get verified!
          </h3>
          <p className="text-amber-700 text-sm mb-4">
            You are currently at {completionPercentage}%. Please complete the following items to reach 100% and earn your verified badge:
          </p>
          <div className="flex flex-wrap gap-2">
            {missingFields.map(field => (
              <span key={field} className="px-3 py-1.5 bg-white text-amber-700 border border-amber-200 rounded-lg text-sm font-medium shadow-sm flex items-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> {formatMissingField(field)}
              </span>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSaveProfile} className="space-y-8">
        
        {/* Basic Information */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-6 border-b pb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" /> Basic Information
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Business Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
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
              <label className="text-sm font-semibold text-slate-700">Owner Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Services Offered <span className="text-red-500">*</span></label>
              
              {/* Selected Tags */}
              <div
                className="w-full min-h-[46px] px-3 py-2 rounded-xl border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-500 bg-white flex flex-wrap gap-2 cursor-pointer"
                onClick={() => setShowServiceDropdown(prev => !prev)}
              >
                {formData.servicesOffered.length > 0 ? (
                  formData.servicesOffered.map(s => (
                    <span
                      key={s}
                      className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-bold px-3 py-1.5 rounded-lg"
                    >
                      {s}
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          setFormData(prev => ({ ...prev, servicesOffered: prev.servicesOffered.filter(x => x !== s) }));
                        }}
                        className="text-indigo-400 hover:text-red-500 transition-colors ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400 text-sm self-center">Click to select services...</span>
                )}
              </div>

              {/* Dropdown */}
              {showServiceDropdown && (
                <div className="relative z-30">
                  <div className="absolute w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                    {allServices.length === 0 ? (
                      <p className="p-4 text-sm text-slate-400">Loading services...</p>
                    ) : (
                      allServices.map(service => {
                        const isSelected = formData.servicesOffered.includes(service);
                        return (
                          <button
                            type="button"
                            key={service}
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                servicesOffered: isSelected
                                  ? prev.servicesOffered.filter(x => x !== service)
                                  : [...prev.servicesOffered, service]
                              }));
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between gap-3 transition-colors ${
                              isSelected
                                ? 'bg-indigo-50 text-indigo-700 font-bold'
                                : 'text-slate-700 hover:bg-slate-50 font-medium'
                            }`}
                          >
                            <span>{service}</span>
                            {isSelected && <span className="text-indigo-500 font-black">✓</span>}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
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
              <label className="text-sm font-semibold text-slate-700 flex justify-between">
                Phone Number
                {phoneVerified ? (
                  <span className="text-green-600 flex items-center gap-1 text-xs"><CheckCircle className="w-3 h-3"/> Verified</span>
                ) : (
                  <span className="text-amber-500 flex items-center gap-1 text-xs"><AlertCircle className="w-3 h-3"/> Unverified</span>
                )}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="+91..."
                />
                {!phoneVerified && (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={sendingOtp}
                    className="px-4 py-2 bg-indigo-50 text-indigo-700 font-semibold rounded-xl border border-indigo-100 hover:bg-indigo-100 transition-colors whitespace-nowrap flex items-center gap-2"
                  >
                    {sendingOtp ? <Loader2 className="w-4 h-4 animate-spin" /> : <Phone className="w-4 h-4" />}
                    Verify
                  </button>
                )}
              </div>
              {!phoneVerified && !formData.phone.startsWith('+') && (
                <p className="text-[10px] text-amber-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-2.5 h-2.5" /> Include country code (+91) for SMS delivery
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Experience (Years) <span className="text-red-500">*</span></label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">Description <span className="text-red-500">*</span></label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="3"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* Address Details */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-6 border-b pb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-indigo-500" /> Address Details
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Pincode <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  type="text"
                  name="pincode"
                  value={formData.address.pincode}
                  onChange={handleAddressChange}
                  required
                  maxLength="6"
                  placeholder="Enter 6-digit pincode"
                  className="w-full px-4 py-3 pl-10 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                {fetchingPincode && (
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Street Address <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="street"
                value={formData.address.street}
                onChange={handleAddressChange}
                required
                placeholder="Flat/House No., Building, Street"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">State <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="state"
                value={formData.address.state}
                onChange={handleAddressChange}
                required
                readOnly
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 outline-none cursor-default"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">District <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="district"
                value={formData.address.district}
                onChange={handleAddressChange}
                required
                readOnly
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 outline-none cursor-default"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">City / Locality <span className="text-red-500">*</span></label>
              {cityOptions.length > 0 ? (
                <select
                  name="city"
                  value={formData.address.city}
                  onChange={handleAddressChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                >
                  {cityOptions.map(city => <option key={city} value={city}>{city}</option>)}
                </select>
              ) : (
                <input
                  type="text"
                  name="city"
                  value={formData.address.city}
                  onChange={handleAddressChange}
                  required
                  placeholder="Enter city/locality"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              Map Location <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-slate-500 mb-2">Pin your exact location to help users find you.</p>
            <LocationPicker 
              value={formData.coordinates} 
              onChange={(coords) => setFormData({...formData, coordinates: coords})}
            />
          </div>
        </div>

        {/* Global Save Button at the Bottom */}
        <div className="flex justify-end mt-8">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-70 shadow-lg hover:shadow-xl w-full md:w-auto justify-center text-lg"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
            Save & Update Profile
          </button>
        </div>
      </form>

      {/* Documents Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-6 border-b pb-4 flex items-center gap-2">
          <BadgeCheck className="w-5 h-5 text-indigo-500" /> Documents & Verification
        </h2>

        <div className="grid md:grid-cols-2 gap-8 mb-6">
          <div className="space-y-4">
            <label className="text-sm font-semibold text-slate-700 block">Profile Picture <span className="text-red-500">*</span></label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden flex-shrink-0">
                {profileDocs.profileImage ? (
                  <img src={profileDocs.profileImage.url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-8 h-8 text-slate-300" />
                )}
              </div>
              <div className="flex-1">
                <input type="file" id="profileImageInput" className="hidden" accept="image/*" onChange={(e) => handleDocumentSelect(e, 'profileImage')} />
                <label htmlFor="profileImageInput" className="cursor-pointer px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors inline-block mb-2">Choose Photo</label>
                <p className="text-xs text-slate-500">{selectedDocs.profileImage ? `Selected: ${selectedDocs.profileImage.name}` : 'No new file selected'}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-semibold text-slate-700 block">Government ID (Front & Back) <span className="text-red-500">*</span></label>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="w-12 h-12 rounded bg-white border border-slate-200 flex items-center justify-center overflow-hidden">
                  {profileDocs.governmentId?.frontImage ? <img src={profileDocs.governmentId.frontImage.url} className="w-full h-full object-cover" /> : <ImageIcon className="w-5 h-5 text-slate-300" />}
                </div>
                <div className="flex-1"><p className="text-sm font-medium">Front Side</p></div>
                <input type="file" id="frontIdInput" className="hidden" accept="image/*" onChange={(e) => handleDocumentSelect(e, 'frontImage')} />
                <label htmlFor="frontIdInput" className="cursor-pointer p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600"><UploadCloud className="w-4 h-4" /></label>
              </div>
              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="w-12 h-12 rounded bg-white border border-slate-200 flex items-center justify-center overflow-hidden">
                  {profileDocs.governmentId?.backImage ? <img src={profileDocs.governmentId.backImage.url} className="w-full h-full object-cover" /> : <ImageIcon className="w-5 h-5 text-slate-300" />}
                </div>
                <div className="flex-1"><p className="text-sm font-medium">Back Side</p></div>
                <input type="file" id="backIdInput" className="hidden" accept="image/*" onChange={(e) => handleDocumentSelect(e, 'backImage')} />
                <label htmlFor="backIdInput" className="cursor-pointer p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600"><UploadCloud className="w-4 h-4" /></label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end border-t pt-4">
          <button onClick={handleUploadDocuments} disabled={uploadingDocs || (!selectedDocs.profileImage && !selectedDocs.frontImage && !selectedDocs.backImage)} className="flex items-center gap-2 px-6 py-2.5 bg-slate-800 text-white font-medium rounded-xl hover:bg-slate-900 transition-colors disabled:opacity-50">
            {uploadingDocs ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
            Upload Documents
          </button>
        </div>
      </div>

      {/* Portfolio Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><ImageIcon className="w-5 h-5 text-indigo-500" /> Portfolio Images</h2>
          <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 font-semibold rounded-lg hover:bg-indigo-100 transition-colors">
            {uploadingPortfolio ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
            Add Images
            <input type="file" multiple accept="image/*" className="hidden" onChange={handlePortfolioUpload} disabled={uploadingPortfolio} />
          </label>
        </div>
        {portfolioImages.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
            <Camera className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No portfolio images yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {portfolioImages.map((img) => (
              <div key={img.publicId} className="group relative aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                <img src={img.url} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button onClick={() => handleDeletePortfolioImage(img.publicId)} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors transform scale-0 group-hover:scale-100 duration-200"><Trash2 className="w-5 h-5" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl relative text-center">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6"><Phone className="w-8 h-8" /></div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Verify Phone</h3>
            <p className="text-slate-500 mb-8 text-sm">Enter the 4-digit code sent to <br/><strong className="text-slate-700">{formData.phone}</strong></p>
            <input type="text" maxLength="4" value={otpValue} onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))} className="w-full text-center text-3xl tracking-widest font-bold px-4 py-4 rounded-xl border-2 border-indigo-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none mb-6" placeholder="0000" />
            <div className="flex flex-col gap-3">
              <button onClick={handleVerifyOtp} disabled={verifyingOtp || otpValue.length < 4} className="w-full py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                {verifyingOtp ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                Verify OTP
              </button>
              <button onClick={() => setShowOtpModal(false)} className="w-full py-3 text-slate-500 font-medium hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
