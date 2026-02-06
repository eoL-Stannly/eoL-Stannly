/**
 * LLM Agents Office - Backend Server
 * Provides REST API for agent management and WebSocket for real-time updates.
 */

import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { AgentOrchestrator } from '../agents/AgentOrchestrator.js';
import { KnowledgeBase } from '../knowledgebase/KnowledgeBase.js';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '../..');

const PORT = process.env.PORT || 3001;

// ---- Initialize Knowledge Base ----
const kb = new KnowledgeBase();
kb.loadSeedData();

// ---- Initialize Orchestrator ----
const orchestrator = new AgentOrchestrator(kb);

// ---- Express Setup ----
const app = express();
app.use(cors());
app.use(express.json());

const server = createServer(app);

// ---- WebSocket for real-time updates ----
const wss = new WebSocketServer({ server, path: '/ws' });

const broadcast = (data) => {
  const msg = JSON.stringify(data);
  for (const client of wss.clients) {
    if (client.readyState === 1) {
      client.send(msg);
    }
  }
};

// Subscribe orchestrator events to WebSocket
orchestrator.subscribe((event) => {
  broadcast({ type: 'orchestrator_event', payload: event });
});

wss.on('connection', (ws) => {
  console.log('Client connected via WebSocket');

  // Send current state
  ws.send(
    JSON.stringify({
      type: 'init',
      payload: {
        agents: orchestrator.getAllAgentStates(),
        status: orchestrator.getStatus(),
        knowledgeBase: kb.getStats(),
        ralph: getRalphStatus(),
      },
    })
  );

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// ---- API Routes ----

// Get all agents
app.get('/api/agents', (req, res) => {
  res.json(orchestrator.getAllAgentStates());
});

// Get specific agent
app.get('/api/agents/:id', (req, res) => {
  const agent = orchestrator.getAgentState(req.params.id);
  if (!agent) return res.status(404).json({ error: 'Agent not found' });
  res.json(agent);
});

// Submit a task
app.post('/api/tasks', async (req, res) => {
  try {
    const { description, priority } = req.body;
    if (!description) return res.status(400).json({ error: 'Description required' });
    const task = await orchestrator.submitTask(description, priority);
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get orchestrator status
app.get('/api/status', (req, res) => {
  res.json({
    orchestrator: orchestrator.getStatus(),
    ralph: getRalphStatus(),
    knowledgeBase: kb.getStats(),
  });
});

// Get activity log
app.get('/api/activity', (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  const log = orchestrator.getMessageLog();
  res.json(log.slice(-limit));
});

// ---- Knowledge Base API ----

app.get('/api/knowledge', (req, res) => {
  res.json(kb.getAllDocuments());
});

app.get('/api/knowledge/search', (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Query parameter q required' });
  res.json(kb.search(q));
});

app.post('/api/knowledge', (req, res) => {
  const { id, title, content, metadata } = req.body;
  if (!title || !content) return res.status(400).json({ error: 'Title and content required' });
  const docId = id || `doc_${Date.now()}`;
  const doc = kb.addDocument(docId, title, content, metadata);
  broadcast({ type: 'knowledge_updated', payload: kb.getStats() });
  res.json(doc);
});

app.delete('/api/knowledge/:id', (req, res) => {
  kb.removeDocument(req.params.id);
  broadcast({ type: 'knowledge_updated', payload: kb.getStats() });
  res.json({ ok: true });
});

// ---- Ralph Status ----

function getRalphStatus() {
  const statusFile = join(ROOT_DIR, '.ralph', 'status.json');
  try {
    if (existsSync(statusFile)) {
      const raw = readFileSync(statusFile, 'utf-8');
      return JSON.parse(raw);
    }
  } catch {
    // ignore parse errors
  }
  return {
    running: false,
    loop_count: 0,
    calls_this_hour: 0,
    max_calls_per_hour: 100,
  };
}

app.get('/api/ralph/status', (req, res) => {
  res.json(getRalphStatus());
});

// ---- Start Server ----
server.listen(PORT, () => {
  console.log(`LLM Agents Office server running on port ${PORT}`);
  console.log(`WebSocket available at ws://localhost:${PORT}/ws`);
  console.log(`Knowledge base loaded: ${kb.getStats().totalDocuments} documents`);
});
