import React from 'react';
import { useHospital } from '../context/HospitalContext';

function DashboardPage() {
  const { patients } = useHospital();
  
  const scheduleData = {
    totalScheduled: patients.length,
    rescheduled: patients.filter(p => p.rescheduleReason).length,
    capacity: 240
  };

  const utilizationRate = scheduleData.capacity ? 
    ((scheduleData.totalScheduled / scheduleData.capacity) * 100).toFixed(1) : 0;

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
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
      
      <div className="card" style={{ marginTop: '2rem' }}>
        <h3>🏥 System Status</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', marginTop: '1.5rem' }}>
          <div style={{ textAlign: 'center', padding: '1.5rem', background: 'rgba(46, 204, 113, 0.1)', borderRadius: '15px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚡</div>
            <div style={{ fontWeight: 'bold', color: '#27ae60' }}>AI Engine Active</div>
            <div style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>Predicting arrivals</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1.5rem', background: 'rgba(52, 152, 219, 0.1)', borderRadius: '15px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔄</div>
            <div style={{ fontWeight: 'bold', color: '#3498db' }}>Auto-Scheduling</div>
            <div style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>Dynamic rescheduling</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;