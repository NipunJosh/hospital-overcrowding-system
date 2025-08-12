import React from 'react';

function PredictionChart({ predictions }) {
  const maxValue = Math.max(...predictions.map(p => Math.max(p.predicted, p.capacity)), 30);

  return (
    <div className="card">
      <h3>📈 Hourly Predictions</h3>
      <div style={{ display: 'flex', alignItems: 'end', gap: '1rem', height: '200px', padding: '1rem 0' }}>
        {predictions.map((pred, index) => (
          <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '150px', justifyContent: 'end' }}>
              <div style={{
                width: '30px',
                height: `${(pred.predicted / maxValue) * 150}px`,
                background: pred.predicted > pred.capacity ? '#e74c3c' : '#3498db',
                marginBottom: '5px',
                borderRadius: '2px'
              }}></div>
              <div style={{
                width: '30px',
                height: '2px',
                background: '#2c3e50',
                position: 'relative',
                top: `-${(pred.capacity / maxValue) * 150}px`
              }}></div>
            </div>
            <div style={{ fontSize: '0.8rem', textAlign: 'center', marginTop: '0.5rem' }}>
              <div>{pred.time}</div>
              <div style={{ color: pred.predicted > pred.capacity ? '#e74c3c' : '#27ae60' }}>
                {pred.predicted}/{pred.capacity}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: '0.8rem', color: '#7f8c8d', marginTop: '1rem' }}>
        🔵 Predicted Load | ⚫ Capacity Limit
      </div>
    </div>
  );
}

export default PredictionChart;