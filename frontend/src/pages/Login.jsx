import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(form.username, form.password);
      toast.success('Login successful!');
      if (user.role === 'admin') navigate('/admin/dashboard');
      else navigate('/dashboard');
    } catch {
      toast.error('Invalid credentials!');
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <div className="bg-gray-900 p-10 rounded-2xl w-full max-w-md border border-gray-800">
        <h1 className="text-3xl font-bold text-white mb-2">Obhijog</h1>
        <p className="text-gray-400 mb-8">Sign in to your account</p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 border border-gray-700 focus:border-primary focus:outline-none"
            placeholder="Username"
            value={form.username}
            onChange={e => setForm({...form, username: e.target.value})}
          />
          <input
            type="password"
            className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 border border-gray-700 focus:border-primary focus:outline-none"
            placeholder="Password"
            value={form.password}
            onChange={e => setForm({...form, password: e.target.value})}
          />
          <button className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:opacity-90 transition">
            Login
          </button>
        </form>
        <p className="text-gray-400 text-center mt-6">
          No account? <a href="/register" className="text-primary">Register</a>
        </p>
      </div>
    </div>
  );
}