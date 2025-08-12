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

  const addPatient = async (newPatient) => {
    try {
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: newPatient.id,
          name: newPatient.name,
          appointment_time: `${newPatient.date} ${newPatient.time}`,
          patient_type: newPatient.type.toLowerCase(),
          priority: newPatient.priority.toLowerCase(),
          department: newPatient.department,
          estimated_duration: newPatient.duration,
          health_condition: newPatient.healthCondition
        })
      });
      
      if (response.ok) {
        setPatients(prev => [...prev, newPatient]);
        localStorage.setItem('hospitalPatients', JSON.stringify([...patients, newPatient]));
      } else {
        console.error('Failed to save patient to database');
        // Still add to local state as fallback
        setPatients(prev => [...prev, newPatient]);
      }
    } catch (error) {
      console.error('Error saving patient:', error);
      // Fallback to local storage only
      setPatients(prev => [...prev, newPatient]);
    }
  };

  const reschedulePatient = async (patientId, newTime, newDate, reason) => {
    try {
      const response = await fetch(`/api/patients/${patientId}/reschedule`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          new_time: `${newDate} ${newTime}`,
          reason: reason
        })
      });
      
      if (response.ok) {
        const updatedPatients = patients.map(patient => 
          patient.id === patientId 
            ? { ...patient, time: newTime, date: newDate, rescheduleReason: reason }
            : patient
        );
        setPatients(updatedPatients);
        localStorage.setItem('hospitalPatients', JSON.stringify(updatedPatients));
      } else {
        console.error('Failed to reschedule patient in database');
      }
    } catch (error) {
      console.error('Error rescheduling patient:', error);
      // Fallback to local update
      setPatients(prev => prev.map(patient => 
        patient.id === patientId 
          ? { ...patient, time: newTime, date: newDate, rescheduleReason: reason }
          : patient
      ));
    }
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

  const [showRescheduleOptions, setShowRescheduleOptions] = useState(null);

  const checkCapacityAndShowOptions = () => {
    const predictions = getHourlyPredictions();
    const overcrowdedSlots = predictions.filter(slot => slot.predicted > CAPACITY_LIMIT);
    const availableSlots = predictions.filter(slot => slot.predicted < CAPACITY_LIMIT);
    
    if (overcrowdedSlots.length > 0 && availableSlots.length > 0) {
      const overcrowdedSlot = overcrowdedSlots[0];
      const excessPatients = overcrowdedSlot.patients.slice(CAPACITY_LIMIT)
        .filter(p => p.priority !== 'Critical' && p.type !== 'Emergency');
      
      if (excessPatients.length > 0) {
        setShowRescheduleOptions({
          overcrowdedSlot,
          excessPatients,
          availableSlots
        });
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      checkCapacityAndShowOptions();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [patients]);

  // Load patients from database on mount
  useEffect(() => {
    const loadPatients = async () => {
      try {
        const response = await fetch('/api/patients');
        if (response.ok) {
          const dbPatients = await response.json();
          // Convert database format to frontend format
          const formattedPatients = dbPatients.map(p => ({
            id: p.patient_id,
            name: p.name,
            time: new Date(p.appointment_time).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
            date: new Date(p.appointment_time).toISOString().split('T')[0],
            dept: p.department,
            priority: p.priority.charAt(0).toUpperCase() + p.priority.slice(1),
            type: p.patient_type.charAt(0).toUpperCase() + p.patient_type.slice(1),
            healthCondition: p.health_condition || '',
            rescheduleReason: p.reschedule_reason || ''
          }));
          setPatients(formattedPatients);
          localStorage.setItem('hospitalPatients', JSON.stringify(formattedPatients));
        } else {
          // Fallback to localStorage if API fails
          const savedPatients = localStorage.getItem('hospitalPatients');
          if (savedPatients) {
            setPatients(JSON.parse(savedPatients));
          }
        }
      } catch (error) {
        console.error('Error loading patients:', error);
        // Fallback to localStorage
        const savedPatients = localStorage.getItem('hospitalPatients');
        if (savedPatients) {
          setPatients(JSON.parse(savedPatients));
        }
      }
    };
    
    loadPatients();
  }, []);

  // Save patients to localStorage whenever patients change
  useEffect(() => {
    localStorage.setItem('hospitalPatients', JSON.stringify(patients));
  }, [patients]);

  const value = {
    patients,
    alerts,
    addPatient,
    reschedulePatient,
    getHourlyPredictions,
    setAlerts,
    CAPACITY_LIMIT,
    showRescheduleOptions,
    setShowRescheduleOptions
  };

  return (
    <HospitalContext.Provider value={value}>
      {children}
    </HospitalContext.Provider>
  );
};

export default HospitalContext;