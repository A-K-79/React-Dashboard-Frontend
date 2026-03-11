import React from "react";
import './ActivityList.css';
import { FaHistory, FaInfoCircle, FaUser, FaClock, FaGlobe } from 'react-icons/fa';

function ActivityList({ activities }) {
    if (!activities || activities.length === 0) {
        return (
            <div className="no-activities">
                <FaInfoCircle size={48} />
                <h3>No Activities</h3>
                <p>Click "Generate Sample Data" to create some activity logs.</p>
            </div>
        );
    }
    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins= Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        return date.toLocaleString();
    };

    const getActivityIcon = (action) => {
        if (action.includes('login')) return '🔐';
        if (action.includes('profile')) return '👤';
        if (action.includes('report')) return '📄';
        if (action.includes('download')) return '📥';
        if(action.includes('settings')) return '⚙️';
        return '📝';
    };

    return (
        <div className="activity-list">
        <div className="activity-stats">
            <span>Total Activities: {activities.length}</span>
        </div>
        {activities.map((activity, index) => (
            <div key={activity.id || index} className="activity-item">
            <div className="activity-icon" style={{ backgroundColor: getActivityColor(activity.action) }}>
                <span>{getActivityIcon(activity.action)}</span>
            </div>
            <div className="activity-content">
                <p className="activity-action">{activity.action}</p>
                <div className="activity-meta">
                <span className="activity-user">
                    <FaUser size={10} />
                    {activity.username || 'System'}
                </span>
                <span className="activity-time">
                    <FaClock size={10} />
                    {formatTime(activity.timestamp)}
                </span>
                {activity.ip_address && (
                    <span className="activity-ip">
                    <FaGlobe size={10} />
                    {activity.ip_address}
                    </span>
                )}
                </div>
            </div>
            </div>
        ))}
        </div>
    );
}

const getActivityColor = (action) => {
    if (action.includes('login')) return '#4caf50';
    if (action.includes('profile')) return '#2196f3';
    if (action.includes('report')) return '#ff9800';
    if (action.includes('download')) return '#9c27b0';
    if (action.includes('settings')) return '#607d8b';
    return '#1976d2';
};

export default ActivityList;