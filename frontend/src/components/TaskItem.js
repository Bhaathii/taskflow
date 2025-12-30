import React, { useState } from 'react';
import { Edit2, Trash2, Check, X, Calendar, Clock, Bell } from 'lucide-react';

function TaskItem({ task, onToggleComplete, onDeleteTask, onUpdateTask }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);
  const [isLoading, setIsLoading] = useState(false);

  // Helper to format date for input (local time)
  const toLocalISOString = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 16);
  };

  const [editDueDate, setEditDueDate] = useState(toLocalISOString(task.dueDate));
  const [editReminder, setEditReminder] = useState(task.reminder);
  const [editPriority, setEditPriority] = useState(task.priority || 'medium');
  const [error, setError] = useState('');

  const handleUpdate = async () => {
    if (!editTitle.trim()) {
      setError('Task title cannot be empty');
      return;
    }
    setIsLoading(true);
    try {
      await onUpdateTask(task._id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
        dueDate: editDueDate || null,
        reminder: editReminder,
        priority: editPriority
      });
      setIsEditing(false);
      setError('');
    } catch (err) {
      console.error('Error updating task:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditDueDate(toLocalISOString(task.dueDate));
    setEditReminder(task.reminder);
    setEditPriority(task.priority || 'medium');
    setIsEditing(false);
    setError('');
  };

  const handleReminderChange = (e) => {
    const checked = e.target.checked;
    setEditReminder(checked);
    if (checked && 'Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isEditing) {
    return (
      <div className="task-item editing">
        {error && (
          <div style={{
            color: '#d32f2f',
            marginBottom: '10px',
            fontSize: '0.9rem',
            padding: '10px',
            background: '#ffebee',
            borderRadius: '8px',
            width: '100%'
          }}>
            {error}
          </div>
        )}
        <input
          type="text"
          value={editTitle}
          onChange={(e) => {
            setEditTitle(e.target.value);
            setError('');
          }}
          className="input-field"
          placeholder="Task title"
          maxLength="100"
          aria-label="Edit task title"
        />
        <div style={{ fontSize: '0.85rem', color: '#999' }}>
          {editTitle.length}/100
        </div>
        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          className="input-field"
          rows="3"
          placeholder="Task description"
          maxLength="500"
          aria-label="Edit task description"
        />
        <div style={{ fontSize: '0.85rem', color: '#999' }}>
          {editDescription.length}/500
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '10px', marginBottom: '10px' }}>
            <input
              type="datetime-local"
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
              className="input-field"
              style={{ marginTop: 0, flex: 1 }}
              aria-label="Edit due date"
            />
            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value)}
              className="input-field"
              style={{ marginTop: 0, width: '120px' }}
              aria-label="Edit priority"
            >
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🔴 High</option>
            </select>
            <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              <input
                type="checkbox"
                checked={editReminder}
                onChange={handleReminderChange}
              />
              <Bell size={16} /> Remind
            </label>
        </div>

        <div className="edit-actions">
          <button onClick={handleUpdate} className="btn btn-success" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', opacity: isLoading ? 0.7 : 1 }} disabled={isLoading}>
            <Check size={18} /> {isLoading ? 'Saving...' : 'Save'}
          </button>
          <button onClick={handleCancel} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }} disabled={isLoading}>
            <X size={18} /> Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        className="task-checkbox"
        checked={task.completed}
        onChange={() => onToggleComplete(task._id, task.completed)}
        title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
        aria-label={task.completed ? 'Mark task as incomplete' : 'Mark task as complete'}
      />
      <div className="task-content">
        <div className="task-title">{task.title}</div>
        {task.description && (
          <div className="task-description">{task.description}</div>
        )}
        <div className="task-meta" style={{ display: 'flex', gap: '15px', fontSize: '0.8rem', color: '#666', marginTop: '5px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '12px', background: task.priority === 'high' ? '#ffebee' : task.priority === 'low' ? '#e8f5e9' : '#fff3e0' }}>
            {task.priority === 'high' && '🔴'}
            {task.priority === 'medium' && '🟡'}
            {task.priority === 'low' && '🟢'}
            {task.priority || 'medium'} Priority
          </div>
          <div className="task-date" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Calendar size={14} />
            Created: {formatDate(task.createdAt)}
          </div>
          {task.dueDate && (
            <div className="task-due-date" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: new Date(task.dueDate) < new Date() && !task.completed ? '#d32f2f' : '#666' }}>
              <Clock size={14} />
              Due: {formatDateTime(task.dueDate)}
            </div>
          )}
          {task.reminder && !task.completed && (
            <div className="task-reminder" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f57c00' }}>
              <Bell size={14} />
              Reminder Set
            </div>
          )}
        </div>
      </div>
      <div className="task-actions">
        <button 
          onClick={() => setIsEditing(true)} 
          className="btn btn-secondary"
          title="Edit task"
          style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <Edit2 size={16} />
          Edit
        </button>
        <button 
          onClick={() => {
            if (window.confirm('Are you sure you want to delete this task?')) {
              onDeleteTask(task._id);
            }
          }} 
          className="btn btn-danger"
          title="Delete task"
          style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </div>
  );
}

export default TaskItem;