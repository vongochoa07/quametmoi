import React, { useState } from 'react';
import SimpleImageUpload from './components/SimpleImageUpload';
import { predictInsect } from './services/api';

const SimpleApp = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleImageSelect = (imageData, file) => {
    console.log('Image selected:', file.name);
    setSelectedImage({ imageData, file });
    setResult(null);
  };

  const handleImageRemove = () => {
    console.log('Image removed');
    setSelectedImage(null);
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      alert('Vui lòng chọn ảnh trước khi phân tích');
      return;
    }

    console.log('Starting analysis...');
    setIsAnalyzing(true);
    try {
      const result = await predictInsect(selectedImage.file);
      console.log('Analysis result:', result);
      setResult(result);
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Có lỗi xảy ra khi phân tích ảnh: ' + error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)'
      }}>
        <h1 style={{
          textAlign: 'center',
          fontSize: '2.5rem',
          fontWeight: '800',
          marginBottom: '20px',
          color: '#262626'
        }}>
          🐛 NhanDienSauHai AI
        </h1>
        
        <p style={{
          textAlign: 'center',
          fontSize: '1.2rem',
          color: '#525252',
          marginBottom: '40px'
        }}>
          Ứng dụng thông minh giúp nông dân nhận diện sâu hại
        </p>

        <SimpleImageUpload
          onImageSelect={handleImageSelect}
          onImageRemove={handleImageRemove}
          selectedImage={selectedImage?.imageData}
        />
        
        {selectedImage && (
          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              style={{
                background: isAnalyzing ? '#9ca3af' : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                color: 'white',
                border: 'none',
                padding: '16px 40px',
                borderRadius: '9999px',
                fontSize: '18px',
                fontWeight: '600',
                cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                margin: '0 auto'
              }}
            >
              {isAnalyzing ? (
                <>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid currentColor',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Đang phân tích...
                </>
              ) : (
                <>
                  🧠 Phân tích ảnh
                </>
              )}
            </button>
          </div>
        )}

        {result && (
          <div style={{
            marginTop: '30px',
            padding: '30px',
            background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
            borderRadius: '16px',
            border: '2px solid #22c55e',
            boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)'
          }}>
            <h2 style={{ 
              color: '#15803d', 
              marginBottom: '20px',
              fontSize: '24px',
              fontWeight: '700',
              textAlign: 'center'
            }}>
              🎯 Kết quả phân tích AI
            </h2>
            
            {result.success && result.predictions && result.predictions.length > 0 ? (
              <div>
                <div style={{
                  background: 'white',
                  padding: '20px',
                  borderRadius: '12px',
                  marginBottom: '20px',
                  border: '1px solid #e5e5e5'
                }}>
                  <h3 style={{ color: '#374151', marginBottom: '15px', fontSize: '18px' }}>
                    📊 Tổng quan:
                  </h3>
                  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#22c55e' }}>
                        {result.total_detections || result.predictions.length}
                      </div>
                      <div style={{ color: '#6b7280', fontSize: '14px' }}>Đối tượng phát hiện</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>
                        {Math.round((result.predictions[0]?.confidence || 0) * 100)}%
                      </div>
                      <div style={{ color: '#6b7280', fontSize: '14px' }}>Độ tin cậy</div>
                    </div>
                  </div>
                </div>

                {result.predictions.map((prediction, index) => (
                  <div key={index} style={{
                    background: 'white',
                    padding: '25px',
                    borderRadius: '12px',
                    marginBottom: '15px',
                    border: '1px solid #e5e5e5',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                      <h4 style={{ 
                        color: '#1f2937', 
                        margin: 0, 
                        fontSize: '20px',
                        fontWeight: '600'
                      }}>
                        🐛 {prediction.insect_info?.vietnamese_name || 'Côn trùng không xác định'}
                      </h4>
                      <div style={{
                        background: prediction.confidence > 0.8 ? '#dcfce7' : prediction.confidence > 0.6 ? '#fef3c7' : '#fee2e2',
                        color: prediction.confidence > 0.8 ? '#15803d' : prediction.confidence > 0.6 ? '#d97706' : '#dc2626',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}>
                        {Math.round(prediction.confidence * 100)}% tin cậy
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                      <div>
                        <h5 style={{ color: '#374151', marginBottom: '8px', fontSize: '16px' }}>
                          🔬 Tên khoa học:
                        </h5>
                        <p style={{ color: '#6b7280', margin: 0, fontStyle: 'italic' }}>
                          {prediction.insect_info?.scientific_name || 'Chưa xác định'}
                        </p>
                      </div>

                      <div>
                        <h5 style={{ color: '#374151', marginBottom: '8px', fontSize: '16px' }}>
                          ⚠️ Mức độ nguy hiểm:
                        </h5>
                        <p style={{ 
                          color: prediction.insect_info?.danger_level === 'Rất cao' ? '#dc2626' : 
                                prediction.insect_info?.danger_level === 'Cao' ? '#ea580c' :
                                prediction.insect_info?.danger_level === 'Trung bình' ? '#d97706' : '#16a34a',
                          margin: 0,
                          fontWeight: '600',
                          fontSize: '16px'
                        }}>
                          {prediction.insect_info?.danger_level || 'Chưa xác định'}
                        </p>
                      </div>

                      <div>
                        <h5 style={{ color: '#374151', marginBottom: '8px', fontSize: '16px' }}>
                          🌱 Cây trồng bị ảnh hưởng:
                        </h5>
                        <p style={{ color: '#6b7280', margin: 0 }}>
                          {prediction.insect_info?.affected_crops || 'Chưa xác định'}
                        </p>
                      </div>

                      <div>
                        <h5 style={{ color: '#374151', marginBottom: '8px', fontSize: '16px' }}>
                          🏠 Môi trường sống:
                        </h5>
                        <p style={{ color: '#6b7280', margin: 0 }}>
                          {prediction.insect_info?.habitat || 'Chưa xác định'}
                        </p>
                      </div>
                    </div>

                    <div style={{ marginTop: '20px' }}>
                      <h5 style={{ color: '#374151', marginBottom: '10px', fontSize: '16px' }}>
                        🛡️ Biện pháp phòng ngừa:
                      </h5>
                      <p style={{ 
                        color: '#4b5563', 
                        margin: 0, 
                        lineHeight: '1.6',
                        background: '#f9fafb',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb'
                      }}>
                        {prediction.insect_info?.prevention || 'Chưa có thông tin'}
                      </p>
                    </div>

                    <div style={{ marginTop: '15px' }}>
                      <h5 style={{ color: '#374151', marginBottom: '10px', fontSize: '16px' }}>
                        💊 Biện pháp xử lý:
                      </h5>
                      <p style={{ 
                        color: '#4b5563', 
                        margin: 0, 
                        lineHeight: '1.6',
                        background: '#fef2f2',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #fecaca'
                      }}>
                        {prediction.insect_info?.treatment || 'Chưa có thông tin'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                background: '#fef2f2',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid #fecaca',
                textAlign: 'center'
              }}>
                <h3 style={{ color: '#dc2626', marginBottom: '10px' }}>
                  ❌ Không phát hiện được sâu hại
                </h3>
                <p style={{ color: '#6b7280', margin: 0 }}>
                  Vui lòng thử với ảnh khác hoặc kiểm tra chất lượng ảnh
                </p>
              </div>
            )}
          </div>
        )}

        <div style={{
          marginTop: '40px',
          textAlign: 'center',
          padding: '20px',
          background: '#f8fafc',
          borderRadius: '12px'
        }}>
          <h3 style={{ color: '#374151', marginBottom: '15px' }}>
            📊 Thống kê hệ thống
          </h3>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#22c55e' }}>102</div>
              <div style={{ color: '#6b7280' }}>Loài sâu hại</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>95%</div>
              <div style={{ color: '#6b7280' }}>Độ chính xác</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>24/7</div>
              <div style={{ color: '#6b7280' }}>Hỗ trợ</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SimpleApp;
