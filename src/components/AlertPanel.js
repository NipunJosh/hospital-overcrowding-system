import React from 'react';

function AlertPanel({ alerts }) {
  return (
    <div className="card">
      <h3>🚨 Active Alerts</h3>
      {alerts.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem', 
          color: '#27ae60',
          background: 'rgba(46, 204, 113, 0.1)',
          borderRadius: '15px',
          border: '2px solid #2ecc71'
        }}>
          ✅ No active alerts
        </div>
      ) : (
        <div>
          {alerts.map(alert => (
            <div key={alert.id} className={`alert-item alert-${alert.severity.toLowerCase()}`}>
              <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                {alert.severity} - {alert.time}
              </div>
              <div>{alert.message}</div>
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