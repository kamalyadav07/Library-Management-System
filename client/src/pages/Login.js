// client/src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const { login } = useAuth(); // Get the login function from our context
  const navigate = useNavigate();

  const { username, password } = formData;
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    const loginSuccessful = await login(username, password); // Call the login function
    if (loginSuccessful) {
      navigate('/'); // Redirect to the main library page on success
    } else {
      alert('Invalid credentials. Please try again.');
    }
  };

  return (
    <form onSubmit={onSubmit} className="auth-form">
      <h2>Login</h2>
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={username}
        onChange={onChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={password}
        onChange={onChange}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;