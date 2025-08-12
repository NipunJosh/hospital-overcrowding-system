import React, { useState } from 'react';

function ScheduleManager({ onReschedule }) {
  const [selectedHour, setSelectedHour] = useState('10:00');
  const [isRescheduling, setIsRescheduling] = useState(false);

  const handleReschedule = async () => {
    setIsRescheduling(true);
    
    // Simulate API call
    setTimeout(() => {
      onReschedule({
        hour: selectedHour,
        action: 'reschedule_non_critical',
        timestamp: new Date().toISOString()
      });
      setIsRescheduling(false);
    }, 2000);
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
        <p>• Reschedules non-critical appointments</p>
        <p>• Maintains emergency capacity</p>
        <p>• Notifies affected patients</p>
      </div>
    </div>
  );
}

export default ScheduleManager;