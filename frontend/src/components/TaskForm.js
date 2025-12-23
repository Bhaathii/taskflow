import React, { useState } from 'react';
import { Plus, Bell } from 'lucide-react';

function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [reminder, setReminder] = useState(false);
  const [error, setError] = useState('');
  const titleId = React.useId();
  const descriptionId = React.useId();
  const dueDateId = React.useId();
  const reminderId = React.useId();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Please enter a task title');
      return;
    }

    onAddTask({
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      reminder: reminder
    });

    setTitle('');
    setDescription('');
    setDueDate('');
    setReminder(false);
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
        <label htmlFor={titleId} className="visually-hidden">Task Title *</label>
        <input
          id={titleId}
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
        <div style={{ fontSize: '0.85rem', color: '#999', marginTop: '-10px' }} aria-hidden="true">
          {title.length}/100
        </div>
        <label htmlFor={descriptionId} className="visually-hidden">Task Description</label>
        <textarea
          id={descriptionId}
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

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginTop: '10px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <label htmlFor={dueDateId} style={{ fontSize: '0.9rem', marginBottom: '5px', color: '#666' }}>Due Date</label>
            <input
              id={dueDateId}
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="input-field"
              style={{ marginTop: 0 }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '22px' }}>
            <input
              id={reminderId}
              type="checkbox"
              checked={reminder}
              onChange={(e) => {
                const checked = e.target.checked;
                setReminder(checked);
                if (checked && 'Notification' in window && Notification.permission !== 'granted') {
                  Notification.requestPermission();
                }
              }}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <label htmlFor={reminderId} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Bell size={16} /> Remind me
            </label>
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '15px' }}>
          <Plus size={20} />
          Add Task
        </button>
      </form>
    </div>
  );
}

export default TaskForm;