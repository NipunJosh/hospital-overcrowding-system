import React from 'react';
import Dashboard from '../components/Dashboard';

function DashboardPage({ scheduleData }) {
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <Dashboard scheduleData={scheduleData} />
      
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