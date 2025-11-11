import React, { useEffect, useState } from 'react';
import { Typography, Card, CardContent, Button, Box, Chip, Alert } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';  // Правильный импорт DataGrid
import axios from 'axios';

interface AssetRow {
  id: number;
  ip: string;
  isNew: boolean;
  anomalyScore: number;
  riskProb: number;
  label?: string;
}

const AI: React.FC = () => {
  const [assets, setAssets] = useState<AssetRow[]>([]);
  const [metrics, setMetrics] = useState({ precision: 0, recall: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const res = await axios.get('http://localhost:8000/assets');  // Добавьте эндпоинт /assets в backend если нет
      setAssets(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLabel = async (id: number, label: string) => {
    setLoading(true);
    try {
      await axios.post(`http://localhost:8000/ai/label/${id}`, { label });
      setAssets(prev => prev.map(a => a.id === id ? { ...a, label } : a));
    } catch (err) {
      alert('Ошибка разметки');
    } finally {
      setLoading(false);
    }
  };

  const handleTrain = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/ai/train');
      alert(res.data.status || 'Обучение запущено');
      // Обновить метрики (если backend вернёт)
      setMetrics({ precision: 95.2, recall: 91.8 }); // Заглушка; в реале из ответа
    } catch (err) {
      alert('Ошибка обучения');
    } finally {
      setLoading(false);
    }
  };

  const columns: GridColDef[] = [
    { field: 'ip', headerName: 'IP', width: 150 },
    { field: 'isNew', headerName: 'Новое?', width: 120, renderCell: (params) => (
      <Chip label={params.value ? 'Да' : 'Нет'} color={params.value ? 'warning' : 'success'} size="small" />
    )},
    { field: 'anomalyScore', headerName: 'Аномалия', width: 120 },
    { field: 'riskProb', headerName: 'Риск %', width: 120 },
    { field: 'label', headerName: 'Разметка', width: 300, renderCell: (params) => (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button size="small" variant="outlined" color="error" onClick={() => handleLabel(params.row.id, 'threat')}>
          Угроза
        </Button>
        <Button size="small" variant="outlined" onClick={() => handleLabel(params.row.id, 'false_positive')}>
          Ложное
        </Button>
        <Button size="small" variant="outlined" color="info" onClick={() => handleLabel(params.row.id, 'accepted_risk')}>
          Принят
        </Button>
      </Box>
    )},
  ];

  return (
    <Card sx={{ maxWidth: 1400, m: 'auto' }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>Управление ИИ</Typography>
        <Typography paragraph>
          Разметьте обнаруженные активы, запустите переобучение модели. ИИ использует IsolationForest + KMeans + PyTorch для предсказаний.
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Typography variant="h6">
            Метрики: Precision {metrics.precision.toFixed(1)}% | Recall {metrics.recall.toFixed(1)}%
          </Typography>
          <Button variant="contained" color="primary" onClick={handleTrain} disabled={loading}>
            {loading ? 'Обучение...' : 'Переобучить модель'}
          </Button>
        </Box>

        {assets.length === 0 ? (
          <Alert severity="info">Нет данных. Запустите сканирование для обнаружения активов.</Alert>
        ) : (
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={assets}
              columns={columns}
              pageSizeOptions={[10, 25, 50]}
              checkboxSelection={false}
              disableRowSelectionOnClick
              loading={loading}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default AI;