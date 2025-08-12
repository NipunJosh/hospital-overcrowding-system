import React from 'react';
import PredictionChart from '../components/PredictionChart';
import { useHospital } from '../context/HospitalContext';

function PredictionsPage() {
  const { getHourlyPredictions } = useHospital();
  const predictions = getHourlyPredictions();
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <PredictionChart predictions={predictions} />
      
      <div className="card" style={{ marginTop: '2rem' }}>
        <h3>📊 Prediction Details</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginTop: '1.5rem' }}>
          {predictions.map((pred, index) => (
            <div key={index} style={{
              padding: '1rem',
              background: pred.predicted > pred.capacity ? 'rgba(231, 76, 60, 0.1)' : 'rgba(46, 204, 113, 0.1)',
              borderRadius: '10px',
              textAlign: 'center'
            }}>
              <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{pred.time}</div>
              <div style={{ margin: '0.5rem 0' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{pred.predicted}</span>
                <span style={{ color: '#7f8c8d' }}>/{pred.capacity}</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#7f8c8d', marginTop: '0.5rem' }}>
                {pred.patients.length > 0 ? (
                  <div>
                    <strong>Patients:</strong>
                    {pred.patients.map(p => (
                      <div key={p.id} style={{ fontSize: '0.7rem', marginTop: '0.25rem' }}>
                        {p.name} ({p.priority})
                      </div>
                    ))}
                  </div>
                ) : (
                  'No patients scheduled'
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PredictionsPage;