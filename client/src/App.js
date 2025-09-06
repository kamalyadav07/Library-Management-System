// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Library from './pages/Library';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';

// A new component to handle the navigation logic
const Navigation = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav>
      <Link to="/">Library</Link>
      {token ? (
        <button onClick={handleLogout} className="nav-link-button">Logout</button>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <header className="App-header">
            <h1>Library Management System</h1>
            <Navigation />
          </header>
          <main>
            <Routes>
              <Route path="/" element={<Library />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;