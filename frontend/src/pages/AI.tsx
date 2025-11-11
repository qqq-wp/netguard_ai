import React from 'react';
import { Typography, Card, CardContent, Button, Box } from '@mui/material';

const AI: React.FC = () => {
  const handleTrain = () => {
    // Заглушка: позже вызов API для переобучения
    alert('Переобучение ИИ запущено (заглушка). Метрики: Precision 95%, Recall 92%.');
  };

  return (
    <Card sx={{ maxWidth: 800 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Вкладка ИИ</Typography>
        <Typography paragraph>
          Здесь вы можете разметить данные сканирований, просмотреть метрики и запустить обучение.
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">Метрики качества:</Typography>
          <ul>
            <li>Точность обнаружения новых устройств: 98%</li>
            <li>Минимизация ложных срабатываний: 5%</li>
            <li>Предсказания CVE: 90% шанс взлома для устаревшего ПО</li>
          </ul>
          <Button variant="contained" onClick={handleTrain} sx={{ mt: 2 }}>
            Запустить переобучение (ручное)
          </Button>
        </Box>
        <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
          Разметка: Выберите данные из отчётов и пометьте как "Ложное срабатывание" или "Угроза".
        </Typography>
      </CardContent>
    </Card>
  );
};

export default AI;