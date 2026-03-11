import React from "react";
import "./StatsCard.css";
import PropTypes from 'prop-types';

function StatsCard({ title, value, icon: Icon, color }) {
    return (
        <div className="stats-card" style={{ borderLeft: `4px solid ${color}` }}>
            <div className="stats-card-content" >
                <h3>{title}</h3>
                <p className="stats-value">{value}</p>

            </div>
            <div className="stats-icon" style={{ backgroundColor: color + 20, color: color }}>
                <Icon size={24} />
            </div>
        </div>
    );
}

StatsCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    icon: PropTypes.elementType.isRequired,
    color: PropTypes.string.isRequired,
};

export default StatsCard;