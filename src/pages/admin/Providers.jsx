import { useState, useEffect } from 'react';
import { api } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { MapPin, Mail, Phone, Briefcase, CheckCircle, XCircle, Clock, ShieldCheck, User } from 'lucide-react';

import Skeleton from '../../components/Skeleton';

export default function Providers() {
  const [providers, setProviders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  
  // ... (rest of the component state)
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectProviderId, setRejectProviderId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/providers', { 
        params: statusFilter ? { status: statusFilter } : {} 
      });
      setProviders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, [statusFilter]);

  const handleAction = async (id, action, reason = '') => {
    try {
      await api.patch(`/admin/providers/${id}/${action}`, { reason });
      toast.success(`Provider ${action}d successfully`);
      fetchProviders();
      if (action === 'reject') {
        setIsRejectModalOpen(false);
        setRejectReason('');
        setRejectProviderId(null);
      }
    } catch (err) {
      toast.error('Failed to update provider status');
    }
  };

  const openRejectModal = (id) => {
    setRejectProviderId(id);
    setRejectReason('');
    setIsRejectModalOpen(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full uppercase tracking-wider"><ShieldCheck className="w-3.5 h-3.5" /> Approved</span>;
      case 'rejected':
        return <span className="flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full uppercase tracking-wider"><XCircle className="w-3.5 h-3.5" /> Rejected</span>;
      case 'deactivated':
        return <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-200 text-slate-800 text-xs font-semibold rounded-full uppercase tracking-wider"><ShieldCheck className="w-3.5 h-3.5 opacity-50" /> Deactivated</span>;
      case 'pending':
        return <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full uppercase tracking-wider"><Clock className="w-3.5 h-3.5" /> Pending</span>;
      default:
        return <span className="px-3 py-1 bg-slate-100 text-slate-800 text-xs font-semibold rounded-full uppercase tracking-wider">{status}</span>;
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
           <h1 className="text-2xl font-bold text-slate-900 mb-2">Providers Management</h1>
           <p className="text-slate-500 text-sm">Review, approve, and manage service providers on the platform.</p>
        </div>
        <div className="relative min-w-[200px]">
          <select 
            className="w-full appearance-none bg-white border border-slate-200 text-slate-700 py-2.5 px-4 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm shadow-sm cursor-pointer"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">All Providers</option>
            <option value="pending">Pending Approval</option>
            <option value="approved">Approved / Active</option>
            <option value="deactivated">Deactivated / Blocked</option>
            <option value="rejected">Rejected</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          Array(5).fill(0).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex justify-between items-start">
                <div className="space-y-3 flex-1">
                  <div className="flex gap-3">
                    <Skeleton variant="title" className="w-1/3 h-6" />
                    <Skeleton className="w-24 h-6 rounded-full" />
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Skeleton variant="text" className="w-3/4" />
                    <Skeleton variant="text" className="w-3/4" />
                    <Skeleton variant="text" className="w-3/4" />
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <>
            {providers.map(p => (
              <div key={p._id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:shadow-md">
                
                {/* Info Section */}
                <div className="flex-1 grid md:grid-cols-[1fr,auto] gap-6 items-start md:items-center">
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="font-bold text-lg text-slate-900">{p.businessName}</h3>
                      {getStatusBadge(p.status)}
                    </div>
                    
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2 mt-4 text-sm text-slate-600">
                      <p className="flex items-center gap-2"><User className="w-4 h-4 text-slate-400" /> <span className="font-medium text-slate-700">{p.ownerName}</span></p>
                      <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-slate-400" /> {p.email}</p>
                      <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-slate-400" /> {p.phone}</p>
                      <p className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-slate-400" /> <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md text-xs font-semibold">{p.serviceType || 'Not specified'}</span></p>
                      <p className="flex items-center gap-2 sm:col-span-2 lg:col-span-1"><MapPin className="w-4 h-4 text-slate-400" /> {p.location}</p>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                {p.status === 'pending' && (
                  <div className="flex flex-row md:flex-col gap-2 min-w-[140px] pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-slate-100 md:pl-6">
                    <button 
                      onClick={() => handleAction(p._id, 'approve')}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
                    >
                      <CheckCircle className="w-4 h-4" /> Approve
                    </button>
                    <button 
                      onClick={() => openRejectModal(p._id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl transition-colors"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>
                )}

                {p.status === 'approved' && (
                  <div className="flex flex-row md:flex-col gap-2 min-w-[140px] pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-slate-100 md:pl-6">
                    <button 
                      onClick={() => handleAction(p._id, 'deactivate')}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-semibold rounded-xl transition-colors border border-red-100"
                    >
                      <XCircle className="w-4 h-4" /> Deactivate
                    </button>
                  </div>
                )}

                {p.status === 'deactivated' && (
                  <div className="flex flex-row md:flex-col gap-2 min-w-[140px] pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-slate-100 md:pl-6">
                    <button 
                      onClick={() => handleAction(p._id, 'reactivate')}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
                    >
                      <CheckCircle className="w-4 h-4" /> Reactivate
                    </button>
                  </div>
                )}
              </div>
            ))}
            
            {providers.length === 0 && (
              <div className="py-20 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 flex flex-col items-center">
                 <Briefcase className="w-12 h-12 text-slate-300 mb-3" />
                 <p className="text-lg font-medium text-slate-700">No providers found</p>
                 <p className="text-sm mt-1">Try changing your status filter.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Rejection Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Reject Provider</h3>
            <p className="text-sm text-slate-500 mb-4">Please provide a reason for rejecting this application. This will be sent to the provider via email.</p>
            
            <textarea
              className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              rows="4"
              placeholder="e.g. Does not meet minimum experience requirements."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            ></textarea>
            
            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => setIsRejectModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleAction(rejectProviderId, 'reject', rejectReason)}
                disabled={!rejectReason.trim()}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}