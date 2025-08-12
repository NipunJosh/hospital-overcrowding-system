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

@dataclass
class PredictionData:
    timestamp: datetime
    predicted_arrivals: int
    confidence: float
    factors: dict  # weather, events, etc.

@dataclass
class Alert:
    timestamp: datetime
    severity: str
    message: str
    predicted_overcrowding: int
    recommended_actions: List[str]