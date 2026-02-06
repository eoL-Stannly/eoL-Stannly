import React, { useState, useEffect, useCallback, useRef } from 'react';
import OfficeWorkspace from './components/OfficeWorkspace.jsx';
import ActivityFeed from './components/ActivityFeed.jsx';
import TaskPanel from './components/TaskPanel.jsx';
import StatusBar from './components/StatusBar.jsx';
import KnowledgePanel from './components/KnowledgePanel.jsx';
import { AGENTS, AGENT_STATES } from './agents/AgentDefinitions.js';

const DEMO_ACTIVITIES = [
  { agentId: 'ada', agentName: 'Ada', message: 'Good morning team! Ready to plan the day.', type: 'agent_idle' },
  { agentId: 'byte', agentName: 'Byte', message: 'Knowledge base loaded with 6 documents.', type: 'knowledge_accessed' },
  { agentId: 'chip', agentName: 'Chip', message: 'IDE is open and coffee is hot. Let\'s code!', type: 'agent_idle' },
  { agentId: 'dot', agentName: 'Dot', message: 'Ready to review any pull requests.', type: 'agent_idle' },
  { agentId: 'echo', agentName: 'Echo', message: 'Test suites initialized. All green!', type: 'agent_idle' },
  { agentId: 'flux', agentName: 'Flux', message: 'Documentation templates loaded.', type: 'agent_idle' },
];

export default function App() {
  const [agents, setAgents] = useState(
    AGENTS.map((a) => ({ ...a, state: AGENT_STATES.IDLE, currentTask: null, completedTasks: 0 }))
  );
  const [activities, setActivities] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [ralphStatus, setRalphStatus] = useState({
    running: false,
    loopCount: 0,
    callsThisHour: 0,
    maxCallsPerHour: 100,
    uptime: 0,
  });
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showKnowledge, setShowKnowledge] = useState(false);
  const loopRef = useRef(null);
  const uptimeRef = useRef(null);

  // Load initial demo activities
  useEffect(() => {
    const initial = DEMO_ACTIVITIES.map((a, i) => ({
      ...a,
      timestamp: new Date(Date.now() - (DEMO_ACTIVITIES.length - i) * 60000).toISOString(),
    }));
    setActivities(initial);
  }, []);

  // Simulate Ralph loop running
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
    if (ralphStatus.running) {
      // Uptime counter
      uptimeRef.current = setInterval(() => {
        setRalphStatus((prev) => ({ ...prev, uptime: prev.uptime + 1 }));
      }, 1000);

      // Simulated agent activity loop
      loopRef.current = setInterval(() => {
        setRalphStatus((prev) => ({
          ...prev,
          loopCount: prev.loopCount + 1,
          callsThisHour: prev.callsThisHour + 1,
        }));

        // Pick a random agent to activate
        const agentIndex = Math.floor(Math.random() * AGENTS.length);
        const agent = AGENTS[agentIndex];
        const actions = [
          { state: AGENT_STATES.THINKING, msg: `${agent.name} is analyzing the next task...` },
          { state: AGENT_STATES.WORKING, msg: `${agent.name} is working on implementation...` },
          { state: AGENT_STATES.COLLABORATING, msg: `${agent.name} is collaborating with the team...` },
        ];
        const action = actions[Math.floor(Math.random() * actions.length)];

        setAgents((prev) =>
          prev.map((a, i) =>
            i === agentIndex ? { ...a, state: action.state } : a
          )
        );

        setActivities((prev) => [
          {
            agentId: agent.id,
            agentName: agent.name,
            message: action.msg,
            type: 'agent_working',
            timestamp: new Date().toISOString(),
          },
          ...prev,
        ].slice(0, 50));

        // Return agent to idle after a bit
        setTimeout(() => {
          setAgents((prev) =>
            prev.map((a, i) =>
              i === agentIndex
                ? { ...a, state: AGENT_STATES.IDLE, completedTasks: a.completedTasks + 1 }
                : a
            )
          );
        }, 3000 + Math.random() * 4000);
      }, 5000);

      return () => {
        clearInterval(loopRef.current);
        clearInterval(uptimeRef.current);
      };
    }
  }, [ralphStatus.running]);

  const submitTask = useCallback((description) => {
    const task = {
      id: `task_${Date.now()}`,
      description,
      status: 'pending',
      createdAt: new Date().toISOString(),
      assignedTo: null,
    };
    setTasks((prev) => [task, ...prev]);

    setActivities((prev) => [
      {
        agentId: 'ada',
        agentName: 'Ada',
        message: `New task received: "${description}"`,
        type: 'task_submitted',
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ].slice(0, 50));

    // Ada picks it up
    setTimeout(() => {
      setAgents((prev) =>
        prev.map((a) => (a.id === 'ada' ? { ...a, state: AGENT_STATES.THINKING } : a))
      );
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, status: 'in_progress', assignedTo: 'ada' } : t))
      );
    }, 1000);

    // Delegate to team
    setTimeout(() => {
      setAgents((prev) =>
        prev.map((a) => {
          if (a.id === 'ada') return { ...a, state: AGENT_STATES.IDLE, completedTasks: a.completedTasks + 1 };
          if (a.id === 'byte') return { ...a, state: AGENT_STATES.WORKING };
          if (a.id === 'chip') return { ...a, state: AGENT_STATES.THINKING };
          return a;
        })
      );
      setActivities((prev) => [
        {
          agentId: 'ada',
          agentName: 'Ada',
          message: `Delegated task to Byte (research) and Chip (implementation)`,
          type: 'agent_assigned',
          timestamp: new Date().toISOString(),
        },
        ...prev,
      ].slice(0, 50));
    }, 3000);

    // Complete
    setTimeout(() => {
      setAgents((prev) =>
        prev.map((a) => {
          if (a.id === 'byte' || a.id === 'chip')
            return { ...a, state: AGENT_STATES.CELEBRATING, completedTasks: a.completedTasks + 1 };
          return a;
        })
      );
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, status: 'completed' } : t))
      );
      setActivities((prev) => [
        {
          agentId: 'chip',
          agentName: 'Chip',
          message: `Task completed: "${description}"`,
          type: 'task_completed',
          timestamp: new Date().toISOString(),
        },
        ...prev,
      ].slice(0, 50));

      // Back to idle
      setTimeout(() => {
        setAgents((prev) =>
          prev.map((a) =>
            a.id === 'byte' || a.id === 'chip'
              ? { ...a, state: AGENT_STATES.IDLE }
              : a
          )
        );
      }, 2000);
    }, 8000);
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <h1 className="app-title">
            <span className="title-icon">🏢</span>
            LLM Agents Office
          </h1>
          <span className="app-subtitle">Autonomous AI Team Workspace</span>
        </div>
        <div className="header-right">
          <button
            className={`ralph-toggle ${ralphStatus.running ? 'running' : ''}`}
            onClick={toggleRalph}
          >
            <span className="ralph-indicator" />
            {ralphStatus.running ? 'Ralph Running' : 'Start Ralph Loop'}
          </button>
          <button
            className={`kb-toggle ${showKnowledge ? 'active' : ''}`}
            onClick={() => setShowKnowledge(!showKnowledge)}
          >
            📚 Knowledge Base
          </button>
        </div>
      </header>

      <StatusBar ralphStatus={ralphStatus} agents={agents} />

      <main className="app-main">
        <div className="workspace-area">
          <OfficeWorkspace
            agents={agents}
            selectedAgent={selectedAgent}
            onSelectAgent={setSelectedAgent}
          />
        </div>
        <div className="sidebar">
          {showKnowledge ? (
            <KnowledgePanel />
          ) : (
            <>
              <TaskPanel tasks={tasks} onSubmitTask={submitTask} />
              <ActivityFeed activities={activities} />
            </>
          )}
        </div>
      </main>

      {selectedAgent && (
        <AgentDetail
          agent={agents.find((a) => a.id === selectedAgent)}
          onClose={() => setSelectedAgent(null)}
        />
      )}
    </div>
  );
}

function AgentDetail({ agent, onClose }) {
  if (!agent) return null;
  return (
    <div className="agent-detail-overlay" onClick={onClose}>
      <div className="agent-detail-card" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        <div className="detail-header" style={{ borderColor: agent.color }}>
          <div className="detail-avatar" style={{ backgroundColor: agent.color }}>
            <AgentAvatar role={agent.avatar} size={80} />
          </div>
          <div className="detail-info">
            <h2>{agent.name}</h2>
            <span className="detail-title">{agent.title}</span>
            <span className={`detail-state state-${agent.state}`}>{agent.state}</span>
          </div>
        </div>
        <p className="detail-personality">{agent.personality}</p>
        <div className="detail-stats">
          <div className="stat">
            <span className="stat-value">{agent.completedTasks}</span>
            <span className="stat-label">Tasks Done</span>
          </div>
          <div className="stat">
            <span className="stat-value">{agent.capabilities?.length || 0}</span>
            <span className="stat-label">Skills</span>
          </div>
        </div>
        <div className="detail-capabilities">
          <h4>Capabilities</h4>
          <div className="capability-tags">
            {(agent.capabilities || []).map((cap) => (
              <span key={cap} className="capability-tag">{cap.replace(/_/g, ' ')}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AgentAvatar({ role, size = 48 }) {
  const avatars = {
    planner: '📋',
    researcher: '🔍',
    coder: '💻',
    reviewer: '🔎',
    tester: '🧪',
    documenter: '📝',
  };
  return (
    <span style={{ fontSize: size * 0.6 }} className="avatar-emoji">
      {avatars[role] || '🤖'}
    </span>
  );
}
