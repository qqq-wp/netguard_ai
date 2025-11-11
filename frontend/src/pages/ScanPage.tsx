import React, { useState } from 'react';
import { Button, TextField, Card, CardContent, Typography, Alert, MenuItem } from '@mui/material';
import axios from 'axios';

const ScanPage: React.FC = () => {
  const [subnet, setSubnet] = useState('192.168.1.0/24');
  const [mode, setMode] = useState('quick');
  const [customFlags, setCustomFlags] = useState('');
  const [status, setStatus] = useState('');
  const [taskId, setTaskId] = useState<number | null>(null);

  const startScan = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/scan/start', {
        subnet,
        mode,
        custom_flags: customFlags,
      });
      setTaskId(response.data.task_id);
      setStatus(`Задача ${response.data.task_id} добавлена в очередь (статус: ${response.data.status})`);
    } catch (error: any) {
      setStatus(`Ошибка запуска: ${error.response?.data?.detail || error.message}`);
    }
  };

  const checkStatus = async () => {
    if (!taskId) return;
    try {
      const response = await axios.get(`http://localhost:8000/api/scan/${taskId}/status`);
      setStatus(`Статус: ${response.data.status}. Результаты: ${JSON.stringify(response.data.results, null, 2)}`);
    } catch (error: any) {
      setStatus(`Ошибка проверки: ${error.message}`);
    }
  };

  return (
    <Card sx={{ maxWidth: 600 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Запуск сканирования</Typography>
        <TextField
          label="Подсеть (CIDR)"
          value={subnet}
          onChange={(e) => setSubnet(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Режим"
          select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          fullWidth
          margin="normal"
        >
          <MenuItem value="ping">Ping-скан</MenuItem>
          <MenuItem value="quick">Быстрое</MenuItem>
          <MenuItem value="full">Полное</MenuItem>
          <MenuItem value="custom">Пользовательский</MenuItem>
        </TextField>
        {mode === 'custom' && (
          <TextField
            label="Кастомные флаги nmap"
            value={customFlags}
            onChange={(e) => setCustomFlags(e.target.value)}
            fullWidth
            margin="normal"
            helperText="Пример: -sV --script vuln"
          />
        )}
        <Button variant="contained" onClick={startScan} fullWidth sx={{ mt: 2 }}>
          Запустить сканирование
        </Button>
        {taskId && (
          <Button variant="outlined" onClick={checkStatus} fullWidth sx={{ mt: 1 }}>
            Проверить статус
          </Button>
        )}
        {status && <Alert severity="info" sx={{ mt: 2 }}>{status}</Alert>}
        <Typography variant="body2" sx={{ mt: 2 }}>
          Только одна задача активна; новые добавляются в очередь.
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ScanPage;