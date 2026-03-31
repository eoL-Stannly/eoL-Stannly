export const handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod === 'POST') {
    const body = JSON.parse(event.body || '{}');
    const { description, priority } = body;

    if (!description) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Description required' }) };
    }

    const task = {
      id: `task_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      description,
      priority: priority || 'normal',
      status: 'pending',
      createdAt: new Date().toISOString(),
      assignedTo: null,
    };

    return { statusCode: 200, headers, body: JSON.stringify(task) };
  }

  // GET returns empty for serverless (state is client-side)
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify([]),
  };
};
