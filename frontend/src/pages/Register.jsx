import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { toast } from 'react-toastify';

export default function Register() {
  const [form, setForm] = useState({
    username: '', email: '', password: '', password2: '',
    student_id: '', department: '', phone: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register/', { ...form, role: 'student' });
      toast.success('Registered! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error('Registration failed. Check your inputs.');
    }
  };

  const fields = [
    { key: 'username', placeholder: 'Username' },
    { key: 'email', placeholder: 'Email', type: 'email' },
    { key: 'student_id', placeholder: 'Student ID' },
    { key: 'department', placeholder: 'Department' },
    { key: 'phone', placeholder: 'Phone Number' },
    { key: 'password', placeholder: 'Password', type: 'password' },
    { key: 'password2', placeholder: 'Confirm Password', type: 'password' },
  ];

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center py-10">
      <div className="bg-gray-900 p-10 rounded-2xl w-full max-w-md border border-gray-800">
        <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
        <p className="text-gray-400 mb-8">Join Obhijog</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map(f => (
            <input
              key={f.key}
              type={f.type || 'text'}
              className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 border border-gray-700 focus:border-primary focus:outline-none"
              placeholder={f.placeholder}
              value={form[f.key]}
              onChange={e => setForm({...form, [f.key]: e.target.value})}
            />
          ))}
          <button className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:opacity-90 transition">
            Register
          </button>
        </form>
        <p className="text-gray-400 text-center mt-6">
          Have account? <a href="/login" className="text-primary">Login</a>
        </p>
      </div>
    </div>
  );
}