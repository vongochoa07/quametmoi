import React from 'react';
import styled from 'styled-components';
import { Brain, Shield, Leaf, Users, Target, Award, Phone, Mail, MapPin } from 'lucide-react';

const AboutContainer = styled.div`
  min-height: calc(100vh - 70px);
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 20px 15px;
  }
`;

const HeroSection = styled.div`
  text-align: center;
  margin-bottom: 60px;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const Section = styled.section`
  margin-bottom: 60px;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
`;

const FeatureCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
  }
`;

const FeatureIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: white;
  font-size: 32px;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 15px;
`;

const FeatureDescription = styled.p`
  color: #666;
  line-height: 1.6;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const StatNumber = styled.div`
  font-size: 3rem;
  font-weight: 800;
  color: #667eea;
  margin-bottom: 10px;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: #666;
  font-weight: 600;
`;

const TechnologySection = styled.div`
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
`;

const TechGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-top: 30px;
`;

const TechItem = styled.div`
  text-align: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
`;

const TechIcon = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
  color: white;
  font-size: 24px;
`;

const TechTitle = styled.h4`
  font-size: 1.2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
`;

const TechDescription = styled.p`
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
`;

const ContactSection = styled.div`
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-top: 30px;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
`;

const ContactIcon = styled.div`
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
`;

const ContactInfo = styled.div`
  flex: 1;
`;

const ContactLabel = styled.div`
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
`;

const ContactValue = styled.div`
  color: #666;
`;

const AboutPage = () => {
  return (
    <AboutContainer>
      <HeroSection>
        <HeroTitle>Về Ứng Dụng</HeroTitle>
        <HeroSubtitle>
          Ứng dụng thông minh sử dụng công nghệ AI để nhận diện và cung cấp thông tin 
          chi tiết về các loài côn trùng gây hại, giúp nông dân bảo vệ mùa màng hiệu quả.
        </HeroSubtitle>
      </HeroSection>
      
      <Section>
        <SectionTitle>Tính Năng Nổi Bật</SectionTitle>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>
              <Brain size={40} />
            </FeatureIcon>
            <FeatureTitle>AI Thông Minh</FeatureTitle>
            <FeatureDescription>
              Sử dụng mô hình YOLOv8 tiên tiến để nhận diện chính xác 102 loài côn trùng gây hại 
              với độ chính xác cao lên đến 95%.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>
              <Shield size={40} />
            </FeatureIcon>
            <FeatureTitle>Thông Tin Chi Tiết</FeatureTitle>
            <FeatureDescription>
              Cung cấp thông tin đầy đủ về mức độ nguy hiểm, cây trồng bị ảnh hưởng, 
              môi trường sống và cách phòng chống.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>
              <Leaf size={40} />
            </FeatureIcon>
            <FeatureTitle>Thân Thiện Môi Trường</FeatureTitle>
            <FeatureDescription>
              Khuyến khích sử dụng phương pháp sinh học và hạn chế thuốc hóa học 
              để bảo vệ môi trường và sức khỏe.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </Section>
      
      <Section>
        <SectionTitle>Thống Kê</SectionTitle>
        <StatsGrid>
          <StatCard>
            <StatNumber>102</StatNumber>
            <StatLabel>Loài Côn Trùng</StatLabel>
          </StatCard>
          
          <StatCard>
            <StatNumber>95%</StatNumber>
            <StatLabel>Độ Chính Xác</StatLabel>
          </StatCard>
          
          <StatCard>
            <StatNumber>24/7</StatNumber>
            <StatLabel>Hỗ Trợ</StatLabel>
          </StatCard>
          
          <StatCard>
            <StatNumber>100%</StatNumber>
            <StatLabel>Miễn Phí</StatLabel>
          </StatCard>
        </StatsGrid>
      </Section>
      
      <Section>
        <TechnologySection>
          <SectionTitle>Công Nghệ Sử Dụng</SectionTitle>
          <TechGrid>
            <TechItem>
              <TechIcon>
                <Brain size={24} />
              </TechIcon>
              <TechTitle>YOLOv8</TechTitle>
              <TechDescription>
                Mô hình deep learning tiên tiến cho nhận diện đối tượng thời gian thực
              </TechDescription>
            </TechItem>
            
            <TechItem>
              <TechIcon>
                <Target size={24} />
              </TechIcon>
              <TechTitle>Computer Vision</TechTitle>
              <TechDescription>
                Xử lý và phân tích ảnh tự động với độ chính xác cao
              </TechDescription>
            </TechItem>
            
            <TechItem>
              <TechIcon>
                <Shield size={24} />
              </TechIcon>
              <TechTitle>FastAPI</TechTitle>
              <TechDescription>
                Framework Python hiện đại cho xây dựng API nhanh và bảo mật
              </TechDescription>
            </TechItem>
            
            <TechItem>
              <TechIcon>
                <Users size={24} />
              </TechIcon>
              <TechTitle>React</TechTitle>
              <TechDescription>
                Thư viện JavaScript cho giao diện người dùng responsive và thân thiện
              </TechDescription>
            </TechItem>
          </TechGrid>
        </TechnologySection>
      </Section>
      
      <Section>
        <ContactSection>
          <SectionTitle>Liên Hệ</SectionTitle>
          <ContactGrid>
            <ContactItem>
              <ContactIcon>
                <Mail size={20} />
              </ContactIcon>
              <ContactInfo>
                <ContactLabel>Email</ContactLabel>
                <ContactValue>support@pestai.com</ContactValue>
              </ContactInfo>
            </ContactItem>
            
            <ContactItem>
              <ContactIcon>
                <Phone size={20} />
              </ContactIcon>
              <ContactInfo>
                <ContactLabel>Điện thoại</ContactLabel>
                <ContactValue>+84 123 456 789</ContactValue>
              </ContactInfo>
            </ContactItem>
            
            <ContactItem>
              <ContactIcon>
                <MapPin size={20} />
              </ContactIcon>
              <ContactInfo>
                <ContactLabel>Địa chỉ</ContactLabel>
                <ContactValue>Hà Nội, Việt Nam</ContactValue>
              </ContactInfo>
            </ContactItem>
          </ContactGrid>
        </ContactSection>
      </Section>
    </AboutContainer>
  );
};

export default AboutPage;
