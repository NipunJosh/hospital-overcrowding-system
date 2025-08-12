import React, { useState, useEffect } from 'react';

function DoctorManagement({ onClose }) {
  const [doctorCounts, setDoctorCounts] = useState({
    General: 3,
    Cardiology: 2,
    Orthopedics: 2,
    Neurology: 1,
    Emergency: 5
  });

  useEffect(() => {
    const saved = localStorage.getItem('doctorCounts');
    if (saved) {
      setDoctorCounts(JSON.parse(saved));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('doctorCounts', JSON.stringify(doctorCounts));
    onClose();
    alert('Doctor counts updated successfully!');
  };

  const handleChange = (dept, count) => {
    setDoctorCounts(prev => ({
      ...prev,
      [dept]: Math.max(1, parseInt(count) || 1)
    }));
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
        <h3>👨‍⚕️ Doctor Management</h3>
        <p style={{ color: '#7f8c8d', marginBottom: '1.5rem' }}>
          Set number of doctors per department to manage patient capacity
        </p>

        {Object.entries(doctorCounts).map(([dept, count]) => (
          <div key={dept} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem',
            marginBottom: '0.5rem',
            background: 'rgba(52, 152, 219, 0.1)',
            borderRadius: '10px'
          }}>
            <div>
              <div style={{ fontWeight: 'bold' }}>{dept}</div>
              <div style={{ fontSize: '0.8rem', color: '#7f8c8d' }}>
                {count} doctor{count > 1 ? 's' : ''} = {count} patients per time slot
              </div>
            </div>
            <input
              type="number"
              min="1"
              max="10"
              value={count}
              onChange={(e) => handleChange(dept, e.target.value)}
              style={{
                width: '60px',
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '5px',
                textAlign: 'center'
              }}
            />
          </div>
        ))}

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button
            onClick={handleSave}
            className="btn btn-primary"
            style={{ flex: 1 }}
          >
            Save Changes
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

export default DoctorManagement;