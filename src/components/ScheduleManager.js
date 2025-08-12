import React, { useState } from 'react';

function ScheduleManager({ onReschedule }) {
  const [selectedHour, setSelectedHour] = useState('10:00');
  const [isRescheduling, setIsRescheduling] = useState(false);

  const handleReschedule = async () => {
    setIsRescheduling(true);
    
    try {
      const response = await fetch('https://hospital-overcrowding-system-2.onrender.com/api/reschedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          target_hour: selectedHour,
          action: 'priority_reschedule',
          reschedule_from_hour: selectedHour,
          existing_patients: JSON.parse(localStorage.getItem('hospitalPatients') || '[]')
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        onReschedule({
          rescheduled_patients: result.rescheduled_patients,
          message: result.message,
          count: result.rescheduled_count
        });
        console.log('Auto-reschedule successful:', result);
      } else {
        console.error('Reschedule failed:', result.error);
        alert('Rescheduling failed: ' + result.message);
      }
    } catch (error) {
      console.error('Reschedule API error:', error);
      alert('Failed to connect to rescheduling service');
    }
    
    setIsRescheduling(false);
  };

  return (
    <div className="card">
      <h3>⚡ Dynamic Rescheduling</h3>
      
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Start Rescheduling From Time:</label>
        <input
          type="time"
          value={selectedHour}
          onChange={(e) => setSelectedHour(e.target.value)}
          style={{ 
            width: '100%', 
            padding: '0.75rem', 
            borderRadius: '10px', 
            border: '1px solid #ddd',
            fontSize: '1rem'
          }}
        />
      </div>

      <button 
        className="btn btn-danger" 
        onClick={handleReschedule}
        disabled={isRescheduling}
        style={{ width: '100%', marginBottom: '1rem' }}
      >
        {isRescheduling ? '⏳ AI Rescheduling...' : '🤖 AI Priority Reschedule'}
      </button>

      <div style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>
        <p>• <strong>AI Algorithm</strong> understands medical priority</p>
        <p>• <strong>Critical patients</strong> shifted to earliest slots</p>
        <p>• <strong>High priority</strong> moved to early appointments</p>
        <p>• <strong>Low priority</strong> shifted to later time slots</p>
        <p>• Smart rescheduling with shift analytics</p>
      </div>
    </div>
  );
}

export default ScheduleManager;