import React, { useState } from 'react';

function RescheduleOptionsPopup({ options, onReschedule, onClose }) {
  const [selectedReschedules, setSelectedReschedules] = useState({});

  const handlePatientReschedule = (patientId, newTime) => {
    setSelectedReschedules(prev => ({
      ...prev,
      [patientId]: newTime
    }));
  };

  const handleConfirmReschedules = () => {
    Object.entries(selectedReschedules).forEach(([patientId, newTime]) => {
      const patient = options.excessPatients.find(p => p.id === patientId);
      if (patient && newTime) {
        onReschedule(
          patientId,
          newTime,
          patient.date,
          `Manual reschedule: Capacity exceeded at ${options.overcrowdedSlot.time}`
        );
      }
    });
    onClose();
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
        width: '600px',
        maxHeight: '80vh',
        overflowY: 'auto'
      }}>
        <h3>⚠️ Capacity Exceeded</h3>
        <p style={{ color: '#e74c3c', marginTop: '0.5rem' }}>
          Time slot {options.overcrowdedSlot.time} has {options.overcrowdedSlot.predicted} patients 
          (limit: {options.overcrowdedSlot.capacity})
        </p>

        <div style={{ marginTop: '1.5rem' }}>
          <h4>Patients to Reschedule:</h4>
          {options.excessPatients.map(patient => (
            <div key={patient.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem',
              marginTop: '0.5rem',
              background: 'rgba(243, 156, 18, 0.1)',
              borderRadius: '10px'
            }}>
              <div>
                <div style={{ fontWeight: 'bold' }}>{patient.name}</div>
                <div style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>
                  {patient.dept} • {patient.priority} Priority
                </div>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>
                  Current: {patient.time}
                </div>
              </div>
              <select
                value={selectedReschedules[patient.id] || ''}
                onChange={(e) => handlePatientReschedule(patient.id, e.target.value)}
                style={{
                  padding: '0.5rem',
                  borderRadius: '5px',
                  border: '1px solid #ddd'
                }}
              >
                <option value="">Select new time</option>
                {options.availableSlots.map(slot => (
                  <option key={slot.time} value={slot.time}>
                    {slot.time} ({slot.predicted}/{slot.capacity} patients)
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button
            onClick={handleConfirmReschedules}
            className="btn btn-primary"
            style={{ flex: 1 }}
            disabled={Object.keys(selectedReschedules).length === 0}
          >
            Confirm Reschedules
          </button>
          <button
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
      </div>
    </div>
  );
}

export default RescheduleOptionsPopup;