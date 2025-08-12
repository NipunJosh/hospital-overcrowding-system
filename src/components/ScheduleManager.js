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
          action: 'priority_reschedule'
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
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Target Hour:</label>
        <select 
          value={selectedHour} 
          onChange={(e) => setSelectedHour(e.target.value)}
          style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
        >
          <option value="09:00">09:00 - Morning Rush</option>
          <option value="10:00">10:00 - Peak Load</option>
          <option value="11:00">11:00 - High Activity</option>
          <option value="12:00">12:00 - Lunch Hour</option>
        </select>
      </div>

      <button 
        className="btn btn-danger" 
        onClick={handleReschedule}
        disabled={isRescheduling}
        style={{ width: '100%', marginBottom: '1rem' }}
      >
        {isRescheduling ? '⏳ Rescheduling...' : '🔄 Auto-Reschedule'}
      </button>

      <div style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>
        <p>• <strong>Critical patients</strong> get earliest slots</p>
        <p>• <strong>High priority</strong> patients scheduled next</p>
        <p>• <strong>Medium/Low priority</strong> fill remaining slots</p>
        <p>• Automatically updates database</p>
      </div>
    </div>
  );
}

export default ScheduleManager;