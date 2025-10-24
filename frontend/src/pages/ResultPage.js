import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeft, Bug, AlertTriangle, Shield, Leaf, Droplets, RotateCcw } from 'lucide-react';

const ResultContainer = styled.div`
  min-height: calc(100vh - 70px);
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 20px 15px;
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 30px;
  
  &:hover {
    background: #5a6268;
    transform: translateY(-2px);
  }
`;

const ResultHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const ResultTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  color: #333;
  margin-bottom: 10px;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const ResultSubtitle = styled.p`
  font-size: 1.1rem;
  color: #666;
`;

const ResultGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`;

const ImageSection = styled.div`
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const ResultImage = styled.img`
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const InfoSection = styled.div`
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const InsectName = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ScientificName = styled.p`
  font-size: 1.1rem;
  color: #666;
  font-style: italic;
  margin-bottom: 20px;
`;

const ConfidenceBadge = styled.div`
  display: inline-block;
  padding: 8px 16px;
  background: ${props => {
    if (props.confidence >= 0.8) return '#28a745';
    if (props.confidence >= 0.6) return '#ffc107';
    return '#dc3545';
  }};
  color: white;
  border-radius: 20px;
  font-weight: 600;
  margin-bottom: 30px;
`;

const InfoGrid = styled.div`
  display: grid;
  gap: 20px;
`;

const InfoItem = styled.div`
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  border-left: 4px solid #667eea;
`;

const InfoLabel = styled.div`
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InfoValue = styled.div`
  color: #666;
  line-height: 1.6;
`;

const DangerLevel = styled.div`
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 14px;
  background: ${props => {
    switch(props.level) {
      case 'Rất cao': return '#dc3545';
      case 'Cao': return '#fd7e14';
      case 'Trung bình': return '#ffc107';
      case 'Thấp': return '#28a745';
      default: return '#6c757d';
    }
  }};
  color: white;
`;

const NoResultsContainer = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const NoResultsIcon = styled.div`
  width: 100px;
  height: 100px;
  background: #f8f9fa;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: #6c757d;
  font-size: 48px;
`;

const NoResultsTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 10px;
`;

const NoResultsText = styled.p`
  color: #666;
  margin-bottom: 30px;
`;

const ResultPage = () => {
  const [analysisResult, setAnalysisResult] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const savedResult = localStorage.getItem('analysisResult');
    if (savedResult) {
      setAnalysisResult(JSON.parse(savedResult));
    } else {
      navigate('/');
    }
  }, [navigate]);
  
  const handleBack = () => {
    localStorage.removeItem('analysisResult');
    navigate('/');
  };
  
  if (!analysisResult) {
    return (
      <ResultContainer>
        <BackButton onClick={handleBack}>
          <ArrowLeft size={20} />
          Quay lại
        </BackButton>
        <NoResultsContainer>
          <NoResultsIcon>
            <Bug size={48} />
          </NoResultsIcon>
          <NoResultsTitle>Không có kết quả phân tích</NoResultsTitle>
          <NoResultsText>Vui lòng thử lại với ảnh khác</NoResultsText>
        </NoResultsContainer>
      </ResultContainer>
    );
  }
  
  const { image, predictions } = analysisResult;
  
  if (!predictions || predictions.length === 0) {
    return (
      <ResultContainer>
        <BackButton onClick={handleBack}>
          <ArrowLeft size={20} />
          Quay lại
        </BackButton>
        <NoResultsContainer>
          <NoResultsIcon>
            <Bug size={48} />
          </NoResultsIcon>
          <NoResultsTitle>Không phát hiện côn trùng</NoResultsTitle>
          <NoResultsText>
            Không tìm thấy côn trùng gây hại trong ảnh. Vui lòng thử với ảnh khác có côn trùng rõ ràng hơn.
          </NoResultsText>
        </NoResultsContainer>
      </ResultContainer>
    );
  }
  
  // Lấy kết quả có confidence cao nhất
  const bestPrediction = predictions[0];
  const { insect_info: insectInfo, confidence } = bestPrediction;
  
  return (
    <ResultContainer>
      <BackButton onClick={handleBack}>
        <ArrowLeft size={20} />
        Phân tích ảnh khác
      </BackButton>
      
      <ResultHeader>
        <ResultTitle>Kết Quả NhanDienSauHai</ResultTitle>
        <ResultSubtitle>AI đã phân tích và xác định loài côn trùng trong ảnh</ResultSubtitle>
      </ResultHeader>
      
      <ResultGrid>
        <ImageSection>
          <ResultImage src={image} alt="Ảnh đã phân tích" />
        </ImageSection>
        
        <InfoSection>
          <InsectName>
            <Bug size={32} />
            {insectInfo.vietnamese_name}
          </InsectName>
          
          <ScientificName>{insectInfo.scientific_name}</ScientificName>
          
          <ConfidenceBadge confidence={confidence}>
            Độ tin cậy: {Math.round(confidence * 100)}%
          </ConfidenceBadge>
          
          <InfoGrid>
            <InfoItem>
              <InfoLabel>
                <AlertTriangle size={20} />
                Mức độ nguy hiểm
              </InfoLabel>
              <InfoValue>
                <DangerLevel level={insectInfo.danger_level}>
                  {insectInfo.danger_level}
                </DangerLevel>
              </InfoValue>
            </InfoItem>
            
            <InfoItem>
              <InfoLabel>
                <Leaf size={20} />
                Cây trồng thường bị hại
              </InfoLabel>
              <InfoValue>{insectInfo.affected_crops}</InfoValue>
            </InfoItem>
            
            <InfoItem>
              <InfoLabel>
                <Shield size={20} />
                Môi trường sống
              </InfoLabel>
              <InfoValue>{insectInfo.habitat}</InfoValue>
            </InfoItem>
            
            <InfoItem>
              <InfoLabel>
                <Droplets size={20} />
                Cách phòng ngừa
              </InfoLabel>
              <InfoValue>{insectInfo.prevention}</InfoValue>
            </InfoItem>
            
            <InfoItem>
              <InfoLabel>
                <RotateCcw size={20} />
                Cách chữa trị
              </InfoLabel>
              <InfoValue>{insectInfo.treatment}</InfoValue>
            </InfoItem>
          </InfoGrid>
        </InfoSection>
      </ResultGrid>
    </ResultContainer>
  );
};

export default ResultPage;
