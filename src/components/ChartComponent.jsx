import React, { useState } from 'react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
const COLORS = ['#1976d2', '2e7d32', '#ed6c02', '#9c27b0', '#d32f2f', '#0288d1', '#388e3c', '#f57c00'];

const CHART_TYPES = [
    { id: 'line', name: 'Line Chart', icon: '📈' },
    { id: 'bar', name: 'Bar Chart', icon: '📊' },
    { id: 'pie', name: 'Pie Chart', icon: '🥧' },
];

function ChartComponent({ data }) {
    const [chartType, setChartType] = useState('line');

    if (!data || data.length === 0) {
        return (
            <div className="no-data">
                <div className="no-data-icon">📊</div>
                <h3>No Chart Data available</h3>
                <p>Click "Generate Sample Data" to create some visualization data.</p>
            </div>
        );
    }

    // Process data for different chart types
    const processedData = data.slice(0, 10).map(item => ({
        ...item,
        name: item.label || `Point ${item.id}`,
        value: item.value || 0,
    }));

    // Group data by category for pie chart
    const categoryData = data.reduce((acc, item) => {
        const category = item.category || 'Uncategorized';
        if(!acc[category]) {
            acc[category] = { name: category, value: 0 };
        }
        acc[category].value += item.value || 0;
        return acc;
    }, {});
    const pieData = Object.values(categoryData);

    const renderChart = () => {
        switch (chartType) {
            case 'bar':
                return (
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                            <XAxis dataKey="name" tick={{ fill: '#666' }}/>
                            <YAxis tick={{ fill: '#666' }}/>
                            <Tooltip
                                contentStyle={{ 
                                    backgroundColor: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                }}
                            />
                            <Legend />
                            <Bar dataKey="value" fill="#1976d2" radius={[4, 4, 0, 0]}>
                                {processedData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                );
            case 'pie':
                return (
                    <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                labelLine={true}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={120}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                            formatter={(value) => value.toFixed(2)}
                                contentStyle={{ 
                                    backgroundColor: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                );
            default: // line chart
                return (
                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                            <XAxis dataKey="name" tick={{ fill: '#666' }}/>
                            <YAxis tick={{ fill: '#666' }}/>
                            <Tooltip
                                contentStyle={{ 
                                    backgroundColor: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#1976d2"
                                strokeWidth={2}
                                dot={{ fill: '#1976d2', strokeWidth: 2 }}
                                activeDot={{ r: 8 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                );
        }
    };

    return (
        <div className="chart-wrapper">
            <div className="chart-controls">
                {CHART_TYPES.map(type => (
                    <button
                    key={type.id}
                    className={`chart-type-btn ${chartType === type.id ? 'active' : ''}`}
                    onClick={() => setChartType(type.id)}
                    >
                        <span className="chart-icon">{type.icon}</span>
                        {type.name}
                    </button>
                ))}
            </div>

            <div className="chart-container">
                {renderChart()}
            </div>

            <div className='chart-stats'>
                <div className='stat-item'>
                    <span className='stat-label'>Total Data Points:</span>
                    <span className='stat-value'>{data.length}</span>
                </div>
                <div className='stat-item'>
                    <span className='stat-label'>Categories:</span>
                    <span className='stat-value'>{Object.keys(categoryData).length}</span>
                </div>

                <div className='stat-item'>
                    <span className='stat-label'>Total Value:</span>
                    <span className='stat-value'>
                        {data.reduce((sum, item) => sum + (item.value || 0), 0).toFixed(2)}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default ChartComponent;