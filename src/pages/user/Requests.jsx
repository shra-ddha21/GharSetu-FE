import { useState, useEffect } from 'react';
import { api } from '../../contexts/AuthContext';

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

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'assigned': return 'bg-purple-100 text-purple-800';
      case 'meeting-scheduled': return 'bg-indigo-100 text-indigo-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Requests</h1>
      
      <div className="space-y-6">
        {requests.map(r => (
          <div key={r._id} className="bg-white p-6 rounded-2xl border shadow-sm">
            <div className="flex justify-between items-start mb-4">
               <div>
                  <h3 className="font-semibold text-lg">{r.requirement}</h3>
                  <p className="text-sm text-gray-500">Preferred Date: {new Date(r.preferredDate).toLocaleDateString()}</p>
               </div>
               <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${getStatusColor(r.status)}`}>
                 {r.status}
               </span>
            </div>
            
            <div className="border-t pt-4 mt-4">
               <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Providers ({r.selectedProviders?.length})</h4>
               <div className="flex flex-wrap gap-2">
                 {r.selectedProviders.map((p) => (
                   <span key={p._id} className="px-2.5 py-1 bg-gray-50 border rounded text-xs text-gray-600">
                     {p.businessName}
                   </span>
                 ))}
               </div>
            </div>

            {r.assignedProviderId && (
              <div className="mt-4 p-4 bg-purple-50 rounded-xl border border-purple-100">
                 <h4 className="font-medium text-purple-900 mb-1">Assigned Provider</h4>
                 <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-purple-800 font-medium">{r.assignedProviderId.businessName}</p>
                      <p className="text-xs text-purple-600">{r.assignedProviderId.ownerName} • {r.assignedProviderId.phone}</p>
                    </div>
                 </div>
              </div>
            )}

            {r.meeting && (
               <div className="mt-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                 <h4 className="font-medium text-indigo-900 mb-1">Meeting Scheduled</h4>
                 <p className="text-sm text-indigo-800">Date: {new Date(r.meeting.date).toLocaleString()}</p>
                 <a href={r.meeting.link} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline mt-1 inline-block">Join Meeting</a>
               </div>
            )}
          </div>
        ))}
        {requests.length === 0 && (
           <div className="text-center py-12 text-gray-500 bg-white rounded-2xl border">
             You haven't made any requests yet.
           </div>
        )}
      </div>
    </div>
  );
}