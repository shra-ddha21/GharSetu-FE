import { useState, useEffect } from 'react';
import { api } from '../../contexts/AuthContext';
import { User, Mail, Calendar, Phone, Video, Info } from 'lucide-react';

const getStatusStyle = (status) => {
  switch (status) {
    case 'pending': return 'bg-amber-100 text-amber-800';
    case 'in-progress': return 'bg-blue-100 text-blue-800';
    case 'assigned': return 'bg-purple-100 text-purple-800';
    case 'meeting-scheduled': return 'bg-indigo-100 text-indigo-800';
    case 'completed': return 'bg-emerald-100 text-emerald-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    default: return 'bg-slate-100 text-slate-800';
  }
};

export default function Assigned() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
         const { data } = await api.get('/providers/requests/assigned');
         setRequests(data);
      } catch (err) {
         console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Loading assigned work...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Assigned Work</h1>

      <div className="space-y-6">
         {requests.map(r => (
           <div key={r._id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
             {/* Header */}
             <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-5">
                <div>
                   <h3 className="font-bold text-lg text-slate-900">{r.requirement}</h3>
                   <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                     <Calendar className="w-4 h-4 text-slate-400" />
                     <span>Pref. Date: {new Date(r.preferredDate).toLocaleDateString()}</span>
                   </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide w-fit ${getStatusStyle(r.status)}`}>
                  {r.status}
                </span>
             </div>

             {/* Customer Details */}
             <div className="border-t border-slate-100 pt-5">
                <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  Customer Information
                </h4>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Name</p>
                    <p className="text-sm font-medium text-slate-900">{r.userId?.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Contact</p>
                    <p className="text-sm text-slate-700 flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" /> {r.userId?.email}
                    </p>
                    {r.userId?.phone && (
                       <p className="text-sm text-slate-700 flex items-center gap-2 mt-1">
                         <Phone className="w-3.5 h-3.5 text-slate-400" /> {r.userId?.phone}
                       </p>
                    )}
                  </div>
                </div>
             </div>

             {/* Action / Status Banners */}
             {r.status === 'meeting-scheduled' && r.meeting && (
               <div className="mt-5 p-5 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                 <div>
                   <h4 className="font-semibold text-indigo-900 mb-1 flex items-center gap-2">
                     <Video className="w-4 h-4 text-indigo-600" /> Meeting Details
                   </h4>
                   <p className="text-sm text-indigo-800">Scheduled for: <span className="font-medium">{new Date(r.meeting.date).toLocaleString()}</span></p>
                 </div>
                 <a 
                   href={r.meeting.link} 
                   target="_blank" 
                   rel="noreferrer" 
                   className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors text-center shadow-sm"
                 >
                   Join Meeting Room
                 </a>
               </div>
             )}

             {r.status === 'assigned' && !r.meeting && (
               <div className="mt-5 p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-3">
                 <Info className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                 <div>
                   <p className="text-sm font-medium text-amber-900">Meeting Scheduling in Progress</p>
                   <p className="text-xs text-amber-700 mt-1">The admin is currently coordinating a meeting time between you and the customer. You will be notified here once the link is ready.</p>
                 </div>
               </div>
             )}
           </div>
         ))}
         {requests.length === 0 && !loading && (
           <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 text-slate-500 shadow-sm flex flex-col items-center">
             <Info className="w-12 h-12 text-slate-300 mb-3" />
             <p className="text-lg font-medium text-slate-700">No assigned work yet</p>
             <p className="text-sm mt-1">When you accept incoming requests, they will appear here.</p>
           </div>
         )}
      </div>
    </div>
  );
}