import React, { useState } from 'react';
import AddPatientForm from '../components/AddPatientForm';
import RescheduleForm from '../components/RescheduleForm';

function PatientsPage() {
  const [patients, setPatients] = useState([
    { id: 'P001', name: 'John Doe', time: '10:00', dept: 'Cardiology', priority: 'Medium', type: 'Scheduled', healthCondition: 'Chest pain, requires ECG' },
    { id: 'P002', name: 'Jane Smith', time: '11:30', dept: 'General', priority: 'Low', type: 'Scheduled', healthCondition: 'Routine checkup' },
    { id: 'P003', name: 'Bob Wilson', time: '09:15', dept: 'Emergency', priority: 'Critical', type: 'Emergency', healthCondition: 'Severe abdominal pain' },
    { id: 'P004', name: 'Alice Johnson', time: '14:00', dept: 'Orthopedics', priority: 'High', type: 'Scheduled', healthCondition: 'Knee injury, possible surgery' }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [showRescheduleForm, setShowRescheduleForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const handleAddPatient = (newPatient) => {
    setPatients([...patients, newPatient]);
  };

  const handleReschedule = (rescheduleData) => {
    setPatients(patients.map(patient => 
      patient.id === rescheduleData.patientId 
        ? { ...patient, time: rescheduleData.newTime, date: rescheduleData.newDate }
        : patient
    ));
  };

  const handleRescheduleClick = (patient) => {
    setSelectedPatient(patient);
    setShowRescheduleForm(true);
  };

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

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
          <h4>Patient List</h4>
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddForm(true)}
          >
            + Add Patient
          </button>
        </div>
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
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{patient.name}</div>
                  <div style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>
                    {patient.dept} • {patient.type}
                  </div>
                  {patient.healthCondition && (
                    <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
                      Condition: {patient.healthCondition}
                    </div>
                  )}
                </div>
                <div style={{ textAlign: 'right', marginRight: '1rem' }}>
                  <div style={{ fontWeight: 'bold' }}>{patient.time}</div>
                  <div style={{ 
                    fontSize: '0.8rem', 
                    color: getPriorityColor(patient.priority),
                    fontWeight: 'bold'
                  }}>
                    {patient.priority} Priority
                  </div>
                </div>
                <button
                  onClick={() => handleRescheduleClick(patient)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '15px',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  Reschedule
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAddForm && (
        <AddPatientForm 
          onAddPatient={handleAddPatient}
          onClose={() => setShowAddForm(false)}
        />
      )}

      {showRescheduleForm && selectedPatient && (
        <RescheduleForm 
          patient={selectedPatient}
          onReschedule={handleReschedule}
          onClose={() => {
            setShowRescheduleForm(false);
            setSelectedPatient(null);
          }}
        />
      )}
    </div>
  );
}

export default PatientsPage;