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

const AGENT_PFPS = {
  rob: '/assets/avatars/rob.png',
  mike: '/assets/avatars/mike.png',
  craig: '/assets/avatars/craig.png',
  leo: '/assets/avatars/leo.png',
  ewan: '/assets/avatars/ewan.png',
  mya: '/assets/avatars/mya.png',
  alex: '/assets/avatars/alex.png',
  ken: '/assets/avatars/ken.png',
  mark: '/assets/avatars/mark.png',
  kevin: 'https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=Kevin&size=200&backgroundColor=9b59b6',
  julie: '/assets/avatars/julie.png',
  peter: 'https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=Peter&size=200&backgroundColor=3498db',
  katie: 'https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=Katie&size=200&backgroundColor=2ecc71',
};

const AGENT_COLORS = {
  rob: '#C0392B', mike: '#2C3E50', craig: '#27AE60', leo: '#8E44AD',
  ewan: '#0047AB', mya: '#C2185B', alex: '#00897B', ken: '#1565C0',
  mark: '#E67E22', kevin: '#9B59B6', julie: '#E91E63', peter: '#3498DB', katie: '#2ECC71',
};

function AvatarImg({ agentId, name, size, borderColor, isActive }) {
  const [failed, setFailed] = React.useState(false);
  const bg = AGENT_COLORS[agentId] || '#333';

  if (failed) {
    return (
      <div style={{
        width: size, height: size, borderRadius: '50%', flexShrink: 0,
        border: `4px solid ${borderColor}`,
        background: bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: isActive ? `0 0 20px ${borderColor}40` : 'none',
      }}>
        <span style={{ color: '#fff', fontFamily: '"Press Start 2P", monospace', fontSize: size * 0.25 }}>{name.charAt(0)}</span>
      </div>
    );
  }

  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
      border: `4px solid ${borderColor}`,
      transition: 'border-color 0.3s, box-shadow 0.3s',
      background: bg,
      boxShadow: isActive ? `0 0 24px ${borderColor}40` : 'none',
    }}>
      <img
        src={AGENT_PFPS[agentId]}
        alt={name}
        onError={() => setFailed(true)}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        referrerPolicy="no-referrer"
      />
    </div>
  );
}

function AgentCard({ agent, isSelected, onClick }) {
  const isActive = agent.state !== AGENT_STATES.IDLE;
  const isWorking = agent.state === AGENT_STATES.WORKING || agent.state === AGENT_STATES.THINKING;
  const isCelebrating = agent.state === AGENT_STATES.CELEBRATING;
  const cfg = STATE_CONFIG[agent.state] || STATE_CONFIG[AGENT_STATES.IDLE];

  return (
    <div onClick={onClick} style={{
      background: isActive ? cfg.bg : '#0C1526',
      border: `2px solid ${isSelected ? '#2EC4F3' : isActive ? `${cfg.color}44` : '#1A2A3A'}`,
      borderRadius: '16px',
      padding: '28px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden',
      height: '380px',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {isWorking && <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: `radial-gradient(ellipse at 20% 30%, ${cfg.color}12 0%, transparent 70%)`,
        animation: 'cardGlow 3s ease-in-out infinite', pointerEvents: 'none',
      }} />}

      {/* Avatar + Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', position: 'relative', zIndex: 1 }}>
        <AvatarImg
          agentId={agent.id}
          name={agent.name}
          size={140}
          borderColor={isActive ? cfg.color : '#1A2A3A'}
          isActive={isActive}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <span style={{ color: '#FAF9F5', fontFamily: '"Press Start 2P", monospace', fontSize: '20px' }}>{agent.name}</span>
            <span style={{
              width: 14, height: 14, borderRadius: '50%', background: cfg.color, flexShrink: 0,
              animation: isActive ? 'dotPulse 1.5s ease-in-out infinite' : 'none',
              boxShadow: isActive ? `0 0 10px ${cfg.color}` : 'none',
            }} />
            {isCelebrating && <span style={{ fontSize: '24px', animation: 'celebBounce 0.5s ease-in-out infinite alternate' }}>&#10024;</span>}
          </div>
          <div style={{ color: '#888', fontFamily: '"Press Start 2P", monospace', fontSize: '12px', lineHeight: '1.5' }}>{agent.title}</div>
          {agent.completedTasks > 0 && (
            <div style={{
              marginTop: '12px', display: 'inline-flex', alignItems: 'center',
              background: 'rgba(247,204,118,0.15)', padding: '5px 12px', borderRadius: '6px',
            }}>
              <span style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '11px', color: '#F7CC76' }}>
                {agent.completedTasks} task{agent.completedTasks !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '24px', position: 'relative', zIndex: 1 }}>
        <span style={{
          fontFamily: '"Press Start 2P", monospace', fontSize: '13px',
          color: cfg.color, textTransform: 'uppercase', letterSpacing: '1px',
          minWidth: '100px',
        }}>{cfg.label}</span>
        <div style={{ flex: 1, height: 8, background: '#162240', borderRadius: '4px', overflow: 'hidden' }}>
          {isWorking ? (
            <div style={{ height: '100%', background: `linear-gradient(90deg, ${cfg.color}, ${cfg.color}88)`, borderRadius: '4px', animation: 'progressSlide 2.5s ease-in-out infinite' }} />
          ) : null}
        </div>
      </div>

      {/* Speech area - fixed at bottom */}
      <div style={{ marginTop: 'auto', height: '60px', position: 'relative', zIndex: 1, display: 'flex', alignItems: 'flex-start' }}>
        {agent.speechBubble && (
          <div style={{
            width: '100%', padding: '12px 16px', background: '#0A1628', borderRadius: '8px',
            border: `1px solid ${cfg.color}22`,
            fontFamily: '"Press Start 2P", monospace', fontSize: '10px',
            color: '#ccc', lineHeight: '1.6',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            <span style={{ color: cfg.color, marginRight: '8px' }}>{'>'}</span>
            {agent.speechBubble}
          </div>
        )}
      </div>
    </div>
  );
}

export default function OfficeWorkspace({ agents, selectedAgent, onSelectAgent }) {
  const activeCount = agents.filter(a => a.state !== AGENT_STATES.IDLE).length;
  const totalTasks = agents.reduce((sum, a) => sum + a.completedTasks, 0);

  return (
    <div className="game-office" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#070D18' }}>
      <div style={{
        padding: '20px 28px', borderBottom: '2px solid #144B63',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: '#0A1120', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img src="/assets/ayima-logo.png" alt="Ayima" style={{ height: 36 }} />
          <span style={{ color: '#333', fontSize: '20px', fontWeight: 300 }}>|</span>
          <span style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '16px', color: '#2EC4F3', letterSpacing: '3px' }}>AGI HQ</span>
        </div>
        <div style={{ display: 'flex', gap: '20px', fontFamily: '"Press Start 2P", monospace', fontSize: '12px', alignItems: 'center' }}>
          <span style={{ color: activeCount > 0 ? '#20C997' : '#555' }}>
            {activeCount > 0 ? `${activeCount} ACTIVE` : 'ALL IDLE'}
          </span>
          {totalTasks > 0 && (
            <span style={{ color: '#F7CC76', background: 'rgba(247,204,118,0.1)', padding: '6px 14px', borderRadius: '6px' }}>
              {totalTasks} COMPLETED
            </span>
          )}
        </div>
      </div>

      <div style={{
        flex: 1, overflowY: 'auto', padding: '24px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))',
        gap: '18px',
        alignContent: 'start',
      }}>
        {(() => {
          const order = ['mike', 'rob', 'ewan', 'leo', 'craig', 'mark', 'kevin', 'alex', 'ken', 'julie', 'peter', 'katie', 'mya'];
          const sorted = [...agents].sort((a, b) => {
            const ai = order.indexOf(a.id);
            const bi = order.indexOf(b.id);
            return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
          });
          return sorted.map(agent => (
          <AgentCard key={agent.id} agent={agent} isSelected={selectedAgent === agent.id}
            onClick={() => onSelectAgent(agent.id === selectedAgent ? null : agent.id)} />
          ));
        })()}
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
