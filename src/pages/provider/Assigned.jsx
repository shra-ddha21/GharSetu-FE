import { useState, useEffect } from 'react';
import { api } from '../../contexts/AuthContext';

export default function Assigned() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
         const { data } = await api.get('/providers/requests/assigned');
         setRequests(data);
      } catch (err) {
         console.error(err);
      }
    };
    fetchRequests();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Assigned Work</h1>

      <div className="space-y-4">
         {requests.map(r => (
           <div key={r._id} className="bg-white p-6 rounded-2xl border shadow-sm">
             <div className="flex justify-between items-start mb-4">
                <div>
                   <h3 className="font-semibold text-lg">{r.requirement}</h3>
                   <p className="text-sm text-gray-500">Customer: {r.userId?.name} ({r.userId?.email})</p>
                   <p className="text-sm text-gray-500">Preferred Date: {new Date(r.preferredDate).toLocaleDateString()}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide bg-blue-100 text-blue-800">
                  {r.status}
                </span>
             </div>

             {r.status === 'meeting-scheduled' && r.meeting && (
               <div className="mt-4 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                 <h4 className="font-semibold text-indigo-900 mb-1">Meeting Details</h4>
                 <p className="text-sm text-indigo-800">Date: {new Date(r.meeting.date).toLocaleString()}</p>
                 <a href={r.meeting.link} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-700 font-medium text-sm inline-block mt-2">
                   Join Meeting Room
                 </a>
               </div>
             )}

             {r.status === 'assigned' && !r.meeting && (
               <p className="mt-4 text-sm text-amber-600 font-medium bg-amber-50 p-3 rounded-lg">
                 Admin is currently scheduling a meeting for this request. Please check back later.
               </p>
             )}
           </div>
         ))}
         {requests.length === 0 && (
           <div className="text-center py-12 bg-white rounded-2xl border text-gray-500">
             You don't have any assigned work.
           </div>
         )}
      </div>
    </div>
  );
}