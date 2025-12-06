import React, { useState } from 'react';
import { Plus } from 'lucide-react';

function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Please enter a task title');
      return;
    }

    onAddTask({
      title: title.trim(),
      description: description.trim()
    });

    setTitle('');
    setDescription('');
    setError('');
  };

  return (
    <div className="task-form">
      <h2>✨ Create New Task</h2>
      {error && (
        <div style={{
          color: '#d32f2f',
          marginBottom: '15px',
          fontSize: '0.9rem',
          padding: '10px',
          background: '#ffebee',
          borderRadius: '8px'
        }}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="What needs to be done? *"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError('');
          }}
          className="input-field"
          maxLength="100"
        />
        <div style={{ fontSize: '0.85rem', color: '#999', marginTop: '-10px' }}>
          {title.length}/100
        </div>
        <textarea
          placeholder="Add more details (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input-field"
          rows="3"
          maxLength="500"
        />
        <div style={{ fontSize: '0.85rem', color: '#999', marginTop: '-10px' }}>
          {description.length}/500
        </div>
        <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <Plus size={20} />
          Add Task
        </button>
      </form>
    </div>
  );
}

export default TaskForm;