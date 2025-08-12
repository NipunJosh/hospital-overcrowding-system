import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Chatbot from './components/Chatbot';
import AlertToast from './components/AlertToast';
import RescheduleOptionsPopup from './components/RescheduleOptionsPopup';
import DashboardPage from './pages/DashboardPage';
import PredictionsPage from './pages/PredictionsPage';
import AlertsPage from './pages/AlertsPage';
import SchedulePage from './pages/SchedulePage';
import PatientsPage from './pages/PatientsPage';
import { HospitalProvider, useHospital } from './context/HospitalContext';
import './App.css';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const { showRescheduleOptions, setShowRescheduleOptions, reschedulePatient } = useHospital();

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
    <div className="app">
      <header className="app-header">
        <h1>🏥 Hospital Overcrowding Management System</h1>
        <p style={{margin: '0.5rem 0', opacity: 0.8}}>AI-Powered Prediction & Dynamic Rescheduling</p>
      </header>
      
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      {renderPage()}
      
      <Chatbot />
      <AlertToast />
      
      {showRescheduleOptions && (
        <RescheduleOptionsPopup
          options={showRescheduleOptions}
          onReschedule={reschedulePatient}
          onClose={() => setShowRescheduleOptions(null)}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <HospitalProvider>
      <AppContent />
    </HospitalProvider>
  );
}

export default App;