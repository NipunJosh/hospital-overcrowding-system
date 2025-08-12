import React, { useState } from 'react';

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your Hospital Assistant. How can I help you today?", isBot: true }
  ]);
  const [inputValue, setInputValue] = useState('');

  const responses = {
    'hello': "Hi there! I'm here to help with hospital information.",
    'overcrowding': "Our AI system predicts overcrowding 4 hours in advance and automatically reschedules non-critical appointments.",
    'appointments': "You can view all appointments in the dashboard. Critical appointments are never rescheduled.",
    'alerts': "The system generates real-time alerts when overcrowding is predicted. Check the alerts panel for details.",
    'predictions': "Our AI analyzes historical data, weather, and events to predict patient arrivals with 85%+ accuracy.",
    'help': "I can help with: overcrowding info, appointments, alerts, predictions, and system features.",
    'default': "I understand you're asking about our hospital system. Could you be more specific? Try asking about overcrowding, appointments, or alerts."
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