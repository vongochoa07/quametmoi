import React, { useState, useRef, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { Camera, X, RotateCcw, Check, AlertCircle } from 'lucide-react';
import { theme } from '../styles/theme';

const CameraOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(10px);
`;

const CameraHeader = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1001;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(to bottom, rgba(0,0,0,0.7), transparent);
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: ${theme.radius.full};
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
`;

const CameraTitle = styled.h2`
  color: white;
  font-size: 20px;
  font-weight: 600;
  margin: 0;
`;

const SwitchButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: ${theme.radius.full};
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
`;

const CameraView = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scaleX(-1); /* Mirror effect */
`;

const Canvas = styled.canvas`
  display: none;
`;

const CameraControls = styled.div`
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const CaptureButton = styled.button`
  width: 80px;
  height: 80px;
  border-radius: ${theme.radius.full};
  border: 4px solid white;
  background: rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const InnerCircle = styled.div`
  width: 60px;
  height: 60px;
  border-radius: ${theme.radius.full};
  background: white;
  transition: all 0.3s ease;
`;

const PreviewContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
`;

const PreviewImage = styled.img`
  max-width: 90%;
  max-height: 70%;
  border-radius: ${theme.radius.xl};
  box-shadow: ${theme.shadows['2xl']};
`;

const PreviewControls = styled.div`
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 20px;
`;

const ActionButton = styled.button`
  padding: 16px 32px;
  border-radius: ${theme.radius.full};
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  
  &.retake {
    background: ${theme.neutral[500]};
    color: white;
    
    &:hover {
      background: ${theme.neutral[600]};
      transform: translateY(-2px);
    }
  }
  
  &.use {
    background: ${theme.primary[500]};
    color: white;
    
    &:hover {
      background: ${theme.primary[600]};
      transform: translateY(-2px);
    }
  }
`;

const ErrorMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${theme.danger[500]};
  color: white;
  padding: 30px;
  border-radius: ${theme.radius.xl};
  text-align: center;
  max-width: 400px;
  box-shadow: ${theme.shadows['2xl']};
`;

const ErrorTitle = styled.h3`
  margin: 0 0 10px 0;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const ErrorText = styled.p`
  margin: 0 0 20px 0;
  opacity: 0.9;
`;

const RetryButton = styled.button`
  background: white;
  color: ${theme.danger[500]};
  border: none;
  padding: 12px 24px;
  border-radius: ${theme.radius.full};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.lg};
  }
`;

const LoadingSpinner = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: ${theme.radius.full};
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: translate(-50%, -50%) rotate(0deg); }
    100% { transform: translate(-50%, -50%) rotate(360deg); }
  }
`;

const CameraCapture = ({ onCapture, onClose }) => {
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
      
      // Request camera access with better constraints for desktop
      const constraints = {
        video: {
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
          frameRate: { ideal: 30, max: 60 }
        }
      };
      
      // Try different camera sources
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
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
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
      }
    }, 'image/jpeg', 0.9);
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
    if (capturedImage) {
      // Convert blob URL to file
      fetch(capturedImage)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
          onCapture(capturedImage, file);
          onClose();
        });
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
    };
  }, [startCamera, stopCamera]);
  
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
      <CameraOverlay>
        <CameraHeader>
          <CloseButton onClick={onClose}>
            <X size={24} />
          </CloseButton>
          <CameraTitle>Camera</CameraTitle>
        </CameraHeader>
        <ErrorMessage>
          <ErrorTitle>
            <AlertCircle size={24} />
            Không thể truy cập camera
          </ErrorTitle>
          <ErrorText>{error}</ErrorText>
          <RetryButton onClick={startCamera}>
            Thử lại
          </RetryButton>
        </ErrorMessage>
      </CameraOverlay>
    );
  }
  
  if (isCaptured && capturedImage) {
    return (
      <CameraOverlay>
        <PreviewContainer>
          <PreviewImage src={capturedImage} alt="Captured" />
          <PreviewControls>
            <ActionButton className="retake" onClick={retakePhoto}>
              <RotateCcw size={20} />
              Chụp lại
            </ActionButton>
            <ActionButton className="use" onClick={usePhoto}>
              <Check size={20} />
              Sử dụng ảnh
            </ActionButton>
          </PreviewControls>
        </PreviewContainer>
      </CameraOverlay>
    );
  }
  
  return (
    <CameraOverlay>
      <CameraHeader>
        <CloseButton onClick={onClose}>
          <X size={24} />
        </CloseButton>
        <CameraTitle>Chụp ảnh sâu hại</CameraTitle>
        <SwitchButton onClick={switchCamera} title="Chuyển đổi camera">
          <RotateCcw size={20} />
        </SwitchButton>
      </CameraHeader>
      
      <CameraView>
        {isLoading && <LoadingSpinner />}
        <Video
          ref={videoRef}
          autoPlay
          playsInline
          muted
        />
        <Canvas ref={canvasRef} />
      </CameraView>
      
      <CameraControls>
        <CaptureButton onClick={capturePhoto}>
          <InnerCircle />
        </CaptureButton>
      </CameraControls>
    </CameraOverlay>
  );
};

export default CameraCapture;