import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';
import { Upload, Camera, X, Image as ImageIcon, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import CameraCapture from './CameraCapture';
import { theme } from '../styles/theme';

const UploadContainer = styled.div`
  background: white;
  border-radius: ${theme.radius['2xl']};
  padding: 40px;
  box-shadow: ${theme.shadows.xl};
  border: 1px solid ${theme.neutral[200]};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${theme.gradients.primary};
  }
`;

const UploadHeader = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const UploadTitle = styled.h3`
  font-size: 24px;
  font-weight: 700;
  color: ${theme.neutral[800]};
  margin-bottom: 10px;
`;

const UploadSubtitle = styled.p`
  color: ${theme.neutral[600]};
  font-size: 16px;
  margin: 0;
`;

const DropzoneContainer = styled.div`
  border: 2px dashed ${props => props.isDragActive ? theme.primary[500] : theme.neutral[300]};
  border-radius: ${theme.radius.xl};
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.isDragActive ? theme.primary[50] : 'transparent'};
  
  &:hover {
    border-color: ${theme.primary[500]};
    background: ${theme.primary[50]};
  }
`;

const DropzoneIcon = styled.div`
  width: 80px;
  height: 80px;
  background: ${theme.gradients.primary};
  border-radius: ${theme.radius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: white;
`;

const DropzoneText = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: ${theme.neutral[700]};
  margin-bottom: 10px;
`;

const DropzoneSubtext = styled.div`
  color: ${theme.neutral[500]};
  font-size: 14px;
  margin-bottom: 20px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  background: ${props => props.variant === 'primary' ? theme.gradients.primary : 'white'};
  color: ${props => props.variant === 'primary' ? 'white' : theme.primary[600]};
  border: ${props => props.variant === 'primary' ? 'none' : `2px solid ${theme.primary[300]}`};
  padding: 12px 24px;
  border-radius: ${theme.radius.full};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.lg};
    border-color: ${props => props.variant !== 'primary' ? theme.primary[500] : 'none'};
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const PreviewContainer = styled.div`
  position: relative;
  margin-top: 30px;
`;

const PreviewImage = styled.img`
  width: 100%;
  max-width: 500px;
  height: 300px;
  object-fit: cover;
  border-radius: ${theme.radius.xl};
  box-shadow: ${theme.shadows.lg};
  margin: 0 auto;
  display: block;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: ${theme.danger[500]};
  color: white;
  border: none;
  border-radius: ${theme.radius.full};
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${theme.shadows.lg};
  
  &:hover {
    background: ${theme.danger[600]};
    transform: scale(1.1);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 40px;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid ${theme.neutral[200]};
  border-top: 4px solid ${theme.primary[500]};
  border-radius: ${theme.radius.full};
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  color: ${theme.neutral[600]};
  font-size: 16px;
  margin: 0;
`;

const FileInput = styled.input`
  display: none;
`;

const StatusMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px 20px;
  border-radius: ${theme.radius.lg};
  margin-top: 20px;
  font-weight: 500;
  
  &.success {
    background: ${theme.success[50]};
    color: ${theme.success[700]};
    border: 1px solid ${theme.success[200]};
  }
  
  &.error {
    background: ${theme.danger[50]};
    color: ${theme.danger[700]};
    border: 1px solid ${theme.danger[200]};
  }
`;

const ImageUpload = ({ onImageSelect, onImageRemove, selectedImage }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      setUploadStatus({
        type: 'error',
        message: 'File không hợp lệ. Vui lòng chọn file ảnh (JPG, PNG, GIF).'
      });
      return;
    }
    
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        onImageSelect(e.target.result, file);
        setUploadStatus({
          type: 'success',
          message: 'Ảnh đã được tải lên thành công!'
        });
      };
      
      reader.readAsDataURL(file);
    }
  }, [onImageSelect]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024 // 10MB
  });
  
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      onDrop([file], []);
    }
  };
  
  const handleCameraClick = () => {
    setShowCamera(true);
  };
  
  const handleCameraCapture = (imageData, file) => {
    onImageSelect(imageData, file);
    setShowCamera(false);
    setUploadStatus({
      type: 'success',
      message: 'Ảnh đã được chụp thành công!'
    });
  };
  
  const handleCameraClose = () => {
    setShowCamera(false);
  };
  
  const handleRemoveImage = () => {
    onImageRemove();
    setUploadStatus(null);
  };
  
  return (
    <UploadContainer>
      <UploadHeader>
        <UploadTitle>Upload ảnh sâu hại</UploadTitle>
        <UploadSubtitle>
          Kéo thả ảnh vào đây hoặc chọn từ thiết bị của bạn
        </UploadSubtitle>
      </UploadHeader>
      
      {!selectedImage ? (
        <>
          <DropzoneContainer {...getRootProps()} isDragActive={isDragActive}>
            <input {...getInputProps()} />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              id="file-input"
            />
            
            <DropzoneIcon>
              <Upload size={40} />
            </DropzoneIcon>
            
            <DropzoneText>
              {isDragActive ? 'Thả ảnh vào đây' : 'Kéo thả ảnh vào đây'}
            </DropzoneText>
            
            <DropzoneSubtext>
              hoặc click để chọn file từ máy tính
            </DropzoneSubtext>
            
            <ActionButtons>
              <ActionButton
                type="button"
                onClick={() => document.getElementById('file-input').click()}
                variant="primary"
              >
                <ImageIcon size={18} />
                Chọn ảnh
              </ActionButton>
              
              <ActionButton
                type="button"
                onClick={handleCameraClick}
                variant="secondary"
              >
                <Camera size={18} />
                Chụp ảnh
              </ActionButton>
            </ActionButtons>
          </DropzoneContainer>
          
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <p style={{ color: theme.neutral[500], fontSize: '14px', margin: 0 }}>
              Hỗ trợ: JPG, PNG, GIF, WebP (tối đa 10MB)
            </p>
          </div>
        </>
      ) : (
        <PreviewContainer>
          <PreviewImage src={selectedImage} alt="Selected" />
          <RemoveButton onClick={handleRemoveImage}>
            <X size={20} />
          </RemoveButton>
        </PreviewContainer>
      )}
      
      {isLoading && (
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>Đang xử lý ảnh...</LoadingText>
        </LoadingContainer>
      )}
      
      {uploadStatus && (
        <StatusMessage className={uploadStatus.type}>
          {uploadStatus.type === 'success' ? (
            <CheckCircle size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          {uploadStatus.message}
        </StatusMessage>
      )}
      
      {showCamera && (
        <CameraCapture
          onCapture={handleCameraCapture}
          onClose={handleCameraClose}
        />
      )}
    </UploadContainer>
  );
};

export default ImageUpload;