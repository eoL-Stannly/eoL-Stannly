import React, { useState, useEffect, useCallback, useRef } from 'react';
import OfficeWorkspace from './components/OfficeWorkspace.jsx';
import ActivityFeed from './components/ActivityFeed.jsx';
import TaskPanel from './components/TaskPanel.jsx';
import TaskConfigModal from './components/TaskConfigModal.jsx';
import PageContentAuditModal from './components/PageContentAuditModal.jsx';
import KnowledgePanel from './components/KnowledgePanel.jsx';
import { AGENTS, AGENT_STATES } from './agents/AgentDefinitions.js';
import { generateClientDeliverable, pickAgentForTask } from './clientDeliverables.js';

const SEO_TASK_BUTTONS = [
  { label: 'Keyword Research', desc: 'Research and analyse target keywords for SEO campaigns' },
  { label: 'Content Production', desc: 'Create and optimise SEO content based on keyword research' },
  { label: 'Redirect Mapping', desc: 'Map redirect rules for site migrations and URL changes' },
  { label: 'Performance Analysis', desc: 'Analyse site performance metrics and Core Web Vitals' },
  { label: 'Technical Auditing', desc: 'Run comprehensive technical SEO audit of the site' },
  { label: 'Internal Linking', desc: 'Analyse and optimise internal link structure' },
  { label: 'HREFLANG Mapping', desc: 'Map hreflang tags for international SEO targeting' },
  { label: 'Sitemap Production', desc: 'Generate and validate XML sitemaps for the site' },
  { label: 'Page Content Audit', desc: 'Run E-E-A-T content quality analysis on a URL', special: 'page-audit' },
];

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

// Determine server base URL (same origin in production, or localhost:3001 in dev)
const SERVER_BASE = '';

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
  const [serverConnected, setServerConnected] = useState(false);
  const [configTask, setConfigTask] = useState(null);
  const [showPageAudit, setShowPageAudit] = useState(false);
  const loopRef = useRef(null);
  const uptimeRef = useRef(null);
  const idleLoopRef = useRef(null);
  const wsRef = useRef(null);

  const addActivity = useCallback((agentId, agentName, message, type) => {
    setActivities((prev) => [{
      agentId, agentName, message, type, timestamp: new Date().toISOString(),
    }, ...prev].slice(0, 100));
  }, []);

  // Helper to update a task's progress
  const updateTaskProgress = useCallback((taskId, stage, percent, stageText) => {
    setTasks((prev) => prev.map((t) =>
      t.id === taskId ? { ...t, progress: { stage, percent, stageText } } : t
    ));
  }, []);

  // Handle events from the WebSocket server
  const handleServerEvent = useCallback((data) => {
    if (data.type === 'init') {
      return;
    }

    if (data.type === 'orchestrator_event') {
      const event = data.payload;
      const taskId = event.task?.id;

      // Update progress from server events — only advance forward, never backwards.
      // Local fallback is also running, so server events just reinforce/accelerate progress.
      if (taskId) {
        const advanceProgress = (stage, percent, stageText) => {
          setTasks((prev) => prev.map((t) => {
            if (t.id !== taskId) return t;
            const current = t.progress?.percent || 0;
            if (percent <= current) return t; // Never go backwards
            return { ...t, progress: { stage, percent, stageText } };
          }));
        };

        if (event.type === 'agent_working' && event.agentId === 'mike') {
          advanceProgress('triaging', 10, 'Mike is triaging the request...');
        } else if (event.type === 'triage_result') {
          const taskTypeName = event.taskType?.replace(/-/g, ' ') || 'task';
          advanceProgress('triaging', 20, `Mike identified: ${taskTypeName}`);
        } else if (event.type === 'agent_assigned' && event.targetAgentId) {
          const name = event.targetAgentName || event.targetAgentId;
          advanceProgress('delegating', 30, `Delegated to ${name}...`);
        } else if (event.type === 'agent_assigned' && !event.targetAgentId) {
          const name = event.agentName || event.agentId;
          advanceProgress('delegating', 35, `${name} is picking up the task...`);
        } else if (event.type === 'sop_loaded') {
          const name = event.agentName || event.agentId;
          advanceProgress('searching_kb', 45, `${name} loaded SOP/PRD for ${event.taskType}...`);
        } else if (event.type === 'knowledge_accessed') {
          const name = event.agentName || event.agentId;
          const count = event.documentsFound || 0;
          advanceProgress('searching_kb', 55, `${name} found ${count} KB documents...`);
        } else if (event.type === 'agent_working' && event.agentId !== 'mike') {
          const name = event.agentName || event.agentId;
          advanceProgress('working', 70, `${name} is generating deliverable...`);
        } else if (event.type === 'task_completed') {
          advanceProgress('completing', 100, 'Complete!');
        } else if (event.type === 'task_error') {
          advanceProgress('error', 100, event.message || 'Task failed');
        }
      }

      // Update agent states
      if (event.agentId && event.agentId !== 'system') {
        setAgents((prev) => prev.map((a) => {
          if (a.id === event.agentId) {
            if (event.type === 'agent_working') {
              return { ...a, state: event.agentId === 'mike' ? AGENT_STATES.THINKING : AGENT_STATES.WORKING, atWaterCooler: false, chattingWith: null, speechBubble: null };
            }
            if (event.type === 'agent_assigned' && event.targetAgentId) {
              return a; // Mike delegating, handled below
            }
            if (event.type === 'agent_assigned' && !event.targetAgentId) {
              return { ...a, state: AGENT_STATES.THINKING, atWaterCooler: false, chattingWith: null, speechBubble: null };
            }
            if (event.type === 'task_completed') {
              return { ...a, state: AGENT_STATES.CELEBRATING, completedTasks: a.completedTasks + 1 };
            }
            if (event.type === 'agent_idle') {
              return { ...a, state: AGENT_STATES.IDLE, currentTask: null };
            }
          }

          if (event.type === 'agent_assigned' && event.targetAgentId && a.id === event.targetAgentId) {
            return { ...a, state: AGENT_STATES.THINKING, atWaterCooler: false, chattingWith: null, speechBubble: null };
          }

          return a;
        }));

        if (event.type === 'agent_assigned' && event.targetAgentId && event.agentId === 'mike') {
          setAgents((prev) => prev.map((a) =>
            a.id === 'mike' ? { ...a, state: AGENT_STATES.IDLE } : a
          ));
        }
      }

      // Update tasks — merge server data without overwriting client-side fields
      if (event.task) {
        setTasks((prev) => {
          const exists = prev.find((t) => t.id === event.task.id);
          if (exists) {
            return prev.map((t) => {
              if (t.id === event.task.id) {
                // Merge: keep client-side fields (progress, shortTitle, meta), update server fields
                const merged = {
                  ...t,
                  status: event.task.status || t.status,
                  assignedTo: event.task.assignedTo || t.assignedTo,
                };
                // Only set result and clear progress on completion
                if (event.type === 'task_completed') {
                  merged.result = event.task.result || event.result;
                  merged.status = 'completed';
                  merged.progress = null;
                }
                return merged;
              }
              return t;
            });
          }
          if (event.type === 'task_submitted') {
            return [{ ...event.task, progress: { stage: 'queued', percent: 5, stageText: 'Queued...' } }, ...prev];
          }
          return prev;
        });
      }

      // Activity feed
      if (event.message) {
        addActivity(
          event.agentId || 'system',
          event.agentName || 'System',
          event.message,
          event.type
        );
      }
    }
  }, [addActivity]);

  // Keep a ref to always have the latest handleServerEvent in the WS closure
  const handleServerEventRef = useRef(handleServerEvent);
  handleServerEventRef.current = handleServerEvent;

  // --- WebSocket connection to backend ---
  useEffect(() => {
    let ws;
    let reconnectTimer;

    const connect = () => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;

      try {
        ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          setServerConnected(true);
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            handleServerEventRef.current(data);
          } catch {
            // ignore parse errors
          }
        };

        ws.onclose = () => {
          setServerConnected(false);
          wsRef.current = null;
          reconnectTimer = setTimeout(connect, 3000);
        };

        ws.onerror = () => {
          // Will trigger onclose
        };
      } catch {
        reconnectTimer = setTimeout(connect, 3000);
      }
    };

    connect();

    return () => {
      clearTimeout(reconnectTimer);
      if (ws) ws.close();
    };
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

          const updated = prev.map((a) => {
            if (a.id === a1.id || a.id === a2.id) {
              return { ...a, state: AGENT_STATES.WALKING };
            }
            return a;
          });

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

        // 25% chance: agent thinks aloud at desk
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

    idleLoopRef.current = setInterval(doIdleBehavior, 5000 + Math.random() * 3000);
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

  // Submit task — always runs local fallback for guaranteed progress.
  // If server is connected, also submits there; server result overrides local when it arrives.
  const submitTask = useCallback(async (description, meta) => {
    setShowPanel('tasks');

    const shortTitle = meta?.taskType || description.split('\n')[0].slice(0, 60);
    const taskId = `task_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const tempTask = {
      id: taskId, description, status: 'pending',
      createdAt: new Date().toISOString(), assignedTo: null, result: null,
      progress: { stage: 'queued', percent: 5, stageText: 'Queued — waiting for triage...' },
      meta: meta || null,
      shortTitle,
    };
    setTasks((prev) => [tempTask, ...prev]);
    addActivity('system', 'System', `Task submitted: ${shortTitle}`, 'task_submitted');

    // Always run local progress — guarantees visible progress stages
    runLocalFallback(tempTask, description);

    // Also submit to server if available — server result replaces local on completion
    try {
      await fetch(`${SERVER_BASE}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, meta, taskId }),
      });
    } catch {
      // Server not available — local fallback already running
    }
  }, [addActivity]);

  // Client-side task processing with visible progress stages
  const runLocalFallback = useCallback((task, description) => {
    const taskId = task.id;
    const target = pickAgentForTask(description);
    const targetAgent = AGENTS.find((a) => a.id === target);

    // Stage 1: Triaging (1s)
    setTimeout(() => {
      updateTaskProgress(taskId, 'triaging', 15, 'Mike is triaging the request...');
      setAgents((prev) => prev.map((a) => a.id === 'mike' ? { ...a, state: AGENT_STATES.THINKING, atWaterCooler: false, chattingWith: null, speechBubble: null } : a));
      setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, status: 'in_progress', assignedTo: 'mike' } : t));
      addActivity('mike', 'Mike', `Triaging: "${description.split('\n')[0].slice(0, 80)}"`, 'agent_working');
    }, 800);

    // Stage 2: Delegating (2.5s)
    setTimeout(() => {
      updateTaskProgress(taskId, 'delegating', 30, `Mike is delegating to ${targetAgent.name}...`);
      setAgents((prev) => prev.map((a) => {
        if (a.id === 'mike') return { ...a, state: AGENT_STATES.IDLE };
        if (a.id === target) return { ...a, state: AGENT_STATES.THINKING, atWaterCooler: false, chattingWith: null, speechBubble: null };
        return a;
      }));
      setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, assignedTo: target } : t));
      addActivity('mike', 'Mike', `Delegated to ${targetAgent.name}`, 'agent_assigned');
    }, 2500);

    // Stage 3: Searching KB (4s)
    setTimeout(() => {
      updateTaskProgress(taskId, 'searching_kb', 50, `${targetAgent.name} is searching the knowledge base...`);
      addActivity(target, targetAgent.name, 'Searching knowledge base for context...', 'knowledge_accessed');
    }, 4000);

    // Stage 4: Working (5.5s)
    setTimeout(() => {
      updateTaskProgress(taskId, 'working', 70, `${targetAgent.name} is generating deliverable...`);
      setAgents((prev) => prev.map((a) => a.id === target ? { ...a, state: AGENT_STATES.WORKING } : a));
      addActivity(target, targetAgent.name, `Working on: "${description.split('\n')[0].slice(0, 80)}"`, 'agent_working');
    }, 5500);

    // Stage 5: Almost done (7.5s)
    setTimeout(() => {
      updateTaskProgress(taskId, 'working', 90, `${targetAgent.name} is finalising output...`);
    }, 7500);

    // Stage 6: Complete (9s) — only if server hasn't already completed this task
    setTimeout(() => {
      setTasks((prev) => {
        const existing = prev.find((t) => t.id === taskId);
        if (existing && existing.status === 'completed') return prev; // Server already completed it

        const result = generateClientDeliverable(description, target, targetAgent.name, targetAgent.title);
        return prev.map((t) => t.id === taskId ? { ...t, status: 'completed', result, progress: null } : t);
      });

      setAgents((prev) => prev.map((a) =>
        a.id === target ? { ...a, state: AGENT_STATES.CELEBRATING, completedTasks: a.completedTasks + 1 } : a
      ));
      addActivity(target, targetAgent.name, `Completed: "${description.split('\n')[0].slice(0, 80)}"`, 'task_completed');

      setTimeout(() => {
        setAgents((prev) => prev.map((a) => a.id === target ? { ...a, state: AGENT_STATES.IDLE } : a));
      }, 2000);
    }, 9000);
  }, [addActivity, updateTaskProgress]);

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
            <span className={`server-status ${serverConnected ? 'server-on' : 'server-off'}`}>
              {serverConnected ? 'SERVER' : 'OFFLINE'}
            </span>
          </div>
        </div>

        {/* SEO Task Quick Actions */}
        <div className="seo-task-buttons">
          {SEO_TASK_BUTTONS.map((btn) => (
            <button
              key={btn.label}
              className={`seo-task-btn${btn.special === 'page-audit' ? ' seo-task-btn--audit' : ''}`}
              title={btn.desc}
              onClick={() => btn.special === 'page-audit' ? setShowPageAudit(true) : setConfigTask(btn)}
            >
              {btn.label}
            </button>
          ))}
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

      {configTask && (
        <TaskConfigModal
          taskType={configTask}
          onClose={() => setConfigTask(null)}
          onSubmit={(description, meta) => {
            setConfigTask(null);
            submitTask(description, meta);
          }}
        />
      )}

      {showPageAudit && (
        <PageContentAuditModal
          onClose={() => setShowPageAudit(false)}
        />
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
