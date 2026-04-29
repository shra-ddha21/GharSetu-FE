import { useState, useEffect } from 'react';
import { api } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function Incoming() {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const { data } = await api.get('/providers/requests/incoming');
      setRequests(data);
    } catch (err) {
      console.error(err);
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

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Incoming Requests</h1>
      <p className="text-gray-500 mb-8">First provider to accept a request gets assigned to it.</p>

      <div className="space-y-4">
        {requests.map(responseObj => (
          <div key={responseObj._id} className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
               <h3 className="font-semibold text-lg mb-1">{responseObj.requestId?.requirement}</h3>
               <p className="text-sm text-gray-500">Customer: {responseObj.requestId?.userId?.name}</p>
               <p className="text-sm text-gray-500">Preferred Date: {new Date(responseObj.requestId?.preferredDate).toLocaleDateString()}</p>
               <p className="text-xs text-gray-400 mt-2">Received: {new Date(responseObj.createdAt).toLocaleString()}</p>
            </div>
            <div className="flex gap-3">
               <button 
                 onClick={() => handleRespond(responseObj.requestId._id, 'accept')}
                 className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
               >
                 Accept Job
               </button>
               <button 
                 onClick={() => handleRespond(responseObj.requestId._id, 'reject')}
                 className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
               >
                 Decline
               </button>
            </div>
          </div>
        ))}
        {requests.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border text-gray-500">
             No pending incoming requests right now.
          </div>
        )}
      </div>
    </div>
  );
}