import React, { useState } from 'react';

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your Hospital Assistant. How can I help you today?", isBot: true }
  ]);
  const [inputValue, setInputValue] = useState('');

  const responses = {
    'hello': "Hello! I'm your Hospital Management AI Assistant. I can help you with anything about this application!",
    'help': "I can help you with:\n• Patient management and scheduling\n• Doctor capacity settings\n• AI predictions and alerts\n• Emergency vs scheduled appointments\n• Rescheduling and optimization\n• System features and navigation",
    'patients': "Patient Management:\n• Add patients with priority levels (Critical, High, Medium, Low)\n• Set appointment duration (15-120 minutes)\n• View patient details and health conditions\n• Delete completed appointments automatically",
    'predictions': "AI Predictions:\n• Shows real patient data per time slot\n• Displays department and priority info\n• Calculates total duration per hour\n• Updates in real-time as you add patients",
    'alerts': "Smart Alerts:\n• Bottom-left toast notifications\n• Capacity exceeded warnings\n• Emergency scheduling alerts\n• Auto-dismiss after 5 seconds",
    'schedule': "Schedule Management:\n• View today's appointments by priority\n• Filter by All/Emergency/Scheduled\n• AI-powered priority rescheduling\n• Manual reschedule with time picker",
    'reschedule': "Rescheduling Options:\n• Manual: Select patients and new times\n• AI Automatic: Sorts all patients by priority\n• Critical patients get earliest slots\n• Low priority moved to later times",
    'capacity': "Doctor-Based Capacity:\n• Set doctors per department (General: 3, Cardiology: 2, etc.)\n• Each doctor = 1 patient per time slot\n• 30-minute intervals (9:00, 9:30, 10:00...)\n• Automatic capacity checking",
    'emergency': "Emergency Rules:\n• Only emergency cases allowed after 12 AM\n• Non-emergency auto-rescheduled to tomorrow\n• Critical priority gets earliest appointments\n• Emergency department has 5 doctors by default",
    'doctors': "Doctor Management:\n• Click 'Manage Doctors' in Patients page\n• Set 1-10 doctors per department\n• Capacity = number of doctors per time slot\n• Saves settings automatically",
    'time': "Time Slot System:\n• 30-minute intervals from 9 AM to 9 PM\n• Each slot can have [doctors] patients max\n• Duration affects next available slot\n• Smart conflict detection",
    'ai': "AI Features:\n• Priority-based rescheduling algorithm\n• Real-time capacity monitoring\n• Predictive overcrowding alerts\n• Intelligent time slot optimization",
    'priority': "Priority Levels:\n• Critical: Life-threatening, earliest slots\n• High: Urgent medical needs\n• Medium: Standard appointments\n• Low: Routine checkups, latest slots",
    'features': "Key Features:\n• Doctor capacity management\n• AI priority rescheduling\n• Real-time predictions\n• Emergency-only after midnight\n• Smart time slot picker\n• Bottom-left alert toasts",
    'default': "I can help with: patients, doctors, scheduling, predictions, alerts, capacity, emergency rules, AI features, priorities, or any other aspect of the hospital management system. What would you like to know?"
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage = { text: inputValue, isBot: false };
    setMessages(prev => [...prev, userMessage]);

    // Simple keyword matching for responses
    const keyword = Object.keys(responses).find(key => 
      inputValue.toLowerCase().includes(key)
    );
    
    const botResponse = responses[keyword] || responses['default'];
    
    setTimeout(() => {
      setMessages(prev => [...prev, { text: botResponse, isBot: true }]);
    }, 1000);

    setInputValue('');
  };

  return (
    <div className="chatbot-container">
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            🏥 Hospital Assistant
          </div>
          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`message ${message.isBot ? 'message-bot' : 'message-user'}`}
              >
                {message.text}
              </div>
            ))}
          </div>
          <div className="chatbot-input">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything..."
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
      
      <button 
        className="chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '✕' : '💬'}
      </button>
    </div>
  );
}

export default Chatbot;