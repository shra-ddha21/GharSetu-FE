import { useState, useEffect } from 'react';
import { api } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { MapPin, Phone, Mail, Briefcase, User, CheckCircle } from 'lucide-react';

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
  const [meetingData, setMeetingData] = useState({});

  const fetchRequests = async () => {
    try {
      const { data } = await api.get('/admin/requests');
      setRequests(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleSendToProviders = async (id) => {
    try {
      await api.post(`/admin/requests/${id}/send`);
      toast.success('Request sent to providers!');
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send request');
    }
  };

  const handleScheduleMeeting = async (id) => {
    const data = meetingData[id];
    if (!data?.date || !data?.link) return toast.error('Date and link required');
    try {
      await api.post(`/admin/requests/${id}/schedule-meeting`, data);
      toast.success('Meeting scheduled!');
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to schedule');
    }
  };

  const handleComplete = async (id) => {
    try {
      await api.patch(`/admin/requests/${id}/complete`);
      toast.success('Request marked completed!');
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to complete');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Service Requests</h1>

      <div className="space-y-6">
        {requests.map(r => (
          <div key={r._id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            {/* Header */}
            <div className="flex justify-between items-start mb-5">
               <div>
                  <h3 className="font-bold text-lg text-slate-900">{r.requirement}</h3>
                  <p className="text-sm text-slate-500 mt-1">From: {r.userId?.name} ({r.userId?.email})</p>
                  <p className="text-sm text-slate-500">Pref. Date: {new Date(r.preferredDate).toLocaleDateString()}</p>
               </div>
               <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${getStatusStyle(r.status)}`}>
                 {r.status}
               </span>
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
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors"
                >
                   Send Request to Selected Providers
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
                <p className="text-sm font-semibold text-slate-700 mb-3">Schedule Meeting</p>
                <div className="flex flex-col md:flex-row gap-3">
                   <input 
                     type="datetime-local" 
                     className="px-3 py-2 border border-slate-200 rounded-lg text-sm flex-1 focus:ring-2 focus:ring-indigo-500 outline-none"
                     onChange={e => setMeetingData({...meetingData, [r._id]: {...meetingData[r._id], date: e.target.value}})}
                   />
                   <input 
                     placeholder="Meeting Link" 
                     className="px-3 py-2 border border-slate-200 rounded-lg text-sm flex-1 focus:ring-2 focus:ring-indigo-500 outline-none"
                     onChange={e => setMeetingData({...meetingData, [r._id]: {...meetingData[r._id], link: e.target.value}})}
                   />
                   <button 
                     onClick={() => handleScheduleMeeting(r._id)}
                     className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
                   >
                      Schedule Meeting
                   </button>
                </div>
              </div>
            )}

            {r.status === 'meeting-scheduled' && (
              <div className="mt-5 p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center justify-between">
                 <p className="text-indigo-800 font-medium text-sm">📅 Meeting is scheduled. Waiting for completion.</p>
                 <button 
                   onClick={() => handleComplete(r._id)}
                   className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
                 >
                   Mark as Completed
                 </button>
              </div>
            )}
          </div>
        ))}
        {requests.length === 0 && <p className="text-slate-500 text-center py-12">No requests found.</p>}
      </div>
    </div>
  );
}