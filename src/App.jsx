import React, { useState, useEffect, useCallback, useRef } from 'react';
import OfficeWorkspace from './components/OfficeWorkspace.jsx';
import ActivityFeed from './components/ActivityFeed.jsx';
import TaskPanel from './components/TaskPanel.jsx';
import StatusBar from './components/StatusBar.jsx';
import KnowledgePanel from './components/KnowledgePanel.jsx';
import { AGENTS, AGENT_STATES } from './agents/AgentDefinitions.js';

const SEO_ACTIONS = [
  { state: AGENT_STATES.WORKING, msgs: [
    '{name} is auditing site crawlability...',
    '{name} is analyzing keyword rankings...',
    '{name} is building a content brief...',
    '{name} is running a backlink analysis...',
    '{name} is optimizing meta tags...',
    '{name} is checking Core Web Vitals...',
    '{name} is processing crawl data...',
    '{name} is building a reporting dashboard...',
    '{name} is reviewing client deliverables...',
    '{name} is mapping internal links...',
  ]},
  { state: AGENT_STATES.THINKING, msgs: [
    '{name} is thinking about content strategy...',
    '{name} is evaluating SERP opportunities...',
    '{name} is analyzing competitor gaps...',
    '{name} is planning the next sprint...',
  ]},
  { state: AGENT_STATES.COLLABORATING, msgs: [
    '{name} is in a team standup...',
    '{name} is discussing strategy with the team...',
    '{name} is reviewing work with a colleague...',
  ]},
  { state: AGENT_STATES.COFFEE, msgs: [
    '{name} is grabbing a coffee...',
    '{name} is at the water cooler...',
  ]},
  { state: AGENT_STATES.WALKING, msgs: [
    '{name} is heading to the whiteboard...',
    '{name} is walking to a meeting...',
  ]},
];

const INIT_MSGS = [
  { id: 'rob', name: 'Rob', msg: 'Morning team. Let\'s review the SEO roadmap.' },
  { id: 'mike', name: 'Mike', msg: 'Deliverables are on track. All clients green.' },
  { id: 'craig', name: 'Craig', msg: 'Keyword research batch ready for review.' },
  { id: 'leo', name: 'Leo', msg: 'Local pack rankings updated overnight.' },
  { id: 'ewan', name: 'Ewan', msg: 'Found 3 quick wins across client accounts.' },
  { id: 'mya', name: 'Mya', msg: 'Client reports sent. Waiting on feedback.' },
  { id: 'alex', name: 'Alex', msg: 'Data pipeline healthy. Dashboards updated.' },
  { id: 'ken', name: 'Ken', msg: 'New scraper deployed. API integrations stable.' },
];

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
  const [showPanel, setShowPanel] = useState('inbox'); // inbox | knowledge
  const loopRef = useRef(null);
  const uptimeRef = useRef(null);

  useEffect(() => {
    const initial = INIT_MSGS.map((m, i) => ({
      agentId: m.id, agentName: m.name, message: m.msg, type: 'agent_idle',
      timestamp: new Date(Date.now() - (INIT_MSGS.length - i) * 60000).toISOString(),
    }));
    setActivities(initial);
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

      // Activate 1-3 random agents
      const count = 1 + Math.floor(Math.random() * 3);
      const indices = new Set();
      while (indices.size < count) indices.add(Math.floor(Math.random() * AGENTS.length));

      for (const idx of indices) {
        const agent = AGENTS[idx];
        const actionGroup = SEO_ACTIONS[Math.floor(Math.random() * SEO_ACTIONS.length)];
        const msg = actionGroup.msgs[Math.floor(Math.random() * actionGroup.msgs.length)]
          .replace('{name}', agent.name);

        setAgents((prev) =>
          prev.map((a, i) => i === idx ? { ...a, state: actionGroup.state } : a)
        );

        setActivities((prev) => [{
          agentId: agent.id, agentName: agent.name, message: msg,
          type: 'agent_working', timestamp: new Date().toISOString(),
        }, ...prev].slice(0, 50));

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

    setActivities((prev) => [{
      agentId: 'mike', agentName: 'Mike', message: `New task received: "${description}"`,
      type: 'task_submitted', timestamp: new Date().toISOString(),
    }, ...prev].slice(0, 50));

    // Mike (COO) triages
    setTimeout(() => {
      setAgents((prev) => prev.map((a) => a.id === 'mike' ? { ...a, state: AGENT_STATES.THINKING } : a));
      setTasks((prev) => prev.map((t) => t.id === task.id ? { ...t, status: 'in_progress', assignedTo: 'mike' } : t));
    }, 1000);

    // Delegates
    setTimeout(() => {
      const delegateTargets = ['rob', 'craig', 'alex'];
      const target = delegateTargets[Math.floor(Math.random() * delegateTargets.length)];
      const targetAgent = AGENTS.find((a) => a.id === target);

      setAgents((prev) => prev.map((a) => {
        if (a.id === 'mike') return { ...a, state: AGENT_STATES.IDLE, completedTasks: a.completedTasks + 1 };
        if (a.id === target) return { ...a, state: AGENT_STATES.WORKING };
        return a;
      }));
      setActivities((prev) => [{
        agentId: 'mike', agentName: 'Mike',
        message: `Delegated task to ${targetAgent.name} (${targetAgent.title})`,
        type: 'agent_assigned', timestamp: new Date().toISOString(),
      }, ...prev].slice(0, 50));

      // Complete
      setTimeout(() => {
        setAgents((prev) => prev.map((a) =>
          a.id === target ? { ...a, state: AGENT_STATES.CELEBRATING, completedTasks: a.completedTasks + 1 } : a
        ));
        setTasks((prev) => prev.map((t) => t.id === task.id ? { ...t, status: 'completed' } : t));
        setActivities((prev) => [{
          agentId: target, agentName: targetAgent.name,
          message: `Completed: "${description}"`,
          type: 'task_completed', timestamp: new Date().toISOString(),
        }, ...prev].slice(0, 50));

        setTimeout(() => {
          setAgents((prev) => prev.map((a) => a.id === target ? { ...a, state: AGENT_STATES.IDLE } : a));
        }, 2000);
      }, 5000);
    }, 3000);
  }, []);

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
          <button className={`tab-btn ${showPanel === 'inbox' ? 'tab-active' : ''}`} onClick={() => setShowPanel('inbox')}>
            Inbox
            <span className="tab-count">{tasks.length}</span>
          </button>
          <button className={`tab-btn ${showPanel === 'knowledge' ? 'tab-active' : ''}`} onClick={() => setShowPanel('knowledge')}>
            KB
          </button>
        </div>

        <div className="right-panel">
          {showPanel === 'knowledge' ? (
            <KnowledgePanel />
          ) : (
            <>
              <TaskPanel tasks={tasks} onSubmitTask={submitTask} />
              <ActivityFeed activities={activities} />
            </>
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
