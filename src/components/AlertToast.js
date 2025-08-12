import React, { useState, useEffect } from 'react';
import { useHospital } from '../context/HospitalContext';

function AlertToast() {
  const { alerts } = useHospital();
  const [visibleAlerts, setVisibleAlerts] = useState([]);

  useEffect(() => {
    if (alerts.length > 0 && visibleAlerts.length === 0) {
      const newAlert = alerts[0];
      // Only show HIGH and CRITICAL alerts
      if (newAlert.severity === 'HIGH' || newAlert.severity === 'CRITICAL') {
        setVisibleAlerts([{ ...newAlert, id: Date.now() + Math.random() }]);
        
        // Auto-remove after 8 seconds
        setTimeout(() => {
          setVisibleAlerts([]);
        }, 8000);
      }
    }
  }, [alerts, visibleAlerts.length]);

  const removeAlert = (alertId) => {
    setVisibleAlerts([]);
    // Show next alert after a brief delay
    setTimeout(() => {
      const nextAlert = alerts.find(a => a.severity === 'HIGH' || a.severity === 'CRITICAL');
      if (nextAlert && alerts.indexOf(nextAlert) > 0) {
        setVisibleAlerts([{ ...alerts[alerts.indexOf(nextAlert)], id: Date.now() + Math.random() }]);
      }
    }, 500);
  };

  const getSeverityColor = (severity) => {
    switch(severity?.toLowerCase()) {
      case 'critical': return '#e74c3c';
      case 'high': return '#f39c12';
      case 'medium': return '#3498db';
      case 'low': return '#27ae60';
      default: return '#7f8c8d';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      maxWidth: '400px'
    }}>
      {visibleAlerts.map((alert, index) => (
        <div
          key={alert.id}
          style={{
            background: 'white',
            border: `3px solid ${getSeverityColor(alert.severity)}`,
            borderRadius: '10px',
            padding: '1rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            animation: 'slideIn 0.3s ease-out',
            transform: `translateY(${index * -10}px)`,
            opacity: 1 - (index * 0.1)
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '0.8rem',
                fontWeight: 'bold',
                color: getSeverityColor(alert.severity),
                textTransform: 'uppercase',
                marginBottom: '0.25rem'
              }}>
                {alert.severity} ALERT
              </div>
              <div style={{ fontSize: '0.9rem', color: '#2c3e50', lineHeight: '1.4' }}>
                {alert.message}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#7f8c8d', marginTop: '0.5rem' }}>
                {alert.time}
              </div>
            </div>
            <button
              onClick={() => removeAlert(alert.id)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.2rem',
                cursor: 'pointer',
                color: '#7f8c8d',
                padding: '0',
                marginLeft: '10px'
              }}
            >
              ×
            </button>
          </div>
        </div>
      ))}
      
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default AlertToast;