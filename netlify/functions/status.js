import { AGENTS } from './shared/agents.js';

export const handler = async () => {
  const status = {
    orchestrator: {
      totalAgents: AGENTS.length,
      idle: AGENTS.length,
      working: 0,
      pendingTasks: 0,
      completedTasks: 0,
      totalMessages: 0,
    },
    ralph: {
      running: false,
      loop_count: 0,
      calls_this_hour: 0,
      max_calls_per_hour: 100,
    },
    knowledgeBase: {
      totalDocuments: 6,
      totalKeywords: 42,
    },
  };

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify(status),
  };
};
