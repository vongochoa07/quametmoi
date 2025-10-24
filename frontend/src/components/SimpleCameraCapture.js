import React, { useState, useRef, useCallback, useEffect } from 'react';

const SimpleCameraCapture = ({ onCapture, onClose }) => {
  const [stream, setStream] = useState(null);
  const [isCaptured, setIsCaptured] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState(null);
  const [facingMode, setFacingMode] = useState('environment');
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
        throw new Error('Camera không được hỗ trợ trên trình duyệt này. Vui lòng sử dụng Chrome, Firefox hoặc Safari mới nhất.');
      }
      
      // Request camera access
      const constraints = {
        video: {
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
          frameRate: { ideal: 30, max: 60 }
        }
      };
      
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        setStream(mediaStream);
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
        }
        
        setIsLoading(false);
      } catch (err) {
        // Fallback to basic constraints
        const basicConstraints = { video: true };
        const mediaStream = await navigator.mediaDevices.getUserMedia(basicConstraints);
        setStream(mediaStream);
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
        }
        
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Camera error:', err);
      let errorMessage = 'Không thể truy cập camera. ';
      
      if (err.name === 'NotAllowedError') {
        errorMessage += 'Vui lòng cho phép truy cập camera trong trình duyệt.';
      } else if (err.name === 'NotFoundError') {
        errorMessage += 'Không tìm thấy camera trên thiết bị.';
      } else if (err.name === 'NotSupportedError') {
        errorMessage += 'Trình duyệt không hỗ trợ camera.';
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
        console.error('Video or canvas ref not available');
        return;
      }
      
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Check if video is ready
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        console.error('Video not ready');
        return;
      }
      
      const context = canvas.getContext('2d');
      if (!context) {
        console.error('Cannot get canvas context');
        return;
      }
      
      // Set canvas size to video size
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to canvas (mirror the image)
      context.save();
      context.scale(-1, 1);
      context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
      context.restore();
      
      // Convert to blob
      canvas.toBlob((blob) => {
        if (blob) {
          const imageUrl = URL.createObjectURL(blob);
          setCapturedImage(imageUrl);
          setIsCaptured(true);
          stopCamera();
        } else {
          console.error('Failed to create blob from canvas');
        }
      }, 'image/jpeg', 0.9);
    } catch (error) {
      console.error('Error capturing photo:', error);
      setError('Lỗi khi chụp ảnh: ' + error.message);
    }
  }, [stopCamera]);
  
  const retakePhoto = useCallback(() => {
    setIsCaptured(false);
    setCapturedImage(null);
    if (capturedImage) {
      URL.revokeObjectURL(capturedImage);
    }
    startCamera();
  }, [startCamera, capturedImage]);
  
  const usePhoto = useCallback(() => {
    try {
      if (capturedImage) {
        // Convert blob URL to file
        fetch(capturedImage)
          .then(res => {
            if (!res.ok) {
              throw new Error('Failed to fetch image');
            }
            return res.blob();
          })
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
  
  const switchCamera = useCallback(() => {
    // Only switch on mobile devices
    if (navigator.userAgent.match(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i)) {
      setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    } else {
      // On desktop, just restart camera
      startCamera();
    }
  }, [startCamera]);
  
  // Start camera when component mounts
  useEffect(() => {
    startCamera();
    
    return () => {
      stopCamera();
      // Cleanup captured image URL
      if (capturedImage) {
        URL.revokeObjectURL(capturedImage);
      }
    };
  }, [startCamera, stopCamera, capturedImage]);
  
  // Restart camera when facing mode changes
  useEffect(() => {
    if (stream) {
      stopCamera();
      setTimeout(() => {
        startCamera();
      }, 100);
    }
  }, [facingMode]);
  
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
          maxWidth: '400px',
          boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            ⚠️ Không thể truy cập camera
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
              cursor: 'pointer',
              transition: 'all 0.3s ease'
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
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
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)'
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
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '16px',
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
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '16px',
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
      flexDirection: 'column',
      backdropFilter: 'blur(10px)'
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)',
            fontSize: '24px'
          }}
        >
          ✕
        </button>
        <h2 style={{ color: 'white', fontSize: '20px', fontWeight: '600', margin: 0 }}>
          Chụp ảnh sâu hại
        </h2>
        <button
          onClick={switchCamera}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)',
            fontSize: '20px'
          }}
          title="Chuyển đổi camera"
        >
          🔄
        </button>
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
            width: '60px',
            height: '60px',
            border: '4px solid rgba(255, 255, 255, 0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
        )}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'scaleX(-1)'
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
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)'
          }}
        >
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'white',
            transition: 'all 0.3s ease'
          }} />
        </button>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SimpleCameraCapture;
