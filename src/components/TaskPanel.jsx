import React, { useState } from 'react';
import { AGENTS } from '../agents/AgentDefinitions.js';

export default function TaskPanel({ tasks, onSubmitTask }) {
  const [input, setInput] = useState('');
  const [expandedTask, setExpandedTask] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSubmitTask(input.trim());
      setInput('');
    }
  };

  const getAgentName = (agentId) => {
    const agent = AGENTS.find((a) => a.id === agentId);
    return agent ? agent.name : agentId;
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
          <div className="task-empty">No tasks yet. Type a task above or click a button to get the agents working!</div>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className={`task-item status-${task.status} ${expandedTask === task.id ? 'task-expanded' : ''}`}>
              <div
                className="task-item-header"
                onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
              >
                <div className="task-status-icon">{getStatusIcon(task.status)}</div>
                <div className="task-content">
                  <div className="task-description">{task.description}</div>
                  <div className="task-meta">
                    {task.assignedTo && (
                      <span className="task-assignee">→ {getAgentName(task.assignedTo)}</span>
                    )}
                    <span className="task-time">
                      {new Date(task.createdAt).toLocaleTimeString()}
                    </span>
                    {task.result && (
                      <span className="task-has-result">View Result</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded result view */}
              {expandedTask === task.id && task.result && (
                <TaskResult result={task.result} />
              )}

              {/* In-progress indicator */}
              {expandedTask === task.id && task.status === 'in_progress' && !task.result && (
                <div className="task-working">
                  <div className="task-working-dots">
                    <span>.</span><span>.</span><span>.</span>
                  </div>
                  <div className="task-working-text">
                    {task.assignedTo ? `${getAgentName(task.assignedTo)} is working on this...` : 'Processing...'}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function TaskResult({ result }) {
  if (!result) return null;

  return (
    <div className="task-result">
      {/* Header */}
      <div className="task-result-header">
        <div className="task-result-type">{result.deliverableType || 'Task Output'}</div>
        {result.agentName && (
          <div className="task-result-agent">by {result.agentName} ({result.agentRole})</div>
        )}
      </div>

      {/* Summary */}
      {result.summary && (
        <div className="task-result-summary">{result.summary}</div>
      )}

      {/* KB Context */}
      {result.kbDocumentsUsed && result.kbDocumentsUsed.length > 0 && (
        <div className="task-result-kb">
          <span className="task-result-kb-icon">📚</span>
          KB sources: {result.kbDocumentsUsed.join(', ')}
        </div>
      )}

      {/* Sections */}
      {result.sections && result.sections.map((section, si) => (
        <div key={si} className="task-result-section">
          <div className="task-result-section-heading">{section.heading}</div>
          <ul className="task-result-items">
            {section.items.map((item, ii) => (
              <li key={ii} className="task-result-item">{item}</li>
            ))}
          </ul>
        </div>
      ))}

      {/* Recommendations */}
      {result.recommendations && result.recommendations.length > 0 && (
        <div className="task-result-section">
          <div className="task-result-section-heading">Recommendations</div>
          <div className="task-result-recs">
            {result.recommendations.map((rec, ri) => (
              <div key={ri} className={`task-result-rec priority-${rec.priority.toLowerCase()}`}>
                <span className="rec-priority">{rec.priority}</span>
                <span className="rec-action">{rec.action}</span>
                <span className="rec-impact">{rec.impact}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* KB Context note */}
      {result.kbContext && (
        <div className="task-result-kb-note">{result.kbContext}</div>
      )}

      {/* Timestamp */}
      {result.timestamp && (
        <div className="task-result-time">
          Completed: {new Date(result.timestamp).toLocaleString()}
        </div>
      )}
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
