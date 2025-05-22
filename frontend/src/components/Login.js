import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login({ setUser }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/login', form);
      if (res.data.success) {
        const user = res.data.user;
        setUser(user);

        // Navigate based on role
        if (user.role === 'admin') {
          navigate('/admin');
        } else if (user.role === 'employee') {
          navigate('/employee');
        } else {
          alert('Unknown role');
        }
      } else {
        alert('Invalid credentials');
      }
    } catch (err) {
      alert('Login failed');
      console.error(err);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold">Login</h2>
      <input
        className="border p-2 w-full my-2"
        placeholder="Username"
        onChange={e => setForm({ ...form, username: e.target.value })}
      />
      <input
        className="border p-2 w-full my-2"
        placeholder="Password"
        type="password"
        onChange={e => setForm({ ...form, password: e.target.value })}
      />
      <button className="bg-blue-500 text-white p-2 w-full" onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}

export default Login;
