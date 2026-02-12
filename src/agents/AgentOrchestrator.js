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
   * Mike (COO) triages, then delegates to the best specialist.
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

    // Mike (COO) triages — find the best specialist
    const mike = this.agents.get('mike');
    mike.state = AGENT_STATES.THINKING;
    mike.lastActivity = new Date().toISOString();

    this.notify({
      type: 'agent_working',
      agentId: 'mike',
      agentName: 'Mike',
      message: `Mike is triaging: "${description}"`,
    });

    // Brief triage delay
    await new Promise((r) => setTimeout(r, 800));

    // Find the best agent for this task
    const bestRole = this.inferRole(description);
    const bestAgent = this.findBestAgent(bestRole);
    const targetId = bestAgent ? bestAgent.id : this._fallbackAgent(description);

    mike.state = AGENT_STATES.IDLE;

    this.notify({
      type: 'agent_assigned',
      agentId: 'mike',
      agentName: 'Mike',
      targetAgentId: targetId,
      targetAgentName: this.agents.get(targetId).name,
      task,
      message: `Mike delegated to ${this.agents.get(targetId).name}`,
    });

    // Assign to the specialist
    await this.assignToAgent(targetId, task);
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

    // Process the task
    await this.processAgentTask(agentId, task);
  }

  /**
   * Identify the task type from the description for SOP/PRD lookup.
   */
  identifyTaskType(description) {
    const desc = description.toLowerCase();
    if (desc.includes('keyword') || desc.includes('research')) return 'keyword-research';
    if (desc.includes('content') || desc.includes('production')) return 'content-production';
    if (desc.includes('redirect') || desc.includes('migration')) return 'redirect-mapping';
    if (desc.includes('performance') || desc.includes('speed') || desc.includes('vitals')) return 'performance-analysis';
    if (desc.includes('technical') || desc.includes('audit')) return 'technical-audit';
    if (desc.includes('internal link')) return 'internal-linking';
    if (desc.includes('hreflang') || desc.includes('international')) return 'hreflang-mapping';
    if (desc.includes('sitemap')) return 'sitemap-production';
    return null;
  }

  /**
   * Retrieve the SOP and PRD documents for a task type from the knowledge base.
   */
  getSOPandPRD(taskType) {
    if (!taskType || !this.knowledgeBase) return { sop: null, prd: null };
    const sop = this.knowledgeBase.getDocument(`sop-${taskType}`);
    const prd = this.knowledgeBase.getDocument(`prd-${taskType}`);
    return { sop, prd };
  }

  /**
   * Process a task with the assigned agent.
   * Queries KB for context, then generates a structured deliverable.
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

    // Identify task type and load SOP/PRD
    const taskType = this.identifyTaskType(task.description);
    const { sop, prd } = this.getSOPandPRD(taskType);

    if (sop || prd) {
      this.notify({
        type: 'sop_loaded',
        agentId,
        agentName: agent.name,
        taskType,
        hasSOP: !!sop,
        hasPRD: !!prd,
        message: `${agent.name} loaded SOP/PRD for ${taskType}`,
      });
    }

    // Query knowledge base for additional context
    const context = this.knowledgeBase
      ? this.knowledgeBase.search(task.description, 5)
      : [];

    // Filter out SOP/PRD from general search results (they're handled separately)
    const generalContext = context.filter(
      (c) => !c.id?.startsWith('sop-') && !c.id?.startsWith('prd-')
    );

    const allDocs = [];
    if (sop) allDocs.push(sop);
    if (prd) allDocs.push(prd);
    allDocs.push(...generalContext);

    if (allDocs.length > 0) {
      this.notify({
        type: 'knowledge_accessed',
        agentId,
        agentName: agent.name,
        documentsFound: allDocs.length,
        documentTitles: allDocs.map((c) => c.title),
        message: `${agent.name} found ${allDocs.length} relevant KB documents`,
      });
    }

    // Build the prompt context
    const prompt = this.buildPrompt(agent, task, allDocs, sop, prd);

    // Store the interaction
    agent.chatHistory.push({
      role: 'user',
      content: task.description,
      context: context.map((c) => c.title),
    });

    // Generate structured response based on role, task, and KB context
    const response = await this.generateResponse(agent, task, allDocs, sop, prd);

    agent.chatHistory.push({
      role: 'assistant',
      content: typeof response === 'string' ? response : JSON.stringify(response),
    });

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
      result: response,
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

  buildPrompt(agent, task, context, sop = null, prd = null) {
    let prompt = `${agent.systemPrompt}\n\n`;

    // Include SOP and PRD as primary context — these define how to do the work
    if (sop) {
      prompt += `## Standard Operating Procedure\nFollow this SOP to complete the task:\n\n${sop.content}\n\n`;
    }

    if (prd) {
      prompt += `## Deliverable Specification (PRD)\nThe output must conform to this PRD:\n\n${prd.content}\n\n`;
    }

    // Include additional KB context
    const generalDocs = context.filter(
      (c) => c.id !== sop?.id && c.id !== prd?.id
    );
    if (generalDocs.length > 0) {
      prompt += `## Relevant Knowledge Base Documents\n`;
      for (const doc of generalDocs) {
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

  /**
   * Generate a structured, meaningful response based on agent expertise,
   * task description, and knowledge base context.
   */
  async generateResponse(agent, task, context, sop = null, prd = null) {
    // Simulate processing time (1-3 seconds)
    await new Promise((r) => setTimeout(r, 1000 + Math.random() * 2000));

    const desc = task.description.toLowerCase();

    // Generate role-specific, task-specific deliverables
    const generators = {
      principal_seo: () => this._generateTechnicalSEO(desc, context, agent),
      coo: () => this._generateOperations(desc, context, agent),
      seo_director: () => this._generateSEOStrategy(desc, context, agent),
      head_of_seo: () => this._generateSEOLeadership(desc, context, agent),
      account_manager: () => this._generateClientReport(desc, context, agent),
      data_engineer: () => this._generateDataAnalysis(desc, context, agent),
    };

    const generator = generators[agent.role] || generators.coo;
    const result = generator();

    // Enrich result with SOP/PRD metadata
    const kbDocs = context.map((c) => c.title);
    if (sop) {
      result.sopFollowed = sop.title;
      if (!kbDocs.includes(sop.title)) kbDocs.push(sop.title);
    }
    if (prd) {
      result.prdConformed = prd.title;
      if (!kbDocs.includes(prd.title)) kbDocs.push(prd.title);
    }

    return {
      agentId: agent.id,
      agentName: agent.name,
      agentRole: agent.title,
      task: task.description,
      timestamp: new Date().toISOString(),
      kbDocumentsUsed: kbDocs,
      ...result,
    };
  }

  _generateTechnicalSEO(desc, context, agent) {
    if (desc.includes('audit') || desc.includes('technical')) {
      return {
        deliverableType: 'Technical SEO Audit',
        summary: 'Comprehensive technical audit covering crawlability, indexation, site speed, and structured data.',
        sections: [
          {
            heading: 'Crawlability & Indexation',
            items: [
              'Robots.txt: Check for blocked critical resources',
              'XML Sitemap: Validate against indexed pages',
              'Crawl budget: Analyse server log files for bot activity',
              'Canonical tags: Audit for self-referencing and cross-domain canonicals',
              'Noindex/nofollow: Review meta robots directives',
            ],
          },
          {
            heading: 'Site Speed & Core Web Vitals',
            items: [
              'LCP (Largest Contentful Paint): Target < 2.5s',
              'FID/INP (Interaction to Next Paint): Target < 200ms',
              'CLS (Cumulative Layout Shift): Target < 0.1',
              'Image optimisation: WebP/AVIF format adoption',
              'JavaScript render blocking: Defer non-critical scripts',
            ],
          },
          {
            heading: 'Structured Data',
            items: [
              'Validate existing schema markup via Schema.org validator',
              'Implement Organisation, BreadcrumbList, FAQ schema',
              'Test rich result eligibility in Google Rich Results Test',
              'Monitor structured data errors in GSC',
            ],
          },
          {
            heading: 'Site Architecture',
            items: [
              'URL structure: Ensure logical hierarchy and clean URLs',
              'Internal linking: Check click depth (target ≤ 3 clicks)',
              'Orphan pages: Identify pages with no internal links',
              'Redirect chains: Flatten to single-hop 301s',
            ],
          },
        ],
        recommendations: [
          { priority: 'High', action: 'Fix crawl errors reported in GSC', impact: 'Improved indexation' },
          { priority: 'High', action: 'Optimise LCP on top landing pages', impact: 'Better Core Web Vitals' },
          { priority: 'Medium', action: 'Implement breadcrumb schema across all pages', impact: 'Enhanced SERP appearance' },
          { priority: 'Medium', action: 'Resolve redirect chains (found in crawl)', impact: 'Preserved link equity' },
          { priority: 'Low', action: 'Add FAQ schema to informational pages', impact: 'Potential featured snippets' },
        ],
        kbContext: context.length > 0
          ? `Referenced ${context.length} KB documents for audit checklist items.`
          : 'Recommend adding technical SEO documentation to KB for future audits.',
      };
    }

    if (desc.includes('performance') || desc.includes('speed') || desc.includes('vitals')) {
      return {
        deliverableType: 'Performance Analysis Report',
        summary: 'Core Web Vitals and page speed analysis with prioritised optimisation roadmap.',
        sections: [
          {
            heading: 'Core Web Vitals Assessment',
            items: [
              'LCP: Audit hero images, server response times, render-blocking resources',
              'INP: Profile long tasks, optimise event handlers, reduce JavaScript execution',
              'CLS: Fix missing image dimensions, stabilise ad slots, preload web fonts',
            ],
          },
          {
            heading: 'Server Performance',
            items: [
              'TTFB (Time to First Byte): Target < 800ms',
              'CDN configuration: Review edge caching rules',
              'HTTP/2 or HTTP/3: Verify multiplexing support',
              'Compression: Ensure Brotli/gzip for all text resources',
            ],
          },
          {
            heading: 'Resource Optimisation',
            items: [
              'Images: Convert to WebP/AVIF, implement responsive srcset',
              'JavaScript: Code-split and lazy-load non-critical bundles',
              'CSS: Extract critical CSS, defer non-critical stylesheets',
              'Fonts: Preload key fonts, use font-display: swap',
            ],
          },
        ],
        recommendations: [
          { priority: 'High', action: 'Optimise hero images on top 20 landing pages', impact: 'LCP improvement 30-50%' },
          { priority: 'High', action: 'Defer third-party scripts below the fold', impact: 'INP improvement' },
          { priority: 'Medium', action: 'Implement Brotli compression server-side', impact: '15-20% smaller transfers' },
          { priority: 'Medium', action: 'Add explicit width/height to all images', impact: 'CLS reduction' },
        ],
        kbContext: context.length > 0
          ? `Referenced ${context.length} KB documents for performance benchmarks.`
          : 'Recommend adding Core Web Vitals baseline data to KB.',
      };
    }

    // Default technical SEO
    return {
      deliverableType: 'Technical SEO Analysis',
      summary: `Technical analysis for: "${desc}"`,
      sections: [
        {
          heading: 'Findings',
          items: [
            'Site crawlability assessment completed',
            'Indexation status reviewed across priority pages',
            'Internal link structure mapped and analysed',
            'Mobile-friendliness and responsive design verified',
          ],
        },
        {
          heading: 'Recommendations',
          items: [
            'Prioritise fixing 4xx/5xx status code errors',
            'Review and consolidate duplicate content',
            'Ensure XML sitemap reflects current site structure',
            'Implement hreflang if serving multilingual content',
          ],
        },
      ],
      recommendations: [
        { priority: 'High', action: 'Resolve critical crawl errors', impact: 'Improved organic visibility' },
        { priority: 'Medium', action: 'Optimise page load performance', impact: 'Better user experience and rankings' },
      ],
      kbContext: context.length > 0
        ? `Referenced ${context.length} KB documents.`
        : 'Consider expanding the technical SEO knowledge base.',
    };
  }

  _generateOperations(desc, context, agent) {
    return {
      deliverableType: 'Operations & Project Plan',
      summary: `Project management plan for: "${desc}"`,
      sections: [
        {
          heading: 'Task Breakdown',
          items: [
            'Phase 1: Discovery and requirements gathering',
            'Phase 2: Research and data collection',
            'Phase 3: Analysis and strategy development',
            'Phase 4: Implementation and execution',
            'Phase 5: Review, QA, and delivery',
          ],
        },
        {
          heading: 'Resource Allocation',
          items: [
            'Rob (Principal SEO): Technical oversight and strategy review',
            'Craig (SEO Director): Content and keyword strategy',
            'Alex/Ken (Data Engineers): Data pipelines and analysis tools',
            'Mya (Account Manager): Client communication and reporting',
            'Ewan (Head of SEO): Quick wins and account review',
          ],
        },
        {
          heading: 'Timeline & Milestones',
          items: [
            'Week 1: Discovery + initial audit',
            'Week 2: Deep analysis + strategy development',
            'Week 3: Implementation + first deliverables',
            'Week 4: Review + optimisation + final delivery',
          ],
        },
      ],
      recommendations: [
        { priority: 'High', action: 'Kick off discovery session with full team', impact: 'Aligned project scope' },
        { priority: 'Medium', action: 'Set up weekly status check-ins', impact: 'On-time delivery' },
        { priority: 'Medium', action: 'Create shared dashboard for progress tracking', impact: 'Transparency' },
      ],
      kbContext: context.length > 0
        ? `Referenced ${context.length} KB documents for project planning.`
        : 'Consider adding project management templates to KB.',
    };
  }

  _generateSEOStrategy(desc, context, agent) {
    if (desc.includes('keyword') || desc.includes('research')) {
      return {
        deliverableType: 'Keyword Research Report',
        summary: 'Comprehensive keyword research with search intent mapping and opportunity analysis.',
        sections: [
          {
            heading: 'Seed Keywords & Expansion',
            items: [
              'Identify primary seed keywords from business objectives',
              'Expand with Google Suggest, People Also Ask, Related Searches',
              'Pull keyword data from GSC (impressions, clicks, avg position)',
              'Cross-reference with competitor keyword profiles',
              'Identify long-tail keyword opportunities with low competition',
            ],
          },
          {
            heading: 'Search Intent Classification',
            items: [
              'Informational: How-to, guides, what-is queries',
              'Navigational: Brand and product-specific searches',
              'Commercial: Comparison, review, best-of queries',
              'Transactional: Buy, price, order queries',
            ],
          },
          {
            heading: 'Topic Cluster Mapping',
            items: [
              'Group keywords into thematic clusters',
              'Identify pillar page opportunities for each cluster',
              'Map supporting content for each pillar',
              'Define internal linking strategy between pillars and clusters',
            ],
          },
          {
            heading: 'Competitive Gap Analysis',
            items: [
              'Identify keywords competitors rank for that we do not',
              'Analyse content quality and depth of competitor pages',
              'Find SERP feature opportunities (featured snippets, PAA)',
              'Prioritise by search volume, difficulty, and business value',
            ],
          },
        ],
        recommendations: [
          { priority: 'High', action: 'Target high-intent commercial keywords first', impact: 'Faster revenue impact' },
          { priority: 'High', action: 'Create pillar content for top 3 topic clusters', impact: 'Topical authority' },
          { priority: 'Medium', action: 'Optimise existing pages for quick-win keywords', impact: 'Ranking improvements in 30 days' },
          { priority: 'Medium', action: 'Build FAQ content targeting PAA opportunities', impact: 'Featured snippet capture' },
        ],
        kbContext: context.length > 0
          ? `Referenced ${context.length} KB documents for keyword strategy framework.`
          : 'Recommend adding keyword research methodology to KB.',
      };
    }

    if (desc.includes('content') || desc.includes('production') || desc.includes('optimise')) {
      return {
        deliverableType: 'Content Strategy & Production Plan',
        summary: 'Content production plan aligned with keyword research and search intent.',
        sections: [
          {
            heading: 'Content Audit',
            items: [
              'Inventory existing content and performance metrics',
              'Identify thin, duplicate, or outdated content',
              'Map content to keyword targets and search intent',
              'Score content quality against E-E-A-T criteria',
            ],
          },
          {
            heading: 'Content Calendar',
            items: [
              'Pillar pages: 1 per topic cluster (2000-3000 words)',
              'Supporting articles: 3-5 per pillar (1000-1500 words)',
              'Blog posts: Weekly topical content (800-1200 words)',
              'Landing pages: Optimised for transactional intent',
            ],
          },
          {
            heading: 'On-Page Optimisation',
            items: [
              'Title tags: Include primary keyword, under 60 characters',
              'Meta descriptions: Compelling CTAs, under 155 characters',
              'H1-H3 hierarchy: Logical structure with keyword variations',
              'Internal links: 3-5 contextual links per article',
              'Image alt text: Descriptive, keyword-relevant alternatives',
            ],
          },
        ],
        recommendations: [
          { priority: 'High', action: 'Update top 10 pages with refreshed content', impact: 'Quick ranking recovery' },
          { priority: 'High', action: 'Produce pillar content for main topic clusters', impact: 'Topical authority boost' },
          { priority: 'Medium', action: 'Add FAQ sections to key landing pages', impact: 'Featured snippet opportunities' },
          { priority: 'Low', action: 'Create video/infographic variants of top content', impact: 'Multi-format engagement' },
        ],
        kbContext: context.length > 0
          ? `Referenced ${context.length} KB documents for content strategy.`
          : 'Recommend adding content guidelines and brand voice to KB.',
      };
    }

    if (desc.includes('link') && !desc.includes('internal')) {
      return {
        deliverableType: 'Link Building Strategy',
        summary: 'Outreach-driven link acquisition plan with prospect lists and templates.',
        sections: [
          {
            heading: 'Current Backlink Profile',
            items: [
              'Audit existing backlinks for quality and relevance',
              'Identify toxic links for disavow consideration',
              'Benchmark Domain Rating/Authority against competitors',
              'Map link gaps: domains linking to competitors but not us',
            ],
          },
          {
            heading: 'Link Building Tactics',
            items: [
              'Digital PR: Newsworthy data studies and expert commentary',
              'Guest posting: Target industry-relevant publications',
              'Broken link building: Find and replace dead links on authority sites',
              'Resource page outreach: Get listed on curated resource pages',
              'HARO / journalist requests: Expert source placements',
            ],
          },
          {
            heading: 'Outreach Plan',
            items: [
              'Build prospect list: 50-100 relevant domains per month',
              'Personalise outreach templates per tactic',
              'Track response rates and conversion metrics',
              'Target 10-20 quality links per month',
            ],
          },
        ],
        recommendations: [
          { priority: 'High', action: 'Launch digital PR campaign with data study', impact: 'High-authority links at scale' },
          { priority: 'Medium', action: 'Begin broken link building outreach', impact: 'Steady link acquisition' },
          { priority: 'Medium', action: 'Set up journalist request monitoring', impact: 'Opportunistic placements' },
        ],
        kbContext: context.length > 0
          ? `Referenced ${context.length} KB documents for link building strategy.`
          : 'Recommend adding link building playbooks to KB.',
      };
    }

    // Default SEO director response
    return {
      deliverableType: 'SEO Strategy Document',
      summary: `Strategic SEO analysis for: "${desc}"`,
      sections: [
        {
          heading: 'Current State Assessment',
          items: [
            'Organic visibility and ranking distribution',
            'Content coverage vs competitor landscape',
            'Technical health score and critical issues',
            'Backlink profile strength and growth trend',
          ],
        },
        {
          heading: 'Strategic Recommendations',
          items: [
            'Prioritise content gaps with highest search volume',
            'Implement technical fixes blocking indexation',
            'Launch targeted link building campaigns',
            'Establish regular performance monitoring cadence',
          ],
        },
      ],
      recommendations: [
        { priority: 'High', action: 'Address critical technical issues first', impact: 'Foundation for growth' },
        { priority: 'Medium', action: 'Develop content plan aligned with business goals', impact: 'Sustainable traffic growth' },
      ],
      kbContext: context.length > 0
        ? `Referenced ${context.length} KB documents.`
        : 'Recommend adding strategic SEO frameworks to KB.',
    };
  }

  _generateSEOLeadership(desc, context, agent) {
    if (desc.includes('internal link')) {
      return {
        deliverableType: 'Internal Linking Audit & Strategy',
        summary: 'Comprehensive internal link analysis with optimisation recommendations.',
        sections: [
          {
            heading: 'Current Internal Link Analysis',
            items: [
              'Map full internal link graph from crawl data',
              'Identify orphan pages (zero internal links pointing to them)',
              'Calculate PageRank distribution across key sections',
              'Measure average click depth from homepage',
              'Find pages with excessive outgoing internal links (>100)',
            ],
          },
          {
            heading: 'Optimisation Opportunities',
            items: [
              'Add contextual links from high-authority pages to target pages',
              'Create hub pages linking to related content clusters',
              'Fix broken internal links (404s)',
              'Update anchor text to include target keywords naturally',
              'Implement breadcrumb navigation with schema markup',
            ],
          },
          {
            heading: 'Quick Wins',
            items: [
              'Link from top 10 traffic pages to underperforming targets',
              'Add "Related Articles" sections to blog posts',
              'Update navigation menus to surface priority pages',
              'Fix redirect chains in internal links (2+ hops)',
            ],
          },
        ],
        recommendations: [
          { priority: 'High', action: 'Fix orphan pages by adding internal links', impact: 'Improved crawlability and indexation' },
          { priority: 'High', action: 'Link from top pages to conversion pages', impact: 'Increased conversions' },
          { priority: 'Medium', action: 'Implement contextual linking in blog content', impact: 'Better PageRank flow' },
          { priority: 'Low', action: 'Add breadcrumb schema site-wide', impact: 'Enhanced SERP display' },
        ],
        kbContext: context.length > 0
          ? `Referenced ${context.length} KB documents for internal linking best practices.`
          : 'Recommend adding internal linking guidelines to KB.',
      };
    }

    // Default: quick wins and account review
    return {
      deliverableType: 'Quick Wins & Account Review',
      summary: `Account review with prioritised quick wins for: "${desc}"`,
      sections: [
        {
          heading: 'Quick Win Opportunities',
          items: [
            'Title tag optimisation for pages ranking positions 4-10',
            'Meta description updates for pages with low CTR',
            'Internal link additions to boost underperforming pages',
            'Image alt text and file name optimisation',
            'Schema markup implementation on key pages',
            'Broken link fixes (internal 404s)',
          ],
        },
        {
          heading: 'Account Health Summary',
          items: [
            'Organic traffic trend: Review 90-day trajectory',
            'Ranking movements: Track priority keyword shifts',
            'Indexation status: Pages indexed vs submitted',
            'Core Web Vitals: Pass/fail by page type',
          ],
        },
      ],
      recommendations: [
        { priority: 'High', action: 'Optimise title tags for position 4-10 keywords', impact: 'CTR improvement 20-40%' },
        { priority: 'High', action: 'Fix all internal 404 errors', impact: 'Improved crawl efficiency' },
        { priority: 'Medium', action: 'Add FAQ schema to informational pages', impact: 'SERP feature capture' },
      ],
      kbContext: context.length > 0
        ? `Referenced ${context.length} KB documents for quick win analysis.`
        : 'Recommend adding account review templates to KB.',
    };
  }

  _generateClientReport(desc, context, agent) {
    return {
      deliverableType: 'Client Report & Campaign Update',
      summary: `Client-facing report for: "${desc}"`,
      sections: [
        {
          heading: 'Executive Summary',
          items: [
            'Campaign objectives and progress overview',
            'Key performance highlights this period',
            'Strategic focus areas for next period',
          ],
        },
        {
          heading: 'Performance Metrics',
          items: [
            'Organic sessions: Month-over-month and year-over-year trends',
            'Keyword rankings: Distribution and movement summary',
            'Conversions from organic: Lead/revenue attribution',
            'Page-level performance: Top gaining and declining pages',
          ],
        },
        {
          heading: 'Work Completed',
          items: [
            'Technical fixes implemented and verified',
            'Content published and optimised',
            'Links acquired and outreach progress',
            'Reporting and monitoring updates',
          ],
        },
        {
          heading: 'Next Steps',
          items: [
            'Priority actions for the coming period',
            'Upcoming content calendar items',
            'Technical backlog priorities',
            'Client action items and approvals needed',
          ],
        },
      ],
      recommendations: [
        { priority: 'High', action: 'Review and approve content calendar for next month', impact: 'On-time content delivery' },
        { priority: 'Medium', action: 'Provide access to updated GA4 property', impact: 'Accurate reporting' },
        { priority: 'Medium', action: 'Schedule quarterly strategy review', impact: 'Aligned objectives' },
      ],
      kbContext: context.length > 0
        ? `Referenced ${context.length} KB documents for report framework.`
        : 'Recommend adding reporting templates to KB.',
    };
  }

  _generateDataAnalysis(desc, context, agent) {
    if (desc.includes('redirect') || desc.includes('migration')) {
      return {
        deliverableType: 'Redirect Mapping Document',
        summary: 'Redirect mapping plan for site migration or URL restructuring.',
        sections: [
          {
            heading: 'Pre-Migration Audit',
            items: [
              'Crawl current site to capture all live URLs',
              'Export top-performing pages from GSC (clicks, impressions)',
              'Identify pages with backlinks using Ahrefs/Moz',
              'Map current URL structure and taxonomy',
              'Benchmark current organic traffic and rankings',
            ],
          },
          {
            heading: 'Redirect Rules',
            items: [
              'Map each old URL to its new destination (1:1 where possible)',
              'Use 301 (permanent) redirects for all URL changes',
              'Avoid redirect chains: old → new directly (no intermediaries)',
              'Handle parameter URLs and trailing slash variations',
              'Create pattern-based rules for bulk URL migrations',
            ],
          },
          {
            heading: 'Post-Migration Checklist',
            items: [
              'Verify all redirects resolve correctly (200 at destination)',
              'Submit updated XML sitemap to GSC',
              'Monitor crawl errors in GSC daily for 30 days',
              'Track keyword rankings for priority pages weekly',
              'Compare organic traffic 30/60/90 days post-migration',
            ],
          },
        ],
        recommendations: [
          { priority: 'High', action: 'Complete full URL mapping before migration', impact: 'Prevent traffic loss' },
          { priority: 'High', action: 'Test all redirect rules in staging first', impact: 'Avoid broken redirects' },
          { priority: 'Medium', action: 'Update internal links to point to new URLs directly', impact: 'Avoid redirect chains' },
          { priority: 'Medium', action: 'Notify Google of site move via GSC', impact: 'Faster re-indexation' },
        ],
        kbContext: context.length > 0
          ? `Referenced ${context.length} KB documents for redirect mapping best practices.`
          : 'Recommend adding migration checklists to KB.',
      };
    }

    if (desc.includes('hreflang')) {
      return {
        deliverableType: 'HREFLANG Implementation Map',
        summary: 'HREFLANG tag mapping for international SEO targeting.',
        sections: [
          {
            heading: 'Language/Region Mapping',
            items: [
              'Inventory all language/region variants of the site',
              'Define hreflang codes: e.g. en-gb, en-us, fr-fr, de-de',
              'Map each page to its equivalent in other languages',
              'Identify x-default for fallback targeting',
            ],
          },
          {
            heading: 'Implementation Method',
            items: [
              'Option A: HTML link tags in <head> (best for small sites)',
              'Option B: HTTP headers (best for non-HTML resources)',
              'Option C: XML sitemap hreflang entries (best for large sites)',
              'Ensure reciprocal hreflang tags (bidirectional)',
            ],
          },
          {
            heading: 'Validation & Monitoring',
            items: [
              'Validate hreflang using Google Search Console International Targeting report',
              'Check for common errors: missing return tags, incorrect codes, self-referencing',
              'Monitor international search performance by country',
              'Audit quarterly for new pages missing hreflang',
            ],
          },
        ],
        recommendations: [
          { priority: 'High', action: 'Implement hreflang via XML sitemap for scalability', impact: 'Correct geo-targeting' },
          { priority: 'High', action: 'Ensure all return tags are reciprocal', impact: 'Avoid hreflang errors' },
          { priority: 'Medium', action: 'Set x-default to main English version', impact: 'Fallback for unmatched regions' },
        ],
        kbContext: context.length > 0
          ? `Referenced ${context.length} KB documents for hreflang implementation.`
          : 'Recommend adding international SEO guides to KB.',
      };
    }

    if (desc.includes('sitemap')) {
      return {
        deliverableType: 'Sitemap Production & Validation Report',
        summary: 'XML sitemap generation, validation, and submission plan.',
        sections: [
          {
            heading: 'Sitemap Audit',
            items: [
              'Review current sitemap.xml for completeness and accuracy',
              'Compare sitemap URLs against crawl data',
              'Remove non-indexable URLs (noindex, 404, 301)',
              'Check lastmod dates are accurate and meaningful',
              'Verify sitemap is under 50MB / 50,000 URLs per file',
            ],
          },
          {
            heading: 'Sitemap Structure',
            items: [
              'Create sitemap index file for sites with multiple sitemaps',
              'Segment sitemaps by content type (pages, blog, products, images)',
              'Include priority and changefreq signals',
              'Add image and video sitemaps if applicable',
            ],
          },
          {
            heading: 'Submission & Monitoring',
            items: [
              'Submit sitemaps via GSC and robots.txt reference',
              'Monitor indexation rate: submitted vs indexed',
              'Set up alerts for sitemap errors in GSC',
              'Automate sitemap regeneration on content changes',
            ],
          },
        ],
        recommendations: [
          { priority: 'High', action: 'Remove all non-200 URLs from sitemap', impact: 'Clean indexation signals' },
          { priority: 'Medium', action: 'Implement dynamic sitemap generation', impact: 'Always up-to-date' },
          { priority: 'Medium', action: 'Submit sitemap index to GSC', impact: 'Faster discovery of new pages' },
        ],
        kbContext: context.length > 0
          ? `Referenced ${context.length} KB documents for sitemap best practices.`
          : 'Recommend adding sitemap templates to KB.',
      };
    }

    // Default data/analytics response
    return {
      deliverableType: 'Data Analysis Report',
      summary: `Data analysis for: "${desc}"`,
      sections: [
        {
          heading: 'Data Collection',
          items: [
            'GSC API: Search queries, impressions, clicks, positions',
            'GA4: Organic sessions, user behaviour, conversions',
            'Crawl data: URLs, status codes, page speed metrics',
            'Backlink data: Referring domains, anchor text distribution',
          ],
        },
        {
          heading: 'Analysis & Insights',
          items: [
            'Traffic trend analysis with seasonal adjustments',
            'Keyword opportunity scoring (volume × CTR potential × relevance)',
            'Content performance segmentation by type and topic',
            'Technical health scoring by page template',
          ],
        },
        {
          heading: 'Data Pipeline',
          items: [
            'Automated daily data pulls from GSC and GA4',
            'Weekly crawl and ranking snapshots',
            'Monthly competitive benchmarking reports',
            'Real-time alerting for traffic drops > 10%',
          ],
        },
      ],
      recommendations: [
        { priority: 'High', action: 'Set up automated GSC data pipeline', impact: 'Consistent data for decision-making' },
        { priority: 'Medium', action: 'Build keyword opportunity scoring model', impact: 'Prioritised content investment' },
        { priority: 'Low', action: 'Create automated monthly report template', impact: 'Reduced manual reporting time' },
      ],
      kbContext: context.length > 0
        ? `Referenced ${context.length} KB documents for analysis methodology.`
        : 'Recommend adding data analysis playbooks to KB.',
    };
  }

  findBestAgent(role) {
    // Prefer idle agents, but accept any agent with matching role
    const idle = Array.from(this.agents.values()).filter(
      (a) => a.role === role && a.state === AGENT_STATES.IDLE
    );
    if (idle.length > 0) return idle[0];

    // Fallback: any agent with matching role
    const any = Array.from(this.agents.values()).filter((a) => a.role === role);
    return any[0] || null;
  }

  _fallbackAgent(description) {
    // If no role match found, pick based on keyword hints
    const desc = description.toLowerCase();
    if (desc.includes('technical') || desc.includes('audit') || desc.includes('speed') || desc.includes('architecture'))
      return 'rob';
    if (desc.includes('keyword') || desc.includes('content') || desc.includes('on-page'))
      return 'craig';
    if (desc.includes('local') || desc.includes('gbp') || desc.includes('eeat'))
      return 'leo';
    if (desc.includes('data') || desc.includes('analytics') || desc.includes('pipeline') || desc.includes('redirect') || desc.includes('sitemap') || desc.includes('hreflang'))
      return 'alex';
    if (desc.includes('link') || desc.includes('quick win'))
      return 'ewan';
    if (desc.includes('client') || desc.includes('report'))
      return 'mya';
    return 'ewan'; // Ewan as general fallback
  }

  inferRole(description) {
    const lower = description.toLowerCase();
    if (lower.includes('technical') || lower.includes('crawl') || lower.includes('architecture') || lower.includes('speed') || lower.includes('core web vitals') || lower.includes('audit'))
      return 'principal_seo';
    if (lower.includes('keyword') || lower.includes('content') || lower.includes('on-page') || lower.includes('topic cluster'))
      return 'seo_director';
    if (lower.includes('local') || lower.includes('gbp') || lower.includes('citation') || lower.includes('eeat'))
      return 'seo_director';
    if (lower.includes('data') || lower.includes('analytics') || lower.includes('pipeline') || lower.includes('dashboard') || lower.includes('scrape') || lower.includes('redirect') || lower.includes('sitemap') || lower.includes('hreflang'))
      return 'data_engineer';
    if (lower.includes('link') || lower.includes('outreach') || lower.includes('quick win') || lower.includes('internal link'))
      return 'head_of_seo';
    if (lower.includes('client') || lower.includes('report') || lower.includes('campaign'))
      return 'account_manager';
    return 'coo';
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
