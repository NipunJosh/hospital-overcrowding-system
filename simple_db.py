import json
import os
from datetime import datetime

class SimpleDB:
    def __init__(self):
        self.data_file = '/tmp/hospital_data.json'
        self.data = self.load_data()
        self.connected = True
        print("Connected to Simple File Database!")
    
    def load_data(self):
        if os.path.exists(self.data_file):
            try:
                with open(self.data_file, 'r') as f:
                    return json.load(f)
            except:
                pass
        return {'patients': [], 'alerts': [], 'predictions': []}
    
    def save_data(self):
        try:
            with open(self.data_file, 'w') as f:
                json.dump(self.data, f)
        except Exception as e:
            print(f"Save failed: {e}")
    
    def add_patient(self, patient_data):
        # Convert datetime to string for JSON serialization
        if 'appointment_time' in patient_data:
            patient_data['appointment_time'] = patient_data['appointment_time'].isoformat()
        if 'created_at' in patient_data:
            patient_data['created_at'] = patient_data['created_at'].isoformat()
        
        self.data['patients'].append(patient_data)
        self.save_data()
        return type('Result', (), {'inserted_id': patient_data['patient_id']})()
    
    def get_patients(self):
        return self.data['patients']
    
    def delete_patient(self, patient_id):
        original_count = len(self.data['patients'])
        self.data['patients'] = [p for p in self.data['patients'] if p['patient_id'] != patient_id]
        deleted_count = original_count - len(self.data['patients'])
        self.save_data()
        return type('Result', (), {'deleted_count': deleted_count})()
    
    def update_patient_schedule(self, patient_id, new_time, reason=''):
        for patient in self.data['patients']:
            if patient['patient_id'] == patient_id:
                patient['appointment_time'] = new_time.isoformat()
                patient['reschedule_reason'] = reason
                patient['updated_at'] = datetime.now().isoformat()
                self.save_data()
                return type('Result', (), {'modified_count': 1})()
        return type('Result', (), {'modified_count': 0})()
    
    def seed_sample_data(self):
        if not self.data['patients']:
            sample_patients = [
                {
                    'patient_id': 'P001',
                    'name': 'John Doe',
                    'appointment_time': (datetime.now()).isoformat(),
                    'patient_type': 'scheduled',
                    'priority': 'medium',
                    'department': 'Cardiology',
                    'estimated_duration': 30
                },
                {
                    'patient_id': 'P002',
                    'name': 'Jane Smith',
                    'appointment_time': (datetime.now()).isoformat(),
                    'patient_type': 'scheduled',
                    'priority': 'low',
                    'department': 'General',
                    'estimated_duration': 20
                }
            ]
            
            for patient in sample_patients:
                self.add_patient(patient.copy())
                print(f"Added patient: {patient['name']}")