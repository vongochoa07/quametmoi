import React, { useState } from 'react';
import BasicCameraCapture from './BasicCameraCapture';

const SimpleImageUpload = ({ onImageSelect, onImageRemove, selectedImage }) => {
  const [showCamera, setShowCamera] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageSelect(e.target.result, file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraClick = () => {
    console.log('Camera button clicked!');
    setShowCamera(true);
  };

  const handleFileClick = () => {
    console.log('File button clicked!');
    document.getElementById('file-input').click();
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '20px',
      padding: '40px',
      boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
      border: '1px solid #e5e5e5',
      textAlign: 'center'
    }}>
      <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#262626', marginBottom: '10px' }}>
        Upload ảnh sâu hại
      </h3>
      <p style={{ color: '#525252', fontSize: '16px', margin: '0 0 30px 0' }}>
        Kéo thả ảnh vào đây hoặc chọn từ thiết bị của bạn
      </p>
      
      {!selectedImage ? (
        <div>
          <div style={{
            border: '2px dashed #d4d4d4',
            borderRadius: '16px',
            padding: '40px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            marginBottom: '20px'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              color: 'white'
            }}>
              📁
            </div>
            
            <div style={{ fontSize: '18px', fontWeight: '600', color: '#404040', marginBottom: '10px' }}>
              Kéo thả ảnh vào đây
            </div>
            
            <div style={{ color: '#737373', fontSize: '14px', marginBottom: '20px' }}>
              hoặc click để chọn file từ máy tính
            </div>
            
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={handleFileClick}
                style={{
                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '9999px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px'
                }}
              >
                🖼️ Chọn ảnh
              </button>
              
              <button
                onClick={handleCameraClick}
                style={{
                  background: 'white',
                  color: '#22c55e',
                  border: '2px solid #86efac',
                  padding: '12px 24px',
                  borderRadius: '9999px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px'
                }}
              >
                📷 Chụp ảnh
              </button>
            </div>
          </div>
          
          <input
            type="file"
            id="file-input"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          
          <p style={{ color: '#737373', fontSize: '14px', margin: 0 }}>
            Hỗ trợ: JPG, PNG, GIF, WebP (tối đa 10MB)
          </p>
        </div>
      ) : (
        <div style={{ position: 'relative', marginTop: '30px' }}>
          <img
            src={selectedImage}
            alt="Selected"
            style={{
              width: '100%',
              maxWidth: '500px',
              height: '300px',
              objectFit: 'cover',
              borderRadius: '16px',
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
              margin: '0 auto',
              display: 'block'
            }}
          />
          <button
            onClick={onImageRemove}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
            }}
          >
            ✕
          </button>
        </div>
      )}
      
      {showCamera && (
        <BasicCameraCapture
          onCapture={(imageData, file) => {
            onImageSelect(imageData, file);
            setShowCamera(false);
          }}
          onClose={() => setShowCamera(false)}
        />
      )}
    </div>
  );
};

export default SimpleImageUpload;
