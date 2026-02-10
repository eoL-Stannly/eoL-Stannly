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

// Fetch a URL and convert to markdown-ish text
app.post('/api/knowledge/fetch-url', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL required' });

  try {
    const resp = await fetch(url, {
      headers: { 'User-Agent': 'AGI-HQ-KnowledgeBot/1.0' },
      signal: AbortSignal.timeout(15000),
    });
    if (!resp.ok) return res.status(502).json({ error: `Fetch failed: ${resp.status} ${resp.statusText}` });

    const contentType = resp.headers.get('content-type') || '';
    const text = await resp.text();

    // Strip HTML tags to get readable text
    let content = text;
    if (contentType.includes('html')) {
      // Remove script/style blocks, then strip tags
      content = content
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
        .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
        .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '');

      // Convert common elements to markdown
      content = content
        .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n')
        .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n')
        .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n')
        .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n')
        .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
        .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
        .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
        .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
        .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
        .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');

      // Strip remaining tags
      content = content.replace(/<[^>]+>/g, '');
      // Clean up whitespace
      content = content
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\n{3,}/g, '\n\n')
        .trim();
    }

    // Extract title from URL or content
    const titleMatch = text.match(/<title[^>]*>(.*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : new URL(url).hostname;

    // Truncate if extremely long
    if (content.length > 50000) {
      content = content.slice(0, 50000) + '\n\n[Content truncated]';
    }

    res.json({ title, content, url, contentType });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch URL' });
  }
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
