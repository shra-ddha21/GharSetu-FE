import { useState, useEffect } from 'react';
import { api } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Calendar, User, Clock, BellRing, CheckCircle, XCircle } from 'lucide-react';
import Skeleton from '../../components/Skeleton';

export default function Incoming() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const { data } = await api.get('/providers/requests/incoming');
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleRespond = async (id, action) => {
    try {
      await api.post(`/providers/requests/${id}/respond`, { action });
      toast.success(`Request ${action}ed successfully.`);
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to respond');
      fetchRequests(); // refresh in case it was locked by another provider
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-700">
        <Skeleton variant="title" className="w-64 h-8 mb-6" />
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
            <div className="space-y-3">
              <Skeleton variant="title" className="w-3/4" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton variant="text" />
                <Skeleton variant="text" />
              </div>
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-12 flex-1" />
              <Skeleton className="h-12 flex-1" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Incoming Requests</h1>
        <p className="text-slate-500 flex items-center gap-2">
          <BellRing className="w-4 h-4 text-amber-500" />
          The first provider to accept a request gets assigned to it. Act fast!
        </p>
      </div>

      <div className="space-y-6">
        {requests.map(responseObj => (
          <div key={responseObj._id} className="bg-white p-6 rounded-2xl border border-blue-100 shadow-md relative overflow-hidden transition-all hover:shadow-lg">
            {/* Left Accent Bar */}
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500"></div>
            
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pl-2">
              <div className="flex-1">
                 <h3 className="font-bold text-lg text-slate-900 mb-4">{responseObj.requestId?.requirement}</h3>
                 
                 <div className="grid sm:grid-cols-2 gap-4">
                   <div className="flex items-center gap-2.5 text-sm text-slate-700">
                     <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                       <User className="w-4 h-4 text-slate-500" />
                     </div>
                     <div>
                       <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Customer</p>
                       <p className="font-medium">{responseObj.requestId?.userId?.name}</p>
                     </div>
                   </div>

                   <div className="flex items-center gap-2.5 text-sm text-slate-700">
                     <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                       <Calendar className="w-4 h-4 text-blue-600" />
                     </div>
                     <div>
                       <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Preferred Date</p>
                       <p className="font-medium">{new Date(responseObj.requestId?.preferredDate).toLocaleDateString()}</p>
                     </div>
                   </div>
                 </div>

                 <p className="text-xs text-slate-400 mt-5 flex items-center gap-1.5">
                   <Clock className="w-3.5 h-3.5" /> Received: {new Date(responseObj.createdAt).toLocaleString()}
                 </p>
              </div>

              <div className="flex md:flex-col gap-3 min-w-[140px]">
                 <button 
                   onClick={() => handleRespond(responseObj.requestId._id, 'accept')}
                   className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
                 >
                   <CheckCircle className="w-4 h-4" /> Accept Job
                 </button>
                 <button 
                   onClick={() => handleRespond(responseObj.requestId._id, 'reject')}
                   className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl transition-colors"
                 >
                   <XCircle className="w-4 h-4" /> Decline
                 </button>
              </div>
            </div>
          </div>
        ))}
        {requests.length === 0 && !loading && (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200 border-dashed text-slate-500 flex flex-col items-center">
             <BellRing className="w-12 h-12 text-slate-300 mb-3" />
             <p className="text-lg font-medium text-slate-700">All caught up!</p>
             <p className="text-sm mt-1">There are no pending incoming requests right now.</p>
          </div>
        )}
      </div>
    </div>
  );
}