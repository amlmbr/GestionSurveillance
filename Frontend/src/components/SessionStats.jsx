import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { Building2, Users, BookOpen, School } from 'lucide-react';
import StatistiquesService from '../services/statistiqueService';
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;
const StatsContainer = styled.div`
  display: flex;
  gap: 20px;
  padding: 30px 20px;
  width: 100%;
`;
const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 16px;
  padding-top: 32px;
  min-width: 220px;
  flex: 1;
  position: relative;
  margin-top: 28px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  animation: ${fadeIn} 0.6s ease-out forwards;
  animation-delay: ${props => props.index * 0.1}s;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  }
`;
const IconWrapper = styled.div`
  width: 54px;
  height: 54px;
  border-radius: 12px;
  position: absolute;
  left: 16px;
  top: -27px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, 
    ${props => props.bgColor} 0%, 
    ${props => props.bgColor}dd 100%
  );
  box-shadow: 0 8px 16px ${props => `${props.bgColor}40`};
`;
const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
const Title = styled.div`
  font-size: 14px;
  color: #64748b;
  text-align: right;
  font-weight: 500;
`;
const Value = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  text-align: right;
  margin: 2px 0;
`;
const Status = styled.div`
  text-align: right;
  font-size: 13px;
  color: #94a3b8;
`;
const SessionStatsComponent = ({idsesion}) => {
    const [stats, setStats] = useState({
        salles: 0,
        enseignants: 0,
        departements: 0,
        examens: 0
      });
    useEffect(() => {
        const fetchSessionStats = async () => {
          try {
            const data = await StatistiquesService.getCounts(idsesion); // Supposez que vous avez une méthode pour récupérer la session par ID
            setStats(data);
          } catch (error) {
            console.error('Error fetching session:', error);
          }
        };
    
        fetchSessionStats();
      }, [idsesion]);
  const statsConfig = [
    {
      title: 'Locaux',
      icon: Building2,
      value:  stats.salles,
      bgColor: '#2563eb',
      status: 'Salles disponibles'
    },
    {
      title: 'Enseignants',
      icon: Users,
      value: stats.enseignants,
      bgColor: '#16a34a',
      status: 'Surveillants'
    },
    {
      title: 'Départements',
      icon: School,
      value: stats.departements,
      bgColor: '#dc2626',
      status: 'Actifs'
    },
    {
      title: 'Examens',
      icon: BookOpen,
      value: stats.examens,
      bgColor: '#020617',
      status: 'Cette session'
    }
  ];
  return (
    <StatsContainer>
      {statsConfig.map((stat, index) => (
        <Card key={index} index={index}>
          <IconWrapper bgColor={stat.bgColor}>
            <stat.icon color="white" size={24} strokeWidth={2} />
          </IconWrapper>
          <ContentWrapper>
            <Title>{stat.title}</Title>
            <Value>{stat.value}</Value>
            <Status>{stat.status}</Status>
          </ContentWrapper>
        </Card>
      ))}
    </StatsContainer>
  );
};
export default SessionStatsComponent;