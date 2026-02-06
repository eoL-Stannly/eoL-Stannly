/**
 * Agent Orchestrator
 * Manages the lifecycle of LLM agents, dispatches tasks,
 * and coordinates inter-agent communication.
 */

import { AGENTS, AGENT_STATES, getAgentById } from './AgentDefinitions.js';

export class AgentOrchestrator {
  constructor(knowledgeBase) {
    this.knowledgeBase = knowledgeBase;
    this.agents = new Map();
    this.taskQueue = [];
    this.activeTasksByAgent = new Map();
    this.messageLog = [];
    this.listeners = new Set();

    // Initialize all agents
    for (const agentDef of AGENTS) {
      this.agents.set(agentDef.id, {
        ...agentDef,
        state: AGENT_STATES.IDLE,
        currentTask: null,
        completedTasks: 0,
        lastActivity: null,
        chatHistory: [],
      });
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(event) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      ...event,
    };
    this.messageLog.push(logEntry);
    for (const listener of this.listeners) {
      listener(logEntry);
    }
  }

  getAgentState(agentId) {
    return this.agents.get(agentId);
  }

  getAllAgentStates() {
    return Array.from(this.agents.values());
  }

  getMessageLog() {
    return this.messageLog;
  }

  /**
   * Submit a task to the orchestrator.
   * The planner agent (Ada) will break it down and delegate.
   */
  async submitTask(description, priority = 'normal') {
    const task = {
      id: `task_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      description,
      priority,
      status: 'pending',
      createdAt: new Date().toISOString(),
      subtasks: [],
      assignedTo: null,
      result: null,
    };

    this.taskQueue.push(task);
    this.notify({
      type: 'task_submitted',
      task,
      message: `New task submitted: ${description}`,
    });

    // Ada (planner) picks up the task first
    await this.assignToAgent('ada', task);
    return task;
  }

  /**
   * Assign a task to a specific agent
   */
  async assignToAgent(agentId, task) {
    const agent = this.agents.get(agentId);
    if (!agent) throw new Error(`Agent ${agentId} not found`);

    agent.state = AGENT_STATES.THINKING;
    agent.currentTask = task;
    agent.lastActivity = new Date().toISOString();
    task.assignedTo = agentId;
    task.status = 'in_progress';

    this.notify({
      type: 'agent_assigned',
      agentId,
      agentName: agent.name,
      task,
      message: `${agent.name} is picking up: ${task.description}`,
    });

    // Simulate agent processing
    await this.processAgentTask(agentId, task);
  }

  /**
   * Process a task with the assigned agent.
   * In production, this would call the actual LLM API.
   */
  async processAgentTask(agentId, task) {
    const agent = this.agents.get(agentId);
    agent.state = AGENT_STATES.WORKING;

    this.notify({
      type: 'agent_working',
      agentId,
      agentName: agent.name,
      message: `${agent.name} is working on: ${task.description}`,
    });

    // Query knowledge base for context
    const context = this.knowledgeBase
      ? this.knowledgeBase.search(task.description)
      : [];

    if (context.length > 0) {
      this.notify({
        type: 'knowledge_accessed',
        agentId,
        agentName: agent.name,
        documentsFound: context.length,
        message: `${agent.name} found ${context.length} relevant documents in the knowledge base`,
      });
    }

    // Build the prompt for the LLM
    const prompt = this.buildPrompt(agent, task, context);

    // Store the interaction
    agent.chatHistory.push({
      role: 'user',
      content: task.description,
      context: context.map((c) => c.title),
    });

    // Simulate LLM response (in production, call actual API)
    const response = await this.callLLM(agent, prompt);

    agent.chatHistory.push({
      role: 'assistant',
      content: response,
    });

    // Handle delegation if planner creates subtasks
    if (agent.role === 'planner' && response.subtasks) {
      for (const subtask of response.subtasks) {
        const targetAgent = this.findBestAgent(subtask.role);
        if (targetAgent) {
          const subTask = {
            id: `subtask_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
            description: subtask.description,
            status: 'pending',
            parentTaskId: task.id,
            assignedTo: null,
          };
          task.subtasks.push(subTask);
          // Queue for later execution
          this.taskQueue.push(subTask);
        }
      }
    }

    // Complete the task
    agent.state = AGENT_STATES.CELEBRATING;
    agent.completedTasks += 1;
    task.status = 'completed';
    task.result = response;

    this.notify({
      type: 'task_completed',
      agentId,
      agentName: agent.name,
      task,
      message: `${agent.name} completed: ${task.description}`,
    });

    // Return to idle after a brief celebration
    setTimeout(() => {
      agent.state = AGENT_STATES.IDLE;
      agent.currentTask = null;
      this.notify({
        type: 'agent_idle',
        agentId,
        agentName: agent.name,
        message: `${agent.name} is ready for the next task`,
      });
    }, 2000);

    return response;
  }

  buildPrompt(agent, task, context) {
    let prompt = `${agent.systemPrompt}\n\n`;

    if (context.length > 0) {
      prompt += `## Relevant Knowledge Base Documents\n`;
      for (const doc of context) {
        prompt += `### ${doc.title}\n${doc.content}\n\n`;
      }
    }

    prompt += `## Current Task\n${task.description}\n`;

    if (agent.chatHistory.length > 0) {
      prompt += `\n## Previous Context\n`;
      const recent = agent.chatHistory.slice(-4);
      for (const msg of recent) {
        prompt += `${msg.role}: ${msg.content}\n`;
      }
    }

    return prompt;
  }

  findBestAgent(role) {
    const candidates = Array.from(this.agents.values()).filter(
      (a) => a.role === role && a.state === AGENT_STATES.IDLE
    );
    return candidates[0] || null;
  }

  /**
   * Simulated LLM call - replace with actual API integration
   */
  async callLLM(agent, prompt) {
    // Simulate processing delay
    await new Promise((r) => setTimeout(r, 1000 + Math.random() * 2000));

    // Return structured response based on agent role
    const responses = {
      planner: {
        analysis: `Analyzed the task and created a plan`,
        subtasks: [
          { role: 'researcher', description: 'Research requirements and constraints' },
          { role: 'coder', description: 'Implement the solution' },
          { role: 'tester', description: 'Write and run tests' },
          { role: 'reviewer', description: 'Review the implementation' },
          { role: 'documenter', description: 'Document the changes' },
        ],
      },
      researcher: { findings: 'Researched the topic using knowledge base', sources: [] },
      coder: { code: '// Implementation here', language: 'javascript' },
      reviewer: { approved: true, comments: [] },
      tester: { passed: true, coverage: '87%' },
      documenter: { documentation: 'Documentation updated' },
    };

    return responses[agent.role] || { result: 'Task processed' };
  }

  /**
   * Process all queued tasks (used by Ralph loop)
   */
  async processQueue() {
    const pending = this.taskQueue.filter((t) => t.status === 'pending');
    for (const task of pending) {
      const bestAgent = task.assignedTo
        ? this.agents.get(task.assignedTo)
        : this.findBestAgent(this.inferRole(task.description));
      if (bestAgent) {
        await this.assignToAgent(bestAgent.id, task);
      }
    }
    return pending.length;
  }

  inferRole(description) {
    const lower = description.toLowerCase();
    if (lower.includes('research') || lower.includes('find') || lower.includes('search'))
      return 'researcher';
    if (lower.includes('code') || lower.includes('implement') || lower.includes('build'))
      return 'coder';
    if (lower.includes('review') || lower.includes('check'))
      return 'reviewer';
    if (lower.includes('test') || lower.includes('verify'))
      return 'tester';
    if (lower.includes('document') || lower.includes('write'))
      return 'documenter';
    return 'planner';
  }

  getStatus() {
    const agents = this.getAllAgentStates();
    return {
      totalAgents: agents.length,
      idle: agents.filter((a) => a.state === AGENT_STATES.IDLE).length,
      working: agents.filter((a) => a.state !== AGENT_STATES.IDLE).length,
      pendingTasks: this.taskQueue.filter((t) => t.status === 'pending').length,
      completedTasks: this.taskQueue.filter((t) => t.status === 'completed').length,
      totalMessages: this.messageLog.length,
    };
  }
}
