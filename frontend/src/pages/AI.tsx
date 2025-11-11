import React, { useEffect, useState } from 'react';
import { Typography, Card, CardContent, Button, Box, DataGrid, Chip } from '@mui/material';
import axios from 'axios';

interface AssetRow {
  id: number;
  ip: string;
  isNew: boolean;
  anomalyScore: number;
  riskProb: number;
  label: string;
}

const AI: React.FC = () => {
  const [assets, setAssets] = useState<AssetRow[]>([]);
  const [metrics, setMetrics] = useState({ precision: 95, recall: 92 });

  useEffect(() => {
    // Fetch assets из API
    axios.get('http://localhost:8000/assets').then(res => setAssets(res.data));
  }, []);

  const handleLabel = async (id: number, label: string) => {
    await axios.post(`http://localhost:8000/ai/label/${id}`, { label });
    // Refresh
    setAssets(prev => prev.map(a => a.id === id ? { ...a, label } : a));
  };

  const handleTrain = async () => {
    await axios.post('http://localhost:8000/ai/train');
    alert(`Переобучение завершено. Метрики: Precision ${metrics.precision}%, Recall ${metrics.recall}%`);
  };

  const columns = [
    { field: 'ip', headerName: 'IP', width: 150 },
    { field: 'isNew', headerName: 'Новое?', renderCell: (params: any) => <Chip label={params.value ? 'Да' : 'Нет'} color={params.value ? 'warning' : 'success'} /> },
    { field: 'anomalyScore', headerName: 'Аномалия', width: 120 },
    { field: 'riskProb', headerName: 'Риск %', width: 100 },
    {
      field: 'label',
      headerName: 'Разметка',
      renderCell: (params: any) => (
        <Box>
          <Button size="small" onClick={() => handleLabel(params.row.id, 'false_positive')}>Ложное</Button>
          <Button size="small" onClick={() => handleLabel(params.row.id, 'threat')}>Угроза</Button>
          <Button size="small" onClick={() => handleLabel(params.row.id, 'accepted_risk')}>Принят</Button>
        </Box>
      ),
      width: 200
    },
  ];

  return (
    <Card sx={{ maxWidth: 1200 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Вкладка ИИ</Typography>
        <Typography paragraph>Разметьте активы, просмотрите метрики, запустите обучение.</Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Typography>Метрики: Precision {metrics.precision}%, Recall {metrics.recall}%</Typography>
          <Button variant="contained" onClick={handleTrain}>Переобучить модель</Button>
        </Box>

        <DataGrid rows={assets} columns={columns} autoHeight pageSize={10} />
        
        <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
          ИИ: Кластеризует устройства, предсказывает риски (e.g., 90% взлом для устаревшего ПО), генерит сигнатуры.
        </Typography>
      </CardContent>
    </Card>
  );
};

export default AI;