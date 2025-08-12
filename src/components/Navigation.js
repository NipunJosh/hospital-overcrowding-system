import React from 'react';

function Navigation({ currentPage, setCurrentPage }) {
  const pages = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'predictions', name: 'Predictions', icon: '📈' },
    { id: 'alerts', name: 'Alerts', icon: '🚨' },
    { id: 'schedule', name: 'Schedule', icon: '📅' },
    { id: 'patients', name: 'Patients', icon: '👥' }
  ];

  return (
    <nav style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'center',
      gap: '2rem',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      {pages.map(page => (
        <button
          key={page.id}
          onClick={() => setCurrentPage(page.id)}
          style={{
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '25px',
            background: currentPage === page.id ? 
              'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 
              'transparent',
            color: currentPage === page.id ? 'white' : '#2c3e50',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <span>{page.icon}</span>
          {page.name}
        </button>
      ))}
    </nav>
  );
}

export default Navigation;