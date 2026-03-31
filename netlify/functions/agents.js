import { AGENTS } from './shared/agents.js';

export const handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // GET /api/agents or /api/agents/:id
  const pathParts = event.path.replace(/^\/\.netlify\/functions\//, '').split('/');
  const agentId = pathParts[1]; // after "agents"

  if (agentId) {
    const agent = AGENTS.find((a) => a.id === agentId);
    if (!agent) {
      return { statusCode: 404, headers, body: JSON.stringify({ error: 'Agent not found' }) };
    }
    return { statusCode: 200, headers, body: JSON.stringify(agent) };
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(AGENTS),
  };
};
