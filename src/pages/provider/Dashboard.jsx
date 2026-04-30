import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Briefcase, FileText } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  
  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="grid md:grid-cols-2 gap-6 mt-2">
        <Link to="/provider/incoming-requests" className="block p-6 bg-white rounded-2xl border border-slate-100 hover:shadow-md transition-shadow group flex flex-col justify-center">
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition-colors">
             <Briefcase className="w-6 h-6 text-indigo-600 group-hover:text-white" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-slate-800">Incoming Requests</h3>
          <p className="text-slate-500 text-sm font-medium">Review and accept new service requests sent to you.</p>
        </Link>

        <Link to="/provider/assigned-requests" className="block p-6 bg-white rounded-2xl border border-slate-100 hover:shadow-md transition-shadow group flex flex-col justify-center">
          <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-teal-600 transition-colors">
             <FileText className="w-6 h-6 text-teal-600 group-hover:text-white" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-slate-800">Assigned Work</h3>
          <p className="text-slate-500 text-sm font-medium">View details and meeting links for your assigned jobs.</p>
        </Link>
      </div>
    </div>
  );
}