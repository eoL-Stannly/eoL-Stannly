import React, { useState, useEffect, useCallback, useRef } from 'react';
import OfficeWorkspace from './components/OfficeWorkspace.jsx';
import ActivityFeed from './components/ActivityFeed.jsx';
import TaskPanel from './components/TaskPanel.jsx';
import KnowledgePanel from './components/KnowledgePanel.jsx';
import { AGENTS, AGENT_STATES } from './agents/AgentDefinitions.js';

export default function App() {
  const [agents, setAgents] = useState(
    AGENTS.map((a) => ({ ...a, state: AGENT_STATES.IDLE, currentTask: null, completedTasks: 0 }))
  );
  const [activities, setActivities] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [ralphStatus, setRalphStatus] = useState({
    running: false, loopCount: 0, callsThisHour: 0, maxCallsPerHour: 100, uptime: 0,
  });
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showPanel, setShowPanel] = useState('tasks');
  const loopRef = useRef(null);
  const uptimeRef = useRef(null);

  const addActivity = useCallback((agentId, agentName, message, type) => {
    setActivities((prev) => [{
      agentId, agentName, message, type, timestamp: new Date().toISOString(),
    }, ...prev].slice(0, 100));
  }, []);

  const toggleRalph = useCallback(() => {
    setRalphStatus((prev) => {
      if (prev.running) {
        clearInterval(loopRef.current);
        clearInterval(uptimeRef.current);
        return { ...prev, running: false };
      }
      return { ...prev, running: true, uptime: 0 };
    });
  }, []);

  useEffect(() => {
    if (!ralphStatus.running) return;

    uptimeRef.current = setInterval(() => {
      setRalphStatus((p) => ({ ...p, uptime: p.uptime + 1 }));
    }, 1000);

    loopRef.current = setInterval(() => {
      setRalphStatus((p) => ({
        ...p, loopCount: p.loopCount + 1, callsThisHour: p.callsThisHour + 1,
      }));

      // This is where real Ralph loop integration will go.
      // For now, agents cycle through states to show the UI is alive.
      const count = 1 + Math.floor(Math.random() * 3);
      const indices = new Set();
      while (indices.size < count) indices.add(Math.floor(Math.random() * AGENTS.length));

      for (const idx of indices) {
        const agent = AGENTS[idx];
        setAgents((prev) =>
          prev.map((a, i) => i === idx ? { ...a, state: AGENT_STATES.WORKING } : a)
        );

        const duration = 3000 + Math.random() * 5000;
        setTimeout(() => {
          setAgents((prev) =>
            prev.map((a, i) =>
              i === idx ? { ...a, state: AGENT_STATES.IDLE, completedTasks: a.completedTasks + 1 } : a
            )
          );
        }, duration);
      }
    }, 4000);

    return () => { clearInterval(loopRef.current); clearInterval(uptimeRef.current); };
  }, [ralphStatus.running]);

  const submitTask = useCallback((description) => {
    const task = {
      id: `task_${Date.now()}`, description, status: 'pending',
      createdAt: new Date().toISOString(), assignedTo: null,
    };
    setTasks((prev) => [task, ...prev]);
    addActivity('system', 'System', `Task submitted: "${description}"`, 'task_submitted');

    // Mike (COO) triages
    setTimeout(() => {
      setAgents((prev) => prev.map((a) => a.id === 'mike' ? { ...a, state: AGENT_STATES.THINKING } : a));
      setTasks((prev) => prev.map((t) => t.id === task.id ? { ...t, status: 'in_progress', assignedTo: 'mike' } : t));
      addActivity('mike', 'Mike', `Triaging: "${description}"`, 'agent_working');
    }, 1000);

    // Delegates
    setTimeout(() => {
      const delegateTargets = ['rob', 'craig', 'leo', 'ewan', 'alex', 'ken'];
      const target = delegateTargets[Math.floor(Math.random() * delegateTargets.length)];
      const targetAgent = AGENTS.find((a) => a.id === target);

      setAgents((prev) => prev.map((a) => {
        if (a.id === 'mike') return { ...a, state: AGENT_STATES.IDLE, completedTasks: a.completedTasks + 1 };
        if (a.id === target) return { ...a, state: AGENT_STATES.WORKING };
        return a;
      }));
      setTasks((prev) => prev.map((t) => t.id === task.id ? { ...t, assignedTo: target } : t));
      addActivity('mike', 'Mike', `Assigned to ${targetAgent.name}`, 'agent_assigned');

      setTimeout(() => {
        setAgents((prev) => prev.map((a) =>
          a.id === target ? { ...a, state: AGENT_STATES.CELEBRATING, completedTasks: a.completedTasks + 1 } : a
        ));
        setTasks((prev) => prev.map((t) => t.id === task.id ? { ...t, status: 'completed' } : t));
        addActivity(target, targetAgent.name, `Completed: "${description}"`, 'task_completed');

        setTimeout(() => {
          setAgents((prev) => prev.map((a) => a.id === target ? { ...a, state: AGENT_STATES.IDLE } : a));
        }, 2000);
      }, 5000);
    }, 3000);
  }, [addActivity]);

  return (
    <div className="game-app">
      <div className="game-left">
        <OfficeWorkspace agents={agents} selectedAgent={selectedAgent} onSelectAgent={setSelectedAgent} />
      </div>

      <div className="game-right">
        <div className="right-controls">
          <button className={`ctrl-btn ralph-btn ${ralphStatus.running ? 'ralph-on' : ''}`} onClick={toggleRalph}>
            <span className="ralph-dot"></span>
            {ralphStatus.running ? 'RALPH ON' : 'START RALPH'}
          </button>
          <div className="ctrl-stats">
            <span>Loop: {ralphStatus.loopCount}</span>
            <span>Active: {agents.filter((a) => a.state !== AGENT_STATES.IDLE).length}/{agents.length}</span>
          </div>
        </div>

        <div className="right-tabs">
          <button className={`tab-btn ${showPanel === 'tasks' ? 'tab-active' : ''}`} onClick={() => setShowPanel('tasks')}>
            Tasks
            <span className="tab-count">{tasks.length}</span>
          </button>
          <button className={`tab-btn ${showPanel === 'knowledge' ? 'tab-active' : ''}`} onClick={() => setShowPanel('knowledge')}>
            Knowledge Base
          </button>
          <button className={`tab-btn ${showPanel === 'activity' ? 'tab-active' : ''}`} onClick={() => setShowPanel('activity')}>
            Log
            <span className="tab-count">{activities.length}</span>
          </button>
        </div>

        <div className="right-panel">
          {showPanel === 'knowledge' ? (
            <KnowledgePanel />
          ) : showPanel === 'activity' ? (
            <ActivityFeed activities={activities} />
          ) : (
            <TaskPanel tasks={tasks} onSubmitTask={submitTask} />
          )}
        </div>
      </div>

      {selectedAgent && (
        <AgentDetail agent={agents.find((a) => a.id === selectedAgent)} onClose={() => setSelectedAgent(null)} />
      )}
    </div>
  );
}

function AgentDetail({ agent, onClose }) {
  if (!agent) return null;
  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-card" onClick={(e) => e.stopPropagation()}>
        <button className="detail-close" onClick={onClose}>X</button>
        <div className="detail-top">
          <div className="detail-char-preview" style={{ background: agent.shirtColor }}>
            <div className="mini-head" style={{ background: agent.skinTone }}></div>
          </div>
          <div>
            <div className="detail-name">{agent.name}</div>
            <div className="detail-role">{agent.title}</div>
            <div className={`detail-state ds-${agent.state}`}>{agent.state}</div>
          </div>
        </div>
        <div className="detail-desc">{agent.personality}</div>
        <div className="detail-stats-row">
          <div className="ds-box">
            <div className="ds-num">{agent.completedTasks}</div>
            <div className="ds-lbl">TASKS</div>
          </div>
          <div className="ds-box">
            <div className="ds-num">{agent.capabilities?.length || 0}</div>
            <div className="ds-lbl">SKILLS</div>
          </div>
        </div>
        <div className="detail-skills">
          {(agent.capabilities || []).map((c) => (
            <span key={c} className="skill-tag">{c.replace(/_/g, ' ')}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
