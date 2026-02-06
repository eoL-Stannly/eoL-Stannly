import React, { useState, useEffect, useCallback, useRef } from 'react';
import OfficeWorkspace from './components/OfficeWorkspace.jsx';
import ActivityFeed from './components/ActivityFeed.jsx';
import TaskPanel from './components/TaskPanel.jsx';
import KnowledgePanel from './components/KnowledgePanel.jsx';
import { AGENTS, AGENT_STATES } from './agents/AgentDefinitions.js';

const IDLE_CHATTER = [
  "Have you seen the latest algo update?",
  "Core Web Vitals looking good today",
  "That keyword cluster is ranking!",
  "Need more coffee...",
  "Client call went great",
  "Schema markup is live",
  "Backlink profile is growing",
  "CTR is up 12% this week",
  "Let's review the SERP data",
  "New content brief ready",
  "GBP reviews are coming in",
  "Pipeline finished overnight",
  "Quick win: title tag updates",
  "E-E-A-T audit is done",
  "Page speed score hit 95!",
  "Crawl budget looks healthy",
  "Competitor dropped in rankings",
  "Link building outreach sent",
  "Dashboard metrics updated",
  "Index coverage looks clean",
  "That topic cluster is solid",
  "Internal linking audit next?",
  "Log files show more bot hits",
  "Organic traffic is trending up",
  "Citation cleanup finished",
  "Content gap analysis ready",
  "Featured snippet won!",
  "Anyone tried the new GSC API?",
  "Redirect chain fixed",
  "Robots.txt updated",
];

const WATER_COOLER_CHAT = [
  "Did you catch the game?",
  "Weather's nice today",
  "Any plans this weekend?",
  "Coffee machine is fixed!",
  "Team lunch tomorrow?",
  "New podcast recommendation?",
  "That meeting was productive",
  "Friday vibes!",
  "Need a break from screens",
  "Great teamwork today",
];

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function App() {
  const [agents, setAgents] = useState(
    AGENTS.map((a) => ({
      ...a,
      state: AGENT_STATES.IDLE,
      currentTask: null,
      completedTasks: 0,
      speechBubble: null,
      atWaterCooler: false,
      chattingWith: null,
    }))
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
  const idleLoopRef = useRef(null);

  const addActivity = useCallback((agentId, agentName, message, type) => {
    setActivities((prev) => [{
      agentId, agentName, message, type, timestamp: new Date().toISOString(),
    }, ...prev].slice(0, 100));
  }, []);

  // --- Speech bubble helper ---
  const showSpeechBubble = useCallback((agentId, text, duration = 4000) => {
    setAgents((prev) => prev.map((a) =>
      a.id === agentId ? { ...a, speechBubble: text } : a
    ));
    setTimeout(() => {
      setAgents((prev) => prev.map((a) =>
        a.id === agentId ? { ...a, speechBubble: null } : a
      ));
    }, duration);
  }, []);

  // --- Idle behavior loop ---
  useEffect(() => {
    const doIdleBehavior = () => {
      setAgents((prev) => {
        const idleAgents = prev.filter(
          (a) => a.state === AGENT_STATES.IDLE && !a.atWaterCooler && !a.speechBubble
        );
        if (idleAgents.length < 2) return prev;

        const roll = Math.random();

        // 35% chance: two agents go to water cooler and chat
        if (roll < 0.35 && idleAgents.length >= 2) {
          const shuffled = [...idleAgents].sort(() => Math.random() - 0.5);
          const a1 = shuffled[0];
          const a2 = shuffled[1];

          // Phase 1: Walk to cooler
          const updated = prev.map((a) => {
            if (a.id === a1.id || a.id === a2.id) {
              return { ...a, state: AGENT_STATES.WALKING };
            }
            return a;
          });

          // Phase 2: Arrive at cooler and chat
          setTimeout(() => {
            setAgents((p) => p.map((a) => {
              if (a.id === a1.id) return { ...a, state: AGENT_STATES.COLLABORATING, atWaterCooler: true, chattingWith: a2.id };
              if (a.id === a2.id) return { ...a, state: AGENT_STATES.COLLABORATING, atWaterCooler: true, chattingWith: a1.id };
              return a;
            }));
            const chat1 = pickRandom(WATER_COOLER_CHAT);
            showSpeechBubble(a1.id, chat1, 3500);

            setTimeout(() => {
              const chat2 = pickRandom(WATER_COOLER_CHAT);
              showSpeechBubble(a2.id, chat2, 3500);
            }, 2000);

            // Phase 3: Walk back
            setTimeout(() => {
              setAgents((p) => p.map((a) => {
                if (a.id === a1.id || a.id === a2.id) {
                  return { ...a, state: AGENT_STATES.WALKING, atWaterCooler: false, chattingWith: null };
                }
                return a;
              }));

              setTimeout(() => {
                setAgents((p) => p.map((a) => {
                  if (a.id === a1.id || a.id === a2.id) {
                    return { ...a, state: AGENT_STATES.IDLE };
                  }
                  return a;
                }));
              }, 2000);
            }, 8000);
          }, 2000);

          return updated;
        }

        // 25% chance: single agent gets coffee
        if (roll < 0.60) {
          const agent = pickRandom(idleAgents);
          const updated = prev.map((a) =>
            a.id === agent.id ? { ...a, state: AGENT_STATES.WALKING } : a
          );

          setTimeout(() => {
            setAgents((p) => p.map((a) =>
              a.id === agent.id ? { ...a, state: AGENT_STATES.COFFEE } : a
            ));
            showSpeechBubble(agent.id, pickRandom(["Ahh, fresh coffee!", "Need this caffeine", "Coffee time!", "Back in a sec"]), 3000);

            setTimeout(() => {
              setAgents((p) => p.map((a) =>
                a.id === agent.id ? { ...a, state: AGENT_STATES.WALKING } : a
              ));
              setTimeout(() => {
                setAgents((p) => p.map((a) =>
                  a.id === agent.id ? { ...a, state: AGENT_STATES.IDLE } : a
                ));
              }, 1500);
            }, 5000);
          }, 1500);

          return updated;
        }

        // 25% chance: agent thinks aloud at desk (speech bubble only, no state change)
        if (roll < 0.85) {
          const agent = pickRandom(idleAgents);
          showSpeechBubble(agent.id, pickRandom(IDLE_CHATTER), 4000);
          return prev;
        }

        // 15% chance: two agents chat at their desks
        if (idleAgents.length >= 2) {
          const shuffled = [...idleAgents].sort(() => Math.random() - 0.5);
          const a1 = shuffled[0];
          const a2 = shuffled[1];
          showSpeechBubble(a1.id, pickRandom(IDLE_CHATTER), 4000);
          setTimeout(() => {
            showSpeechBubble(a2.id, pickRandom(IDLE_CHATTER), 4000);
          }, 1500);
        }

        return prev;
      });
    };

    // Start idle loop immediately
    idleLoopRef.current = setInterval(doIdleBehavior, 5000 + Math.random() * 3000);

    // First trigger after a short delay
    const firstTimeout = setTimeout(doIdleBehavior, 2000);

    return () => {
      clearInterval(idleLoopRef.current);
      clearTimeout(firstTimeout);
    };
  }, [showSpeechBubble]);

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

      const count = 1 + Math.floor(Math.random() * 3);
      const indices = new Set();
      while (indices.size < count) indices.add(Math.floor(Math.random() * AGENTS.length));

      for (const idx of indices) {
        setAgents((prev) =>
          prev.map((a, i) => i === idx ? { ...a, state: AGENT_STATES.WORKING, atWaterCooler: false, chattingWith: null, speechBubble: null } : a)
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

    // Mike (COO) triages — pull him from whatever idle behavior
    setTimeout(() => {
      setAgents((prev) => prev.map((a) => a.id === 'mike' ? { ...a, state: AGENT_STATES.THINKING, atWaterCooler: false, chattingWith: null, speechBubble: null } : a));
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
        if (a.id === target) return { ...a, state: AGENT_STATES.WORKING, atWaterCooler: false, chattingWith: null, speechBubble: null };
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
