import React, { useState } from 'react';

function RescheduleForm({ patient, onReschedule, onClose }) {
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTime, setNewTime] = useState('09:00');
  const [reason, setReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onReschedule({
      patientId: patient.id,
      patientName: patient.name,
      oldTime: patient.time,
      newDate,
      newTime,
      reason: reason || 'Manual rescheduling based on health condition'
    });
    onClose();
  };

  const getPriorityColor = (priority) => {
    switch(priority?.toLowerCase()) {
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
        padding: '2rem',
        borderRadius: '20px',
        width: '500px'
      }}>
        <h3>🔄 Reschedule Patient</h3>
        
        <div style={{
          padding: '1rem',
          background: 'rgba(52, 152, 219, 0.1)',
          borderRadius: '10px',
          marginTop: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{patient.name}</div>
          <div style={{ fontSize: '0.9rem', color: '#7f8c8d', marginTop: '0.25rem' }}>
            {patient.dept} • Current: {patient.time}
          </div>
          <div style={{ 
            fontSize: '0.8rem', 
            color: getPriorityColor(patient.priority),
            fontWeight: 'bold',
            marginTop: '0.25rem'
          }}>
            {patient.priority} Priority
          </div>
          {patient.healthCondition && (
            <div style={{ 
              fontSize: '0.9rem', 
              marginTop: '0.5rem',
              padding: '0.5rem',
              background: 'rgba(255,255,255,0.7)',
              borderRadius: '5px'
            }}>
              <strong>Condition:</strong> {patient.healthCondition}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                New Date
              </label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '10px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                New Time
              </label>
              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '10px'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Reason for Rescheduling
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows="3"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '10px',
                resize: 'vertical'
              }}
              placeholder="Health condition improvement, emergency priority change, patient request..."
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 1 }}
            >
              Reschedule Patient
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '25px',
                background: 'white',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RescheduleForm;