import React from 'react';
import { AGENT_STATES } from '../agents/AgentDefinitions.js';

export default function StatusBar({ ralphStatus, agents }) {
  const activeAgents = agents.filter((a) => a.state !== AGENT_STATES.IDLE).length;
  const totalCompleted = agents.reduce((sum, a) => sum + a.completedTasks, 0);

  const formatUptime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`status-bar ${ralphStatus.running ? 'ralph-active' : ''}`}>
      <div className="status-section">
        <span className="status-label">Ralph Loop</span>
        <span className={`status-value ${ralphStatus.running ? 'pulse' : ''}`}>
          {ralphStatus.running ? '● RUNNING' : '○ STOPPED'}
        </span>
      </div>

      <div className="status-divider" />

      <div className="status-section">
        <span className="status-label">Loop Count</span>
        <span className="status-value">{ralphStatus.loopCount}</span>
      </div>

      <div className="status-divider" />

      <div className="status-section">
        <span className="status-label">API Calls</span>
        <span className="status-value">
          {ralphStatus.callsThisHour}/{ralphStatus.maxCallsPerHour}
        </span>
      </div>

      <div className="status-divider" />

      <div className="status-section">
        <span className="status-label">Active Agents</span>
        <span className="status-value">{activeAgents}/{agents.length}</span>
      </div>

      <div className="status-divider" />

      <div className="status-section">
        <span className="status-label">Tasks Done</span>
        <span className="status-value">{totalCompleted}</span>
      </div>

      <div className="status-divider" />

      <div className="status-section">
        <span className="status-label">Uptime</span>
        <span className="status-value mono">{formatUptime(ralphStatus.uptime)}</span>
      </div>
    </div>
  );
}
