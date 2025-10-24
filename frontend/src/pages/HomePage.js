import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Brain, Shield, Leaf, ArrowRight, Sparkles, Camera, Upload, Search, BarChart3, Users, Award } from 'lucide-react';
import SimpleImageUpload from '../components/SimpleImageUpload';
import { predictInsect } from '../services/api';
import { toast } from 'react-toastify';
import { theme } from '../styles/theme';

const HomeContainer = styled.div`
  min-height: 100vh;
  background: ${theme.gradients.hero};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.05)"/><circle cx="10" cy="60" r="0.5" fill="rgba(255,255,255,0.05)"/><circle cx="90" cy="40" r="0.5" fill="rgba(255,255,255,0.05)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
    opacity: 0.3;
    z-index: 1;
  }
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const Header = styled.div`
  padding: 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: white;
  font-size: 24px;
  font-weight: 700;
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: ${theme.radius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
`;

const NavLinks = styled.div`
  display: flex;
  gap: 30px;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled.a`
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    color: white;
    transform: translateY(-2px);
  }
`;

const HeroSection = styled.div`
  text-align: center;
  padding: 80px 0 120px;
  color: white;
`;

const HeroTitle = styled.h1`
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  margin-bottom: 20px;
  line-height: 1.1;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
`;

const HeroSubtitle = styled.p`
  font-size: clamp(1.1rem, 2vw, 1.3rem);
  margin-bottom: 40px;
  opacity: 0.95;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 60px;
`;

const PrimaryButton = styled.button`
  background: white;
  color: ${theme.primary[600]};
  border: none;
  padding: 16px 32px;
  border-radius: ${theme.radius.full};
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: ${theme.shadows.lg};
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: ${theme.shadows['2xl']};
  }
  
  &:active {
    transform: translateY(-1px);
  }
`;

const SecondaryButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 14px 30px;
  border-radius: ${theme.radius.full};
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-2px);
  }
`;

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  margin-bottom: 80px;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: ${theme.radius.xl};
  padding: 30px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.15);
  }
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 8px;
  color: white;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  opacity: 0.9;
  color: white;
`;

const FeaturesSection = styled.div`
  background: white;
  padding: 100px 0;
  margin-top: -50px;
  position: relative;
  z-index: 2;
`;

const FeaturesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  color: ${theme.neutral[800]};
  margin-bottom: 20px;
`;

const SectionSubtitle = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: ${theme.neutral[600]};
  margin-bottom: 60px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  margin-bottom: 80px;
`;

const FeatureCard = styled.div`
  background: white;
  border-radius: ${theme.radius.xl};
  padding: 40px;
  box-shadow: ${theme.shadows.lg};
  border: 1px solid ${theme.neutral[200]};
  transition: all 0.3s ease;
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
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${theme.shadows['2xl']};
  }
`;

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  background: ${theme.gradients.primary};
  border-radius: ${theme.radius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  color: white;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${theme.neutral[800]};
  margin-bottom: 15px;
`;

const FeatureDescription = styled.p`
  color: ${theme.neutral[600]};
  line-height: 1.6;
`;

const CTA = styled.div`
  background: ${theme.gradients.primary};
  color: white;
  padding: 80px 0;
  text-align: center;
`;

const CTAContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
`;

const CTATitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 20px;
`;

const CTASubtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 40px;
  opacity: 0.9;
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
`;

const HomePage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();

  const handleImageSelect = (imageData, file) => {
    setSelectedImage({ imageData, file });
  };

  const handleImageRemove = () => {
    setSelectedImage(null);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      toast.error('Vui lòng chọn ảnh trước khi phân tích');
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await predictInsect(selectedImage.file);
      if (result.success) {
        navigate('/result', { state: { result, imageData: selectedImage.imageData } });
      } else {
        toast.error('Không thể phân tích ảnh. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast.error('Có lỗi xảy ra khi phân tích ảnh');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <HomeContainer>
      <ContentWrapper>
        <Header>
          <Logo>
            <LogoIcon>
              <Leaf size={24} />
            </LogoIcon>
            NhanDienSauHai
          </Logo>
          <NavLinks>
            <NavLink href="#features">Tính năng</NavLink>
            <NavLink href="#about">Giới thiệu</NavLink>
            <NavLink href="#contact">Liên hệ</NavLink>
          </NavLinks>
        </Header>

        <HeroSection>
          <HeroTitle>
            NhanDienSauHai
            <br />
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginTop: '10px' }}>
              Bằng AI <Sparkles size={40} />
            </span>
          </HeroTitle>
          <HeroSubtitle>
            Ứng dụng thông minh giúp nông dân nhận diện và xử lý sâu hại một cách chính xác, 
            bảo vệ mùa màng hiệu quả với công nghệ AI tiên tiến.
          </HeroSubtitle>
          
          <ActionButtons>
            <PrimaryButton onClick={() => document.getElementById('image-upload').scrollIntoView({ behavior: 'smooth' })}>
              <Camera size={20} />
              Chụp ảnh phân tích
            </PrimaryButton>
            <SecondaryButton onClick={() => navigate('/insects')}>
              <Search size={20} />
              Xem danh sách sâu hại
            </SecondaryButton>
          </ActionButtons>

          <StatsSection>
            <StatCard>
              <StatNumber>102</StatNumber>
              <StatLabel>Loài sâu hại</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>95%</StatNumber>
              <StatLabel>Độ chính xác</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>24/7</StatNumber>
              <StatLabel>Hỗ trợ</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>100%</StatNumber>
              <StatLabel>Miễn phí</StatLabel>
            </StatCard>
          </StatsSection>
        </HeroSection>
      </ContentWrapper>

      <FeaturesSection id="features">
        <FeaturesContainer>
          <SectionTitle>Tính năng nổi bật</SectionTitle>
          <SectionSubtitle>
            Công nghệ AI tiên tiến giúp nông dân bảo vệ mùa màng hiệu quả
          </SectionSubtitle>
          
          <FeaturesGrid>
            <FeatureCard>
              <FeatureIcon>
                <Brain size={28} />
              </FeatureIcon>
              <FeatureTitle>AI Thông Minh</FeatureTitle>
              <FeatureDescription>
                Sử dụng mô hình YOLOv8 tiên tiến để nhận diện chính xác 102 loài sâu hại 
                với độ chính xác lên đến 95%.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>
                <Camera size={28} />
              </FeatureIcon>
              <FeatureTitle>Chụp ảnh trực tiếp</FeatureTitle>
              <FeatureDescription>
                Chụp ảnh sâu hại trực tiếp từ camera hoặc upload từ thư viện, 
                nhận kết quả phân tích ngay lập tức.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>
                <Shield size={28} />
              </FeatureIcon>
              <FeatureTitle>Thông tin chi tiết</FeatureTitle>
              <FeatureDescription>
                Cung cấp thông tin đầy đủ về mức độ nguy hiểm, cây trồng bị ảnh hưởng, 
                và biện pháp phòng trị hiệu quả.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>
                <Leaf size={28} />
              </FeatureIcon>
              <FeatureTitle>Thân thiện môi trường</FeatureTitle>
              <FeatureDescription>
                Khuyến khích sử dụng phương pháp sinh học, hạn chế thuốc hóa học 
                để bảo vệ môi trường và sức khỏe.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>
                <BarChart3 size={28} />
              </FeatureIcon>
              <FeatureTitle>Phân tích chuyên sâu</FeatureTitle>
              <FeatureDescription>
                Cung cấp báo cáo chi tiết về tình trạng sâu hại và đề xuất 
                kế hoạch quản lý dịch hại hiệu quả.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>
                <Users size={28} />
              </FeatureIcon>
              <FeatureTitle>Cộng đồng nông dân</FeatureTitle>
              <FeatureDescription>
                Kết nối với cộng đồng nông dân để chia sẻ kinh nghiệm và 
                học hỏi phương pháp canh tác bền vững.
              </FeatureDescription>
            </FeatureCard>
          </FeaturesGrid>
        </FeaturesContainer>
      </FeaturesSection>

      <div id="image-upload" style={{ background: 'white', padding: '60px 0' }}>
        <FeaturesContainer>
          <SectionTitle>Bắt đầu phân tích</SectionTitle>
          <SectionSubtitle>
            Upload ảnh sâu hại để bắt đầu quá trình nhận diện AI
          </SectionSubtitle>
          
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <SimpleImageUpload
              onImageSelect={handleImageSelect}
              onImageRemove={handleImageRemove}
              selectedImage={selectedImage}
            />
            
            {selectedImage && (
              <div style={{ textAlign: 'center', marginTop: '30px' }}>
                <PrimaryButton 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  style={{ 
                    fontSize: '18px',
                    padding: '16px 40px',
                    opacity: isAnalyzing ? 0.7 : 1
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
                      <Brain size={20} />
                      Phân tích ảnh
                    </>
                  )}
                </PrimaryButton>
              </div>
            )}
          </div>
        </FeaturesContainer>
      </div>

      <CTA>
        <CTAContainer>
          <CTATitle>Sẵn sàng bảo vệ mùa màng?</CTATitle>
          <CTASubtitle>
            Tham gia cùng hàng nghìn nông dân đã tin tưởng sử dụng NhanDienSauHai
          </CTASubtitle>
          <CTAButtons>
            <PrimaryButton style={{ background: 'white', color: theme.primary[600] }}>
              <Award size={20} />
              Bắt đầu ngay
            </PrimaryButton>
            <SecondaryButton style={{ border: '2px solid rgba(255,255,255,0.3)' }}>
              <Users size={20} />
              Tìm hiểu thêm
            </SecondaryButton>
          </CTAButtons>
        </CTAContainer>
      </CTA>
    </HomeContainer>
  );
};

export default HomePage;