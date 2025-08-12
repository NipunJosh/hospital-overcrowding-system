import React from 'react';

function PredictionChart({ predictions }) {
  const maxValue = Math.max(...predictions.map(p => Math.max(p.predicted, p.capacity)), 30);

  return (
    <div className="card">
      <h3>📈 Hourly Predictions</h3>
      <div className="prediction-chart">
        {predictions.map((pred, index) => (
          <div key={index} className="prediction-bar">
            <div className={`bar ${pred.predicted > pred.capacity ? 'bar-overcrowded' : 'bar-normal'}`}
                 style={{ height: `${(pred.predicted / maxValue) * 200}px` }}>
            </div>
            <div className="bar-label">
              <div>{pred.time}</div>
              <div style={{ color: pred.predicted > pred.capacity ? '#e74c3c' : '#27ae60', fontWeight: 'bold' }}>
                {pred.predicted}/{pred.capacity}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: '0.9rem', color: '#7f8c8d', marginTop: '1rem', textAlign: 'center' }}>
        🔵 Normal Load | 🔴 Overcrowded | Confidence: {predictions[0]?.confidence ? (predictions[0].confidence * 100).toFixed(0) + '%' : 'N/A'}
      </div>
    </div>
  );
}

export default PredictionChart;