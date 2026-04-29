import { useState, useEffect } from 'react';
import { api } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function Providers() {
  const [providers, setProviders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchProviders = async () => {
    try {
      const { data } = await api.get('/admin/providers', { 
        params: statusFilter ? { status: statusFilter } : {} 
      });
      setProviders(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, [statusFilter]);

  const handleAction = async (id, action) => {
    try {
      await api.patch(`/admin/providers/${id}/${action}`);
      toast.success(`Provider ${action}d successfully`);
      fetchProviders();
    } catch (err) {
      toast.error('Failed to update provider status');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-end mb-6">
        <div>
           <h1 className="text-2xl font-bold text-gray-900 mb-1">Providers Management</h1>
           <p className="text-gray-500 text-sm">Review and manage service providers.</p>
        </div>
        <select 
          className="border px-3 py-2 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">All Providers</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="grid gap-4">
        {providers.map(p => (
          <div key={p._id} className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
               <div className="flex items-center gap-3 mb-1">
                 <h3 className="font-semibold text-lg">{p.businessName}</h3>
                 <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                   p.status === 'approved' ? 'bg-green-100 text-green-800' :
                   p.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                 }`}>
                   {p.status}
                 </span>
               </div>
               <p className="text-sm text-gray-500">{p.ownerName} • {p.email} • {p.phone}</p>
               <p className="text-xs text-gray-400 mt-1">Service: {p.serviceType} | Location: {p.location}</p>
            </div>
            
            {p.status === 'pending' && (
              <div className="flex gap-2">
                <button 
                  onClick={() => handleAction(p._id, 'approve')}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Approve
                </button>
                <button 
                  onClick={() => handleAction(p._id, 'reject')}
                  className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-lg transition-colors"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
        {providers.length === 0 && (
          <div className="p-8 text-center bg-white rounded-2xl border text-gray-500">
             No providers found.
          </div>
        )}
      </div>
    </div>
  );
}