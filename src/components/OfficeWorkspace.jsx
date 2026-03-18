import React from 'react';
import { AGENT_STATES } from '../agents/AgentDefinitions.js';

const STATE_CONFIG = {
  [AGENT_STATES.IDLE]: { label: 'Idle', color: '#666', dot: '#444' },
  [AGENT_STATES.WORKING]: { label: 'Working', color: '#20C997', dot: '#20C997' },
  [AGENT_STATES.THINKING]: { label: 'Thinking', color: '#2EC4F3', dot: '#2EC4F3' },
  [AGENT_STATES.WALKING]: { label: 'Moving', color: '#F7CC76', dot: '#F7CC76' },
  [AGENT_STATES.COLLABORATING]: { label: 'Collaborating', color: '#9B59B6', dot: '#9B59B6' },
  [AGENT_STATES.PRESENTING]: { label: 'Presenting', color: '#0047AB', dot: '#0047AB' },
  [AGENT_STATES.COFFEE]: { label: 'Break', color: '#F08D34', dot: '#F08D34' },
  [AGENT_STATES.CELEBRATING]: { label: 'Done!', color: '#F7CC76', dot: '#F7CC76' },
};

function AgentCard({ agent, isSelected, onClick }) {
  const isActive = agent.state !== AGENT_STATES.IDLE;
  const isWorking = agent.state === AGENT_STATES.WORKING || agent.state === AGENT_STATES.THINKING;
  const isCelebrating = agent.state === AGENT_STATES.CELEBRATING;
  const cfg = STATE_CONFIG[agent.state] || STATE_CONFIG[AGENT_STATES.IDLE];

  const initials = agent.name.charAt(0).toUpperCase();

  return (
    <div
      onClick={onClick}
      style={{
        background: isActive ? 'rgba(46, 196, 243, 0.04)' : '#0C1526',
        border: `1px solid ${isSelected ? '#2EC4F3' : isActive ? `${cfg.color}33` : '#1A2A3A'}`,
        borderRadius: '6px',
        padding: '10px 12px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Active pulse background */}
      {isWorking && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: `linear-gradient(135deg, ${cfg.color}08 0%, transparent 60%)`,
          animation: 'cardPulse 3s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
      )}

      {/* Top row: Avatar + Name + Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative', zIndex: 1 }}>
        {/* Avatar circle */}
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: agent.shirtColor,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: isActive ? `2px solid ${cfg.color}` : '2px solid transparent',
          transition: 'border-color 0.3s',
          flexShrink: 0,
        }}>
          <span style={{ color: '#fff', fontFamily: '"Press Start 2P", monospace', fontSize: '11px', fontWeight: 'bold' }}>{initials}</span>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
            <span style={{ color: '#FAF9F5', fontFamily: '"Press Start 2P", monospace', fontSize: '8px' }}>{agent.name}</span>
            {/* Status dot */}
            <span style={{
              width: 6, height: 6, borderRadius: '50%', background: cfg.dot, flexShrink: 0,
              animation: isActive ? 'dotPulse 1.5s ease-in-out infinite' : 'none',
            }} />
          </div>
          <div style={{ color: '#999', fontFamily: '"Press Start 2P", monospace', fontSize: '5px' }}>{agent.title}</div>
        </div>

        {/* Task count badge */}
        {agent.completedTasks > 0 && (
          <div style={{
            background: '#F7CC76', color: '#1a1a1a',
            fontFamily: '"Press Start 2P", monospace', fontSize: '7px',
            width: 20, height: 20, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 'bold', flexShrink: 0,
          }}>{agent.completedTasks}</div>
        )}
      </div>

      {/* Status line */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', position: 'relative', zIndex: 1 }}>
        <span style={{
          fontFamily: '"Press Start 2P", monospace', fontSize: '5px',
          color: cfg.color, textTransform: 'uppercase', letterSpacing: '0.5px',
        }}>{cfg.label}</span>

        {/* Progress bar when working */}
        {isWorking && (
          <div style={{ flex: 1, height: 3, background: '#162240', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', background: cfg.color, borderRadius: '2px',
              animation: 'progressPulse 2.5s ease-in-out infinite',
            }} />
          </div>
        )}

        {/* Celebration sparkles */}
        {isCelebrating && (
          <span style={{ fontSize: '10px', animation: 'celebSpin 0.6s ease-in-out infinite' }}>&#10024;</span>
        )}
      </div>

      {/* Speech bubble */}
      {agent.speechBubble && (
        <div style={{
          marginTop: '8px', padding: '5px 8px',
          background: '#162240', borderRadius: '4px',
          border: `1px solid ${cfg.color}22`,
          fontFamily: '"Press Start 2P", monospace', fontSize: '4.5px',
          color: '#ccc', lineHeight: '1.6',
          position: 'relative', zIndex: 1,
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
    <div className="game-office" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{
        padding: '14px 16px 12px',
        borderBottom: '1px solid #144B63',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src="/assets/ayima-logo.png" alt="Ayima" style={{ height: 22, opacity: 0.9 }} />
          <span style={{ color: '#444', fontSize: '10px' }}>|</span>
          <span style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '8px', color: '#2EC4F3', letterSpacing: '1px' }}>AGI HQ</span>
        </div>
        <div style={{ display: 'flex', gap: '12px', fontFamily: '"Press Start 2P", monospace', fontSize: '5px' }}>
          <span style={{ color: activeCount > 0 ? '#20C997' : '#666' }}>
            {activeCount > 0 ? `${activeCount} ACTIVE` : 'ALL IDLE'}
          </span>
          {totalTasks > 0 && <span style={{ color: '#F7CC76' }}>{totalTasks} DONE</span>}
        </div>
      </div>

      {/* Agent Grid */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '12px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '8px',
        alignContent: 'start',
      }}>
        {agents.map(agent => (
          <AgentCard
            key={agent.id}
            agent={agent}
            isSelected={selectedAgent === agent.id}
            onClick={() => onSelectAgent(agent.id === selectedAgent ? null : agent.id)}
          />
        ))}
      </div>

      {/* Animations */}
      <style>{`
        @keyframes dotPulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.4); }
        }
        @keyframes cardPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes progressPulse {
          0% { width: 15%; }
          50% { width: 75%; }
          100% { width: 15%; }
        }
        @keyframes celebSpin {
          0% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.3) rotate(180deg); }
          100% { transform: scale(1) rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
