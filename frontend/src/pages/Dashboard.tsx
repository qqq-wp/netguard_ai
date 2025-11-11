import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Box,
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard: React.FC = () => {
  // Пример данных для графиков
  const vulnerabilityData = {
    labels: ['Critical', 'High', 'Medium', 'Low'],
    datasets: [
      {
        label: 'Уязвимости по критичности',
        data: [12, 19, 8, 15],
        backgroundColor: [
          '#ff4444',
          '#ffbb33',
          '#00C851',
          '#33b5e5',
        ],
      },
    ],
  };

  const scanActivityData = {
    labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    datasets: [
      {
        label: 'Сканирования',
        data: [12, 19, 3, 5, 2, 3, 8],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Дашборд безопасности
      </Typography>
      
      <Grid container spacing={3}>
        {/* Статистика */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Всего активов
              </Typography>
              <Typography variant="h5" component="div">
                156
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Открытых портов
              </Typography>
              <Typography variant="h5" component="div">
                842
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Критических уязвимостей
              </Typography>
              <Typography variant="h5" component="div" color="error">
                12
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Активных сканирований
              </Typography>
              <Typography variant="h5" component="div">
                3
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Графики */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Распределение уязвимостей
            </Typography>
            <Doughnut data={vulnerabilityData} />
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Активность сканирований
            </Typography>
            <Bar data={scanActivityData} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;