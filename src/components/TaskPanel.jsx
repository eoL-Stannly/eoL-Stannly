import React, { useState, useEffect, useRef } from 'react';
import { AGENTS } from '../agents/AgentDefinitions.js';
import { exportDeliverable } from '../exportDeliverable.js';

export default function TaskPanel({ tasks, onSubmitTask }) {
  const [input, setInput] = useState('');
  const [expandedTask, setExpandedTask] = useState(null);
  const prevTasksRef = useRef(tasks);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSubmitTask(input.trim());
      setInput('');
    }
  };

  // Auto-expand tasks when they complete with a result
  useEffect(() => {
    const prev = prevTasksRef.current;
    for (const task of tasks) {
      const prevTask = prev.find((t) => t.id === task.id);
      if (task.status === 'completed' && task.result && (!prevTask || prevTask.status !== 'completed')) {
        setExpandedTask(task.id);
        break;
      }
    }
    prevTasksRef.current = tasks;
  }, [tasks]);

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
                  <div className="task-description">{task.shortTitle || task.description.split('\n')[0].slice(0, 60)}</div>
                  {/* Meta badges: brief, attachments, links */}
                  {task.meta && (
                    <div className="task-config-badges">
                      {task.meta.brief && <span className="task-badge badge-brief">Brief</span>}
                      {task.meta.links?.length > 0 && <span className="task-badge badge-links">{task.meta.links.length} link{task.meta.links.length > 1 ? 's' : ''}</span>}
                      {task.meta.fileNames?.length > 0 && <span className="task-badge badge-files">{task.meta.fileNames.length} file{task.meta.fileNames.length > 1 ? 's' : ''}</span>}
                      {task.meta.format && task.meta.format !== 'markdown' && <span className="task-badge badge-format">{task.meta.format.toUpperCase()}</span>}
                    </div>
                  )}
                  <div className="task-meta">
                    {task.assignedTo && (
                      <span className="task-assignee">→ {getAgentName(task.assignedTo)}</span>
                    )}
                    <span className="task-time">
                      {new Date(task.createdAt).toLocaleTimeString()}
                    </span>
                    {task.result && (
                      <span className="task-has-result">{expandedTask === task.id ? 'Hide' : 'View Result'}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress bar — always visible on active tasks */}
              {(task.status === 'pending' || task.status === 'in_progress') && (
                <TaskProgress task={task} />
              )}

              {/* Expanded result view */}
              {expandedTask === task.id && task.result && (
                <TaskResult result={task.result} />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function TaskProgress({ task }) {
  const progress = task.progress || {};
  const percent = progress.percent || (task.status === 'pending' ? 5 : 10);
  const stageText = progress.stageText || (task.status === 'pending' ? 'Queued — waiting for triage...' : 'Processing...');
  const stage = progress.stage || 'queued';

  return (
    <div className="task-progress">
      <div className="task-progress-bar-track">
        <div
          className={`task-progress-bar-fill stage-${stage}`}
          style={{ width: `${percent}%` }}
        ></div>
      </div>
      <div className="task-progress-info">
        <span className="task-progress-text">{stageText}</span>
        <span className="task-progress-pct">{Math.round(percent)}%</span>
      </div>
      {/* Stage indicators */}
      <div className="task-progress-stages">
        <ProgressStage label="Triage" active={stage === 'triaging'} done={stageIsDone('triaging', stage)} />
        <ProgressStage label="Assign" active={stage === 'delegating'} done={stageIsDone('delegating', stage)} />
        <ProgressStage label="KB Search" active={stage === 'searching_kb'} done={stageIsDone('searching_kb', stage)} />
        <ProgressStage label="Working" active={stage === 'working'} done={stageIsDone('working', stage)} />
        <ProgressStage label="Done" active={stage === 'completing'} done={stage === 'completing'} />
      </div>
    </div>
  );
}

const STAGE_ORDER = ['queued', 'triaging', 'delegating', 'searching_kb', 'working', 'completing'];

function stageIsDone(checkStage, currentStage) {
  return STAGE_ORDER.indexOf(currentStage) > STAGE_ORDER.indexOf(checkStage);
}

function ProgressStage({ label, active, done }) {
  const cls = done ? 'progress-stage done' : active ? 'progress-stage active' : 'progress-stage';
  return (
    <div className={cls}>
      <div className="progress-stage-dot"></div>
      <span className="progress-stage-label">{label}</span>
    </div>
  );
}

function TaskResult({ result }) {
  if (!result) return null;

  return (
    <div className="task-result">
      <div className="task-result-header">
        <div className="task-result-type">{result.deliverableType || 'Task Output'}</div>
        {result.agentName && (
          <div className="task-result-agent">by {result.agentName} ({result.agentRole})</div>
        )}
      </div>

      {/* Download buttons */}
      <div className="task-result-downloads">
        <button className="task-download-btn" onClick={() => exportDeliverable(result, 'markdown')} title="Download as Markdown">
          Download MD
        </button>
        <button className="task-download-btn" onClick={() => exportDeliverable(result, 'csv')} title="Download as CSV">
          Download CSV
        </button>
      </div>

      {/* SOP/PRD badges */}
      {(result.sopFollowed || result.prdConformed) && (
        <div className="task-result-process-badges">
          {result.sopFollowed && (
            <span className="task-badge badge-sop">SOP: {result.sopFollowed}</span>
          )}
          {result.prdConformed && (
            <span className="task-badge badge-prd">PRD: {result.prdConformed}</span>
          )}
        </div>
      )}

      {result.summary && (
        <div className="task-result-summary">{result.summary}</div>
      )}

      {result.kbDocumentsUsed && result.kbDocumentsUsed.length > 0 && (
        <div className="task-result-kb">
          <span className="task-result-kb-icon">📚</span>
          KB sources: {result.kbDocumentsUsed.join(', ')}
        </div>
      )}

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

      {result.kbContext && (
        <div className="task-result-kb-note">{result.kbContext}</div>
      )}

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
