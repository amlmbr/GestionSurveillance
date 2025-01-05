import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import StatistiquesService from '../services/statistiqueService';
const ProfessorsByDepartment = () => {
  const [barChartData, setBarChartData] = useState([]);
  const [valuesdisp, setValuesDisp] = useState({
    "dispenses": 0.0,
    "nonDispenses": 100.0
  });
  
  const pieChartData = [
    { name: 'Dispensés', value: valuesdisp.dispenses, color: '#3B82F6' },
    { name: 'Non Dispensés', value: valuesdisp.nonDispenses, color: '#60A5FA' }
  ];
  useEffect(() => {
    const fetchPourcentDispense = async () => {
        try {
          const data = await StatistiquesService.getDispensePourcent();
         
          setValuesDisp(data);
        } catch (error) {
          console.error('Error fetching session:', error);
        }
      };
    const fetchSessionStats = async () => {
      try {
        const data = await StatistiquesService.getEnseignantsParDepartement();
        const transformedData = Object.entries(data).map(([key, value]) => ({
          department: key,
          professors: value
        }));
        setBarChartData(transformedData);
      } catch (error) {
        console.error('Error fetching session:', error);
      }
    };
    fetchSessionStats();
    fetchPourcentDispense()
  }, []);
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '12px',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        }}>
          <div style={{ color: '#111827', fontWeight: '600', marginBottom: '4px' }}>
            {label}
          </div>
          <div style={{ color: '#3B82F6', fontSize: '14px' }}>
            {`${payload[0].value} Professeurs`}
          </div>
        </div>
      );
    }
    return null;
  };
  const PieChartTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '12px',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        }}>
          <div style={{ color: '#111827', fontWeight: '600' }}>
            {`${payload[0].name}: ${payload[0].value}%`}
          </div>
        </div>
      );
    }
    return null;
  };
  const chartContainerStyle = {
    backgroundColor: 'white',
    padding: '32px',
    borderRadius: '16px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
    width: '45%', // Taille égale pour les deux graphiques
    minWidth: '400px',
    maxWidth: '600px'
  };
  const titleStyle = {
    textAlign: 'center',
    marginBottom: '32px'
  };
  const chartWrapperStyle = {
    height: '400px',
    width: '100%'
  };
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      padding: '24px',
      backgroundColor: '#F9FAFB',
      minHeight: '500px',
      alignItems: 'flex-start',
      gap: '24px',
      flexWrap: 'wrap'
    }}>
      {/* Bar Chart */}
      <div style={chartContainerStyle}>
        <div style={titleStyle}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
            Distribution des Professeurs
          </h2>
          <p style={{ fontSize: '14px', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            par Département
          </p>
        </div>
        <div style={chartWrapperStyle}>
          <ResponsiveContainer>
            <BarChart
              data={barChartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={1} />
                  <stop offset="100%" stopColor="#60A5FA" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="department"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: '#6B7280' }}
                angle={-45}
                textAnchor="end"
                interval={0}
                height={80}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: '#6B7280' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="professors"
                fill="url(#barGradient)"
                radius={[8, 8, 0, 0]}
                barSize={45}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Pie Chart */}
      <div style={chartContainerStyle}>
        <div style={titleStyle}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
            Statut des Professeurs
          </h2>
          <p style={{ fontSize: '14px', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Dispensés vs Non Dispensés
          </p>
        </div>
        <div style={chartWrapperStyle}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<PieChartTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
export default ProfessorsByDepartment;