import React from 'react';
import { AGENT_STATES } from '../agents/AgentDefinitions.js';

/**
 * The main office workspace - a top-down isometric-style view
 * of the office where cartoon agent characters sit at their desks.
 */
export default function OfficeWorkspace({ agents, selectedAgent, onSelectAgent }) {
  return (
    <div className="office-workspace">
      <div className="office-floor">
        {/* Office decorations */}
        <div className="office-plant plant-1">🌿</div>
        <div className="office-plant plant-2">🪴</div>
        <div className="office-water-cooler">🚰</div>
        <div className="office-whiteboard">
          <div className="whiteboard-content">
            <div className="wb-title">Sprint Board</div>
            <div className="wb-items">
              <span className="wb-done">✓ Setup</span>
              <span className="wb-progress">→ Build</span>
              <span className="wb-todo">○ Ship</span>
            </div>
          </div>
        </div>

        {/* Agent desks */}
        <div className="desk-grid">
          {agents.map((agent) => (
            <AgentDesk
              key={agent.id}
              agent={agent}
              isSelected={selectedAgent === agent.id}
              onClick={() => onSelectAgent(agent.id === selectedAgent ? null : agent.id)}
            />
          ))}
        </div>

        {/* Center meeting table */}
        <div className="meeting-table">
          <span className="table-label">Team Hub</span>
        </div>
      </div>
    </div>
  );
}

function AgentDesk({ agent, isSelected, onClick }) {
  const stateClass = `agent-state-${agent.state}`;
  const isActive = agent.state !== AGENT_STATES.IDLE;

  return (
    <div
      className={`agent-desk ${stateClass} ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
      style={{ '--agent-color': agent.color }}
    >
      {/* Status bubble */}
      {isActive && (
        <div className="status-bubble">
          <span className="bubble-text">{getStatusText(agent.state)}</span>
        </div>
      )}

      {/* The character */}
      <div className={`agent-character ${isActive ? 'active' : 'idle'}`}>
        <div className="character-body" style={{ backgroundColor: agent.color }}>
          {/* Head */}
          <div className="character-head">
            <div className="character-face">
              <span className="eyes">{getEyes(agent.state)}</span>
              <span className="mouth">{getMouth(agent.state)}</span>
            </div>
            {agent.state === AGENT_STATES.THINKING && (
              <div className="thought-bubbles">
                <span className="thought t1">.</span>
                <span className="thought t2">.</span>
                <span className="thought t3">💡</span>
              </div>
            )}
          </div>
          {/* Body / Arms animation */}
          <div className={`character-arms ${isActive ? 'typing' : 'resting'}`}>
            <span className="arm left">╰</span>
            <span className="arm right">╯</span>
          </div>
        </div>
      </div>

      {/* Desk surface */}
      <div className="desk-surface">
        <div className="desk-items">
          <span className="desk-computer">{getComputerIcon(agent.state)}</span>
          <span className="desk-accessory">{getDeskAccessory(agent.role)}</span>
        </div>
      </div>

      {/* Name plate */}
      <div className="name-plate">
        <span className="agent-name">{agent.name}</span>
        <span className="agent-title">{agent.title}</span>
      </div>

      {/* Task counter badge */}
      {agent.completedTasks > 0 && (
        <div className="task-badge">{agent.completedTasks}</div>
      )}

      {/* Active glow effect */}
      {isActive && <div className="active-glow" />}

      {/* Celebration particles */}
      {agent.state === AGENT_STATES.CELEBRATING && (
        <div className="celebration">
          {['🎉', '⭐', '✨', '🎊'].map((emoji, i) => (
            <span key={i} className={`particle p${i}`}>{emoji}</span>
          ))}
        </div>
      )}
    </div>
  );
}

function getEyes(state) {
  switch (state) {
    case AGENT_STATES.WORKING: return '◉ ◉';
    case AGENT_STATES.THINKING: return '◑ ◑';
    case AGENT_STATES.COLLABORATING: return '◕ ◕';
    case AGENT_STATES.BLOCKED: return '✖ ✖';
    case AGENT_STATES.CELEBRATING: return '◠ ◠';
    default: return '● ●';
  }
}

function getMouth(state) {
  switch (state) {
    case AGENT_STATES.WORKING: return '▬';
    case AGENT_STATES.THINKING: return '○';
    case AGENT_STATES.COLLABORATING: return '◡';
    case AGENT_STATES.BLOCKED: return '▿';
    case AGENT_STATES.CELEBRATING: return '◡';
    default: return '‿';
  }
}

function getStatusText(state) {
  switch (state) {
    case AGENT_STATES.WORKING: return 'Working...';
    case AGENT_STATES.THINKING: return 'Thinking...';
    case AGENT_STATES.COLLABORATING: return 'Collab!';
    case AGENT_STATES.BLOCKED: return 'Blocked!';
    case AGENT_STATES.CELEBRATING: return 'Done! 🎉';
    default: return '';
  }
}

function getComputerIcon(state) {
  if (state === AGENT_STATES.WORKING) return '💻';
  if (state === AGENT_STATES.THINKING) return '🖥️';
  return '🖥️';
}

function getDeskAccessory(role) {
  switch (role) {
    case 'planner': return '📊';
    case 'researcher': return '📚';
    case 'coder': return '☕';
    case 'reviewer': return '🔍';
    case 'tester': return '🧪';
    case 'documenter': return '📒';
    default: return '📎';
  }
}
