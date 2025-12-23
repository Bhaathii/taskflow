import React, { useState } from 'react';
import { Plus, Bell, Sparkles } from 'lucide-react';
import * as chrono from 'chrono-node';

function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [reminder, setReminder] = useState(false);
  const [showSmartInput, setShowSmartInput] = useState(false);
  const [smartInputValue, setSmartInputValue] = useState('');
  const [error, setError] = useState('');

  const titleId = React.useId();
  const descriptionId = React.useId();
  const dueDateId = React.useId();
  const reminderId = React.useId();
  const smartInputId = React.useId();

  const handleSmartInputChange = (e) => {
    const text = e.target.value;
    setSmartInputValue(text);

    const parsed = chrono.parse(text);
    if (parsed.length > 0) {
      const date = parsed[0].start.date();

      // Convert to local YYYY-MM-DDTHH:mm string for the input
      // This is a bit tricky. new Date(date) gives a date object.
      // We want the local time string representation.
      const offset = date.getTimezoneOffset() * 60000;
      const localDate = new Date(date.getTime() - offset);
      const isoString = localDate.toISOString().slice(0, 16);

      setDueDate(isoString);

      // Remove the date text from the title?
      // Optional: keep the full text as title or strip the date part.
      // For now, let's keep the full text in the smart input, but update the 'title' state
      // with the text MINUS the date string if we wanted to be fancy.
      // But user might want to edit.

      // Let's just update the title to match the input text for now,
      // or maybe the user wants the Smart Input to just populate the fields.

      // Current design: Smart Input populates Title and Date.
      setTitle(text);
    } else {
      setTitle(text);
    }
  };

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
    setSmartInputValue('');
    setError('');
    // Keep Smart Input open if it was open? Or close it?
    // Let's leave it as is.
  };

  return (
    <div className="task-form">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h2 style={{ margin: 0 }}>✨ Create New Task</h2>
        <button
          type="button"
          onClick={() => setShowSmartInput(!showSmartInput)}
          style={{
            background: 'none',
            border: 'none',
            color: '#667eea',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '0.9rem',
            padding: '5px 10px',
            borderRadius: '5px',
            backgroundColor: showSmartInput ? '#eef2ff' : 'transparent'
          }}
        >
          <Sparkles size={16} />
          {showSmartInput ? 'Simple Mode' : 'Smart Add'}
        </button>
      </div>

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
        {showSmartInput && (
          <div style={{ marginBottom: '15px', padding: '15px', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
            <label htmlFor={smartInputId} style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#475569', fontWeight: 'bold' }}>
              <Sparkles size={14} style={{ display: 'inline', marginRight: '4px' }}/>
              Smart Input
            </label>
            <input
              id={smartInputId}
              type="text"
              placeholder="e.g., 'Call Mom tomorrow at 5pm'"
              value={smartInputValue}
              onChange={handleSmartInputChange}
              className="input-field"
              autoFocus
            />
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '5px' }}>
              Type naturally. We'll extract the due date automatically.
            </div>
          </div>
        )}

        <label htmlFor={titleId} className="visually-hidden">Task Title *</label>
        <input
          id={titleId}
          type="text"
          placeholder="What needs to be done? *"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (showSmartInput) setSmartInputValue(e.target.value); // Sync back
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