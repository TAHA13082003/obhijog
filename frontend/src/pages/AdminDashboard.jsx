import { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [grievances, setGrievances] = useState([]);
  const [stats, setStats] = useState({});
  const [selected, setSelected] = useState(null);
  const [response, setResponse] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchData();
    API.get('/grievances/admin/stats/').then(r => setStats(r.data));
  }, [filter]);

  const fetchData = () => {
    const url = filter ? `/grievances/admin/all/?status=${filter}` : '/grievances/admin/all/';
    API.get(url).then(r => setGrievances(r.data));
  };

  const updateStatus = async () => {
    try {
      await API.patch(`/grievances/admin/update/${selected.id}/`, {
        status: newStatus, admin_response: response
      });
      toast.success('Status updated!');
      setSelected(null);
      fetchData();
    } catch { toast.error('Update failed.'); }
  };

  const statusColor = (s) => ({
    pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    in_progress: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    resolved: 'bg-green-500/10 text-green-400 border-green-500/30',
    rejected: 'bg-red-500/10 text-red-400 border-red-500/30'
  }[s] || '');

  return (
    <div className="min-h-screen bg-dark text-white">
      <nav className="bg-gray-900 border-b border-gray-800 px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">Obhijog<span className="text-gray-400 text-sm font-normal">Admin</span></h1>
        <div className="flex items-center gap-6">
          <span className="text-gray-400">{user?.username}</span>
          <button onClick={logout} className="text-red-400 hover:text-red-300 text-sm">Logout</button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-10">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Total', val: stats.total, color: 'border-primary' },
            { label: 'Pending', val: stats.pending, color: 'border-yellow-500' },
            { label: 'In Progress', val: stats.in_progress, color: 'border-blue-500' },
            { label: 'Resolved', val: stats.resolved, color: 'border-green-500' },
          ].map(s => (
            <div key={s.label} className={`bg-gray-900 rounded-2xl p-6 border-l-4 ${s.color}`}>
              <div className="text-4xl font-bold">{s.val ?? 0}</div>
              <div className="text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex gap-3 mb-6">
          {['', 'pending', 'in_progress', 'resolved', 'rejected'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold border transition ${filter === f ? 'bg-primary text-white border-primary' : 'bg-gray-900 text-gray-400 border-gray-700 hover:border-primary'}`}>
              {f === '' ? 'All' : f.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>

        {/* Grievances Table */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 text-sm">
                <th className="text-left px-6 py-4">Title</th>
                <th className="text-left px-6 py-4">Category</th>
                <th className="text-left px-6 py-4">Urgency</th>
                <th className="text-left px-6 py-4">Status</th>
                <th className="text-left px-6 py-4">Date</th>
                <th className="text-left px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {grievances.map(g => (
                <tr key={g.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition">
                  <td className="px-6 py-4">
                    <div className="font-semibold">{g.title}</div>
                    <div className="text-xs text-gray-500 font-mono">{String(g.tracking_id).substring(0, 8)}...</div>
                  </td>
                  <td className="px-6 py-4 text-gray-400 capitalize">{g.category}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${g.urgency === 'high' ? 'bg-red-500/10 text-red-400' : g.urgency === 'medium' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-green-500/10 text-green-400'}`}>
                      {g.urgency.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusColor(g.status)}`}>
                      {g.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm">{new Date(g.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => { setSelected(g); setNewStatus(g.status); setResponse(g.admin_response || ''); }}
                      className="text-primary hover:underline text-sm">
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {selected && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-lg border border-gray-700">
              <h3 className="text-xl font-bold mb-2">{selected.title}</h3>
              <p className="text-gray-400 text-sm mb-6">{selected.description}</p>
              <div className="space-y-4">
                <select className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 border border-gray-700"
                  value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <textarea className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 border border-gray-700 h-28"
                  placeholder="Admin response..." value={response} onChange={e => setResponse(e.target.value)} />
                <div className="flex gap-4">
                  <button onClick={updateStatus} className="flex-1 bg-primary py-3 rounded-xl font-bold hover:opacity-90">
                    Update
                  </button>
                  <button onClick={() => setSelected(null)} className="flex-1 bg-gray-800 py-3 rounded-xl font-bold hover:bg-gray-700">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}