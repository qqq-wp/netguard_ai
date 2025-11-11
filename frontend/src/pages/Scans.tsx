import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { scanApi } from '../services/api';

interface ScanTask {
  id: number;
  scan_type: string;
  status: string;
  created_at: string;
  network_id: number;
}

interface ScanNetwork {
  id: number;
  name: string;
  cidr_range: string;
  description: string;
}

const Scans: React.FC = () => {
  const [scanTasks, setScanTasks] = useState<ScanTask[]>([]);
  const [scanNetworks, setScanNetworks] = useState<ScanNetwork[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newScan, setNewScan] = useState({
    network_id: 0,
    scan_type: 'quick',
    nmap_arguments: '',
  });

  useEffect(() => {
    loadScanTasks();
    loadScanNetworks();
  }, []);

  const loadScanTasks = async () => {
    try {
      const response = await scanApi.getScanTasks();
      setScanTasks(response.data);
    } catch (error) {
      console.error('Error loading scan tasks:', error);
      setError('Ошибка загрузки задач сканирования');
    }
  };

  const loadScanNetworks = async () => {
    try {
      const response = await scanApi.getScanNetworks();
      setScanNetworks(response.data);
      // Устанавливаем первую сеть по умолчанию
      if (response.data.length > 0) {
        setNewScan(prev => ({ ...prev, network_id: response.data[0].id }));
      }
    } catch (error) {
      console.error('Error loading scan networks:', error);
      setError('Ошибка загрузки списка сетей');
    }
  };

  const handleCreateScan = async () => {
    if (newScan.network_id === 0) {
      setError('Пожалуйста, выберите сеть для сканирования');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await scanApi.createScanTask(newScan);
      setOpenDialog(false);
      setNewScan({
        network_id: scanNetworks[0]?.id || 0,
        scan_type: 'quick',
        nmap_arguments: '',
      });
      loadScanTasks();
    } catch (error: any) {
      console.error('Error creating scan task:', error);
      setError(error.response?.data?.detail || 'Ошибка создания задачи сканирования');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'running': return 'warning';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const getScanTypeLabel = (scanType: string) => {
    const labels: { [key: string]: string } = {
      'ping': 'Ping Scan',
      'quick': 'Быстрое сканирование',
      'normal': 'Обычное сканирование',
      'full': 'Полное сканирование'
    };
    return labels[scanType] || scanType;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Управление сканированиями</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
        >
          Новое сканирование
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Тип сканирования</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Дата создания</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {scanTasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.id}</TableCell>
                <TableCell>{getScanTypeLabel(task.scan_type)}</TableCell>
                <TableCell>
                  <Chip
                    label={task.status}
                    color={getStatusColor(task.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(task.created_at).toLocaleString('ru-RU')}
                </TableCell>
              </TableRow>
            ))}
            {scanTasks.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography color="textSecondary">
                    Нет задач сканирования. Создайте первую задачу.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Новое сканирование</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Сеть для сканирования</InputLabel>
            <Select
              value={newScan.network_id}
              label="Сеть для сканирования"
              onChange={(e) => setNewScan({ ...newScan, network_id: e.target.value as number })}
            >
              {scanNetworks.map((network) => (
                <MenuItem key={network.id} value={network.id}>
                  {network.name} ({network.cidr_range})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Тип сканирования</InputLabel>
            <Select
              value={newScan.scan_type}
              label="Тип сканирования"
              onChange={(e) => setNewScan({ ...newScan, scan_type: e.target.value })}
            >
              <MenuItem value="ping">Ping Scan (обнаружение хостов)</MenuItem>
              <MenuItem value="quick">Быстрое сканирование (топ-1000 портов)</MenuItem>
              <MenuItem value="normal">Обычное сканирование (все порты + версии)</MenuItem>
              <MenuItem value="full">Полное сканирование (все порты + ОС + скрипты)</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            margin="normal"
            label="Дополнительные аргументы nmap"
            value={newScan.nmap_arguments}
            onChange={(e) => setNewScan({ ...newScan, nmap_arguments: e.target.value })}
            placeholder="-sV -O --script vuln"
            helperText="Оставьте пустым для использования стандартных параметров"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Отмена</Button>
          <Button 
            onClick={handleCreateScan} 
            variant="contained"
            disabled={loading || newScan.network_id === 0}
          >
            {loading ? 'Создание...' : 'Запустить'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Scans;