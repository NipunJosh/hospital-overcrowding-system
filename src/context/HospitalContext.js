import React, { createContext, useContext, useState, useEffect } from 'react';

const HospitalContext = createContext();

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error('useHospital must be used within HospitalProvider');
  }
  return context;
};

export const HospitalProvider = ({ children }) => {
  const [patients, setPatients] = useState([
    { id: 'P001', name: 'John Doe', time: '10:00', dept: 'Cardiology', priority: 'Medium', type: 'Scheduled', healthCondition: 'Chest pain, requires ECG', date: new Date().toISOString().split('T')[0] },
    { id: 'P002', name: 'Jane Smith', time: '11:30', dept: 'General', priority: 'Low', type: 'Scheduled', healthCondition: 'Routine checkup', date: new Date().toISOString().split('T')[0] },
    { id: 'P003', name: 'Bob Wilson', time: '09:15', dept: 'Emergency', priority: 'Critical', type: 'Emergency', healthCondition: 'Severe abdominal pain', date: new Date().toISOString().split('T')[0] },
    { id: 'P004', name: 'Alice Johnson', time: '14:00', dept: 'Orthopedics', priority: 'High', type: 'Scheduled', healthCondition: 'Knee injury, possible surgery', date: new Date().toISOString().split('T')[0] }
  ]);

  const [alerts, setAlerts] = useState([]);
  const CAPACITY_LIMIT = 3;

  const addPatient = (newPatient) => {
    setPatients(prev => [...prev, newPatient]);
  };

  const reschedulePatient = (patientId, newTime, newDate, reason) => {
    setPatients(prev => prev.map(patient => 
      patient.id === patientId 
        ? { ...patient, time: newTime, date: newDate, rescheduleReason: reason }
        : patient
    ));
  };

  const getHourlyPredictions = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayPatients = patients.filter(p => p.date === today);
    
    const hourlyData = {};
    
    for (let hour = 9; hour <= 17; hour++) {
      const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
      hourlyData[timeSlot] = {
        time: timeSlot,
        patients: [],
        predicted: 0,
        capacity: CAPACITY_LIMIT
      };
    }

    todayPatients.forEach(patient => {
      const hour = parseInt(patient.time.split(':')[0]);
      const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
      
      if (hourlyData[timeSlot]) {
        hourlyData[timeSlot].patients.push(patient);
        hourlyData[timeSlot].predicted = hourlyData[timeSlot].patients.length;
      }
    });

    return Object.values(hourlyData);
  };

  const autoReschedule = () => {
    const predictions = getHourlyPredictions();
    const overcrowdedSlots = predictions.filter(slot => slot.predicted > CAPACITY_LIMIT);
    const availableSlots = predictions.filter(slot => slot.predicted < CAPACITY_LIMIT);
    
    if (overcrowdedSlots.length === 0) return;

    let rescheduledCount = 0;
    const newAlerts = [];

    overcrowdedSlots.forEach(slot => {
      const excessPatients = slot.patients.slice(CAPACITY_LIMIT);
      
      excessPatients.forEach(patient => {
        if (patient.priority === 'Critical' || patient.type === 'Emergency') return;
        
        const availableSlot = availableSlots.find(s => s.predicted < CAPACITY_LIMIT);
        if (availableSlot) {
          reschedulePatient(
            patient.id, 
            availableSlot.time, 
            patient.date,
            `Auto-rescheduled: Overcrowding prevention from ${slot.time}`
          );
          
          availableSlot.predicted++;
          rescheduledCount++;
          
          newAlerts.push({
            id: Date.now() + Math.random(),
            severity: 'MEDIUM',
            message: `${patient.name} auto-rescheduled from ${slot.time} to ${availableSlot.time}`,
            time: new Date().toLocaleTimeString().slice(0, 5)
          });
        }
      });
    });

    if (rescheduledCount > 0) {
      setAlerts(prev => [...newAlerts, ...prev]);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      autoReschedule();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [patients]);

  const value = {
    patients,
    alerts,
    addPatient,
    reschedulePatient,
    getHourlyPredictions,
    setAlerts,
    CAPACITY_LIMIT
  };

  return (
    <HospitalContext.Provider value={value}>
      {children}
    </HospitalContext.Provider>
  );
};

export default HospitalContext;