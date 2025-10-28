import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
   await axios.post('https://crowdsolve-m96y.onrender.com/api/auth/register', form);
      navigate('/login');
    } catch (error) {
      alert('Registration Failed');
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-900'>
      <form onSubmit={handleSubmit} className='bg-gray-800 p-6 rounded-xl w-full max-w-sm'>
        <h2 className='text-2xl font-bold mb-4 text-center text-white'>Register</h2>
        <input
          className='w-full mb-3 p-2 bg-gray-700 rounded text-white'
          type='text'
          placeholder='Username'
          required
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          className='w-full mb-3 p-2 bg-gray-700 rounded text-white'
          type='email'
          placeholder='Email'
          required
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className='w-full mb-3 p-2 bg-gray-700 rounded text-white'
          type='password'
          placeholder='Password'
          required
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="px-6 py-2 w-full rounded-full text-gray-100 font-semibold bg-gradient-to-r from-purple-500 via-violet-500 to-violet-400 border border-violet-600 hover:scale-105 hover:opacity-90 shadow-md hover:shadow-lg transition-transform duration-300">Register</button>
        <p className='text-center text-sm text-gray-400 mt-4'>
          Already have an account?{' '}
          <Link to="/login" className="relative inline-block text-sm font-medium text-white hover:text-violet-300 transition-colors duration-300
             after:block after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0
             after:bg-gradient-to-r after:from-purple-400 after:to-violet-400
             hover:after:w-full after:transition-all after:duration-300">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;


