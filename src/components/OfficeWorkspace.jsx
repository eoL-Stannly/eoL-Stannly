import React from 'react';
import { AGENT_STATES } from '../agents/AgentDefinitions.js';

const STATE_CONFIG = {
  [AGENT_STATES.IDLE]: { label: 'Idle', color: '#555', dot: '#444' },
  [AGENT_STATES.WORKING]: { label: 'Working', color: '#20C997', dot: '#20C997' },
  [AGENT_STATES.THINKING]: { label: 'Thinking', color: '#2EC4F3', dot: '#2EC4F3' },
  [AGENT_STATES.WALKING]: { label: 'Moving', color: '#F7CC76', dot: '#F7CC76' },
  [AGENT_STATES.COLLABORATING]: { label: 'Collab', color: '#9B59B6', dot: '#9B59B6' },
  [AGENT_STATES.PRESENTING]: { label: 'Presenting', color: '#0047AB', dot: '#0047AB' },
  [AGENT_STATES.COFFEE]: { label: 'Break', color: '#F08D34', dot: '#F08D34' },
  [AGENT_STATES.CELEBRATING]: { label: 'Done!', color: '#F7CC76', dot: '#F7CC76' },
};

// Anime-style SVG character portraits for each agent
function AnimeAvatar({ agentId, size = 44, isActive, stateColor }) {
  const s = size;
  const portraits = {
    rob: ( // Principal SEO - spiky dark hair, intense eyes, red shirt
      <svg viewBox="0 0 80 80" width={s} height={s}>
        <defs><clipPath id={`clip-${agentId}`}><circle cx="40" cy="40" r="38"/></clipPath></defs>
        <circle cx="40" cy="40" r="39" fill="#1a1a2e" stroke={isActive ? stateColor : '#2a2a4a'} strokeWidth="2"/>
        <g clipPath={`url(#clip-${agentId})`}>
          <rect x="0" y="45" width="80" height="40" fill="#C0392B"/>
          <rect x="30" y="47" width="20" height="8" rx="2" fill="#E74C3C"/>
          <ellipse cx="40" cy="38" rx="18" ry="20" fill="#F5D0A9"/>
          <ellipse cx="32" cy="36" rx="4" ry="3.5" fill="white"/>
          <ellipse cx="48" cy="36" rx="4" ry="3.5" fill="white"/>
          <circle cx="33" cy="36" r="2.2" fill="#2C3E50"/>
          <circle cx="49" cy="36" r="2.2" fill="#2C3E50"/>
          <circle cx="33.8" cy="35.2" r="0.8" fill="white"/>
          <circle cx="49.8" cy="35.2" r="0.8" fill="white"/>
          <path d="M36 44 Q40 47 44 44" fill="none" stroke="#8B4513" strokeWidth="1.2" strokeLinecap="round"/>
          <path d="M20 28 Q25 10 40 14 Q55 10 60 28 L58 30 Q55 20 40 22 Q25 20 22 30Z" fill="#2C2C2C"/>
          <path d="M22 28 L18 18 Q20 24 24 26Z" fill="#2C2C2C"/>
          <path d="M58 28 L62 18 Q60 24 56 26Z" fill="#2C2C2C"/>
          <path d="M25 28 L22 16 Q24 22 27 25Z" fill="#2C2C2C"/>
          <path d="M28 32 L20 30" stroke="#2C2C2C" strokeWidth="2" strokeLinecap="round"/>
          <path d="M52 32 L60 30" stroke="#2C2C2C" strokeWidth="2" strokeLinecap="round"/>
        </g>
      </svg>
    ),
    mike: ( // COO - neat short dark hair, sharp features, navy suit
      <svg viewBox="0 0 80 80" width={s} height={s}>
        <defs><clipPath id={`clip-${agentId}`}><circle cx="40" cy="40" r="38"/></clipPath></defs>
        <circle cx="40" cy="40" r="39" fill="#1a1a2e" stroke={isActive ? stateColor : '#2a2a4a'} strokeWidth="2"/>
        <g clipPath={`url(#clip-${agentId})`}>
          <rect x="0" y="48" width="80" height="40" fill="#2C3E50"/>
          <path d="M35 48 L40 55 L45 48" fill="#ECF0F1"/>
          <ellipse cx="40" cy="38" rx="17" ry="19" fill="#D4A574"/>
          <ellipse cx="32" cy="36" rx="3.5" ry="3" fill="white"/>
          <ellipse cx="48" cy="36" rx="3.5" ry="3" fill="white"/>
          <circle cx="32.5" cy="36" r="2" fill="#1a1a2e"/>
          <circle cx="48.5" cy="36" r="2" fill="#1a1a2e"/>
          <circle cx="33.2" cy="35.3" r="0.7" fill="white"/>
          <circle cx="49.2" cy="35.3" r="0.7" fill="white"/>
          <path d="M37 44 Q40 46 43 44" fill="none" stroke="#6D4C41" strokeWidth="1" strokeLinecap="round"/>
          <path d="M22 26 Q30 14 40 16 Q50 14 58 26 L56 28 Q50 20 40 22 Q30 20 24 28Z" fill="#1a1a1a"/>
          <rect x="24" y="33" width="13" height="1.5" rx="0.5" fill="none" stroke="#1a1a2e" strokeWidth="0.8"/>
          <rect x="43" y="33" width="13" height="1.5" rx="0.5" fill="none" stroke="#1a1a2e" strokeWidth="0.8"/>
        </g>
      </svg>
    ),
    craig: ( // SEO Director - messy brown hair, friendly eyes, green shirt
      <svg viewBox="0 0 80 80" width={s} height={s}>
        <defs><clipPath id={`clip-${agentId}`}><circle cx="40" cy="40" r="38"/></clipPath></defs>
        <circle cx="40" cy="40" r="39" fill="#1a1a2e" stroke={isActive ? stateColor : '#2a2a4a'} strokeWidth="2"/>
        <g clipPath={`url(#clip-${agentId})`}>
          <rect x="0" y="48" width="80" height="40" fill="#27AE60"/>
          <ellipse cx="40" cy="38" rx="17" ry="19" fill="#F5DEB3"/>
          <ellipse cx="33" cy="36" rx="3.5" ry="3.5" fill="white"/>
          <ellipse cx="47" cy="36" rx="3.5" ry="3.5" fill="white"/>
          <circle cx="33.5" cy="36.5" r="2.2" fill="#5D4037"/>
          <circle cx="47.5" cy="36.5" r="2.2" fill="#5D4037"/>
          <circle cx="34.2" cy="35.5" r="0.8" fill="white"/>
          <circle cx="48.2" cy="35.5" r="0.8" fill="white"/>
          <path d="M35 44 Q40 48 45 44" fill="none" stroke="#8B6914" strokeWidth="1.2" strokeLinecap="round"/>
          <path d="M20 26 Q28 12 40 15 Q52 12 60 26 L57 27 Q52 18 40 20 Q28 18 23 27Z" fill="#6D4C41"/>
          <path d="M22 24 L18 16" stroke="#6D4C41" strokeWidth="3" strokeLinecap="round"/>
          <path d="M58 24 L63 17" stroke="#6D4C41" strokeWidth="3" strokeLinecap="round"/>
          <path d="M30 22 L28 14" stroke="#6D4C41" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M50 22 L53 15" stroke="#6D4C41" strokeWidth="2.5" strokeLinecap="round"/>
        </g>
      </svg>
    ),
    leo: ( // SEO Director - blond spiked hair, confident, purple shirt
      <svg viewBox="0 0 80 80" width={s} height={s}>
        <defs><clipPath id={`clip-${agentId}`}><circle cx="40" cy="40" r="38"/></clipPath></defs>
        <circle cx="40" cy="40" r="39" fill="#1a1a2e" stroke={isActive ? stateColor : '#2a2a4a'} strokeWidth="2"/>
        <g clipPath={`url(#clip-${agentId})`}>
          <rect x="0" y="48" width="80" height="40" fill="#8E44AD"/>
          <ellipse cx="40" cy="38" rx="17" ry="19" fill="#FDDCB5"/>
          <ellipse cx="33" cy="36" rx="3.8" ry="3.2" fill="white"/>
          <ellipse cx="47" cy="36" rx="3.8" ry="3.2" fill="white"/>
          <circle cx="33.5" cy="36" r="2" fill="#1565C0"/>
          <circle cx="47.5" cy="36" r="2" fill="#1565C0"/>
          <circle cx="34.2" cy="35.2" r="0.7" fill="white"/>
          <circle cx="48.2" cy="35.2" r="0.7" fill="white"/>
          <path d="M37 44 Q40 46.5 43 44" fill="none" stroke="#A0522D" strokeWidth="1" strokeLinecap="round"/>
          <path d="M20 28 Q26 8 40 12 Q54 8 60 28 L57 27 Q52 16 40 18 Q28 16 23 27Z" fill="#E8C840"/>
          <path d="M24 24 L16 10 Q22 18 26 22Z" fill="#E8C840"/>
          <path d="M56 24 L64 10 Q58 18 54 22Z" fill="#E8C840"/>
          <path d="M34 20 L30 8 Q34 14 36 18Z" fill="#E8C840"/>
          <path d="M46 20 L50 8 Q46 14 44 18Z" fill="#E8C840"/>
          <path d="M40 18 L40 6 Q42 12 41 16Z" fill="#E8C840"/>
        </g>
      </svg>
    ),
    ewan: ( // Head of SEO - auburn/red hair, determined look, blue shirt
      <svg viewBox="0 0 80 80" width={s} height={s}>
        <defs><clipPath id={`clip-${agentId}`}><circle cx="40" cy="40" r="38"/></clipPath></defs>
        <circle cx="40" cy="40" r="39" fill="#1a1a2e" stroke={isActive ? stateColor : '#2a2a4a'} strokeWidth="2"/>
        <g clipPath={`url(#clip-${agentId})`}>
          <rect x="0" y="48" width="80" height="40" fill="#0047AB"/>
          <ellipse cx="40" cy="38" rx="17" ry="19" fill="#F5D0A9"/>
          <ellipse cx="33" cy="35" rx="4" ry="3.5" fill="white"/>
          <ellipse cx="47" cy="35" rx="4" ry="3.5" fill="white"/>
          <circle cx="33.5" cy="35.5" r="2.3" fill="#2E7D32"/>
          <circle cx="47.5" cy="35.5" r="2.3" fill="#2E7D32"/>
          <circle cx="34.3" cy="34.5" r="0.8" fill="white"/>
          <circle cx="48.3" cy="34.5" r="0.8" fill="white"/>
          <path d="M36 44 Q40 47 44 44" fill="none" stroke="#8B4513" strokeWidth="1.2" strokeLinecap="round"/>
          <path d="M22 27 Q28 12 40 15 Q52 12 58 27 L56 28 Q52 18 40 20 Q28 18 24 28Z" fill="#A0522D"/>
          <path d="M22 26 L20 18 Q22 22 24 25Z" fill="#A0522D"/>
          <path d="M58 26 L60 18 Q58 22 56 25Z" fill="#A0522D"/>
          <path d="M28 32 Q30 30 26 30" fill="none" stroke="#A0522D" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M52 32 Q50 30 54 30" fill="none" stroke="#A0522D" strokeWidth="1.5" strokeLinecap="round"/>
        </g>
      </svg>
    ),
    mya: ( // Account Manager - long dark hair, warm eyes, pink/magenta top
      <svg viewBox="0 0 80 80" width={s} height={s}>
        <defs><clipPath id={`clip-${agentId}`}><circle cx="40" cy="40" r="38"/></clipPath></defs>
        <circle cx="40" cy="40" r="39" fill="#1a1a2e" stroke={isActive ? stateColor : '#2a2a4a'} strokeWidth="2"/>
        <g clipPath={`url(#clip-${agentId})`}>
          <rect x="0" y="48" width="80" height="40" fill="#C2185B"/>
          <path d="M18 24 Q18 60 28 65 L28 48" fill="#1a1a1a"/>
          <path d="M62 24 Q62 60 52 65 L52 48" fill="#1a1a1a"/>
          <ellipse cx="40" cy="38" rx="16" ry="18" fill="#D4A574"/>
          <ellipse cx="33" cy="36" rx="3.5" ry="3.5" fill="white"/>
          <ellipse cx="47" cy="36" rx="3.5" ry="3.5" fill="white"/>
          <circle cx="33.3" cy="36.3" r="2.2" fill="#4E342E"/>
          <circle cx="47.3" cy="36.3" r="2.2" fill="#4E342E"/>
          <circle cx="34" cy="35.3" r="0.8" fill="white"/>
          <circle cx="48" cy="35.3" r="0.8" fill="white"/>
          <path d="M36 44 Q40 47 44 44" fill="none" stroke="#8B5E3C" strokeWidth="1" strokeLinecap="round"/>
          <ellipse cx="30" cy="42" rx="3" ry="2" fill="#E8B4A0" opacity="0.5"/>
          <ellipse cx="50" cy="42" rx="3" ry="2" fill="#E8B4A0" opacity="0.5"/>
          <path d="M18 24 Q24 10 40 14 Q56 10 62 24 L60 26 Q54 16 40 18 Q26 16 20 26Z" fill="#1a1a1a"/>
          <path d="M28 33 Q30 31 26 31" fill="none" stroke="#1a1a1a" strokeWidth="1.2"/>
          <path d="M52 33 Q50 31 54 31" fill="none" stroke="#1a1a1a" strokeWidth="1.2"/>
        </g>
      </svg>
    ),
    alex: ( // Data Scientist - short neat hair, glasses, teal shirt
      <svg viewBox="0 0 80 80" width={s} height={s}>
        <defs><clipPath id={`clip-${agentId}`}><circle cx="40" cy="40" r="38"/></clipPath></defs>
        <circle cx="40" cy="40" r="39" fill="#1a1a2e" stroke={isActive ? stateColor : '#2a2a4a'} strokeWidth="2"/>
        <g clipPath={`url(#clip-${agentId})`}>
          <rect x="0" y="48" width="80" height="40" fill="#00897B"/>
          <ellipse cx="40" cy="38" rx="17" ry="19" fill="#E8C4A0"/>
          <rect x="25" y="32" width="14" height="9" rx="3" fill="none" stroke="#B0BEC5" strokeWidth="1.5"/>
          <rect x="41" y="32" width="14" height="9" rx="3" fill="none" stroke="#B0BEC5" strokeWidth="1.5"/>
          <line x1="39" y1="36" x2="41" y2="36" stroke="#B0BEC5" strokeWidth="1.2"/>
          <ellipse cx="32" cy="36" rx="3" ry="2.8" fill="white"/>
          <ellipse cx="48" cy="36" rx="3" ry="2.8" fill="white"/>
          <circle cx="32.3" cy="36" r="1.8" fill="#37474F"/>
          <circle cx="48.3" cy="36" r="1.8" fill="#37474F"/>
          <circle cx="33" cy="35.2" r="0.6" fill="white"/>
          <circle cx="49" cy="35.2" r="0.6" fill="white"/>
          <path d="M37 44 Q40 46 43 44" fill="none" stroke="#8B6914" strokeWidth="1" strokeLinecap="round"/>
          <path d="M22 26 Q28 14 40 16 Q52 14 58 26 L56 27 Q52 18 40 20 Q28 18 24 27Z" fill="#3E2723"/>
        </g>
      </svg>
    ),
    ken: ( // Data Scientist & Engineer - blue-tinted hair, sharp style
      <svg viewBox="0 0 80 80" width={s} height={s}>
        <defs><clipPath id={`clip-${agentId}`}><circle cx="40" cy="40" r="38"/></clipPath></defs>
        <circle cx="40" cy="40" r="39" fill="#1a1a2e" stroke={isActive ? stateColor : '#2a2a4a'} strokeWidth="2"/>
        <g clipPath={`url(#clip-${agentId})`}>
          <rect x="0" y="48" width="80" height="40" fill="#1565C0"/>
          <ellipse cx="40" cy="38" rx="17" ry="19" fill="#F5DEB3"/>
          <ellipse cx="33" cy="36" rx="3.5" ry="3" fill="white"/>
          <ellipse cx="47" cy="36" rx="3.5" ry="3" fill="white"/>
          <circle cx="33.3" cy="36" r="2" fill="#263238"/>
          <circle cx="47.3" cy="36" r="2" fill="#263238"/>
          <circle cx="34" cy="35.2" r="0.7" fill="white"/>
          <circle cx="48" cy="35.2" r="0.7" fill="white"/>
          <path d="M36 44 Q40 46 44 44" fill="none" stroke="#8B6914" strokeWidth="1" strokeLinecap="round"/>
          <path d="M20 28 Q26 10 40 13 Q54 10 60 28 L57 27 Q52 16 40 18 Q28 16 23 27Z" fill="#1A237E"/>
          <path d="M22 26 L16 14 Q20 20 24 24Z" fill="#1A237E"/>
          <path d="M58 26 L64 14 Q60 20 56 24Z" fill="#1A237E"/>
          <path d="M40 16 L40 6 Q42 10 41 14Z" fill="#1A237E"/>
          <path d="M34 18 L30 8 Q34 12 35 16Z" fill="#1A237E"/>
          <path d="M46 18 L50 8 Q46 12 45 16Z" fill="#1A237E"/>
        </g>
      </svg>
    ),
  };

  return portraits[agentId] || portraits.ewan;
}

function AgentCard({ agent, isSelected, onClick }) {
  const isActive = agent.state !== AGENT_STATES.IDLE;
  const isWorking = agent.state === AGENT_STATES.WORKING || agent.state === AGENT_STATES.THINKING;
  const isCelebrating = agent.state === AGENT_STATES.CELEBRATING;
  const cfg = STATE_CONFIG[agent.state] || STATE_CONFIG[AGENT_STATES.IDLE];

  return (
    <div onClick={onClick} style={{
      background: isActive ? 'rgba(46, 196, 243, 0.04)' : '#0C1526',
      border: `1px solid ${isSelected ? '#2EC4F3' : isActive ? `${cfg.color}33` : '#1A2A3A'}`,
      borderRadius: '8px', padding: '12px', cursor: 'pointer',
      transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden',
    }}>
      {isWorking && <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: `linear-gradient(135deg, ${cfg.color}08 0%, transparent 60%)`,
        animation: 'cardPulse 3s ease-in-out infinite', pointerEvents: 'none',
      }} />}

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative', zIndex: 1 }}>
        <AnimeAvatar agentId={agent.id} size={44} isActive={isActive} stateColor={cfg.color} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
            <span style={{ color: '#FAF9F5', fontFamily: '"Press Start 2P", monospace', fontSize: '8px' }}>{agent.name}</span>
            <span style={{
              width: 6, height: 6, borderRadius: '50%', background: cfg.dot, flexShrink: 0,
              animation: isActive ? 'dotPulse 1.5s ease-in-out infinite' : 'none',
            }} />
          </div>
          <div style={{ color: '#777', fontFamily: '"Press Start 2P", monospace', fontSize: '5px' }}>{agent.title}</div>
        </div>
        {agent.completedTasks > 0 && (
          <div style={{
            background: '#F7CC76', color: '#1a1a1a',
            fontFamily: '"Press Start 2P", monospace', fontSize: '7px',
            width: 22, height: 22, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 'bold', flexShrink: 0,
          }}>{agent.completedTasks}</div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', position: 'relative', zIndex: 1 }}>
        <span style={{
          fontFamily: '"Press Start 2P", monospace', fontSize: '5px',
          color: cfg.color, textTransform: 'uppercase', letterSpacing: '0.5px',
        }}>{cfg.label}</span>
        {isWorking && (
          <div style={{ flex: 1, height: 3, background: '#162240', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ height: '100%', background: cfg.color, borderRadius: '2px', animation: 'progressPulse 2.5s ease-in-out infinite' }} />
          </div>
        )}
        {isCelebrating && <span style={{ fontSize: '12px', animation: 'celebSpin 0.6s ease-in-out infinite' }}>&#10024;</span>}
      </div>

      {agent.speechBubble && (
        <div style={{
          marginTop: '8px', padding: '5px 8px', background: '#162240', borderRadius: '4px',
          border: `1px solid ${cfg.color}22`,
          fontFamily: '"Press Start 2P", monospace', fontSize: '4.5px',
          color: '#ccc', lineHeight: '1.6', position: 'relative', zIndex: 1,
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
      <div style={{
        padding: '14px 16px 12px', borderBottom: '1px solid #144B63',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src="/assets/ayima-logo.png" alt="Ayima" style={{ height: 22, opacity: 0.9 }} />
          <span style={{ color: '#333', fontSize: '10px' }}>|</span>
          <span style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '8px', color: '#2EC4F3', letterSpacing: '1px' }}>AGI HQ</span>
        </div>
        <div style={{ display: 'flex', gap: '12px', fontFamily: '"Press Start 2P", monospace', fontSize: '5px' }}>
          <span style={{ color: activeCount > 0 ? '#20C997' : '#555' }}>
            {activeCount > 0 ? `${activeCount} ACTIVE` : 'ALL IDLE'}
          </span>
          {totalTasks > 0 && <span style={{ color: '#F7CC76' }}>{totalTasks} DONE</span>}
        </div>
      </div>

      <div style={{
        flex: 1, overflowY: 'auto', padding: '12px',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '8px', alignContent: 'start',
      }}>
        {agents.map(agent => (
          <AgentCard key={agent.id} agent={agent} isSelected={selectedAgent === agent.id}
            onClick={() => onSelectAgent(agent.id === selectedAgent ? null : agent.id)} />
        ))}
      </div>

      <style>{`
        @keyframes dotPulse { 0%,100%{opacity:.4;transform:scale(1)}50%{opacity:1;transform:scale(1.4)} }
        @keyframes cardPulse { 0%,100%{opacity:.3}50%{opacity:1} }
        @keyframes progressPulse { 0%{width:15%}50%{width:75%}100%{width:15%} }
        @keyframes celebSpin { 0%{transform:scale(1) rotate(0)}50%{transform:scale(1.3) rotate(180deg)}100%{transform:scale(1) rotate(360deg)} }
      `}</style>
    </div>
  );
}
