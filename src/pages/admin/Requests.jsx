import { useState, useEffect } from 'react';
import { api } from '../../contexts/AuthContext';

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
      alert('Request sent to providers!');
      fetchRequests();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send request');
    }
  };

  const handleScheduleMeeting = async (id) => {
    const data = meetingData[id];
    if (!data?.date || !data?.link) return alert('Date and link required');
    try {
      await api.post(`/admin/requests/${id}/schedule-meeting`, data);
      alert('Meeting scheduled!');
      fetchRequests();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to schedule');
    }
  };

  const handleComplete = async (id) => {
    try {
      await api.patch(`/admin/requests/${id}/complete`);
      alert('Request marked completed!');
      fetchRequests();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to complete');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Service Requests</h1>

      <div className="space-y-6">
        {requests.map(r => (
          <div key={r._id} className="bg-white p-6 rounded-2xl border shadow-sm">
            <div className="flex justify-between items-start mb-4">
               <div>
                  <h3 className="font-semibold text-lg">{r.requirement}</h3>
                  <p className="text-sm text-gray-500">From: {r.userId?.name} ({r.userId?.email})</p>
                  <p className="text-sm text-gray-500">Pref. Date: {new Date(r.preferredDate).toLocaleDateString()}</p>
               </div>
               <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide bg-gray-100`}>
                 {r.status}
               </span>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm font-medium mb-2 text-gray-700">Selected Providers:</p>
              <ul className="list-disc pl-5 text-sm text-gray-600 mb-4 space-y-1">
                {r.selectedProviders?.map((p) => (
                  <li key={p._id}>{p.businessName} ({p.ownerName})</li>
                ))}
              </ul>
              
              {r.status === 'pending' && (
                <button 
                  onClick={() => handleSendToProviders(r._id)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
                >
                   Send Request to Selected Providers
                </button>
              )}

              {r.status === 'in-progress' && (
                <p className="text-amber-600 text-sm font-medium">Waiting for providers to respond...</p>
              )}

              {r.status === 'assigned' && (
                <div className="p-4 bg-purple-50 rounded-xl mt-4">
                   <p className="text-purple-900 font-medium mb-3">Assigned to: {r.assignedProviderId?.businessName}</p>
                   <div className="flex flex-col md:flex-row gap-3">
                      <input 
                        type="datetime-local" 
                        className="px-3 py-2 border rounded-lg text-sm flex-1"
                        onChange={e => setMeetingData({...meetingData, [r._id]: {...meetingData[r._id], date: e.target.value}})}
                      />
                      <input 
                        placeholder="Meeting Link" 
                        className="px-3 py-2 border rounded-lg text-sm flex-1"
                        onChange={e => setMeetingData({...meetingData, [r._id]: {...meetingData[r._id], link: e.target.value}})}
                      />
                      <button 
                        onClick={() => handleScheduleMeeting(r._id)}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium whitespace-nowrap"
                      >
                         Schedule Meeting
                      </button>
                   </div>
                </div>
              )}

              {r.status === 'meeting-scheduled' && (
                <div className="p-4 bg-indigo-50 rounded-xl mt-4 flex items-center justify-between">
                   <p className="text-indigo-900 font-medium text-sm">Meeting is scheduled. Waiting for completion.</p>
                   <button 
                     onClick={() => handleComplete(r._id)}
                     className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium"
                   >
                     Mark as Completed
                   </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {requests.length === 0 && <p className="text-gray-500">No requests found.</p>}
      </div>
    </div>
  );
}