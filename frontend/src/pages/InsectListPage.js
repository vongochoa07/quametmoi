import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Search, Bug, AlertTriangle, Leaf, Shield } from 'lucide-react';
import { getInsects } from '../services/api';

const ListContainer = styled.div`
  min-height: calc(100vh - 70px);
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 20px 15px;
  }
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  color: #333;
  margin-bottom: 10px;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const PageSubtitle = styled.p`
  font-size: 1.1rem;
  color: #666;
`;

const SearchSection = styled.div`
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 15px 20px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  width: 20px;
  height: 20px;
`;

const SearchWrapper = styled.div`
  position: relative;
`;

const FilterSection = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  padding: 8px 16px;
  border: 2px solid ${props => props.active ? '#667eea' : '#e9ecef'};
  background: ${props => props.active ? '#667eea' : 'white'};
  color: ${props => props.active ? 'white' : '#666'};
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #667eea;
    background: #667eea;
    color: white;
  }
`;

const InsectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const InsectCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
  }
`;

const InsectHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
`;

const InsectIcon = styled.div`
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
`;

const InsectName = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 5px;
`;

const ScientificName = styled.p`
  font-size: 0.9rem;
  color: #666;
  font-style: italic;
`;

const InsectInfo = styled.div`
  display: grid;
  gap: 15px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const InfoLabel = styled.div`
  font-weight: 600;
  color: #333;
  min-width: 120px;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const InfoValue = styled.div`
  color: #666;
  flex: 1;
`;

const DangerLevel = styled.div`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 15px;
  font-weight: 600;
  font-size: 12px;
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

const LoadingContainer = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const ErrorIcon = styled.div`
  width: 80px;
  height: 80px;
  background: #f8d7da;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: #721c24;
  font-size: 32px;
`;

const InsectListPage = () => {
  const [insects, setInsects] = useState({});
  const [filteredInsects, setFilteredInsects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dangerFilter, setDangerFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    loadInsects();
  }, []);
  
  useEffect(() => {
    filterInsects();
  }, [insects, searchTerm, dangerFilter]);
  
  const loadInsects = async () => {
    try {
      setLoading(true);
      const response = await getInsects();
      setInsects(response.insects);
    } catch (error) {
      console.error('Lỗi khi tải danh sách côn trùng:', error);
      setError('Không thể tải danh sách côn trùng');
    } finally {
      setLoading(false);
    }
  };
  
  const filterInsects = () => {
    let filtered = Object.entries(insects);
    
    // Lọc theo từ khóa tìm kiếm
    if (searchTerm) {
      filtered = filtered.filter(([id, insect]) =>
        insect.vietnamese_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        insect.scientific_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        insect.affected_crops.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Lọc theo mức độ nguy hiểm
    if (dangerFilter !== 'all') {
      filtered = filtered.filter(([id, insect]) => insect.danger_level === dangerFilter);
    }
    
    setFilteredInsects(filtered);
  };
  
  const dangerLevels = ['all', 'Rất cao', 'Cao', 'Trung bình', 'Thấp'];
  
  if (loading) {
    return (
      <ListContainer>
        <LoadingContainer>
          <LoadingSpinner></LoadingSpinner>
          <p>Đang tải danh sách côn trùng...</p>
        </LoadingContainer>
      </ListContainer>
    );
  }
  
  if (error) {
    return (
      <ListContainer>
        <ErrorContainer>
          <ErrorIcon>
            <Bug size={32} />
          </ErrorIcon>
          <h2>Lỗi tải dữ liệu</h2>
          <p>{error}</p>
        </ErrorContainer>
      </ListContainer>
    );
  }
  
  return (
    <ListContainer>
      <PageHeader>
        <PageTitle>Danh Sách Côn Trùng Gây Hại</PageTitle>
        <PageSubtitle>
          Tìm hiểu về 102 loài côn trùng gây hại và cách phòng chống
        </PageSubtitle>
      </PageHeader>
      
      <SearchSection>
        <SearchWrapper>
          <SearchInput
            type="text"
            placeholder="Tìm kiếm theo tên côn trùng, tên khoa học hoặc cây trồng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SearchIcon size={20} />
        </SearchWrapper>
        
        <FilterSection>
          <FilterButton
            active={dangerFilter === 'all'}
            onClick={() => setDangerFilter('all')}
          >
            Tất cả
          </FilterButton>
          {dangerLevels.slice(1).map(level => (
            <FilterButton
              key={level}
              active={dangerFilter === level}
              onClick={() => setDangerFilter(level)}
            >
              {level}
            </FilterButton>
          ))}
        </FilterSection>
      </SearchSection>
      
      <InsectsGrid>
        {filteredInsects.map(([id, insect]) => (
          <InsectCard key={id}>
            <InsectHeader>
              <InsectIcon>
                <Bug size={24} />
              </InsectIcon>
              <div>
                <InsectName>{insect.vietnamese_name}</InsectName>
                <ScientificName>{insect.scientific_name}</ScientificName>
              </div>
            </InsectHeader>
            
            <InsectInfo>
              <InfoRow>
                <InfoLabel>
                  <AlertTriangle size={16} />
                  Mức độ:
                </InfoLabel>
                <InfoValue>
                  <DangerLevel level={insect.danger_level}>
                    {insect.danger_level}
                  </DangerLevel>
                </InfoValue>
              </InfoRow>
              
              <InfoRow>
                <InfoLabel>
                  <Leaf size={16} />
                  Cây trồng:
                </InfoLabel>
                <InfoValue>{insect.affected_crops}</InfoValue>
              </InfoRow>
              
              <InfoRow>
                <InfoLabel>
                  <Shield size={16} />
                  Môi trường:
                </InfoLabel>
                <InfoValue>{insect.habitat}</InfoValue>
              </InfoRow>
            </InsectInfo>
          </InsectCard>
        ))}
      </InsectsGrid>
      
      {filteredInsects.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Không tìm thấy côn trùng nào phù hợp với bộ lọc</p>
        </div>
      )}
    </ListContainer>
  );
};

export default InsectListPage;
