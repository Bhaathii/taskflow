import React from 'react';
import TaskItem from './TaskItem';

function TaskList({ tasks, onToggleComplete, onDeleteTask, onUpdateTask }) {
  if (tasks.length === 0) {
    return (
      <div className="task-list">
        <div className="no-tasks">
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🎉</div>
          <p>No tasks yet. Create one to get started! 🚀</p>
        </div>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map(task => (
        <TaskItem
          key={task._id}
          task={task}
          onToggleComplete={onToggleComplete}
          onDeleteTask={onDeleteTask}
          onUpdateTask={onUpdateTask}
        />
      ))}
    </div>
  );
}

export default TaskList;