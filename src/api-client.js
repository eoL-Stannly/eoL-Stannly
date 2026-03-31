/**
 * Ayima API Client
 * ================
 * Drop-in replacement for direct Anthropic API calls.
 * All requests go through the Ayima backend server.
 * The API key NEVER leaves the server — the frontend only knows
 * the server URL and an auth token.
 *
 * Usage:
 *   import api from './api-client';
 *   const audit = await api.seo.contentAudit('https://example.com');
 *   const reply = await api.aya.chat('How do I fix thin content?');
 */

// ---- Configuration ----
// Set these via your build tool (Vite, CRA, etc.)
// VITE: import.meta.env.VITE_API_URL
// CRA:  process.env.REACT_APP_API_URL
const API_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  (typeof process !== 'undefined' && process.env?.REACT_APP_API_URL) ||
  'http://localhost:3001';

const AUTH_TOKEN =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_TOKEN) ||
  (typeof process !== 'undefined' && process.env?.REACT_APP_API_TOKEN) ||
  '';

// ---- Base fetch wrapper ----
async function request(path, options = {}) {
  const { method = 'GET', body, timeout = 120000 } = options;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  const headers = { 'Content-Type': 'application/json' };
  if (AUTH_TOKEN) {
    headers['Authorization'] = `Bearer ${AUTH_TOKEN}`;
  }

  try {
    const res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
      throw new Error(err.error || `Server error: ${res.status}`);
    }

    return res.json();
  } catch (e) {
    clearTimeout(timer);
    if (e.name === 'AbortError') throw new Error('Request timed out');
    throw e;
  }
}

// ---- API methods ----
const api = {
  // Health check
  health: () => request('/api/health'),
  stats: () => request('/api/health/stats'),

  seo: {
    /**
     * Run a content audit on a URL.
     * @param {string} url - Page URL to audit
     * @returns {Promise<object>} Structured audit results
     */
    contentAudit: (url) =>
      request('/api/seo/content-audit', { method: 'POST', body: { url } }),

    /**
     * Run a technical SEO audit on a URL.
     * @param {string} url - Page URL to audit
     * @returns {Promise<object>} Technical audit results
     */
    technical: (url) =>
      request('/api/seo/technical', { method: 'POST', body: { url } }),
  },

  aya: {
    /**
     * Send a chat message to AYA.
     * @param {string} message - User message
     * @param {Array} [history] - Previous conversation turns
     * @returns {Promise<{reply: string, usage: object}>}
     */
    chat: (message, history = []) =>
      request('/api/aya/chat', { method: 'POST', body: { message, history } }),
  },

  tasks: {
    /**
     * Submit a task to an agent.
     * @param {string} command - Task command
     * @param {string} [agentId] - Which agent to assign
     * @returns {Promise<{taskId: string, status: string}>}
     */
    submit: (command, agentId) =>
      request('/api/tasks/submit', { method: 'POST', body: { command, agentId } }),

    /**
     * Poll task status.
     * @param {string} taskId
     * @returns {Promise<object>} Task with status and result
     */
    get: (taskId) =>
      request(`/api/tasks/${taskId}`),

    /**
     * Poll until a task completes (or fails/times out).
     * @param {string} taskId
     * @param {object} [opts]
     * @param {number} [opts.interval=2000] - Poll interval ms
     * @param {number} [opts.maxWait=300000] - Max wait ms (5 min)
     * @param {function} [opts.onProgress] - Called each poll
     * @returns {Promise<object>} Completed task
     */
    poll: async (taskId, { interval = 2000, maxWait = 300000, onProgress } = {}) => {
      const deadline = Date.now() + maxWait;
      while (Date.now() < deadline) {
        const task = await api.tasks.get(taskId);
        if (onProgress) onProgress(task);
        if (task.status === 'complete' || task.status === 'error') return task;
        await new Promise(r => setTimeout(r, interval));
      }
      throw new Error('Task timed out');
    },
  },
};

export default api;
