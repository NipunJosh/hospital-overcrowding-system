import React, { useState } from 'react';

function TimeSlotPicker({ value, onChange, availableSlots }) {
  const [selectedHour, setSelectedHour] = useState(9);
  const [selectedMinute, setSelectedMinute] = useState(0);

  const hours = Array.from({ length: 13 }, (_, i) => i + 9); // 9 AM to 9 PM
  const minutes = [0, 30];

  const handleHourChange = (hour) => {
    setSelectedHour(hour);
    updateTime(hour, selectedMinute);
  };

  const handleMinuteChange = (minute) => {
    setSelectedMinute(minute);
    updateTime(selectedHour, minute);
  };

  const updateTime = (hour, minute) => {
    const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    onChange(timeString);
  };

  const isSlotAvailable = (hour, minute) => {
    const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    const slot = availableSlots?.find(s => s.value === timeString);
    return slot?.available !== false;
  };

  const formatDisplayTime = (hour, minute) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
  };

  return (
    <div style={{
      background: '#f8f9fa',
      borderRadius: '15px',
      padding: '1.5rem',
      border: '1px solid #e9ecef'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2c3e50' }}>
          Select Time
        </div>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3498db', marginTop: '0.5rem' }}>
          {formatDisplayTime(selectedHour, selectedMinute)}
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#7f8c8d' }}>
          Hour
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '0.5rem'
        }}>
          {hours.map(hour => (
            <button
              key={hour}
              onClick={() => handleHourChange(hour)}
              disabled={!isSlotAvailable(hour, selectedMinute)}
              style={{
                padding: '0.75rem',
                border: 'none',
                borderRadius: '10px',
                background: selectedHour === hour ? '#3498db' : 
                           isSlotAvailable(hour, selectedMinute) ? 'white' : '#ecf0f1',
                color: selectedHour === hour ? 'white' : 
                       isSlotAvailable(hour, selectedMinute) ? '#2c3e50' : '#bdc3c7',
                cursor: isSlotAvailable(hour, selectedMinute) ? 'pointer' : 'not-allowed',
                fontWeight: selectedHour === hour ? 'bold' : 'normal',
                fontSize: '0.9rem',
                transition: 'all 0.2s ease'
              }}
            >
              {hour > 12 ? hour - 12 : hour}{hour >= 12 ? 'PM' : 'AM'}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#7f8c8d' }}>
          Minutes
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.5rem'
        }}>
          {minutes.map(minute => (
            <button
              key={minute}
              onClick={() => handleMinuteChange(minute)}
              disabled={!isSlotAvailable(selectedHour, minute)}
              style={{
                padding: '0.75rem',
                border: 'none',
                borderRadius: '10px',
                background: selectedMinute === minute ? '#27ae60' : 
                           isSlotAvailable(selectedHour, minute) ? 'white' : '#ecf0f1',
                color: selectedMinute === minute ? 'white' : 
                       isSlotAvailable(selectedHour, minute) ? '#2c3e50' : '#bdc3c7',
                cursor: isSlotAvailable(selectedHour, minute) ? 'pointer' : 'not-allowed',
                fontWeight: selectedMinute === minute ? 'bold' : 'normal',
                fontSize: '0.9rem',
                transition: 'all 0.2s ease'
              }}
            >
              :{minute.toString().padStart(2, '0')}
            </button>
          ))}
        </div>
      </div>

      <div style={{
        marginTop: '1rem',
        padding: '0.75rem',
        background: isSlotAvailable(selectedHour, selectedMinute) ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)',
        borderRadius: '8px',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: isSlotAvailable(selectedHour, selectedMinute) ? '#27ae60' : '#e74c3c'
      }}>
        {isSlotAvailable(selectedHour, selectedMinute) ? 
          '✅ Time slot available' : 
          '❌ Time slot full - select another time'
        }
      </div>
    </div>
  );
}

export default TimeSlotPicker;