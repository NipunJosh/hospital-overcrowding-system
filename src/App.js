import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import AlertPanel from './components/AlertPanel';
import PredictionChart from './components/PredictionChart';
import ScheduleManager from './components/ScheduleManager';
import './App.css';

const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.herokuapp.com' 
  : 'http://localhost:5000';

function App() {
  const [predictions, setPredictions] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [scheduleData, setScheduleData] = useState({});

  useEffect(() => {
    fetchPredictions();
    fetchAlerts();
    fetchScheduleData();
    
    const interval = setInterval(() => {
      fetchPredictions();
      fetchAlerts();
      fetchScheduleData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchPredictions = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/predictions`);
      const data = await response.json();
      setPredictions(data);
    } catch (error) {
      // Fallback mock data
      setPredictions([
        { time: '09:00', predicted: 18, capacity: 20 },
        { time: '10:00', predicted: 25, capacity: 20 },
        { time: '11:00', predicted: 22, capacity: 20 },
        { time: '12:00', predicted: 28, capacity: 20 }
      ]);
    }
  };

  const fetchAlerts = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/alerts`);
      const data = await response.json();
      setAlerts(data);
    } catch (error) {
      setAlerts([
        { id: 1, severity: 'HIGH', message: 'Overcrowding predicted at 10:00', time: '09:45' },
        { id: 2, severity: 'CRITICAL', message: 'Emergency surge expected at 12:00', time: '09:50' }
      ]);
    }
  };

  const fetchScheduleData = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/schedule`);
      const data = await response.json();
      setScheduleData(data);
    } catch (error) {
      setScheduleData({
        totalScheduled: 156,
        rescheduled: 8,
        capacity: 240
      });
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🏥 Hospital Overcrowding Management System</h1>
      </header>
      
      <div className="app-content">
        <div className="main-panel">
          <Dashboard scheduleData={scheduleData} />
          <PredictionChart predictions={predictions} />
        </div>
        
        <div className="side-panel">
          <AlertPanel alerts={alerts} />
          <ScheduleManager onReschedule={(data) => console.log('Reschedule:', data)} />
        </div>
      </div>
    </div>
  );
}

export default App;