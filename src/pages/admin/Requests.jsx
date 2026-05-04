import { useState, useEffect } from 'react';
import { api } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { MapPin, Phone, Mail, Briefcase, User, CheckCircle, ChevronRight, Loader2 } from 'lucide-react';
import Skeleton from '../../components/Skeleton';

const getStatusStyle = (status) => {
  switch (status) {
    case 'pending': return 'bg-amber-100 text-amber-800';
    case 'in-progress': return 'bg-blue-100 text-blue-800';
    case 'assigned': return 'bg-purple-100 text-purple-800';
    case 'meeting-scheduled': return 'bg-indigo-100 text-indigo-800';
    case 'completed': return 'bg-emerald-100 text-emerald-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [meetingData, setMeetingData] = useState({});
  const [processingId, setProcessingId] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/requests', {
        params: statusFilter ? { status: statusFilter } : {}
      });
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  const handleSendToProviders = async (id) => {
    setProcessingId(id);
    try {
      await api.post(`/admin/requests/${id}/send`);
      toast.success('Request sent to providers!');
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send request');
    } finally {
      setProcessingId(null);
    }
  };

  const handleScheduleMeeting = async (id) => {
    const data = meetingData[id];
    if (!data?.date || !data?.link) return toast.error('Date and link required');
    setProcessingId(id);
    try {
      await api.post(`/admin/requests/${id}/schedule-meeting`, data);
      toast.success('Meeting scheduled!');
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to schedule');
    } finally {
      setProcessingId(null);
    }
  };

  const handleComplete = async (id) => {
    setProcessingId(id);
    try {
      await api.patch(`/admin/requests/${id}/complete`);
      toast.success('Request marked completed!');
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to complete');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Service Requests</h1>
          <p className="text-slate-500 text-sm">Review, assign, and manage customer service requests.</p>
        </div>
        <div className="relative min-w-[200px]">
          <select 
            className="w-full appearance-none bg-white border border-slate-200 text-slate-700 py-2.5 px-4 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm shadow-sm cursor-pointer"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">All Requests</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In-Progress</option>
            <option value="assigned">Assigned</option>
            <option value="meeting-scheduled">Meeting Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
               <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <Skeleton variant="title" className="w-1/3 h-6" />
                    <Skeleton variant="text" className="w-1/4" />
                  </div>
                  <Skeleton className="w-24 h-6 rounded-full" />
               </div>
               <div className="flex gap-4 p-4 bg-slate-50 rounded-2xl">
                  <Skeleton className="h-8 flex-1" />
                  <Skeleton className="h-8 flex-1" />
                  <Skeleton className="h-8 flex-1" />
               </div>
               <div className="space-y-3 pt-4">
                  <Skeleton variant="text" className="w-1/4" />
                  <div className="grid grid-cols-3 gap-3">
                    <Skeleton className="h-20 rounded-xl" />
                    <Skeleton className="h-20 rounded-xl" />
                    <Skeleton className="h-20 rounded-xl" />
                  </div>
               </div>
            </div>
          ))
        ) : (
          <>
            {requests.map(r => (
          <div key={r._id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            {/* Header & Status */}
            <div className="flex justify-between items-start mb-4">
               <div>
                  <h3 className="font-extrabold text-xl text-slate-900 tracking-tight">{r.requirement}</h3>
                  <div className="flex items-center gap-2 mt-1 text-slate-500">
                    <CheckCircle className="w-4 h-4 text-indigo-500" />
                    <span className="text-sm font-medium">Preferred Date: {new Date(r.preferredDate).toLocaleDateString()}</span>
                  </div>
               </div>
               <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${getStatusStyle(r.status)}`}>
                 {r.status}
               </span>
            </div>

            {/* Customer Details Row */}
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
               <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm border border-slate-100">
                    <User className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-slate-400 leading-none mb-1">Customer</span>
                    <span className="text-sm font-bold text-slate-800 leading-none">{r.userId?.name}</span>
                  </div>
               </div>

               <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm border border-slate-100">
                    <Mail className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-slate-400 leading-none mb-1">Email Address</span>
                    <span className="text-sm font-medium text-slate-600 leading-none">{r.userId?.email}</span>
                  </div>
               </div>

               <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm border border-slate-100">
                    <Phone className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-slate-400 leading-none mb-1">Mobile Number</span>
                    <span className="text-sm font-medium text-slate-600 leading-none">{r.userId?.phone || 'Not provided'}</span>
                  </div>
               </div>

               <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm border border-slate-100">
                    <MapPin className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-slate-400 leading-none mb-1">Address</span>
                    <span className="text-sm font-medium text-slate-600 leading-none">{r.userId?.address || 'Not provided'}</span>
                  </div>
               </div>
            </div>

            {/* Selected Providers */}
            <div className="border-t border-slate-100 pt-5">
              <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-slate-400" />
                Selected Providers ({r.selectedProviders?.length || 0})
              </h4>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {r.selectedProviders?.map((p) => (
                  <div key={p._id} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="font-semibold text-sm text-slate-800">{p.businessName}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{p.ownerName}</p>
                    <div className="flex items-center gap-1 mt-1.5 text-xs text-slate-500">
                      <MapPin className="w-3 h-3" /> {p.location || 'N/A'}
                    </div>
                    <span className="inline-block mt-1.5 px-2 py-0.5 bg-slate-200 text-slate-600 text-[10px] font-medium rounded-full">
                      {p.serviceType || 'N/A'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Assigned Provider — Always visible when exists */}
            {r.assignedProviderId && (
              <div className="mt-5 p-5 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
                <h4 className="text-sm font-semibold text-purple-800 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-600" />
                  Assigned Provider
                </h4>
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="w-12 h-12 bg-purple-200 rounded-xl flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-purple-700" />
                  </div>
                  <div className="flex-1 grid sm:grid-cols-2 gap-x-6 gap-y-2">
                    <div>
                      <p className="font-bold text-purple-900">{r.assignedProviderId.businessName}</p>
                      <p className="text-sm text-purple-700">{r.assignedProviderId.ownerName}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-purple-700 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5" /> {r.assignedProviderId.phone || 'N/A'}
                      </p>
                      <p className="text-sm text-purple-700 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" /> {r.assignedProviderId.email || 'N/A'}
                      </p>
                    </div>
                    <p className="text-sm text-purple-700 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" /> {r.assignedProviderId.location || 'N/A'}
                    </p>
                    <span className="inline-block w-fit px-2.5 py-0.5 bg-purple-200 text-purple-800 text-xs font-medium rounded-full">
                      {r.assignedProviderId.serviceType || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Blocks — Status-specific */}
            {r.status === 'pending' && (
              <div className="mt-5 pt-4 border-t border-slate-100">
                <button 
                  onClick={() => handleSendToProviders(r._id)}
                  disabled={processingId === r._id}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all active:scale-[0.98] shadow-lg shadow-indigo-200 disabled:opacity-70 flex items-center gap-2"
                >
                  {processingId === r._id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  {processingId === r._id ? 'Sending...' : 'Send Request to Selected Providers'}
                </button>
              </div>
            )}

            {r.status === 'in-progress' && (
              <div className="mt-5 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-blue-700 text-sm font-medium">⏳ Waiting for providers to respond...</p>
              </div>
            )}

            {r.status === 'assigned' && (
              <div className="mt-5 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-sm font-bold text-slate-700 mb-3">Schedule Meeting</p>
                <div className="flex flex-col md:flex-row gap-3">
                   <input 
                     type="datetime-local" 
                     className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm flex-1 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                     onChange={e => setMeetingData({...meetingData, [r._id]: {...meetingData[r._id], date: e.target.value}})}
                   />
                   <input 
                     placeholder="Meeting Link (Zoom, Google Meet, etc.)" 
                     className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm flex-1 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                     onChange={e => setMeetingData({...meetingData, [r._id]: {...meetingData[r._id], link: e.target.value}})}
                   />
                   <button 
                     onClick={() => handleScheduleMeeting(r._id)}
                     disabled={processingId === r._id}
                     className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-bold whitespace-nowrap transition-all active:scale-[0.98] shadow-lg shadow-purple-200 disabled:opacity-70 flex items-center justify-center gap-2"
                   >
                     {processingId === r._id ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                     {processingId === r._id ? 'Scheduling...' : 'Schedule Meeting'}
                   </button>
                </div>
              </div>
            )}

            {r.status === 'meeting-scheduled' && (
              <div className="mt-5 p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                 <p className="text-indigo-800 font-bold text-sm">📅 Meeting is scheduled. Waiting for completion.</p>
                 <button 
                   onClick={() => handleComplete(r._id)}
                   disabled={processingId === r._id}
                   className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-all active:scale-[0.98] shadow-lg shadow-emerald-200 disabled:opacity-70 flex items-center justify-center gap-2"
                 >
                   {processingId === r._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                   {processingId === r._id ? 'Completing...' : 'Mark as Completed'}
                 </button>
              </div>
            )}
          </div>
        ))}
        {requests.length === 0 && (
          <div className="py-20 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 flex flex-col items-center">
             <Briefcase className="w-12 h-12 text-slate-300 mb-3" />
             <p className="text-lg font-medium text-slate-700">No requests found</p>
             <p className="text-sm mt-1">Try changing your status filter.</p>
          </div>
        )}
      </>
    )}
  </div>
</div>
  );
}