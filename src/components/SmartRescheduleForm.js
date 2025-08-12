import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import TimeSlotPicker from './TimeSlotPicker';

function SmartRescheduleForm({ patient, onReschedule, onClose }) {
  const { patients } = useHospital();
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTime, setNewTime] = useState('09:00');
  const [reason, setReason] = useState('');

  const getDoctorCounts = () => {
    const saved = localStorage.getItem('doctorCounts');
    return saved ? JSON.parse(saved) : {
      General: 3, Cardiology: 2, Orthopedics: 2, Neurology: 1, Emergency: 5
    };
  };

  const getAvailableTimeSlots = () => {
    const doctorCounts = getDoctorCounts();
    const maxDoctors = doctorCounts[patient.department] || 1;
    const slots = [];
    
    // Generate time slots from 9 AM to 9 PM (30-minute intervals)
    for (let hour = 9; hour <= 21; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeSlot = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        // Count existing patients in this slot for same department and date
        const existingPatients = patients.filter(p => 
          p.time === timeSlot && 
          p.date === newDate && 
          p.department === patient.department &&
          p.id !== patient.id // Exclude current patient
        );
        
        const available = existingPatients.length < maxDoctors;
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        const displayTime = `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
        
        slots.push({
          value: timeSlot,
          display: displayTime,
          available,
          occupancy: `${existingPatients.length}/${maxDoctors}`
        });
      }
    }
    
    return slots;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const slots = getAvailableTimeSlots();
    const selectedSlot = slots.find(s => s.value === newTime);
    
    if (!selectedSlot?.available) {
      alert('Selected time slot is not available. Please choose another time.');
      return;
    }
    
    onReschedule({
      patientId: patient.id,
      patientName: patient.name,
      oldTime: patient.time,
      newDate,
      newTime,
      reason: reason || 'Smart rescheduling based on doctor availability'
    });
    onClose();
  };

  const availableSlots = getAvailableTimeSlots();

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
        width: '600px',
        maxHeight: '80vh',
        overflowY: 'auto'
      }}>
        <h3>🔄 Smart Reschedule</h3>
        
        <div style={{
          padding: '1rem',
          background: 'rgba(52, 152, 219, 0.1)',
          borderRadius: '10px',
          marginTop: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{patient.name}</div>
          <div style={{ fontSize: '0.9rem', color: '#7f8c8d', marginTop: '0.25rem' }}>
            {patient.department} • Current: {patient.time} • {patient.priority} Priority
          </div>
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
                Available Time Slots
              </label>
              <TimeSlotPicker 
                value={newTime}
                onChange={setNewTime}
                availableSlots={availableSlots}
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
              placeholder="Doctor availability, patient request, emergency priority..."
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

export default SmartRescheduleForm;