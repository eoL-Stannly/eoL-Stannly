const DOCUMENTS = [
  {
    id: 'arch-overview',
    title: 'System Architecture Overview',
    content: 'Multi-agent architecture with specialized roles collaborating through a central orchestrator.',
    metadata: { category: 'architecture' },
  },
  {
    id: 'agent-guidelines',
    title: 'Agent Interaction Guidelines',
    content: 'Agents consult KB, cite sources, delegate appropriately, report blockers, celebrate wins.',
    metadata: { category: 'guidelines' },
  },
  {
    id: 'ralph-loop',
    title: 'Ralph Wiggum Loop Documentation',
    content: 'Bash-based automation framework: dual-condition exit, rate limiting, circuit breaker, session continuity.',
    metadata: { category: 'infrastructure' },
  },
  {
    id: 'coding-standards',
    title: 'Coding Standards',
    content: 'ES modules, functional patterns, descriptive names, JSDoc, <50 line functions, test all public APIs.',
    metadata: { category: 'standards' },
  },
  {
    id: 'testing-strategy',
    title: 'Testing Strategy',
    content: 'Test pyramid: unit, integration, e2e. Descriptive assertions. 80%+ coverage on critical paths.',
    metadata: { category: 'testing' },
  },
  {
    id: 'knowledge-management',
    title: 'Knowledge Base Management',
    content: 'Supports add/search/remove documents. Keyword search with relevance scoring. Agent-queryable.',
    metadata: { category: 'infrastructure' },
  },
];

export const handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Search
  const params = event.queryStringParameters || {};
  if (params.q) {
    const query = params.q.toLowerCase();
    const results = DOCUMENTS.filter(
      (d) =>
        d.title.toLowerCase().includes(query) ||
        d.content.toLowerCase().includes(query)
    );
    return { statusCode: 200, headers, body: JSON.stringify(results) };
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(DOCUMENTS),
  };
};
