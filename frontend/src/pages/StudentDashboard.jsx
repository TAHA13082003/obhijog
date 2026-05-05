import { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const [grievances, setGrievances] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [trackId, setTrackId] = useState('');
  const [tracked, setTracked] = useState(null);
  const [form, setForm] = useState({
    title: '', description: '', category: 'result',
    urgency: 'medium', department: '', is_anonymous: false
  });

  useEffect(() => {
    API.get('/grievances/my/').then(r => setGrievances(r.data));
    API.get('/grievances/departments/').then(r => setDepartments(r.data));
  }, []);

  const submitGrievance = async (e) => {
    e.preventDefault();
    try {
      await API.post('/grievances/submit/', form);
      toast.success('Grievance submitted!');
      setShowForm(false);
      API.get('/grievances/my/').then(r => setGrievances(r.data));
    } catch { toast.error('Submission failed.'); }
  };

  const trackGrievance = async () => {
    try {
      const res = await API.get(`/grievances/track/${trackId}/`);
      setTracked(res.data);
    } catch { toast.error('Grievance not found.'); }
  };

  const statusColor = (s) => ({
    pending: 'text-yellow-400', in_progress: 'text-blue-400',
    resolved: 'text-green-400', rejected: 'text-red-400'
  }[s] || 'text-gray-400');

  return (
    <div className="min-h-screen bg-dark text-white">
      {/* Navbar */}
      <nav className="bg-gray-900 border-b border-gray-800 px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">SmartGrieve</h1>
        <div className="flex items-center gap-6">
          <span className="text-gray-400">Welcome, <span className="text-white font-semibold">{user?.username}</span></span>
          <button onClick={logout} className="text-red-400 hover:text-red-300 text-sm">Logout</button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-10">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          {[
            { label: 'Total', count: grievances.length, color: 'border-primary' },
            { label: 'Pending', count: grievances.filter(g => g.status === 'pending').length, color: 'border-yellow-500' },
            { label: 'Resolved', count: grievances.filter(g => g.status === 'resolved').length, color: 'border-green-500' },
          ].map(s => (
            <div key={s.label} className={`bg-gray-900 rounded-2xl p-6 border-l-4 ${s.color}`}>
              <div className="text-4xl font-bold">{s.count}</div>
              <div className="text-gray-400 mt-1">{s.label} Grievances</div>
            </div>
          ))}
        </div>

        {/* Track */}
        <div className="bg-gray-900 rounded-2xl p-6 mb-8 border border-gray-800">
          <h2 className="text-lg font-bold mb-4">Track Grievance</h2>
          <div className="flex gap-4">
            <input
              className="flex-1 bg-gray-800 text-white rounded-xl px-4 py-3 border border-gray-700 focus:border-primary focus:outline-none"
              placeholder="Enter Tracking ID..."
              value={trackId}
              onChange={e => setTrackId(e.target.value)}
            />
            <button onClick={trackGrievance} className="bg-primary px-6 py-3 rounded-xl font-bold hover:opacity-90">
              Track
            </button>
          </div>
          {tracked && (
            <div className="mt-4 p-4 bg-gray-800 rounded-xl">
              <div className="font-bold">{tracked.title}</div>
              <div className={`text-sm mt-1 ${statusColor(tracked.status)}`}>{tracked.status.toUpperCase()}</div>
              {tracked.admin_response && <div className="text-gray-400 text-sm mt-2">Response: {tracked.admin_response}</div>}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">My Grievances</h2>
          <button onClick={() => setShowForm(!showForm)} className="bg-primary px-6 py-3 rounded-xl font-bold hover:opacity-90">
            + Submit Grievance
          </button>
        </div>

        {/* Submit Form */}
        {showForm && (
          <div className="bg-gray-900 rounded-2xl p-8 mb-8 border border-gray-800">
            <h3 className="text-lg font-bold mb-6">New Grievance</h3>
            <form onSubmit={submitGrievance} className="space-y-4">
              <input className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 border border-gray-700 focus:border-primary focus:outline-none"
                placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
              <textarea className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 border border-gray-700 focus:border-primary focus:outline-none h-32"
                placeholder="Describe your grievance..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              <div className="grid grid-cols-3 gap-4">
                <select className="bg-gray-800 text-white rounded-xl px-4 py-3 border border-gray-700"
                  value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                  <option value="result">Result Issue</option>
                  <option value="harassment">Harassment</option>
                  <option value="facility">Facility</option>
                  <option value="administrative">Administrative</option>
                  <option value="other">Other</option>
                </select>
                <select className="bg-gray-800 text-white rounded-xl px-4 py-3 border border-gray-700"
                  value={form.urgency} onChange={e => setForm({...form, urgency: e.target.value})}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <select className="bg-gray-800 text-white rounded-xl px-4 py-3 border border-gray-700"
                  value={form.department} onChange={e => setForm({...form, department: e.target.value})}>
                  <option value="">Select Department</option>
                  {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <label className="flex items-center gap-3 text-gray-400 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-primary"
                  checked={form.is_anonymous} onChange={e => setForm({...form, is_anonymous: e.target.checked})} />
                Submit anonymously
              </label>
              <button type="submit" className="bg-primary px-8 py-3 rounded-xl font-bold hover:opacity-90">
                Submit Grievance
              </button>
            </form>
          </div>
        )}

        {/* Grievances List */}
        <div className="space-y-4">
          {grievances.map(g => (
            <div key={g.id} className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{g.title}</h3>
                  <p className="text-gray-400 text-sm mt-1">{g.description.substring(0, 100)}...</p>
                  <div className="text-xs text-gray-500 mt-2 font-mono">ID: {g.tracking_id}</div>
                </div>
                <div className="text-right">
                  <div className={`font-bold text-sm ${statusColor(g.status)}`}>{g.status.toUpperCase()}</div>
                  <div className="text-xs text-gray-500 mt-1">{g.category} · {g.urgency}</div>
                </div>
              </div>
            </div>
          ))}
          {grievances.length === 0 && (
            <div className="text-center text-gray-500 py-20">No grievances yet. Submit your first one!</div>
          )}
        </div>
      </div>
    </div>
  );
}