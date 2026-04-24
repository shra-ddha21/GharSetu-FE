import { useState, useEffect } from 'react';
import { api } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Search() {
  const [providers, setProviders] = useState([]);
  const [serviceType, setServiceType] = useState('');
  const [location, setLocation] = useState('');
  const [selectedProviders, setSelectedProviders] = useState([]);
  
  // Request Form State
  const [requirement, setRequirement] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e?.preventDefault();
    try {
      const { data } = await api.get('/users/search', { params: { serviceType, location } });
      setProviders(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  const toggleSelection = (id) => {
    setSelectedProviders(prev => {
      if (prev.includes(id)) return prev.filter(p => p !== id);
      if (prev.length >= 5) {
        alert('You can select a maximum of 5 providers per request.');
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    if (selectedProviders.length === 0) return alert('Select at least one provider');
    
    setSubmitting(true);
    try {
      await api.post('/users/requests', {
        requirement,
        preferredDate,
        providerIds: selectedProviders
      });
      alert('Request submitted successfully!');
      navigate('/user/requests');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Search Providers</h1>
      
      <form onSubmit={handleSearch} className="flex gap-4 mb-8 bg-white p-4 rounded-xl border">
        <div className="flex-1">
          <input 
            placeholder="Service Type (e.g. Plumbing, Cleaning)" 
            className="w-full px-4 py-2 border rounded-lg"
            value={serviceType}
            onChange={e => setServiceType(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <input 
            placeholder="Location" 
            className="w-full px-4 py-2 border rounded-lg"
            value={location}
            onChange={e => setLocation(e.target.value)}
          />
        </div>
        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Search
        </button>
      </form>

      {selectedProviders.length > 0 && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center justify-between sticky top-4 z-10 shadow-sm">
           <div>
              <p className="text-green-800 font-medium">{selectedProviders.length} Provider(s) Selected</p>
              <p className="text-green-600 text-sm">You can select up to 5 providers for a single request.</p>
           </div>
           {!showForm ? (
             <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium">Continue to Request</button>
           ) : (
             <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm font-medium">Cancel Request</button>
           )}
        </div>
      )}

      {showForm && selectedProviders.length > 0 && (
        <form onSubmit={handleSubmitRequest} className="mb-8 p-6 bg-white border rounded-2xl shadow-sm">
           <h3 className="text-lg font-semibold mb-4">Complete Your Request</h3>
           <div className="space-y-4">
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Requirement</label>
               <textarea required rows={3} className="w-full px-3 py-2 border rounded-lg" value={requirement} onChange={e => setRequirement(e.target.value)} placeholder="Describe what you need help with..." />
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
               <input required type="date" className="w-full px-3 py-2 border rounded-lg" value={preferredDate} onChange={e => setPreferredDate(e.target.value)} />
             </div>
             <button disabled={submitting} type="submit" className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium">
               {submitting ? 'Submitting...' : 'Submit Request'}
             </button>
           </div>
        </form>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers.map(p => {
          const isSelected = selectedProviders.includes(p._id);
          return (
            <div key={p._id} className={`p-6 bg-white rounded-2xl border transition-all ${isSelected ? 'border-blue-500 ring-1 ring-blue-500 shadow-md' : 'hover:shadow-md'}`}>
               <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{p.businessName}</h3>
                    <p className="text-sm text-gray-500">{p.ownerName}</p>
                  </div>
                  <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">{p.serviceType}</span>
               </div>
               <div className="space-y-2 mb-6 text-sm text-gray-600">
                  <p>📍 {p.location}</p>
               </div>
               <button 
                  onClick={() => toggleSelection(p._id)}
                  className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                    isSelected ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border'
                  }`}
               >
                 {isSelected ? 'Remove Selection' : 'Select Provider'}
               </button>
            </div>
          )
        })}
        {providers.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500">
            No providers found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}