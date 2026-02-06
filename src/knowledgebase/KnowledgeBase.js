/**
 * Knowledge Base
 * Simple vector-like search over documents that agents can query.
 * In production, replace with a proper vector DB or RAG pipeline.
 */

export class KnowledgeBase {
  constructor() {
    this.documents = new Map();
    this.index = new Map(); // keyword -> Set<docId>
  }

  /**
   * Add a document to the knowledge base
   */
  addDocument(id, title, content, metadata = {}) {
    const doc = {
      id,
      title,
      content,
      metadata,
      addedAt: new Date().toISOString(),
    };
    this.documents.set(id, doc);
    this._indexDocument(doc);
    return doc;
  }

  /**
   * Remove a document
   */
  removeDocument(id) {
    const doc = this.documents.get(id);
    if (doc) {
      this._deindexDocument(doc);
      this.documents.delete(id);
    }
  }

  /**
   * Search the knowledge base by query string
   */
  search(query, maxResults = 5) {
    const keywords = this._tokenize(query);
    const scores = new Map();

    for (const keyword of keywords) {
      const matchingDocs = this.index.get(keyword) || new Set();
      for (const docId of matchingDocs) {
        scores.set(docId, (scores.get(docId) || 0) + 1);
      }
    }

    // Sort by relevance score
    const results = Array.from(scores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, maxResults)
      .map(([docId, score]) => ({
        ...this.documents.get(docId),
        relevanceScore: score / keywords.length,
      }));

    return results;
  }

  /**
   * Get all documents
   */
  getAllDocuments() {
    return Array.from(this.documents.values());
  }

  /**
   * Get document by ID
   */
  getDocument(id) {
    return this.documents.get(id);
  }

  /**
   * Get knowledge base stats
   */
  getStats() {
    return {
      totalDocuments: this.documents.size,
      totalKeywords: this.index.size,
      documents: Array.from(this.documents.values()).map((d) => ({
        id: d.id,
        title: d.title,
        contentLength: d.content.length,
      })),
    };
  }

  /**
   * Load seed documents for demo
   */
  loadSeedData() {
    this.addDocument(
      'arch-overview',
      'System Architecture Overview',
      `The LLM Agents Office system uses a multi-agent architecture where specialized agents
collaborate to complete complex tasks. Each agent has a defined role (planner, researcher,
coder, reviewer, tester, documenter) and communicates through a central orchestrator.
The system uses a knowledge base for grounding agent responses in factual information.`,
      { category: 'architecture' }
    );

    this.addDocument(
      'agent-guidelines',
      'Agent Interaction Guidelines',
      `Agents should follow these interaction guidelines:
1. Always consult the knowledge base before responding
2. Cite sources when making factual claims
3. Delegate tasks outside your expertise to the appropriate specialist
4. Report blockers immediately to the planner agent
5. Celebrate team successes together`,
      { category: 'guidelines' }
    );

    this.addDocument(
      'ralph-loop',
      'Ralph Wiggum Loop Documentation',
      `The Ralph Wiggum loop is a bash-based automation framework that enables continuous
autonomous development cycles. Key features:
- Dual-condition exit gate (heuristic + explicit EXIT_SIGNAL)
- Rate limiting (configurable calls/hour)
- Circuit breaker for stagnation detection
- Session continuity with auto-expiry
- Live monitoring dashboard`,
      { category: 'infrastructure' }
    );

    this.addDocument(
      'coding-standards',
      'Coding Standards and Best Practices',
      `Project coding standards:
- Use ES modules (import/export)
- Prefer functional patterns where possible
- Write descriptive variable names
- Add JSDoc comments for public functions
- Keep functions under 50 lines
- Test all public interfaces`,
      { category: 'standards' }
    );

    this.addDocument(
      'testing-strategy',
      'Testing Strategy',
      `Testing follows a pyramid approach:
- Unit tests for individual functions and components
- Integration tests for agent interactions
- End-to-end tests for complete workflows
- Use assertions that describe expected behavior
- Aim for 80%+ code coverage on critical paths`,
      { category: 'testing' }
    );

    this.addDocument(
      'knowledge-management',
      'Knowledge Base Management',
      `The knowledge base supports:
- Adding documents with title, content, and metadata
- Keyword-based search with relevance scoring
- Document lifecycle management (add, update, remove)
- Agents can query the KB during task processing
- New knowledge can be added by any agent or user`,
      { category: 'infrastructure' }
    );
  }

  // --- Internal methods ---

  _tokenize(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 2);
  }

  _indexDocument(doc) {
    const tokens = new Set([
      ...this._tokenize(doc.title),
      ...this._tokenize(doc.content),
    ]);
    for (const token of tokens) {
      if (!this.index.has(token)) {
        this.index.set(token, new Set());
      }
      this.index.get(token).add(doc.id);
    }
  }

  _deindexDocument(doc) {
    const tokens = new Set([
      ...this._tokenize(doc.title),
      ...this._tokenize(doc.content),
    ]);
    for (const token of tokens) {
      const docIds = this.index.get(token);
      if (docIds) {
        docIds.delete(doc.id);
        if (docIds.size === 0) this.index.delete(token);
      }
    }
  }
}
