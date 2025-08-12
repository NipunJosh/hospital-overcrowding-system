import React from 'react';

function AlertPanel({ alerts }) {
  return (
    <div className="card">
      <h3>🚨 Active Alerts</h3>
      {alerts.length === 0 ? (
        <p style={{ color: '#27ae60' }}>✅ No active alerts</p>
      ) : (
        <div>
          {alerts.map(alert => (
            <div key={alert.id} className={`alert-${alert.severity.toLowerCase()}`} 
                 style={{ padding: '0.75rem', marginBottom: '0.5rem', borderRadius: '4px', background: '#fff3cd' }}>
              <div style={{ fontWeight: 'bold', color: '#856404' }}>
                {alert.severity} - {alert.time}
              </div>
              <div style={{ marginTop: '0.25rem' }}>{alert.message}</div>
            </div>
          ))}
          <button className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}>
            View All Alerts
          </button>
        </div>
      )}
    </div>
  );
}

export default AlertPanel;