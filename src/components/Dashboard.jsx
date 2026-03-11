import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import StatsCard from './StatsCard';
import ChartComponent from './ChartComponent';
import ActivityList from './ActivityList';
import './Dashboard.css';
import { FaUsers, FaUserCheck, FaDollarSign, FaUserPlus, FaSyncAlt } from 'react-icons/fa';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `${API_BASE_URL}/dashboard-summary/`,
        {
          timeout: 5000,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setSummary(response.data);
    } catch (err) {
        let errorMessage = 'Failed to fetch dashboard data.';
        if (err.code === 'ECONNABORTED') {
            errorMessage = 'Request timeout. Please check if the backend server is running.';
        } else if (err.response) {
            errorMessage = `Server error: ${err.response.status}`;
        } else if (err.request) {
            errorMessage = 'Cannot connect to backend server. Make sure it\'s running on the correct port.';
        } else {
            errorMessage = err.message;
        }
        setError(errorMessage);
    } finally {
        setLoading(false);
    }
}, []);

useEffect(() => {
    fetchDashboardData();

    // Refresh data every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
}, [fetchDashboardData]);

const handleGenerateSampleData = async () => {
    try {
        setGenerating(true);
        await axios.post(`${API_BASE_URL}/generate-sample-data/`);
        await fetchDashboardData();
        alert('Sample data generated successfully!');
    } catch (err) {
        console.error('Error generating sample data:', err);
        alert('Error generating sample data. Make sure the backend server is running.');
    } finally {
        setGenerating(false);
    }
};

const handleRefresh = () => {
    fetchDashboardData();
};

if (loading && !summary) {
    return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading dashboard...</p>
        </div>
    );
}

if (error) {
    return (
        <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h2>Error Loading Dashboard</h2>
            <p>{error}</p>
            <button onClick={handleRefresh} className="retry-btn">
                <FaSyncAlt /> Retry
            </button>
            <div className="error-help">
                <h3>Troubleshooting:</h3>
                <ul>
                    <li>Make sure the Django backend is running on port 8000</li>
                    <li>
                        Run: <code>
                            cd backend && python manage.py runserver
                        </code>
                    </li>
                    <li>
                        Check if CORS is properly configured
                    </li>
                    <li>
                        Verify the API endpoints are accessible
                    </li>
                </ul>
            </div>
        </div>
    );
}

if (!summary) {
  return (
    <div className="error-container">
      <p>No data available. Click "Generate Sample Data" to create some.</p>
      <button
        onClick={handleGenerateSampleData}
        className="generate-btn"
        disabled={generating}
      >
        {generating ? 'Generating...' : 'Generate Sample Data'}
      </button>
    </div>
  );
}

const stats = summary?.stats || {};

const statsConfig = [
  {
    title: 'Total Users',
    value: stats.total_users?.toLocaleString() || '0',
    icon: FaUsers,
    color: '#1976d2',
  },
  {
    title: 'Active Sessions',
    value: stats.active_sessions?.toLocaleString() || '0',
    icon: FaUserCheck,
    color: '#2e7d32',
  },
  {
    title: 'Revenue Today',
    value: `$${parseFloat(stats.revenue_today || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,maximumFractionDigits: 2
    })}`,
    icon: FaDollarSign,
    color: '#ed6c02',
  },
  {
    title: 'New Signups',
    value: stats.new_signups?.toLocaleString() || '0',
    icon: FaUserPlus,
    color: '#9c27b0',
  },
];

return (
  <div className="dashboard">
    <header className="dashboard-header">
      <div className="header-left">
        <h1>Analytics Dashboard</h1>
        <span className="live-badge">LIVE</span>
      </div>

      <div className="header-right">
        <button
          onClick={handleRefresh}
          className="refresh-btn"
          title="Refresh data"
        >
          <FaSyncAlt className={loading ? 'spinning' : ''} />
        </button>

        <button
          onClick={handleGenerateSampleData}
          className="generate-btn"
          disabled={generating}
        >
          {generating ? 'Generating...' : 'Generate Sample Data'}
        </button>
      </div>
    </header>


    <div className="stats-grid">
  {statsConfig.map((stat, index) => (
    <StatsCard key={index} {...stat} />
  ))}
</div>

<div className="charts-section">
  <div className="chart-container">
    <h2>Data Overview</h2>
    <ChartComponent data={summary?.chart_data || []} />
  </div>

  <div className="activities-container">
    <h2>Recent Activities</h2>
    <ActivityList activities={summary?.recent_activities || []} />
  </div>
</div>
</div>
);
}

export default Dashboard;