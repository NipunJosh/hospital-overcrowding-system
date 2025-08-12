from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime, timedelta
from prediction_engine import PredictionEngine
from dynamic_scheduler import DynamicScheduler
from alert_system import AlertSystem
from models import Patient, PatientType, Priority
import json

app = Flask(__name__)
CORS(app)

# Initialize system components
prediction_engine = PredictionEngine()
scheduler = DynamicScheduler()
alert_system = AlertSystem()

@app.route('/api/predictions', methods=['GET'])
def get_predictions():
    predictions = prediction_engine.predict_next_hours(4)
    return jsonify([{
        'time': p.timestamp.strftime('%H:%M'),
        'predicted': p.predicted_arrivals,
        'capacity': 20,
        'confidence': p.confidence
    } for p in predictions])

@app.route('/api/alerts', methods=['GET'])
def get_alerts():
    return jsonify([{
        'id': i,
        'severity': alert.severity,
        'message': alert.message,
        'time': alert.timestamp.strftime('%H:%M')
    } for i, alert in enumerate(alert_system.active_alerts)])

@app.route('/api/schedule', methods=['GET'])
def get_schedule():
    summary = scheduler.get_schedule_summary()
    return jsonify(summary)

@app.route('/api/reschedule', methods=['POST'])
def reschedule_patients():
    data = request.json
    target_hour = datetime.strptime(data['hour'], '%H:%M').replace(
        year=datetime.now().year,
        month=datetime.now().month,
        day=datetime.now().day
    )
    
    rescheduled = scheduler.reschedule_patients(25, target_hour)
    return jsonify({
        'success': True,
        'rescheduled_count': len(rescheduled),
        'patients': rescheduled
    })

if __name__ == '__main__':
    # Add sample data
    sample_patients = [
        Patient("P001", "John Doe", datetime.now() + timedelta(hours=1), PatientType.SCHEDULED, Priority.MEDIUM, "Cardiology", 30),
        Patient("P002", "Jane Smith", datetime.now() + timedelta(hours=2), PatientType.SCHEDULED, Priority.LOW, "General", 20)
    ]
    
    for patient in sample_patients:
        scheduler.add_patient(patient)
    
    print("Hospital System starting...")
    print("Backend running at: http://0.0.0.0:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)