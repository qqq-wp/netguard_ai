import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';

const Assets: React.FC = () => {
  // Заглушка данных
  const assets = [
    {
      id: 1,
      ip_address: '192.168.1.1',
      hostname: 'router.local',
      os_name: 'Linux',
      device_type: 'Router',
      status: 'active',
    },
    {
      id: 2,
      ip_address: '192.168.1.100',
      hostname: 'server01',
      os_name: 'Ubuntu 20.04',
      device_type: 'Server',
      status: 'active',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Инвентарь активов
      </Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>IP Адрес</TableCell>
              <TableCell>Hostname</TableCell>
              <TableCell>ОС</TableCell>
              <TableCell>Тип устройства</TableCell>
              <TableCell>Статус</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assets.map((asset) => (
              <TableRow key={asset.id}>
                <TableCell>{asset.ip_address}</TableCell>
                <TableCell>{asset.hostname}</TableCell>
                <TableCell>{asset.os_name}</TableCell>
                <TableCell>{asset.device_type}</TableCell>
                <TableCell>
                  <Chip 
                    label={asset.status} 
                    color={asset.status === 'active' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Assets;