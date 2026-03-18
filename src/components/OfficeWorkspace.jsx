import React from 'react';
import { AGENT_STATES } from '../agents/AgentDefinitions.js';

const STATE_CONFIG = {
  [AGENT_STATES.IDLE]: { label: 'Idle', color: '#555', bg: 'transparent' },
  [AGENT_STATES.WORKING]: { label: 'Working', color: '#20C997', bg: 'rgba(32,201,151,0.06)' },
  [AGENT_STATES.THINKING]: { label: 'Thinking', color: '#2EC4F3', bg: 'rgba(46,196,243,0.06)' },
  [AGENT_STATES.WALKING]: { label: 'Moving', color: '#F7CC76', bg: 'rgba(247,204,118,0.06)' },
  [AGENT_STATES.COLLABORATING]: { label: 'Collab', color: '#9B59B6', bg: 'rgba(155,89,182,0.06)' },
  [AGENT_STATES.PRESENTING]: { label: 'Presenting', color: '#0047AB', bg: 'rgba(0,71,171,0.06)' },
  [AGENT_STATES.COFFEE]: { label: 'Break', color: '#F08D34', bg: 'rgba(240,141,52,0.06)' },
  [AGENT_STATES.CELEBRATING]: { label: 'Done!', color: '#F7CC76', bg: 'rgba(247,204,118,0.08)' },
};

function AgentCard({ agent, isSelected, onClick }) {
  const isActive = agent.state !== AGENT_STATES.IDLE;
  const isWorking = agent.state === AGENT_STATES.WORKING || agent.state === AGENT_STATES.THINKING;
  const isCelebrating = agent.state === AGENT_STATES.CELEBRATING;
  const cfg = STATE_CONFIG[agent.state] || STATE_CONFIG[AGENT_STATES.IDLE];

  return (
    <div onClick={onClick} style={{
      background: isActive ? cfg.bg : '#0C1526',
      border: `1.5px solid ${isSelected ? '#2EC4F3' : isActive ? `${cfg.color}44` : '#1A2A3A'}`,
      borderRadius: '10px', padding: '16px', cursor: 'pointer',
      transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column', gap: '12px',
    }}>
      {/* Active glow */}
      {isWorking && <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: `radial-gradient(ellipse at 30% 20%, ${cfg.color}10 0%, transparent 70%)`,
        animation: 'cardGlow 3s ease-in-out infinite', pointerEvents: 'none',
      }} />}

      {/* Top: Avatar + Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', position: 'relative', zIndex: 1 }}>
        {/* PFP */}
        <div style={{
          width: 56, height: 56, borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
          border: `2.5px solid ${isActive ? cfg.color : '#1A2A3A'}`,
          transition: 'border-color 0.3s',
          boxShadow: isActive ? `0 0 12px ${cfg.color}33` : 'none',
        }}>
          <img src={`/assets/avatars/${agent.id}.png`} alt={agent.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ color: '#FAF9F5', fontFamily: '"Press Start 2P", monospace', fontSize: '11px' }}>{agent.name}</span>
            {/* Status dot */}
            <span style={{
              width: 8, height: 8, borderRadius: '50%', background: cfg.color, flexShrink: 0,
              animation: isActive ? 'dotPulse 1.5s ease-in-out infinite' : 'none',
              boxShadow: isActive ? `0 0 6px ${cfg.color}` : 'none',
            }} />
          </div>
          <div style={{ color: '#888', fontFamily: '"Press Start 2P", monospace', fontSize: '7px', lineHeight: '1.4' }}>{agent.title}</div>
        </div>

        {/* Task badge */}
        {agent.completedTasks > 0 && (
          <div style={{
            background: '#F7CC76', color: '#1a1a1a',
            fontFamily: '"Press Start 2P", monospace', fontSize: '9px',
            width: 28, height: 28, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 'bold', flexShrink: 0,
            boxShadow: '0 0 8px rgba(247,204,118,0.3)',
          }}>{agent.completedTasks}</div>
        )}
      </div>

      {/* Status bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative', zIndex: 1 }}>
        <span style={{
          fontFamily: '"Press Start 2P", monospace', fontSize: '7px',
          color: cfg.color, textTransform: 'uppercase', letterSpacing: '0.5px',
          minWidth: '60px',
        }}>{cfg.label}</span>
        {isWorking && (
          <div style={{ flex: 1, height: 4, background: '#162240', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ height: '100%', background: `linear-gradient(90deg, ${cfg.color}, ${cfg.color}88)`, borderRadius: '2px', animation: 'progressSlide 2.5s ease-in-out infinite' }} />
          </div>
        )}
        {isCelebrating && <span style={{ fontSize: '14px', animation: 'celebBounce 0.5s ease-in-out infinite alternate' }}>&#10024;</span>}
      </div>

      {/* Speech bubble */}
      {agent.speechBubble && (
        <div style={{
          padding: '8px 10px', background: '#0A1628', borderRadius: '6px',
          border: `1px solid ${cfg.color}22`,
          fontFamily: '"Press Start 2P", monospace', fontSize: '6px',
          color: '#ccc', lineHeight: '1.8', position: 'relative', zIndex: 1,
        }}>
          <span style={{ color: cfg.color, marginRight: '4px' }}>{'>'}</span>
          {agent.speechBubble}
        </div>
      )}
    </div>
  );
}

export default function OfficeWorkspace({ agents, selectedAgent, onSelectAgent }) {
  const activeCount = agents.filter(a => a.state !== AGENT_STATES.IDLE).length;
  const totalTasks = agents.reduce((sum, a) => sum + a.completedTasks, 0);

  return (
    <div className="game-office" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#070D18' }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px 14px', borderBottom: '1px solid #144B63',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: '#0A1120',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/assets/ayima-logo.png" alt="Ayima" style={{ height: 26, opacity: 0.9 }} />
          <span style={{ color: '#333', fontSize: '14px', fontWeight: 300 }}>|</span>
          <span style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '10px', color: '#2EC4F3', letterSpacing: '2px' }}>AGI HQ</span>
        </div>
        <div style={{ display: 'flex', gap: '16px', fontFamily: '"Press Start 2P", monospace', fontSize: '7px', alignItems: 'center' }}>
          <span style={{ color: activeCount > 0 ? '#20C997' : '#555' }}>
            {activeCount > 0 ? `${activeCount} ACTIVE` : 'ALL IDLE'}
          </span>
          {totalTasks > 0 && (
            <span style={{ color: '#F7CC76', background: 'rgba(247,204,118,0.1)', padding: '3px 8px', borderRadius: '4px' }}>
              {totalTasks} COMPLETED
            </span>
          )}
        </div>
      </div>

      {/* Agent Grid - responsive, fills available space */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '16px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '12px',
        alignContent: 'start',
      }}>
        {agents.map(agent => (
          <AgentCard key={agent.id} agent={agent} isSelected={selectedAgent === agent.id}
            onClick={() => onSelectAgent(agent.id === selectedAgent ? null : agent.id)} />
        ))}
      </div>

      <style>{`
        @keyframes dotPulse { 0%,100%{opacity:.4;transform:scale(1)}50%{opacity:1;transform:scale(1.5)} }
        @keyframes cardGlow { 0%,100%{opacity:.4}50%{opacity:1} }
        @keyframes progressSlide { 0%{width:10%;margin-left:0}50%{width:60%;margin-left:20%}100%{width:10%;margin-left:90%} }
        @keyframes celebBounce { 0%{transform:scale(1)}100%{transform:scale(1.3) rotate(15deg)} }
      `}</style>
    </div>
  );
}
