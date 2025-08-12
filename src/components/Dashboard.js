import React from 'react';

function Dashboard({ scheduleData }) {
  const utilizationRate = scheduleData.capacity ? 
    ((scheduleData.totalScheduled / scheduleData.capacity) * 100).toFixed(1) : 0;

  return (
    <div className="card">
      <h2>📊 System Overview</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{scheduleData.totalScheduled || 0}</div>
          <div className="stat-label">Total Scheduled</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{scheduleData.rescheduled || 0}</div>
          <div className="stat-label">Rescheduled Today</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{utilizationRate}%</div>
          <div className="stat-label">Capacity Utilization</div>
        </div>
      </div>
      <div style={{ 
        marginTop: '1rem', 
        padding: '1rem', 
        background: utilizationRate > 85 ? 'rgba(231, 76, 60, 0.1)' : 'rgba(46, 204, 113, 0.1)', 
        borderRadius: '15px',
        border: `2px solid ${utilizationRate > 85 ? '#e74c3c' : '#2ecc71'}`,
        textAlign: 'center'
      }}>
        <strong>Status:</strong> {utilizationRate > 85 ? '⚠️ High Load' : '✅ Normal Operations'}
      </div>
    </div>
  );
}

export default Dashboard;