import React, { useState } from 'react';
import ScheduleManager from '../components/ScheduleManager';

function SchedulePage() {
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [rescheduledPatients, setRescheduledPatients] = useState([]);

  const handleReschedule = (data) => {
    setIsRescheduling(true);
    
    setTimeout(() => {
      const mockRescheduled = [
        { name: 'John Doe', oldTime: '10:00', newTime: '14:30', reason: 'Overcrowding prevention' },
        { name: 'Jane Smith', oldTime: '10:15', newTime: '15:00', reason: 'Overcrowding prevention' }
      ];
      setRescheduledPatients(mockRescheduled);
      setIsRescheduling(false);
    }, 3000);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <ScheduleManager onReschedule={handleReschedule} />
        
        <div className="card">
          <h3>📅 Today's Schedule</h3>
          <div style={{ marginTop: '1.5rem' }}>
            {[
              { time: '09:00', patient: 'Alice Johnson', dept: 'Cardiology', status: 'confirmed' },
              { time: '09:30', patient: 'Bob Wilson', dept: 'General', status: 'confirmed' },
              { time: '10:00', patient: 'John Doe', dept: 'Orthopedics', status: 'rescheduled' },
              { time: '10:30', patient: 'Mary Brown', dept: 'Neurology', status: 'confirmed' }
            ].map((appointment, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '1rem',
                marginBottom: '0.5rem',
                background: appointment.status === 'rescheduled' ? 'rgba(243, 156, 18, 0.1)' : 'rgba(46, 204, 113, 0.1)',
                borderRadius: '10px'
              }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{appointment.patient}</div>
                  <div style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>{appointment.dept}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 'bold' }}>{appointment.time}</div>
                  <div style={{ fontSize: '0.8rem', color: appointment.status === 'rescheduled' ? '#f39c12' : '#27ae60' }}>
                    {appointment.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isRescheduling && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '3rem',
            borderRadius: '20px',
            textAlign: 'center',
            maxWidth: '400px'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
            <h3>Rescheduling in Progress...</h3>
            <p style={{ color: '#7f8c8d', marginTop: '1rem' }}>
              AI is analyzing schedules and finding optimal time slots
            </p>
            <div style={{
              width: '100%',
              height: '4px',
              background: '#ecf0f1',
              borderRadius: '2px',
              marginTop: '2rem',
              overflow: 'hidden'
            }}>
              <div style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                animation: 'loading 2s infinite'
              }}></div>
            </div>
          </div>
        </div>
      )}

      {rescheduledPatients.length > 0 && (
        <div className="card" style={{ marginTop: '2rem' }}>
          <h3>✅ Rescheduling Complete</h3>
          <div style={{ marginTop: '1.5rem' }}>
            {rescheduledPatients.map((patient, index) => (
              <div key={index} style={{
                padding: '1rem',
                background: 'rgba(46, 204, 113, 0.1)',
                borderRadius: '10px',
                marginBottom: '0.5rem'
              }}>
                <div style={{ fontWeight: 'bold' }}>{patient.name}</div>
                <div style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>
                  Moved from {patient.oldTime} to {patient.newTime}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#27ae60', marginTop: '0.25rem' }}>
                  Reason: {patient.reason}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SchedulePage;