// Example of the Dashboard
import { useState, useEffect } from 'react';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const authToken = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch('/api/tasks', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await response.json();
      setTasks(data);
    };

    fetchTasks();
  }, [statusFilter]);

  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  return (
    <div>
      <select onChange={handleFilterChange}>
        <option value="">All Tasks</option>
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>
      
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {task.title} - {task.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
