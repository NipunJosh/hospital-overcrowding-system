from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

class HospitalDB:
    def __init__(self):
        # MongoDB Atlas connection with comprehensive SSL fix
        uri = os.getenv('MONGODB_URI', "mongodb+srv://fishhaven737:7Jfcn9qnvQ2FDS9g@hospital-overcrowding-s.lppiehn.mongodb.net/?retryWrites=true&w=majority&appName=hospital-overcrowding-system")
        
        try:
            self.client = MongoClient(
                uri, 
                server_api=ServerApi('1'),
                tlsAllowInvalidCertificates=True,
                tlsInsecure=True,
                connectTimeoutMS=10000,
                serverSelectionTimeoutMS=10000,
                maxPoolSize=1
            )
        except Exception as e:
            print(f"MongoDB connection setup failed: {e}")
            self.client = None
        self.db = self.client.hospital_system
        
        # Test connection and initialize collections
        if self.client:
            try:
                self.client.admin.command('ping')
                print("Connected to MongoDB Atlas!")
                self.db = self.client.hospital_system
                self.patients = self.db.patients
                self.predictions = self.db.predictions
                self.alerts = self.db.alerts
                self.schedules = self.db.schedules
            except Exception as e:
                print(f"MongoDB connection failed: {e}")
                self.client = None
        else:
            print("MongoDB client initialization failed")
    
    def add_patient(self, patient_data):
        if not self.client:
            raise Exception("MongoDB not connected")
        return self.patients.insert_one(patient_data)
    
    def get_patients(self, date=None):
        if not date:
            date = datetime.now().date()
        
        start_date = datetime.combine(date, datetime.min.time())
        end_date = start_date + timedelta(days=1)
        
        return list(self.patients.find({
            'appointment_time': {'$gte': start_date, '$lt': end_date}
        }))
    
    def save_prediction(self, prediction_data):
        return self.predictions.insert_one(prediction_data)
    
    def get_recent_predictions(self, hours=4):
        cutoff = datetime.now() - timedelta(hours=hours)
        return list(self.predictions.find({
            'timestamp': {'$gte': cutoff}
        }).sort('timestamp', -1))
    
    def save_alert(self, alert_data):
        return self.alerts.insert_one(alert_data)
    
    def get_active_alerts(self):
        cutoff = datetime.now() - timedelta(hours=4)
        return list(self.alerts.find({
            'timestamp': {'$gte': cutoff}
        }).sort('timestamp', -1))
    
    def update_patient_schedule(self, patient_id, new_time, reason=''):
        """Update patient appointment time"""
        return self.patients.update_one(
            {'patient_id': patient_id},
            {'$set': {
                'appointment_time': new_time,
                'reschedule_reason': reason,
                'updated_at': datetime.now()
            }}
        )
    
    def delete_patient(self, patient_id):
        """Delete patient from database"""
        return self.patients.delete_one({'patient_id': patient_id})
    
    def seed_sample_data(self):
        sample_patients = [
            {
                'patient_id': 'P001',
                'name': 'John Doe',
                'appointment_time': datetime.now() + timedelta(hours=1),
                'patient_type': 'scheduled',
                'priority': 'medium',
                'department': 'Cardiology',
                'estimated_duration': 30
            },
            {
                'patient_id': 'P002',
                'name': 'Jane Smith',
                'appointment_time': datetime.now() + timedelta(hours=2),
                'patient_type': 'scheduled',
                'priority': 'low',
                'department': 'General',
                'estimated_duration': 20
            }
        ]
        
        for patient in sample_patients:
            if not self.patients.find_one({'patient_id': patient['patient_id']}):
                self.patients.insert_one(patient)
                print(f"Added patient: {patient['name']}")