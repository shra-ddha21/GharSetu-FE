import { useState, useEffect } from 'react';
import { api } from '../../contexts/AuthContext';
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data } = await api.get('/users/requests/me');
        setRequests(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">My Requests</h1>
      
      <div className="space-y-6">
        {requests.map(r => (
          <div key={r._id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            {/* Header */}
            <div className="flex justify-between items-start mb-5">
               <div>
                  <h3 className="font-bold text-lg text-slate-900">{r.requirement}</h3>
                  <p className="text-sm text-slate-500 mt-1">Preferred Date: {new Date(r.preferredDate).toLocaleDateString()}</p>
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

            {/* Meeting Info */}
            {r.meeting && (
               <div className="mt-5 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                 <h4 className="font-semibold text-indigo-900 mb-1 text-sm">📅 Meeting Scheduled</h4>
                 <p className="text-sm text-indigo-800">Date: {new Date(r.meeting.date).toLocaleString()}</p>
                 <a href={r.meeting.link} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline mt-1 inline-block font-medium">Join Meeting →</a>
               </div>
            )}
          </div>
        ))}
        {requests.length === 0 && (
           <div className="text-center py-12 text-slate-500 bg-white rounded-2xl border border-slate-200">
             You haven't made any requests yet.
           </div>
        )}
      </div>
    </div>
  );
}