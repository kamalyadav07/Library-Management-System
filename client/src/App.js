// client/src/App.js (Final Version)
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import Library from './pages/Library';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard'; // Import the new dashboard
import './App.css';
import BookDetails from './pages/BookDetails';
import Profile from './pages/Profile';
import { ThemeProvider } from './context/ThemeContext'; // Import ThemeProvider
import ThemeToggler from './components/ThemeToggler';

// Component for dynamic navigation based on login state
const Navigation = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav>
      <Link to="/">Library</Link>
      {user && user.role === 'Admin' && <Link to="/dashboard">Dashboard</Link>}
      {token ? (
        <>
          <Link to="/profile">My Profile</Link> {/* <-- ADD THIS LINK */}
          <button onClick={handleLogout} className="nav-link-button">Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
};

// Main App layout and routing
function App() {
  return (
    <ThemeProvider>
    <Router>
      <AuthProvider>
        <div className="App">
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} theme="colored"/>
          <header className="App-header">
            <ThemeToggler />
            <h1>Library Management System</h1>
            <Navigation />
          </header>
          <main>
            <Routes>
              <Route path="/" element={<Library />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/books/:id" element={<BookDetails />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
    </ThemeProvider>
  );
}

export default App;