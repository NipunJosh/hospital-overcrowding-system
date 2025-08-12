import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Chatbot from './components/Chatbot';
import DashboardPage from './pages/DashboardPage';
import PredictionsPage from './pages/PredictionsPage';
import AlertsPage from './pages/AlertsPage';
import SchedulePage from './pages/SchedulePage';
import PatientsPage from './pages/PatientsPage';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [predictions, setPredictions] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [scheduleData, setScheduleData] = useState({});

  useEffect(() => {
    // Using mock data for demo
    setPredictions([
      { time: '09:00', predicted: 18, capacity: 20 },
      { time: '10:00', predicted: 25, capacity: 20 },
      { time: '11:00', predicted: 22, capacity: 20 },
      { time: '12:00', predicted: 28, capacity: 20 }
    ]);

    setAlerts([
      { id: 1, severity: 'HIGH', message: 'Overcrowding predicted at 10:00', time: '09:45' },
      { id: 2, severity: 'CRITICAL', message: 'Emergency surge expected at 12:00', time: '09:50' }
    ]);

    setScheduleData({
      totalScheduled: 156,
      rescheduled: 8,
      capacity: 240
    });
  }, []);

  const renderPage = () => {
    switch(currentPage) {
      case 'dashboard': return <DashboardPage scheduleData={scheduleData} />;
      case 'predictions': return <PredictionsPage predictions={predictions} />;
      case 'alerts': return <AlertsPage alerts={alerts} />;
      case 'schedule': return <SchedulePage />;
      case 'patients': return <PatientsPage />;
      default: return <DashboardPage scheduleData={scheduleData} />;
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🏥 Hospital Overcrowding Management System</h1>
        <p style={{margin: '0.5rem 0', opacity: 0.8}}>AI-Powered Prediction & Dynamic Rescheduling</p>
      </header>
      
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      {renderPage()}
      
      <Chatbot />
    </div>
  );
}

export default App;