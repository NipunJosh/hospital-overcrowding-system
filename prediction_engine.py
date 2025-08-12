import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from datetime import datetime, timedelta
from typing import List
from models import PredictionData, PatientType
import pickle

class PredictionEngine:
    def __init__(self):
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.scaler = StandardScaler()
        self.is_trained = False
    
    def prepare_features(self, timestamp: datetime, weather_data: dict = None, events: list = None):
        """Extract time-based and external features"""
        features = [
            timestamp.hour,
            timestamp.weekday(),
            timestamp.day,
            timestamp.month,
            1 if timestamp.weekday() >= 5 else 0,  # weekend
            weather_data.get('temperature', 20) if weather_data else 20,
            weather_data.get('precipitation', 0) if weather_data else 0,
            len(events) if events else 0
        ]
        return np.array(features).reshape(1, -1)
    
    def train(self, historical_data: pd.DataFrame):
        """Train model on historical patient data"""
        if historical_data.empty:
            return
        
        # Prepare training features
        X = []
        y = []
        
        for _, row in historical_data.iterrows():
            timestamp = pd.to_datetime(row['timestamp'])
            features = self.prepare_features(
                timestamp, 
                row.get('weather', {}), 
                row.get('events', [])
            ).flatten()
            X.append(features)
            y.append(row['patient_count'])
        
        X = np.array(X)
        y = np.array(y)
        
        X_scaled = self.scaler.fit_transform(X)
        self.model.fit(X_scaled, y)
        self.is_trained = True
    
    def predict_arrivals(self, timestamp: datetime, weather_data: dict = None, events: list = None) -> PredictionData:
        """Predict patient arrivals for given timestamp"""
        if not self.is_trained:
            # Return default prediction if not trained
            return PredictionData(
                timestamp=timestamp,
                predicted_arrivals=15,  # default estimate
                confidence=0.5,
                factors={'status': 'model_not_trained'}
            )
        
        features = self.prepare_features(timestamp, weather_data, events)
        features_scaled = self.scaler.transform(features)
        
        prediction = self.model.predict(features_scaled)[0]
        confidence = min(0.95, max(0.3, 1.0 - (abs(prediction - 15) / 30)))  # Simple confidence calc
        
        return PredictionData(
            timestamp=timestamp,
            predicted_arrivals=max(0, int(prediction)),
            confidence=confidence,
            factors={
                'weather': weather_data or {},
                'events': events or [],
                'hour': timestamp.hour,
                'weekday': timestamp.weekday()
            }
        )
    
    def predict_next_hours(self, hours: int = 4) -> List[PredictionData]:
        """Predict arrivals for next N hours"""
        predictions = []
        current_time = datetime.now()
        
        for i in range(hours):
            future_time = current_time + timedelta(hours=i)
            prediction = self.predict_arrivals(future_time)
            predictions.append(prediction)
        
        return predictions