import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, useAuth } from '../../contexts/AuthContext';
import { useBooking } from '../../contexts/BookingContext';
import { ArrowLeft, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreateRequest() {
  const navigate = useNavigate();
  const {
    selectedProviders,
    toggleSelection,
    clearSelection,
    requirement,
    setRequirement,
    preferredDate,
    setPreferredDate,
  } = useBooking();

  const { user } = useAuth();

  const [providerDetails, setProviderDetails] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loadingProviders, setLoadingProviders] = useState(true);

  useEffect(() => {
    if (selectedProviders.length === 0) {
      navigate('/user/search');
      return;
    }

    // Wait for user to be loaded
    if (!user) return;

    // Check if user profile is complete
    if (!user.phone || !user.address) {
      toast.error('Please complete your profile (Phone & Address) before creating a request', {
        id: 'profile-incomplete'
      });
      navigate('/user/profile');
      return;
    }

    const fetchProviders = async () => {
      try {
        const results = await Promise.all(
          selectedProviders.map((id) => api.get(`/users/providers/${id}`))
        );
        setProviderDetails(results.map((r) => r.data));
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingProviders(false);
      }
    };
    fetchProviders();
  }, [selectedProviders, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!requirement.trim()) {
      toast.error('Please describe your requirement');
      return;
    }
    if (!preferredDate) {
      toast.error('Please select a preferred date');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/users/requests', {
        requirement,
        preferredDate,
        providerIds: selectedProviders,
      });
      toast.success('Request submitted successfully!');
      clearSelection();
      navigate('/user/requests');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
      <button
        onClick={() => navigate('/user/search')}
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to Search</span>
      </button>

      <header>
        <h1 className="text-2xl font-bold text-slate-900">Create Service Request</h1>
        <p className="text-slate-500 text-sm mt-1">
          Review your selected providers and submit your request.
        </p>
      </header>

      {/* Selected Providers */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-4">
          Selected Providers ({selectedProviders.length})
        </h2>

        {loadingProviders ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
          </div>
        ) : (
          <div className="space-y-3">
            {providerDetails.map((p) => (
              <div
                key={p._id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100"
              >
                <div>
                  <p className="font-semibold text-slate-800">{p.businessName}</p>
                  <p className="text-xs text-slate-500">
                    {p.location} • {p.serviceType || p.servicesOffered?.join(', ') || 'N/A'}
                  </p>
                </div>
                <button
                  onClick={() => toggleSelection(p._id)}
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove provider"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Request Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Request Details</h2>
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">
              Detailed Requirement *
            </label>
            <textarea
              required
              rows={4}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow resize-none"
              value={requirement}
              onChange={(e) => setRequirement(e.target.value)}
              placeholder="Describe what you need help with..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">
              Preferred Date *
            </label>
            <input
              required
              type="date"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
            />
          </div>
          <button
            disabled={submitting || selectedProviders.length === 0}
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 font-semibold transition-colors flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Request'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
