/**
 * Backend server configuration
 * All AI-powered endpoints route through the Railway server.
 * The API key lives ONLY on the server — never in the browser.
 */

const BACKEND_URL = import.meta.env.VITE_API_URL || '';
const AUTH_TOKEN = import.meta.env.VITE_API_TOKEN || '';

/**
 * Make an authenticated request to the backend server.
 * Use this for any endpoint that needs the Anthropic API (SEO, AYA, content audit).
 */
export async function backendFetch(path, options = {}) {
  const { method = 'POST', body, timeout = 120000 } = options;

  const headers = { 'Content-Type': 'application/json' };
  if (AUTH_TOKEN) {
    headers['Authorization'] = `Bearer ${AUTH_TOKEN}`;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(`${BACKEND_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    clearTimeout(timer);
    return res;
  } catch (e) {
    clearTimeout(timer);
    throw e;
  }
}

export { BACKEND_URL, AUTH_TOKEN };
