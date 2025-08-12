from datetime import datetime, timedelta
from typing import List, Dict
from models import Alert, PredictionData
import json

class AlertSystem:
    def __init__(self, capacity_threshold: int = 20):
        self.capacity_threshold = capacity_threshold
        self.alert_history: List[Alert] = []
        self.active_alerts: List[Alert] = []
    
    def evaluate_overcrowding(self, predictions: List[PredictionData], current_load: int) -> List[Alert]:
        """Evaluate predictions and generate alerts if overcrowding is predicted"""
        new_alerts = []
        
        for prediction in predictions:
            total_predicted = current_load + prediction.predicted_arrivals
            
            if total_predicted > self.capacity_threshold:
                severity = self._calculate_severity(total_predicted)
                alert = Alert(
                    timestamp=datetime.now(),
                    severity=severity,
                    message=f"Overcrowding predicted at {prediction.timestamp.strftime('%H:%M')}. "
                           f"Expected: {total_predicted} patients (Capacity: {self.capacity_threshold})",
                    predicted_overcrowding=total_predicted,
                    recommended_actions=self._generate_recommendations(total_predicted, prediction)
                )
                new_alerts.append(alert)
                self.active_alerts.append(alert)
        
        self.alert_history.extend(new_alerts)
        return new_alerts
    
    def _calculate_severity(self, predicted_load: int) -> str:
        """Calculate alert severity based on predicted load"""
        if predicted_load > self.capacity_threshold * 1.5:
            return "CRITICAL"
        elif predicted_load > self.capacity_threshold * 1.25:
            return "HIGH"
        else:
            return "MEDIUM"
    
    def _generate_recommendations(self, predicted_load: int, prediction: PredictionData) -> List[str]:
        """Generate actionable recommendations based on prediction"""
        recommendations = []
        
        excess = predicted_load - self.capacity_threshold
        
        if excess > 0:
            recommendations.append(f"Consider rescheduling {excess} non-critical appointments")
        
        if prediction.confidence < 0.7:
            recommendations.append("Monitor situation closely - prediction confidence is low")
        
        if 'weather' in prediction.factors and prediction.factors['weather'].get('precipitation', 0) > 5:
            recommendations.append("Weather may increase emergency arrivals - prepare additional staff")
        
        if prediction.timestamp.hour in [9, 10, 14, 15]:  # Peak hours
            recommendations.append("Peak hour detected - consider extending operating hours")
        
        recommendations.append("Notify department heads and prepare additional resources")
        
        return recommendations
    
    def clear_old_alerts(self, hours_old: int = 4):
        """Clear alerts older than specified hours"""
        cutoff_time = datetime.now() - timedelta(hours=hours_old)
        self.active_alerts = [alert for alert in self.active_alerts 
                            if alert.timestamp > cutoff_time]
    
    def get_alert_summary(self) -> Dict:
        """Get summary of current alert status"""
        active_count = len(self.active_alerts)
        critical_count = len([a for a in self.active_alerts if a.severity == "CRITICAL"])
        
        return {
            'active_alerts': active_count,
            'critical_alerts': critical_count,
            'latest_alert': self.active_alerts[-1].__dict__ if self.active_alerts else None,
            'total_alerts_today': len([a for a in self.alert_history 
                                     if a.timestamp.date() == datetime.now().date()])
        }
    
    def send_notification(self, alert: Alert) -> bool:
        """Send alert notification (placeholder for actual notification system)"""
        # In real implementation, this would integrate with email, SMS, or hospital systems
        print(f"🚨 ALERT [{alert.severity}]: {alert.message}")
        for action in alert.recommended_actions:
            print(f"   → {action}")
        return True