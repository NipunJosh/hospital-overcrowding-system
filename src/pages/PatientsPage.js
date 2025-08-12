import React, { useState } from 'react';

function PatientsPage() {
  const [patients] = useState([
    { id: 'P001', name: 'John Doe', time: '10:00', dept: 'Cardiology', priority: 'Medium', type: 'Scheduled' },
    { id: 'P002', name: 'Jane Smith', time: '11:30', dept: 'General', priority: 'Low', type: 'Scheduled' },
    { id: 'P003', name: 'Bob Wilson', time: '09:15', dept: 'Emergency', priority: 'Critical', type: 'Emergency' },
    { id: 'P004', name: 'Alice Johnson', time: '14:00', dept: 'Orthopedics', priority: 'High', type: 'Scheduled' }
  ]);

  const getPriorityColor = (priority) => {
    switch(priority.toLowerCase()) {
      case 'critical': return '#e74c3c';
      case 'high': return '#f39c12';
      case 'medium': return '#3498db';
      case 'low': return '#27ae60';
      default: return '#7f8c8d';
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="card">
        <h3>👥 Patient Management</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(52, 152, 219, 0.1)', borderRadius: '10px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3498db' }}>{patients.length}</div>
            <div style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>Total Patients</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(231, 76, 60, 0.1)', borderRadius: '10px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#e74c3c' }}>
              {patients.filter(p => p.priority === 'Critical').length}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>Critical</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(243, 156, 18, 0.1)', borderRadius: '10px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f39c12' }}>
              {patients.filter(p => p.type === 'Emergency').length}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>Emergency</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(46, 204, 113, 0.1)', borderRadius: '10px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#27ae60' }}>
              {patients.filter(p => p.type === 'Scheduled').length}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>Scheduled</div>
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h4>Patient List</h4>
          <div style={{ marginTop: '1rem' }}>
            {patients.map(patient => (
              <div key={patient.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                marginBottom: '0.5rem',
                background: 'rgba(255, 255, 255, 0.5)',
                borderRadius: '10px',
                border: `2px solid ${getPriorityColor(patient.priority)}20`
              }}>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{patient.name}</div>
                  <div style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>
                    {patient.dept} • {patient.type}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 'bold' }}>{patient.time}</div>
                  <div style={{ 
                    fontSize: '0.8rem', 
                    color: getPriorityColor(patient.priority),
                    fontWeight: 'bold'
                  }}>
                    {patient.priority} Priority
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientsPage;