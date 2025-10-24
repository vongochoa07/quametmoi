// Test file để kiểm tra buttons
import React from 'react';

const TestButtons = () => {
  const handleFileClick = () => {
    console.log('File button clicked!');
    alert('File button clicked!');
  };

  const handleCameraClick = () => {
    console.log('Camera button clicked!');
    alert('Camera button clicked!');
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Test Buttons</h2>
      <button 
        onClick={handleFileClick}
        style={{
          padding: '10px 20px',
          margin: '10px',
          backgroundColor: '#22c55e',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Test File Button
      </button>
      
      <button 
        onClick={handleCameraClick}
        style={{
          padding: '10px 20px',
          margin: '10px',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Test Camera Button
      </button>
    </div>
  );
};

export default TestButtons;
