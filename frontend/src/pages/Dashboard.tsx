import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, Alert } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

// Регистрация компонентов Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard: React.FC = () => {
  const [data, setData] = useState({ vulns: [], anomalies: [] }); // Заглушка; позже fetch из API

  useEffect(() => {
    // Симуляция fetch данных из backend
    setData({
      vulns: [
        { id: 'CVE-2023-1', count: 12 },
        { id: 'CVE-2023-2', count: 19 },
        { id: 'CVE-2023-3', count: 3 },
      ],
      anomalies: [65, 59, 80],
    });
  }, []);

  const barData = {
    labels: data.vulns.map(v => v.id),
    datasets: [{
      label: 'Топ уязвимости',
      data: data.vulns.map(v => v.count),
      backgroundColor: 'rgba(75, 192, 192, 0.4)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    }],
  };

  const lineData = {
    labels: ['Янв', 'Фев', 'Мар', 'Апр'],
    datasets: [{
      label: 'Тренды аномалий',
      data: data.anomalies,
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      tension: 0.1,
    }],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Дашборд' },
    },
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>Дашборд</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Топ уязвимостей</Typography>
              <Bar data={barData} options={options} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Тренды аномалий</Typography>
              <Line data={lineData} options={options} />
            </CardContent>
          </Card>
        </Grid>
        {/* Добавьте больше: Heatmap портов, Pie типов активов */}
        <Grid item xs={12}>
          <Alert severity="info">Данные загружены. Для реального использования подключите к API.</Alert>
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;