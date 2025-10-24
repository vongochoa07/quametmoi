import React, { useState, useRef, useCallback, useEffect } from 'react';

const BasicCameraCapture = ({ onCapture, onClose }) => {
  const [stream, setStream] = useState(null);
  const [isCaptured, setIsCaptured] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  const startCamera = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      // Stop existing stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      // Check for camera support
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera không được hỗ trợ trên trình duyệt này.');
      }
      
      // Request camera access
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error('Camera error:', err);
      let errorMessage = 'Không thể truy cập camera. ';
      
      if (err.name === 'NotAllowedError') {
        errorMessage += 'Vui lòng cho phép truy cập camera.';
      } else if (err.name === 'NotFoundError') {
        errorMessage += 'Không tìm thấy camera.';
      } else {
        errorMessage += err.message;
      }
      
      setError(errorMessage);
      setIsLoading(false);
    }
  }, [stream]);
  
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);
  
  const capturePhoto = useCallback(() => {
    try {
      if (!videoRef.current || !canvasRef.current) {
        console.error('Video or canvas not ready');
        return;
      }
      
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        console.error('Video not ready');
        return;
      }
      
      const context = canvas.getContext('2d');
      if (!context) {
        console.error('Cannot get canvas context');
        return;
      }
      
      // Set canvas size
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert to data URL
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedImage(imageDataUrl);
      setIsCaptured(true);
      stopCamera();
      
    } catch (error) {
      console.error('Error capturing photo:', error);
      setError('Lỗi khi chụp ảnh: ' + error.message);
    }
  }, [stopCamera]);
  
  const retakePhoto = useCallback(() => {
    setIsCaptured(false);
    setCapturedImage(null);
    startCamera();
  }, [startCamera]);
  
  const usePhoto = useCallback(() => {
    try {
      if (capturedImage) {
        // Convert data URL to blob
        fetch(capturedImage)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
            onCapture(capturedImage, file);
            onClose();
          })
          .catch(error => {
            console.error('Error using photo:', error);
            setError('Lỗi khi sử dụng ảnh: ' + error.message);
          });
      }
    } catch (error) {
      console.error('Error in usePhoto:', error);
      setError('Lỗi khi sử dụng ảnh: ' + error.message);
    }
  }, [capturedImage, onCapture, onClose]);
  
  // Start camera when component mounts
  useEffect(() => {
    startCamera();
    
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);
  
  if (error) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.95)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        color: 'white',
        padding: '40px'
      }}>
        <div style={{
          background: '#ef4444',
          color: 'white',
          padding: '30px',
          borderRadius: '16px',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '20px' }}>
            ⚠️ Lỗi Camera
          </h3>
          <p style={{ margin: '0 0 20px 0', opacity: 0.9 }}>
            {error}
          </p>
          <button
            onClick={startCamera}
            style={{
              background: 'white',
              color: '#ef4444',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Thử lại
          </button>
        </div>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            cursor: 'pointer',
            fontSize: '24px'
          }}
        >
          ✕
        </button>
      </div>
    );
  }
  
  if (isCaptured && capturedImage) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'black',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px'
      }}>
        <img
          src={capturedImage}
          alt="Captured"
          style={{
            maxWidth: '90%',
            maxHeight: '70%',
            borderRadius: '16px'
          }}
        />
        <div style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '20px'
        }}>
          <button
            onClick={retakePhoto}
            style={{
              padding: '16px 32px',
              borderRadius: '50px',
              border: 'none',
              fontWeight: '600',
              cursor: 'pointer',
              background: '#6b7280',
              color: 'white'
            }}
          >
            🔄 Chụp lại
          </button>
          <button
            onClick={usePhoto}
            style={{
              padding: '16px 32px',
              borderRadius: '50px',
              border: 'none',
              fontWeight: '600',
              cursor: 'pointer',
              background: '#22c55e',
              color: 'white'
            }}
          >
            ✅ Sử dụng ảnh
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.95)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10000,
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)'
      }}>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            cursor: 'pointer',
            fontSize: '24px'
          }}
        >
          ✕
        </button>
        <h2 style={{ color: 'white', fontSize: '20px', fontWeight: '600', margin: 0 }}>
          Chụp ảnh sâu hại
        </h2>
        <div style={{ width: '50px' }} />
      </div>
      
      <div style={{
        flex: 1,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        {isLoading && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            fontSize: '18px'
          }}>
            Đang khởi động camera...
          </div>
        )}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
      
      <div style={{
        position: 'absolute',
        bottom: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px'
      }}>
        <button
          onClick={capturePhoto}
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            border: '4px solid white',
            background: 'rgba(255, 255, 255, 0.2)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'white'
          }} />
        </button>
      </div>
    </div>
  );
};

export default BasicCameraCapture;
