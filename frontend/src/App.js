import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './App.css';
import Login from './components/Login';
import UserProfile from './components/UserProfile';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/tasks';
const GOOGLE_CLIENT_ID = '66337315806-4r7st99rh8grdh8rinoafmqv2ni8si3g.apps.googleusercontent.com'; // Replace with your actual Google Client ID

function App() {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedUserId = localStorage.getItem('userId');
    if (storedUser && storedUserId) {
      try {
        setUser(JSON.parse(storedUser));
        setUserId(storedUserId);
        fetchTasks(storedUserId);
      } catch (err) {
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }

  }, []);

  // Track notified tasks to avoid duplicates
  const notifiedTasksRef = useRef(new Set());

  // Check for due tasks
  useEffect(() => {
    const checkReminders = () => {
      if (!tasks.length) return;

      const now = new Date();
      tasks.forEach(task => {
        if (task.completed || !task.reminder || !task.dueDate) return;

        const dueDate = new Date(task.dueDate);
        const timeDiff = dueDate.getTime() - now.getTime();

        // Notify if due within the next minute, or if it was due recently (within last 5 mins) and not yet notified
        // This covers the case where the user opens the app slightly after the due time
        if (timeDiff > -5 * 60 * 1000 && timeDiff <= 60000) {
            if (!notifiedTasksRef.current.has(task._id)) {
                if (Notification.permission === 'granted') {
                    new Notification('Task Reminder', {
                        body: `Task "${task.title}" is due soon!`,
                        icon: '/logo192.png'
                    });
                    notifiedTasksRef.current.add(task._id);
                }
            }
        }
      });
    };

    // Check immediately on load/update
    checkReminders();

    const interval = setInterval(checkReminders, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [tasks]);

  const fetchTasks = async (uid) => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL, {
        headers: {
          'x-user-id': uid
        }
      });
      setTasks(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (userData) => {
    const uid = userData.sub; // Google's unique identifier
    setUser(userData);
    setUserId(uid);
    fetchTasks(uid);
  };

  const handleLogout = () => {
    setUser(null);
    setUserId(null);
    setTasks([]);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
  };

  const addTask = async (taskData) => {
    try {
      const response = await axios.post(API_URL, {
        ...taskData,
        userId: userId
      }, {
        headers: {
          'x-user-id': userId
        }
      });
      setTasks([response.data, ...tasks]);
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Failed to add task. Please try again.');
    }
  };

  const updateTask = async (id, updatedData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, updatedData, {
        headers: {
          'x-user-id': userId
        }
      });
      setTasks(tasks.map(task => task._id === id ? response.data : task));
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task. Please try again.');
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          'x-user-id': userId
        }
      });
      setTasks(tasks.filter(task => task._id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task. Please try again.');
    }
  };

  const toggleComplete = async (id, completed) => {
    await updateTask(id, { completed: !completed });
  };

  const completedCount = tasks.filter(t => t.completed).length;

  // Show login screen if not authenticated
  if (!user) {
    return (
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <div className="App">
          <Login onLoginSuccess={handleLoginSuccess} />
        </div>
      </GoogleOAuthProvider>
    );
  }

  // Show task dashboard if authenticated
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="App">
        <div className="container">
          <UserProfile user={user} onLogout={handleLogout} />

          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h1>✓ TaskFlow</h1>
            <p className="subtitle">Welcome, {user.name}! Manage your tasks efficiently</p>
          </div>

          {error && (
            <div style={{
              background: '#ffe0e0',
              color: '#d32f2f',
              padding: '15px',
              borderRadius: '10px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}
          
          <TaskForm onAddTask={addTask} />
          
          {loading ? (
            <div className="loading">Loading your tasks...</div>
          ) : (
            <>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                fontSize: '0.95rem'
              }}>
                <h2 style={{ margin: 0 }}>📋 Your Tasks</h2>
                <div style={{ color: '#667eea', fontWeight: 'bold' }}>
                  {completedCount}/{tasks.length} completed
                </div>
              </div>
              <TaskList 
                tasks={tasks}
                onToggleComplete={toggleComplete}
                onDeleteTask={deleteTask}
                onUpdateTask={updateTask}
              />
            </>
          )}
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;