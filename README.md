# Hospital Overcrowding Management System

AI-powered dual-mode prediction and dynamic rescheduling engine for hospital overcrowding prevention.

## Features

- **AI Prediction Engine**: Forecasts patient arrivals using historical data, weather, and events
- **Dynamic Rescheduling**: Automatically reschedules non-critical appointments to prevent overcrowding
- **Real-time Alerts**: Monitors predictions and generates actionable alerts
- **React Dashboard**: Interactive web interface for hospital administrators

## Quick Start

### Backend (Python)
```bash
pip install -r requirements.txt
python hospital_system.py
```

### Frontend (React)
```bash
npm install
npm start
```

## System Components

1. **Prediction Engine** (`prediction_engine.py`) - ML-based patient arrival forecasting
2. **Dynamic Scheduler** (`dynamic_scheduler.py`) - Intelligent appointment rescheduling
3. **Alert System** (`alert_system.py`) - Real-time overcrowding notifications
4. **React Dashboard** (`src/`) - Web interface for system management

## API Endpoints

- `GET /api/predictions` - Get hourly predictions
- `GET /api/alerts` - Get active alerts
- `GET /api/schedule` - Get schedule summary
- `POST /api/reschedule` - Trigger dynamic rescheduling

The system runs on:
- Backend: http://localhost:5000
- Frontend: http://localhost:3000