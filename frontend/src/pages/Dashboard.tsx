// frontend/src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { logout } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    api('/tasks/1').then(setTasks).catch(console.error);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>NetGuard AI Dashboard</h1>
      <button onClick={logout}>Logout</button>
      <pre>{JSON.stringify(tasks, null, 2)}</pre>
    </div>
  );
};

export default Dashboard;