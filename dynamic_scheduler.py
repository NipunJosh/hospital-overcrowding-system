from datetime import datetime, timedelta
from typing import List, Dict
from models import Patient, Priority, PatientType
import heapq

class DynamicScheduler:
    def __init__(self, capacity_per_hour: int = 20):
        self.capacity_per_hour = capacity_per_hour
        self.scheduled_patients: List[Patient] = []
        self.rescheduled_log: List[Dict] = []
    
    def add_patient(self, patient: Patient):
        """Add patient to schedule"""
        self.scheduled_patients.append(patient)
    
    def get_hourly_load(self, target_hour: datetime) -> int:
        """Calculate patient load for specific hour"""
        hour_start = target_hour.replace(minute=0, second=0, microsecond=0)
        hour_end = hour_start + timedelta(hours=1)
        
        count = 0
        for patient in self.scheduled_patients:
            if hour_start <= patient.appointment_time < hour_end:
                count += 1
        return count
    
    def find_reschedulable_patients(self, overcrowded_hour: datetime) -> List[Patient]:
        """Find non-critical patients that can be rescheduled"""
        hour_start = overcrowded_hour.replace(minute=0, second=0, microsecond=0)
        hour_end = hour_start + timedelta(hours=1)
        
        reschedulable = []
        for patient in self.scheduled_patients:
            if (hour_start <= patient.appointment_time < hour_end and 
                patient.patient_type == PatientType.SCHEDULED and
                patient.priority in [Priority.MEDIUM, Priority.LOW]):
                reschedulable.append(patient)
        
        # Sort by priority (lowest first) and appointment time
        reschedulable.sort(key=lambda p: (p.priority.value, p.appointment_time))
        return reschedulable
    
    def find_available_slots(self, start_time: datetime, days_ahead: int = 7) -> List[datetime]:
        """Find available time slots within next N days"""
        available_slots = []
        current_time = start_time
        end_time = start_time + timedelta(days=days_ahead)
        
        while current_time < end_time:
            # Skip nights (before 8 AM, after 6 PM)
            if 8 <= current_time.hour < 18:
                hourly_load = self.get_hourly_load(current_time)
                if hourly_load < self.capacity_per_hour:
                    available_slots.append(current_time)
            
            current_time += timedelta(hours=1)
        
        return available_slots
    
    def reschedule_patients(self, predicted_overcrowding: int, target_hour: datetime) -> List[Dict]:
        """Dynamically reschedule patients to prevent overcrowding"""
        if predicted_overcrowding <= self.capacity_per_hour:
            return []
        
        patients_to_move = predicted_overcrowding - self.capacity_per_hour
        reschedulable = self.find_reschedulable_patients(target_hour)
        available_slots = self.find_available_slots(target_hour + timedelta(hours=1))
        
        rescheduled = []
        moved_count = 0
        
        for patient in reschedulable[:patients_to_move]:
            if moved_count >= patients_to_move or not available_slots:
                break
            
            # Find best available slot
            new_slot = available_slots.pop(0)
            old_time = patient.appointment_time
            patient.appointment_time = new_slot
            
            reschedule_info = {
                'patient_id': patient.id,
                'patient_name': patient.name,
                'old_time': old_time,
                'new_time': new_slot,
                'reason': 'overcrowding_prevention',
                'timestamp': datetime.now()
            }
            
            rescheduled.append(reschedule_info)
            self.rescheduled_log.append(reschedule_info)
            moved_count += 1
        
        return rescheduled
    
    def get_schedule_summary(self) -> Dict:
        """Get current schedule summary"""
        now = datetime.now()
        next_24h = now + timedelta(hours=24)
        
        upcoming_patients = [p for p in self.scheduled_patients 
                           if now <= p.appointment_time <= next_24h]
        
        hourly_breakdown = {}
        for hour in range(24):
            target_hour = now + timedelta(hours=hour)
            load = self.get_hourly_load(target_hour)
            hourly_breakdown[target_hour.strftime('%H:00')] = {
                'load': load,
                'capacity': self.capacity_per_hour,
                'utilization': f"{(load/self.capacity_per_hour)*100:.1f}%"
            }
        
        return {
            'total_scheduled': len(self.scheduled_patients),
            'upcoming_24h': len(upcoming_patients),
            'hourly_breakdown': hourly_breakdown,
            'recent_rescheduled': len(self.rescheduled_log)
        }