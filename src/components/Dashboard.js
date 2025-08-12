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
          <div>Total Scheduled</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{scheduleData.rescheduled || 0}</div>
          <div>Rescheduled Today</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{utilizationRate}%</div>
          <div>Capacity Utilization</div>
        </div>
      </div>
      <div style={{ marginTop: '1rem', padding: '1rem', background: '#e8f5e8', borderRadius: '4px' }}>
        <strong>Status:</strong> {utilizationRate > 85 ? '⚠️ High Load' : '✅ Normal Operations'}
      </div>
    </div>
  );
}

export default Dashboard;