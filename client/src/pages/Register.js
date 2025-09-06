import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (err) {
      console.error(err.response.data);
      alert('Error registering user.');
    }
  };

  return (
    <form onSubmit={onSubmit} className="auth-form">
      <h2>Register</h2>
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={onChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={onChange}
        required
      />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;