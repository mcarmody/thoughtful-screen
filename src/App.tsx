import React, { useState } from 'react';
import { sort, sortWithReason, Package, SortConfig } from './packageSorter.ts';
import './App.css';

const App: React.FC = () => {
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [length, setLength] = useState('');
  const [mass, setMass] = useState('');
  const [result, setResult] = useState('');
  const [reason, setReason] = useState('');
  const [packages, setPackages] = useState<Package[]>([]);
  const [error, setError] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [config, setConfig] = useState<SortConfig>({
    volumeThreshold: 1000000,
    dimensionThreshold: 150,
    massThreshold: 20
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const w = parseFloat(width);
      const h = parseFloat(height);
      const l = parseFloat(length);
      const m = parseFloat(mass);
      
      if (isNaN(w) || isNaN(h) || isNaN(l) || isNaN(m)) {
        throw new Error('Please enter valid numbers for all fields');
      }
      
      const sortResult = sortWithReason(w, h, l, m, config);
      setResult(sortResult.classification);
      setReason(sortResult.reason);
      
      const newPackage: Package = {
        id: Date.now().toString(),
        width: w,
        height: h,
        length: l,
        mass: m,
        result: sortResult.classification,
        reason: sortResult.reason,
        timestamp: new Date()
      };
      
      setPackages(prev => [newPackage, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult('');
      setReason('');
    }
  };

  const clearHistory = () => {
    setPackages([]);
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case 'STANDARD': return '#28a745';
      case 'SPECIAL': return '#ffc107';
      case 'REJECTED': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Thoughtful Package Sorter</h1>
        <p>Robotic Automation Factory - Package Dispatch System</p>
      </header>

      <main className="app-main">
        <div className="sorter-container">
          <div className="form-header">
            <h2>Package Dimensions & Mass</h2>
            <button 
              type="button" 
              className="settings-button"
              onClick={() => setShowSettings(!showSettings)}
              title="Settings"
            >
              ⚙️
            </button>
          </div>

          {showSettings && (
            <div className="settings-panel">
              <h3>Sorting Thresholds</h3>
              <div className="config-inputs">
                <div className="config-group">
                  <label htmlFor="volumeThreshold">Volume Threshold (cm³):</label>
                  <input
                    type="number"
                    id="volumeThreshold"
                    value={config.volumeThreshold}
                    onChange={(e) => setConfig(prev => ({ ...prev, volumeThreshold: parseInt(e.target.value) || 0 }))}
                    min="1"
                  />
                </div>
                <div className="config-group">
                  <label htmlFor="dimensionThreshold">Dimension Threshold (cm):</label>
                  <input
                    type="number"
                    id="dimensionThreshold"
                    value={config.dimensionThreshold}
                    onChange={(e) => setConfig(prev => ({ ...prev, dimensionThreshold: parseInt(e.target.value) || 0 }))}
                    min="1"
                  />
                </div>
                <div className="config-group">
                  <label htmlFor="massThreshold">Mass Threshold (kg):</label>
                  <input
                    type="number"
                    id="massThreshold"
                    value={config.massThreshold}
                    onChange={(e) => setConfig(prev => ({ ...prev, massThreshold: parseInt(e.target.value) || 0 }))}
                    min="1"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="current-thresholds">
            <p><strong>Current Thresholds:</strong></p>
            <p>• Bulky: Volume ≥ {config.volumeThreshold.toLocaleString()} cm³ or any dimension ≥ {config.dimensionThreshold} cm</p>
            <p>• Heavy: Mass ≥ {config.massThreshold} kg</p>
          </div>

          <form onSubmit={handleSubmit} className="package-form">
            
            <div className="input-group">
              <label htmlFor="width">Width (cm):</label>
              <input
                type="number"
                id="width"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                placeholder="Enter width in cm"
                step="0.01"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="height">Height (cm):</label>
              <input
                type="number"
                id="height"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="Enter height in cm"
                step="0.01"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="length">Length (cm):</label>
              <input
                type="number"
                id="length"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                placeholder="Enter length in cm"
                step="0.01"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="mass">Mass (kg):</label>
              <input
                type="number"
                id="mass"
                value={mass}
                onChange={(e) => setMass(e.target.value)}
                placeholder="Enter mass in kg"
                step="0.01"
                required
              />
            </div>

            <button type="submit" className="sort-button">
              Sort Package
            </button>
          </form>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {result && (
            <div className="result-container">
              <h3>Package Classification:</h3>
              <div 
                className="result-badge"
                style={{ backgroundColor: getResultColor(result) }}
              >
                {result}
              </div>
              {reason && (
                <div className="reason-text">
                  {reason}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="history-container">
          <div className="history-header">
            <h2>Package History ({packages.length})</h2>
            {packages.length > 0 && (
              <button onClick={clearHistory} className="clear-button">
                Clear History
              </button>
            )}
          </div>

          {packages.length === 0 ? (
            <p className="no-packages">No packages sorted yet.</p>
          ) : (
            <div className="packages-list">
              {packages.map((pkg) => (
                <div key={pkg.id} className="package-item">
                  <div className="package-info">
                    <div className="package-dimensions">
                      {pkg.width} × {pkg.height} × {pkg.length} cm, {pkg.mass} kg
                    </div>
                    <div className="package-reason">
                      {pkg.reason}
                    </div>
                    <div className="package-timestamp">
                      {pkg.timestamp.toLocaleString()}
                    </div>
                  </div>
                  <div 
                    className="package-result"
                    style={{ color: getResultColor(pkg.result) }}
                  >
                    {pkg.result}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <div className="sorting-rules">
          <h3>Sorting Rules:</h3>
          <ul>
            <li><strong>STANDARD:</strong> Not bulky and not heavy</li>
            <li><strong>SPECIAL:</strong> Either bulky OR heavy (but not both)</li>
            <li><strong>REJECTED:</strong> Both bulky AND heavy</li>
          </ul>
          <p><em>Bulky: Volume ≥ {config.volumeThreshold.toLocaleString()} cm³ or any dimension ≥ {config.dimensionThreshold} cm</em></p>
          <p><em>Heavy: Mass ≥ {config.massThreshold} kg</em></p>
        </div>
      </footer>
    </div>
  );
};

export default App;