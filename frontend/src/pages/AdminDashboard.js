import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  BarChart3, 
  Users, 
  Activity, 
  Database, 
  Settings, 
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
`;

const DashboardHeader = styled.div`
  background: white;
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const HeaderTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 15px;
`;

const HeaderSubtitle = styled.p`
  font-size: 18px;
  color: #666;
  margin-bottom: 20px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const StatIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  background: ${props => props.color || '#667eea'};
  color: white;
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
`;

const ChartTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
`;

const ActionButton = styled.button`
  background: white;
  border: none;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const ActionIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.color || '#667eea'};
  color: white;
`;

const ActionLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #333;
  text-align: center;
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 15px;
  border-radius: 8px;
  background: ${props => props.status === 'online' ? '#d4edda' : '#f8d7da'};
  color: ${props => props.status === 'online' ? '#155724' : '#721c24'};
  font-weight: 600;
  margin-bottom: 20px;
`;

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalPredictions: 0,
    totalUsers: 0,
    systemUptime: '0h 0m',
    accuracy: '0%'
  });
  
  const [systemStatus, setSystemStatus] = useState('offline');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch system status
      const statusResponse = await fetch('http://localhost:8000/status');
      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        setSystemStatus('online');
        
        // Update stats from system data
        setStats(prev => ({
          ...prev,
          totalPredictions: statusData.performance?.total_predictions || 0,
          accuracy: statusData.performance?.avg_confidence 
            ? `${(statusData.performance.avg_confidence * 100).toFixed(1)}%` 
            : '0%'
        }));
      } else {
        setSystemStatus('offline');
      }
      
      // Simulate additional data
      setStats(prev => ({
        ...prev,
        totalUsers: Math.floor(Math.random() * 1000) + 500,
        systemUptime: `${Math.floor(Math.random() * 24)}h ${Math.floor(Math.random() * 60)}m`
      }));
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setSystemStatus('offline');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (action) => {
    switch (action) {
      case 'export':
        alert('Exporting data...');
        break;
      case 'import':
        alert('Importing data...');
        break;
      case 'backup':
        alert('Creating backup...');
        break;
      case 'restore':
        alert('Restoring from backup...');
        break;
      case 'optimize':
        alert('Optimizing system...');
        break;
      case 'update':
        alert('Updating system...');
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <DashboardContainer>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          color: 'white',
          fontSize: '18px'
        }}>
          <RefreshCw className="animate-spin" style={{ marginRight: '10px' }} />
          Loading Dashboard...
        </div>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <DashboardHeader>
        <HeaderTitle>
          <Settings size={32} />
          Admin Dashboard
        </HeaderTitle>
        <HeaderSubtitle>
          Quản lý và giám sát hệ thống IP102 Insect Pest Recognition
        </HeaderSubtitle>
        
        <StatusIndicator status={systemStatus}>
          {systemStatus === 'online' ? (
            <>
              <CheckCircle size={20} />
              System Online
            </>
          ) : (
            <>
              <AlertTriangle size={20} />
              System Offline
            </>
          )}
        </StatusIndicator>
      </DashboardHeader>

      <StatsGrid>
        <StatCard>
          <StatIcon color="#667eea">
            <BarChart3 size={24} />
          </StatIcon>
          <StatValue>{stats.totalPredictions}</StatValue>
          <StatLabel>Total Predictions</StatLabel>
        </StatCard>

        <StatCard>
          <StatIcon color="#28a745">
            <Users size={24} />
          </StatIcon>
          <StatValue>{stats.totalUsers}</StatValue>
          <StatLabel>Active Users</StatLabel>
        </StatCard>

        <StatCard>
          <StatIcon color="#ffc107">
            <Activity size={24} />
          </StatIcon>
          <StatValue>{stats.accuracy}</StatValue>
          <StatLabel>Model Accuracy</StatLabel>
        </StatCard>

        <StatCard>
          <StatIcon color="#17a2b8">
            <Clock size={24} />
          </StatIcon>
          <StatValue>{stats.systemUptime}</StatValue>
          <StatLabel>System Uptime</StatLabel>
        </StatCard>
      </StatsGrid>

      <ChartsGrid>
        <ChartCard>
          <ChartTitle>
            <BarChart3 size={20} />
            Prediction Analytics
          </ChartTitle>
          <div style={{ 
            height: '300px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: '#f8f9fa',
            borderRadius: '8px',
            color: '#666'
          }}>
            Chart visualization would go here
          </div>
        </ChartCard>

        <ChartCard>
          <ChartTitle>
            <Database size={20} />
            System Resources
          </ChartTitle>
          <div style={{ 
            height: '300px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: '#f8f9fa',
            borderRadius: '8px',
            color: '#666'
          }}>
            Resource monitoring would go here
          </div>
        </ChartCard>
      </ChartsGrid>

      <ActionsGrid>
        <ActionButton onClick={() => handleAction('export')}>
          <ActionIcon color="#28a745">
            <Download size={24} />
          </ActionIcon>
          <ActionLabel>Export Data</ActionLabel>
        </ActionButton>

        <ActionButton onClick={() => handleAction('import')}>
          <ActionIcon color="#17a2b8">
            <Upload size={24} />
          </ActionIcon>
          <ActionLabel>Import Data</ActionLabel>
        </ActionButton>

        <ActionButton onClick={() => handleAction('backup')}>
          <ActionIcon color="#ffc107">
            <Database size={24} />
          </ActionIcon>
          <ActionLabel>Backup System</ActionLabel>
        </ActionButton>

        <ActionButton onClick={() => handleAction('restore')}>
          <ActionIcon color="#dc3545">
            <RefreshCw size={24} />
          </ActionIcon>
          <ActionLabel>Restore System</ActionLabel>
        </ActionButton>

        <ActionButton onClick={() => handleAction('optimize')}>
          <ActionIcon color="#6f42c1">
            <Settings size={24} />
          </ActionIcon>
          <ActionLabel>Optimize Model</ActionLabel>
        </ActionButton>

        <ActionButton onClick={() => handleAction('update')}>
          <ActionIcon color="#20c997">
            <RefreshCw size={24} />
          </ActionIcon>
          <ActionLabel>Update System</ActionLabel>
        </ActionButton>
      </ActionsGrid>
    </DashboardContainer>
  );
};

export default AdminDashboard;
