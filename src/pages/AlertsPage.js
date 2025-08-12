import React from 'react';
import AlertPanel from '../components/AlertPanel';
import { useHospital } from '../context/HospitalContext';

function AlertsPage() {
  const { alerts } = useHospital();
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <AlertPanel alerts={alerts} />
      
      <div className="card" style={{ marginTop: '2rem' }}>
        <h3>📋 Alert History</h3>
        <div style={{ marginTop: '1.5rem' }}>
          {[...alerts, 
            { id: 'h1', severity: 'MEDIUM', message: 'Scheduled maintenance completed', time: '08:30' },
            { id: 'h2', severity: 'HIGH', message: 'Weather alert: Heavy rain expected', time: '07:15' }
          ].map(alert => (
            <div key={alert.id} className={`alert-item alert-${alert.severity.toLowerCase()}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                    {alert.severity} Alert
                  </div>
                  <div>{alert.message}</div>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>
                  {alert.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AlertsPage;