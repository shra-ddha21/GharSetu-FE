import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Search, FileText } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-6 h-full px-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2">
        <Link to="/user/search" className="block p-6 bg-white rounded-2xl border border-slate-100 hover:shadow-md transition-shadow group flex flex-col justify-center">
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition-colors">
             <Search className="w-6 h-6 text-indigo-600 group-hover:text-white" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-slate-800">Find a Service Provider</h3>
          <p className="text-slate-500 text-sm font-medium">Search through our vetted list of professionals by service type and location.</p>
        </Link>
        
        <Link to="/user/requests" className="block p-6 bg-white rounded-2xl border border-slate-100 hover:shadow-md transition-shadow group flex flex-col justify-center">
          <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-teal-600 transition-colors">
             <FileText className="w-6 h-6 text-teal-600 group-hover:text-white" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-slate-800">My Requests</h3>
          <p className="text-slate-500 text-sm font-medium">Track your ongoing service requests and upcoming scheduled meetings.</p>
        </Link>
      </div>
    </div>
  );
}