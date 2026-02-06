import React, { useState } from 'react';

export default function TaskPanel({ tasks, onSubmitTask }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSubmitTask(input.trim());
      setInput('');
    }
  };

  return (
    <div className="task-panel">
      <h3 className="panel-title">
        <span className="panel-icon">📋</span>
        Task Queue
      </h3>

      <form className="task-input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="task-input"
          placeholder="Describe a task for the team..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="task-submit-btn">
          Send
        </button>
      </form>

      <div className="task-list">
        {tasks.length === 0 ? (
          <div className="task-empty">No tasks yet. Type a task above to get the agents working!</div>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className={`task-item status-${task.status}`}>
              <div className="task-status-icon">{getStatusIcon(task.status)}</div>
              <div className="task-content">
                <div className="task-description">{task.description}</div>
                <div className="task-meta">
                  {task.assignedTo && <span className="task-assignee">→ {task.assignedTo}</span>}
                  <span className="task-time">
                    {new Date(task.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function getStatusIcon(status) {
  switch (status) {
    case 'pending': return '⏳';
    case 'in_progress': return '🔄';
    case 'completed': return '✅';
    case 'failed': return '❌';
    default: return '○';
  }
}
