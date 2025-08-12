from datetime import datetime, timedelta
from dataclasses import dataclass
from typing import List, Optional
from enum import Enum

class Priority(Enum):
    CRITICAL = 1
    HIGH = 2
    MEDIUM = 3
    LOW = 4

class PatientType(Enum):
    SCHEDULED = "scheduled"
    EMERGENCY = "emergency"
    WALK_IN = "walk_in"

@dataclass
class Patient:
    id: str
    name: str
    appointment_time: datetime
    patient_type: PatientType
    priority: Priority
    department: str
    estimated_duration: int  # minutes
    
    def to_dict(self):
        return {
            'patient_id': self.id,
            'name': self.name,
            'appointment_time': self.appointment_time,
            'patient_type': self.patient_type.value,
            'priority': self.priority.name.lower(),
            'department': self.department,
            'estimated_duration': self.estimated_duration
        }

@dataclass
class PredictionData:
    timestamp: datetime
    predicted_arrivals: int
    confidence: float
    factors: dict  # weather, events, etc.
    
    def to_dict(self):
        return {
            'timestamp': self.timestamp,
            'predicted_arrivals': self.predicted_arrivals,
            'confidence': self.confidence,
            'factors': self.factors
        }

@dataclass
class Alert:
    timestamp: datetime
    severity: str
    message: str
    predicted_overcrowding: int
    recommended_actions: List[str]
    
    def to_dict(self):
        return {
            'timestamp': self.timestamp,
            'severity': self.severity,
            'message': self.message,
            'predicted_overcrowding': self.predicted_overcrowding,
            'recommended_actions': self.recommended_actions
        }