// client/src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Spinner = () => <div className="spinner"></div>;

const StatCard = ({ title, value }) => {
  return (
    <div className="stat-card">
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const config = { headers: { 'x-auth-token': token } };
        const res = await axios.get('http://localhost:5000/api/stats', config);
        setStats(res.data);
      } catch (error) {
        toast.error('Could not load dashboard stats.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchStats();
    }
  }, [token]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="dashboard-container">
      <h2>Admin Dashboard</h2>
      {stats ? (
        <div className="stats-grid">
          <StatCard title="Total Books" value={stats.totalBooks} />
          <StatCard title="Books Available" value={stats.availableBooks} />
          <StatCard title="Books Borrowed" value={stats.borrowedBooks} />
          <StatCard title="Overdue Books" value={stats.overdueBooks} />
          <StatCard title="Total Members" value={stats.totalUsers} />
        </div>
      ) : (
        <p>Could not load statistics.</p>
      )}
    </div>
  );
};

export default Dashboard;