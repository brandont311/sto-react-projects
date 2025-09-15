import React from 'react'

const TestComponent = () => {
  return (
    <div style={{ padding: '20px', backgroundColor: '#1f2937', color: 'white', minHeight: '100vh' }}>
      <h1>STO Unified Field Simulator - Test</h1>
      <p>If you see this, the basic React setup is working!</p>
      <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#374151', borderRadius: '8px' }}>
        <h2>🎯 Status Check</h2>
        <ul>
          <li>✅ React importing correctly</li>
          <li>✅ Component rendering</li>
          <li>✅ Styles applying</li>
        </ul>
      </div>
    </div>
  )
}

export default TestComponent