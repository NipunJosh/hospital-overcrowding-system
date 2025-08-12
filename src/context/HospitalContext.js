import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

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

  const deletePatient = async (patientId) => {
    try {
      const response = await fetch(`https://hospital-overcrowding-system-2.onrender.com/api/patients/${patientId}`, {
        method: 'DELETE'
      });
      
      const updatedPatients = patients.filter(p => p.id !== patientId);
      setPatients(updatedPatients);
      localStorage.setItem('hospitalPatients', JSON.stringify(updatedPatients));
      
      if (response.ok) {
        console.log('Patient deleted from database successfully');
      } else {
        console.warn('Database delete failed, removed from localStorage only');
      }
    } catch (error) {
      console.warn('Database connection failed, removed from localStorage only:', error);
      const updatedPatients = patients.filter(p => p.id !== patientId);
      setPatients(updatedPatients);
    }
  };

  const checkHourlyCapacity = (patients, newPatient) => {
    const appointmentHour = new Date(`${newPatient.date} ${newPatient.time}`).getHours();
    const sameHourPatients = patients.filter(p => {
      const patientHour = new Date(`${p.date} ${p.time}`).getHours();
      return patientHour === appointmentHour && p.date === newPatient.date;
    });
    
    // Calculate total duration for the hour
    const totalDuration = sameHourPatients.reduce((sum, p) => sum + (p.duration || 30), 0) + (newPatient.duration || 30);
    
    return {
      patientCount: sameHourPatients.length,
      totalDuration,
      exceedsLimit: sameHourPatients.length >= 3 || totalDuration > 60
    };
  };

  const addPatient = async (newPatient) => {
    // Check hourly capacity before adding
    const capacityCheck = checkHourlyCapacity(patients, newPatient);
    
    if (capacityCheck.exceedsLimit) {
      // Generate alert for capacity exceeded
      const capacityAlert = {
        id: Date.now() + Math.random(),
        severity: 'HIGH',
        message: `Hour ${newPatient.time} exceeded capacity (${capacityCheck.patientCount + 1} patients, ${capacityCheck.totalDuration} min total). Patient needs rescheduling.`,
        time: new Date().toLocaleTimeString().slice(0, 5)
      };
      setAlerts(prev => [capacityAlert, ...prev]);
      
      // Mark patient for rescheduling
      newPatient.needsRescheduling = true;
    }
    
    // Always update local state immediately for better UX
    const updatedPatients = [...patients, newPatient];
    setPatients(updatedPatients);
    localStorage.setItem('hospitalPatients', JSON.stringify(updatedPatients));
    
    // Try to save to database in background
    try {
      const response = await fetch('https://hospital-overcrowding-system-2.onrender.com/api/patients', {
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
        console.log('Patient saved to database successfully');
      } else {
        console.warn('Database save failed, using localStorage only');
      }
    } catch (error) {
      console.warn('Database connection failed, using localStorage only:', error);
    }
  };

  const reschedulePatient = async (patientId, newTime, newDate, reason) => {
    try {
      const response = await fetch(`https://hospital-overcrowding-system-2.onrender.com/api/patients/${patientId}/reschedule`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          new_time: `${newDate} ${newTime}`,
          reason: reason
        })
      });
      
      const updatedPatients = patients.map(patient => 
        patient.id === patientId 
          ? { ...patient, time: newTime, date: newDate, rescheduleReason: reason }
          : patient
      );
      setPatients(updatedPatients);
      localStorage.setItem('hospitalPatients', JSON.stringify(updatedPatients));
      
      // Generate alert for successful reschedule
      const patient = patients.find(p => p.id === patientId);
      if (patient) {
        const rescheduleAlert = {
          id: Date.now() + Math.random(),
          severity: 'MEDIUM',
          message: `${patient.name} rescheduled from ${patient.time} to ${newTime}`,
          time: new Date().toLocaleTimeString().slice(0, 5)
        };
        setAlerts(prev => [rescheduleAlert, ...prev]);
      }
      
      if (!response.ok) {
        console.error('Failed to reschedule patient in database');
      }
    } catch (error) {
      console.error('Error rescheduling patient:', error);
      // Still update locally
      const updatedPatients = patients.map(patient => 
        patient.id === patientId 
          ? { ...patient, time: newTime, date: newDate, rescheduleReason: reason }
          : patient
      );
      setPatients(updatedPatients);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getHourlyPredictions = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayPatients = patients.filter(p => p.date === today);
    
    const hourlyData = {};
    
    // First, create slots for all patient times
    todayPatients.forEach(patient => {
      const hour = parseInt(patient.time.split(':')[0]);
      const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      const displayTime = `${displayHour}:00 ${period}`;
      
      if (!hourlyData[timeSlot]) {
        hourlyData[timeSlot] = {
          time: displayTime,
          timeSlot: timeSlot,
          hour: hour,
          patients: [],
          predicted: 0,
          capacity: CAPACITY_LIMIT,
          totalDuration: 0
        };
      }
    });
    
    // Add patients to their respective time slots
    todayPatients.forEach(patient => {
      const hour = parseInt(patient.time.split(':')[0]);
      const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
      
      if (hourlyData[timeSlot]) {
        // Convert patient time to 12-hour format
        const [h, m] = patient.time.split(':');
        const patientHour = parseInt(h);
        const period = patientHour >= 12 ? 'PM' : 'AM';
        const displayHour = patientHour === 0 ? 12 : patientHour > 12 ? patientHour - 12 : patientHour;
        const displayTime = `${displayHour}:${m} ${period}`;
        
        hourlyData[timeSlot].patients.push({
          name: patient.name,
          time: displayTime,
          department: patient.dept,
          priority: patient.priority,
          duration: patient.duration || 30,
          healthCondition: patient.healthCondition
        });
        hourlyData[timeSlot].predicted = hourlyData[timeSlot].patients.length;
        hourlyData[timeSlot].totalDuration = hourlyData[timeSlot].patients.reduce((sum, p) => sum + p.duration, 0);
      }
    });

    // Sort by hour and return
    return Object.values(hourlyData).sort((a, b) => a.hour - b.hour);
  }, [patients, CAPACITY_LIMIT]);

  const [showRescheduleOptions, setShowRescheduleOptions] = useState(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checkCapacityAndShowOptions = useCallback(() => {
    const predictions = getHourlyPredictions();
    const overcrowdedSlots = predictions.filter(slot => slot.predicted > CAPACITY_LIMIT);
    const availableSlots = predictions.filter(slot => slot.predicted < CAPACITY_LIMIT);
    
    // Generate alerts for overcrowded slots
    if (overcrowdedSlots.length > 0) {
      const newAlerts = overcrowdedSlots.map(slot => ({
        id: Date.now() + Math.random(),
        severity: 'HIGH',
        message: `Capacity exceeded at ${slot.time}: ${slot.predicted}/${slot.capacity} patients`,
        time: new Date().toLocaleTimeString().slice(0, 5)
      }));
      
      setAlerts(prev => {
        // Avoid duplicate alerts for same time slot
        const existingTimes = prev.map(a => a.message.match(/at (\d{2}:\d{2})/)?.[1]).filter(Boolean);
        const uniqueAlerts = newAlerts.filter(alert => {
          const time = alert.message.match(/at (\d{2}:\d{2})/)?.[1];
          return !existingTimes.includes(time);
        });
        return [...uniqueAlerts, ...prev];
      });
    }
    
    // Show reschedule options if there are available slots
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
  }, [patients, CAPACITY_LIMIT, setAlerts, setShowRescheduleOptions, getHourlyPredictions]);

  useEffect(() => {
    const timer = setTimeout(() => {
      checkCapacityAndShowOptions();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [patients, checkCapacityAndShowOptions]);

  // Load patients from localStorage first, then try database
  useEffect(() => {
    const loadPatients = async () => {
      // Always load from localStorage first for immediate display
      const savedPatients = localStorage.getItem('hospitalPatients');
      if (savedPatients) {
        const localPatients = JSON.parse(savedPatients);
        setPatients(localPatients);
        console.log('Loaded patients from localStorage:', localPatients.length);
      }
      
      // Try to sync with database in background
      try {
        const response = await fetch('https://hospital-overcrowding-system-2.onrender.com/api/patients');
        if (response.ok) {
          const dbPatients = await response.json();
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
          
          // Only update if database has more recent data
          if (formattedPatients.length > 0) {
            setPatients(formattedPatients);
            localStorage.setItem('hospitalPatients', JSON.stringify(formattedPatients));
            console.log('Synced with database:', formattedPatients.length, 'patients');
          }
        } else {
          console.warn('Database connection failed, using localStorage only');
        }
      } catch (error) {
        console.warn('Database sync failed, using localStorage only:', error);
      }
    };
    
    loadPatients();
  }, []);

  // Auto-delete expired appointments
  useEffect(() => {
    const checkExpiredAppointments = () => {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      const today = now.toISOString().split('T')[0];
      
      patients.forEach(patient => {
        if (patient.date === today) {
          const [hours, minutes] = patient.time.split(':').map(Number);
          const appointmentTime = hours * 60 + minutes;
          const duration = patient.duration || 30; // Default 30 minutes
          const endTime = appointmentTime + duration;
          
          // Delete if appointment ended
          if (currentTime > endTime) {
            deletePatient(patient.id);
            
            // Generate alert for auto-deletion
            const deleteAlert = {
              id: Date.now() + Math.random(),
              severity: 'LOW',
              message: `${patient.name} appointment completed - auto-removed`,
              time: new Date().toLocaleTimeString().slice(0, 5)
            };
            setAlerts(prev => [deleteAlert, ...prev]);
          }
        }
      });
    };
    
    // Check every minute
    const interval = setInterval(checkExpiredAppointments, 60000);
    return () => clearInterval(interval);
  }, [patients, deletePatient, setAlerts]);

  // Save patients to localStorage whenever patients change
  useEffect(() => {
    localStorage.setItem('hospitalPatients', JSON.stringify(patients));
  }, [patients]);

  const value = {
    patients,
    alerts,
    addPatient,
    deletePatient,
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