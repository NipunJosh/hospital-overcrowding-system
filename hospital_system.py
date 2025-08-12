from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime, timedelta
try:
    from database import HospitalDB
    db = HospitalDB()
    if not db.connected:
        raise Exception("MongoDB failed")
except:
    print("MongoDB failed, using Simple Database")
    from simple_db import SimpleDB
    db = SimpleDB()
from models import Patient, PatientType, Priority
import json

app = Flask(__name__)
CORS(app)

# Database initialization is now handled above

@app.route('/api/patients', methods=['GET'])
def get_patients():
    patients = db.get_patients()
    return jsonify(patients)

@app.route('/api/patients', methods=['POST'])
def add_patient():
    data = request.json
    patient_data = {
        'patient_id': data['id'],
        'name': data['name'],
        'appointment_time': datetime.fromisoformat(data['appointment_time'].replace(' ', 'T')),
        'patient_type': data['patient_type'],
        'priority': data['priority'],
        'department': data['department'],
        'estimated_duration': data['estimated_duration'],
        'health_condition': data.get('health_condition', ''),
        'created_at': datetime.now()
    }
    
    result = db.add_patient(patient_data)
    return jsonify({'success': True, 'id': str(result.inserted_id)})

@app.route('/api/patients/<patient_id>/reschedule', methods=['PUT'])
def reschedule_patient(patient_id):
    data = request.json
    result = db.update_patient_schedule(
        patient_id, 
        datetime.fromisoformat(data['new_time'].replace(' ', 'T')),
        data.get('reason', '')
    )
    return jsonify({'success': True, 'modified_count': result.modified_count})

@app.route('/api/patients/<patient_id>', methods=['DELETE'])
def delete_patient(patient_id):
    result = db.delete_patient(patient_id)
    return jsonify({'success': True, 'deleted_count': result.deleted_count})

@app.route('/api/predictions', methods=['GET'])
def get_predictions():
    predictions = db.get_recent_predictions()
    if not predictions:
        # Return mock data if no predictions in DB
        return jsonify([
            {'time': '09:00', 'predicted': 18, 'capacity': 20, 'confidence': 0.85},
            {'time': '10:00', 'predicted': 25, 'capacity': 20, 'confidence': 0.92},
            {'time': '11:00', 'predicted': 22, 'capacity': 20, 'confidence': 0.78},
            {'time': '12:00', 'predicted': 28, 'capacity': 20, 'confidence': 0.88}
        ])
    
    return jsonify([{
        'time': p['timestamp'].strftime('%H:%M'),
        'predicted': p['predicted_arrivals'],
        'capacity': 20,
        'confidence': p['confidence']
    } for p in predictions])

@app.route('/api/alerts', methods=['GET'])
def get_alerts():
    alerts = db.get_active_alerts()
    return jsonify([{
        'id': str(alert['_id']),
        'severity': alert['severity'],
        'message': alert['message'],
        'time': alert['timestamp'].strftime('%H:%M')
    } for alert in alerts])

@app.route('/api/schedule', methods=['GET'])
def get_schedule():
    patients = db.get_patients()
    return jsonify({
        'totalScheduled': len(patients),
        'rescheduled': 0,  # Track this separately
        'capacity': 240
    })

@app.route('/api/reschedule', methods=['POST'])
def reschedule_patients():
    data = request.json
    
    try:
        # Get all patients
        patients = db.get_patients()
        
        # Priority order: Critical > High > Medium > Low
        priority_order = {'critical': 1, 'high': 2, 'medium': 3, 'low': 4}
        
        # Sort patients by priority (critical first)
        sorted_patients = sorted(patients, key=lambda p: priority_order.get(p.get('priority', 'low').lower(), 4))
        
        # Generate new time slots starting from 9:00 AM
        rescheduled = []
        current_hour = 9
        current_minute = 0
        
        for patient in sorted_patients:
            # Create new appointment time
            new_time = f"{current_hour:02d}:{current_minute:02d}"
            old_time = patient.get('appointment_time', 'Unknown')
            
            # Update patient in database
            if hasattr(db, 'update_patient_schedule'):
                db.update_patient_schedule(
                    patient['patient_id'], 
                    datetime.strptime(f"2025-08-12 {new_time}", "%Y-%m-%d %H:%M"),
                    f"Auto-rescheduled by priority ({patient.get('priority', 'medium')} priority)"
                )
            
            rescheduled.append({
                'patient_id': patient['patient_id'],
                'name': patient['name'],
                'priority': patient.get('priority', 'medium'),
                'old_time': old_time,
                'new_time': new_time,
                'reason': f"Rescheduled by priority - {patient.get('priority', 'medium')} priority patient"
            })
            
            # Increment time by 30 minutes
            current_minute += 30
            if current_minute >= 60:
                current_hour += 1
                current_minute = 0
        
        return jsonify({
            'success': True,
            'rescheduled_count': len(rescheduled),
            'rescheduled_patients': rescheduled,
            'message': f'Successfully rescheduled {len(rescheduled)} patients by priority'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'message': 'Rescheduling failed'
        })

@app.route('/api/database', methods=['GET'])
def view_database():
    """View all database contents"""
    try:
        if hasattr(db, 'data'):
            return jsonify(db.data)
        else:
            patients = db.get_patients()
            return jsonify({'patients': patients})
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    # Seed sample data
    db.seed_sample_data()
    
    print("Hospital System with MongoDB starting...")
    import os
    port = int(os.environ.get('PORT', 5000))
    print(f"Backend running at: http://localhost:{port}")
    app.run(debug=False, host='0.0.0.0', port=port)