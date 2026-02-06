import React from 'react';
import { AGENT_STATES } from '../agents/AgentDefinitions.js';

export default function OfficeWorkspace({ agents, selectedAgent, onSelectAgent }) {
  return (
    <div className="game-office">
      {/* Top decoration shelf */}
      <div className="office-shelf">
        <div className="shelf-item shelf-drinks">
          <span className="shelf-icon">&#9749;</span>
          <span className="shelf-icon">&#127849;</span>
        </div>
        <div className="shelf-item shelf-window">
          <div className="pixel-window">
            <div className="win-pane"></div>
            <div className="win-pane"></div>
            <div className="win-pane"></div>
            <div className="win-pane"></div>
          </div>
        </div>
        <div className="shelf-item shelf-center">
          <span className="shelf-icon">&#128200;</span>
          <span className="shelf-icon">&#128336;</span>
        </div>
        <div className="shelf-item shelf-window">
          <div className="pixel-window">
            <div className="win-pane"></div>
            <div className="win-pane"></div>
            <div className="win-pane"></div>
            <div className="win-pane"></div>
          </div>
        </div>
        <div className="shelf-item shelf-board">
          <span className="shelf-icon">&#128204;</span>
          <span className="shelf-icon">&#128196;</span>
        </div>
      </div>

      {/* Title */}
      <div className="office-title-bar">
        <span className="sparkle-icon">&#10024;</span>
        SEO AGENT OFFICE
        <span className="sparkle-icon">&#10024;</span>
      </div>

      {/* The brick floor with agents */}
      <div className="office-floor">
        {/* Decorations */}
        <div className="floor-plant" style={{ bottom: 12, right: 30 }}>&#127793;</div>
        <div className="floor-plant" style={{ top: 12, left: 20 }}>&#127811;</div>

        {/* Agent grid */}
        <div className="agent-grid">
          {agents.map((agent) => (
            <AgentStation
              key={agent.id}
              agent={agent}
              isSelected={selectedAgent === agent.id}
              onClick={() => onSelectAgent(agent.id === selectedAgent ? null : agent.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function AgentStation({ agent, isSelected, onClick }) {
  const isActive = agent.state !== AGENT_STATES.IDLE;
  const isWorking = agent.state === AGENT_STATES.WORKING || agent.state === AGENT_STATES.THINKING;
  const isWalking = agent.state === AGENT_STATES.WALKING;
  const isCelebrating = agent.state === AGENT_STATES.CELEBRATING;
  const isCoffee = agent.state === AGENT_STATES.COFFEE;
  const isCollab = agent.state === AGENT_STATES.COLLABORATING || agent.state === AGENT_STATES.PRESENTING;

  return (
    <div className={`agent-station ${isSelected ? 'station-selected' : ''}`} onClick={onClick}>
      {/* Character */}
      <div className={`pixel-char ${isActive ? 'char-active' : ''} ${isWalking ? 'char-walk' : ''}`}>
        {/* Thinking / celebration effects */}
        {agent.state === AGENT_STATES.THINKING && (
          <div className="think-effect">&#128161;</div>
        )}
        {isCelebrating && (
          <div className="celebrate-fx">
            <span className="conf c0">&#10024;</span>
            <span className="conf c1">&#127881;</span>
            <span className="conf c2">&#10024;</span>
          </div>
        )}
        {isCoffee && (
          <div className="coffee-fx">&#9749;</div>
        )}

        {/* Hair */}
        <div className="ch-hair" style={{ background: agent.hairColor }}></div>
        {/* Head */}
        <div className="ch-head" style={{ background: agent.skinTone }}>
          <div className="ch-eye ch-eye-l"></div>
          <div className="ch-eye ch-eye-r"></div>
        </div>
        {/* Body */}
        <div className="ch-body" style={{ background: agent.shirtColor }}></div>
        {/* Legs */}
        <div className="ch-legs">
          <div className={`ch-leg ch-leg-l ${isWalking ? 'walk-l' : ''}`}></div>
          <div className={`ch-leg ch-leg-r ${isWalking ? 'walk-r' : ''}`}></div>
        </div>
      </div>

      {/* Status label */}
      <div className={`state-tag ${isWorking ? 'tag-working' : ''} ${isCelebrating ? 'tag-done' : ''} ${isCollab ? 'tag-collab' : ''} ${isCoffee ? 'tag-coffee' : ''}`}>
        {getLabel(agent.state)}
      </div>

      {/* Desk */}
      <div className="px-desk">
        <div className="desk-top-surface">
          <DeskItems role={agent.role} state={agent.state} />
        </div>
        <div className="desk-front-face"></div>
      </div>

      {/* Nameplate */}
      <div className="px-nameplate">{agent.name}</div>
      <div className="px-title">{agent.title}</div>

      {/* Task badge */}
      {agent.completedTasks > 0 && (
        <div className="px-badge">{agent.completedTasks}</div>
      )}
    </div>
  );
}

function DeskItems({ role, state }) {
  const isWorking = state === AGENT_STATES.WORKING || state === AGENT_STATES.THINKING;

  if (role === 'data_engineer') {
    return (
      <>
        <div className={`px-monitor ${isWorking ? 'mon-glow' : ''}`}>
          <div className="mon-screen mon-code">
            <div className="code-ln c1"></div>
            <div className="code-ln c2"></div>
            <div className="code-ln c3"></div>
          </div>
        </div>
        <div className={`px-monitor ${isWorking ? 'mon-glow' : ''}`}>
          <div className="mon-screen mon-data">
            <div className="data-br d1"></div>
            <div className="data-br d2"></div>
            <div className="data-br d3"></div>
            <div className="data-br d4"></div>
          </div>
        </div>
        <div className="desk-obj">&#127911;</div>
      </>
    );
  }

  if (role === 'coo' || role === 'account_manager') {
    return (
      <>
        <div className={`px-monitor ${isWorking ? 'mon-glow' : ''}`}>
          <div className="mon-screen mon-chart">
            <div className="chart-line"></div>
          </div>
        </div>
        <div className="desk-obj desk-clipboard">
          <div className="clip-check">&#10003;</div>
          <div className="clip-check">&#10003;</div>
        </div>
      </>
    );
  }

  if (role === 'principal_seo' || role === 'head_of_seo') {
    return (
      <>
        <div className="desk-obj">&#128269;</div>
        <div className={`px-monitor ${isWorking ? 'mon-glow' : ''}`}>
          <div className="mon-screen mon-serp">
            <div className="serp-ln s1"></div>
            <div className="serp-ln s2"></div>
            <div className="serp-ln s3"></div>
          </div>
        </div>
        <div className="desk-obj">&#128202;</div>
      </>
    );
  }

  return (
    <>
      <div className={`px-monitor ${isWorking ? 'mon-glow' : ''}`}>
        <div className="mon-screen mon-kw">
          <div className="kw-block k1"></div>
          <div className="kw-block k2"></div>
        </div>
      </div>
      <div className="desk-obj">&#128214;</div>
    </>
  );
}

function getLabel(state) {
  switch (state) {
    case AGENT_STATES.WORKING: return 'working...';
    case AGENT_STATES.THINKING: return 'thinking...';
    case AGENT_STATES.WALKING: return 'walking';
    case AGENT_STATES.COLLABORATING: return 'meeting';
    case AGENT_STATES.PRESENTING: return 'presenting';
    case AGENT_STATES.COFFEE: return 'coffee break';
    case AGENT_STATES.CELEBRATING: return 'done!';
    default: return 'idle';
  }
}
