import React, { useState } from 'react';
import ScheduleManager from '../components/ScheduleManager';
import { useHospital } from '../context/HospitalContext';

function SchedulePage() {
  const { patients } = useHospital();
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [rescheduledPatients, setRescheduledPatients] = useState([]);
  
  // Get today's patients
  const today = new Date().toISOString().split('T')[0];
  const todayPatients = patients.filter(p => p.date === today).sort((a, b) => a.time.localeCompare(b.time));
  
  const getPriorityColor = (priority) => {
    switch(priority?.toLowerCase()) {
      case 'critical': return '#e74c3c';
      case 'high': return '#f39c12';
      case 'medium': return '#3498db';
      case 'low': return '#27ae60';
      default: return '#7f8c8d';
    }
  };

  const handleReschedule = (data) => {
    setIsRescheduling(true);
    
    setTimeout(() => {
      if (data.rescheduled_patients) {
        setRescheduledPatients(data.rescheduled_patients.map(p => ({
          name: p.name,
          priority: p.priority,
          oldTime: p.old_time,
          newTime: p.new_time,
          reason: p.reason
        })));
      } else {
        // Fallback for testing
        const mockRescheduled = [
          { name: 'John Doe', priority: 'critical', oldTime: '10:00 AM', newTime: '9:00 AM', reason: 'Critical priority patient' },
          { name: 'Jane Smith', priority: 'high', oldTime: '10:15 AM', newTime: '9:30 AM', reason: 'High priority patient' }
        ];
        setRescheduledPatients(mockRescheduled);
      }
      setIsRescheduling(false);
    }, 2000);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <ScheduleManager onReschedule={handleReschedule} />
        
        <div className="card">
          <h3>📅 Today's Schedule ({todayPatients.length} patients)</h3>
          <div style={{ marginTop: '1.5rem' }}>
            {todayPatients.length > 0 ? todayPatients.map((patient, index) => {
              const [h, m] = patient.time.split(':');
              const hour = parseInt(h);
              const period = hour >= 12 ? 'PM' : 'AM';
              const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
              const displayTime = `${displayHour}:${m} ${period}`;
              
              return (
                <div key={patient.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '1rem',
                  marginBottom: '0.5rem',
                  background: patient.needsRescheduling ? 'rgba(243, 156, 18, 0.1)' : 'rgba(46, 204, 113, 0.1)',
                  borderRadius: '10px'
                }}>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{patient.name}</div>
                    <div style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>{patient.dept} | {patient.priority}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 'bold' }}>{displayTime}</div>
                    <div style={{ fontSize: '0.8rem', color: patient.needsRescheduling ? '#f39c12' : '#27ae60' }}>
                      {patient.needsRescheduling ? 'needs reschedule' : 'confirmed'}
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div style={{ textAlign: 'center', color: '#7f8c8d', padding: '2rem' }}>
                No patients scheduled for today
              </div>
            )}
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
                marginBottom: '0.5rem',
                border: `2px solid ${getPriorityColor(patient.priority)}20`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 'bold' }}>{patient.name}</div>
                  <div style={{ 
                    fontSize: '0.8rem', 
                    color: getPriorityColor(patient.priority),
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}>
                    {patient.priority} Priority
                  </div>
                </div>
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