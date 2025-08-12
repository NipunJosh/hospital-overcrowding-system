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

  const getDoctorCounts = () => {
    const saved = localStorage.getItem('doctorCounts');
    return saved ? JSON.parse(saved) : {
      General: 3,
      Cardiology: 2,
      Orthopedics: 2,
      Neurology: 1,
      Emergency: 5
    };
  };

  const checkTimeSlotCapacity = (patients, newPatient) => {
    const doctorCounts = getDoctorCounts();
    const maxDoctors = doctorCounts[newPatient.department] || 1;
    
    // Check if it's after 12 AM and not emergency
    const appointmentHour = parseInt(newPatient.time.split(':')[0]);
    if (appointmentHour >= 0 && appointmentHour < 9 && newPatient.type !== 'Emergency') {
      return {
        exceedsLimit: true,
        reason: 'Only emergency cases allowed after 12 AM'
      };
    }
    
    // Calculate time slot end time based on patient durations
    const [newHour, newMinute] = newPatient.time.split(':').map(Number);
    const newStartTime = newHour * 60 + newMinute;
    const newEndTime = newStartTime + (newPatient.duration || 30);
    
    // Find overlapping patients in same department
    const overlappingPatients = patients.filter(p => {
      if (p.date !== newPatient.date || p.department !== newPatient.department) return false;
      
      const [pHour, pMinute] = p.time.split(':').map(Number);
      const pStartTime = pHour * 60 + pMinute;
      const pEndTime = pStartTime + (p.duration || 30);
      
      // Check if time slots overlap
      return (newStartTime < pEndTime && newEndTime > pStartTime);
    });
    
    return {
      patientCount: overlappingPatients.length,
      maxCapacity: maxDoctors,
      exceedsLimit: overlappingPatients.length >= maxDoctors,
      reason: overlappingPatients.length >= maxDoctors ? 
        `Department ${newPatient.department} full - ${overlappingPatients.length}/${maxDoctors} doctors busy during ${newPatient.time}` : null
    };
  };

  const addPatient = async (newPatient) => {
    // Check if appointment is in the past
    const now = new Date();
    const appointmentDateTime = new Date(`${newPatient.date} ${newPatient.time}`);
    
    if (appointmentDateTime < now) {
      const pastAlert = {
        id: Date.now() + Math.random(),
        severity: 'HIGH',
        message: `Cannot schedule appointment in the past. Selected time: ${newPatient.time}`,
        time: new Date().toLocaleTimeString().slice(0, 5)
      };
      setAlerts(prev => [pastAlert, ...prev]);
      return; // Don't add the patient
    }
    
    // Check time slot capacity before adding
    const capacityCheck = checkTimeSlotCapacity(patients, newPatient);
    
    if (capacityCheck.exceedsLimit) {
      // Generate alert for capacity exceeded
      const capacityAlert = {
        id: Date.now() + Math.random(),
        severity: 'HIGH',
        message: capacityCheck.reason || `Time slot ${newPatient.time} full for ${newPatient.department}`,
        time: new Date().toLocaleTimeString().slice(0, 5)
      };
      setAlerts(prev => [capacityAlert, ...prev]);
      
      // If after 12 AM and not emergency, reschedule to tomorrow
      const appointmentHour = parseInt(newPatient.time.split(':')[0]);
      if (appointmentHour >= 0 && appointmentHour < 9 && newPatient.type !== 'Emergency') {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        newPatient.date = tomorrow.toISOString().split('T')[0];
        newPatient.time = '09:00';
        newPatient.rescheduleReason = 'Rescheduled to tomorrow - only emergency cases after 12 AM';
      } else {
        newPatient.needsRescheduling = true;
      }
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
    const doctorCounts = getDoctorCounts();
    const today = new Date().toISOString().split('T')[0];
    const todayPatients = patients.filter(p => p.date === today);
    
    // Group patients by time slot and department
    const timeSlots = {};
    todayPatients.forEach(patient => {
      const key = `${patient.time}-${patient.department}`;
      if (!timeSlots[key]) {
        timeSlots[key] = {
          time: patient.time,
          department: patient.department,
          patients: [],
          capacity: doctorCounts[patient.department] || 1
        };
      }
      timeSlots[key].patients.push(patient);
    });
    
    // Find overcrowded slots
    const overcrowdedSlots = Object.values(timeSlots).filter(slot => 
      slot.patients.length > slot.capacity
    );
    
    // Generate alerts for overcrowded slots
    if (overcrowdedSlots.length > 0) {
      const newAlerts = overcrowdedSlots.map(slot => ({
        id: Date.now() + Math.random(),
        severity: 'HIGH',
        message: `${slot.department} department full at ${slot.time}: ${slot.patients.length}/${slot.capacity} doctors busy`,
        time: new Date().toLocaleTimeString().slice(0, 5)
      }));
      
      setAlerts(prev => [...newAlerts, ...prev.slice(0, 10)]); // Keep only recent 10 alerts
    }
    
    // Show reschedule options for first overcrowded slot
    if (overcrowdedSlots.length > 0) {
      const overcrowdedSlot = overcrowdedSlots[0];
      const excessPatients = overcrowdedSlot.patients.slice(overcrowdedSlot.capacity)
        .filter(p => p.priority !== 'Critical' && p.type !== 'Emergency');
      
      // Generate available slots (simplified)
      const availableSlots = [];
      for (let hour = 9; hour <= 17; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const period = hour >= 12 ? 'PM' : 'AM';
          const displayHour = hour > 12 ? hour - 12 : hour;
          const displayTime = `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
          
          availableSlots.push({
            time: displayTime,
            predicted: 0,
            capacity: overcrowdedSlot.capacity
          });
        }
      }
      
      if (excessPatients.length > 0) {
        setShowRescheduleOptions({
          overcrowdedSlot: {
            ...overcrowdedSlot,
            time: overcrowdedSlot.time,
            predicted: overcrowdedSlot.patients.length
          },
          excessPatients: excessPatients.map(p => ({
            id: p.id,
            name: p.name,
            time: p.time,
            dept: p.dept,
            department: p.department,
            priority: p.priority,
            date: p.date
          })),
          availableSlots
        });
      }
    }
  }, [patients, setAlerts, setShowRescheduleOptions, getDoctorCounts]);

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