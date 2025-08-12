import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Chatbot from './components/Chatbot';
import DashboardPage from './pages/DashboardPage';
import PredictionsPage from './pages/PredictionsPage';
import AlertsPage from './pages/AlertsPage';
import SchedulePage from './pages/SchedulePage';
import PatientsPage from './pages/PatientsPage';
import { HospitalProvider } from './context/HospitalContext';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch(currentPage) {
      case 'dashboard': return <DashboardPage />;
      case 'predictions': return <PredictionsPage />;
      case 'alerts': return <AlertsPage />;
      case 'schedule': return <SchedulePage />;
      case 'patients': return <PatientsPage />;
      default: return <DashboardPage />;
    }
  };

  return (
    <HospitalProvider>
      <div className="app">
        <header className="app-header">
          <h1>🏥 Hospital Overcrowding Management System</h1>
          <p style={{margin: '0.5rem 0', opacity: 0.8}}>AI-Powered Prediction & Dynamic Rescheduling</p>
        </header>
        
        <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
        
        {renderPage()}
        
        <Chatbot />
      </div>
    </HospitalProvider>
  );
}

export default App;