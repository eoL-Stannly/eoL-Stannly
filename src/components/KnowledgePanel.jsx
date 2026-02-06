import React, { useState } from 'react';

const SEED_DOCS = [
  {
    id: 'arch-overview',
    title: 'System Architecture Overview',
    content: 'Multi-agent architecture with specialized roles collaborating through a central orchestrator.',
    category: 'architecture',
  },
  {
    id: 'agent-guidelines',
    title: 'Agent Interaction Guidelines',
    content: 'Agents consult KB, cite sources, delegate appropriately, report blockers, celebrate wins.',
    category: 'guidelines',
  },
  {
    id: 'ralph-loop',
    title: 'Ralph Wiggum Loop Documentation',
    content: 'Bash-based automation framework: dual-condition exit, rate limiting, circuit breaker, session continuity.',
    category: 'infrastructure',
  },
  {
    id: 'coding-standards',
    title: 'Coding Standards',
    content: 'ES modules, functional patterns, descriptive names, JSDoc, <50 line functions, test all public APIs.',
    category: 'standards',
  },
  {
    id: 'testing-strategy',
    title: 'Testing Strategy',
    content: 'Test pyramid: unit, integration, e2e. Descriptive assertions. 80%+ coverage on critical paths.',
    category: 'testing',
  },
  {
    id: 'knowledge-management',
    title: 'Knowledge Base Management',
    content: 'Supports add/search/remove documents. Keyword search with relevance scoring. Agent-queryable.',
    category: 'infrastructure',
  },
];

export default function KnowledgePanel() {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = searchQuery
    ? SEED_DOCS.filter(
        (d) =>
          d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : SEED_DOCS;

  return (
    <div className="knowledge-panel">
      <h3 className="panel-title">
        <span className="panel-icon">📚</span>
        Knowledge Base
      </h3>

      <div className="kb-search">
        <input
          type="text"
          className="kb-search-input"
          placeholder="Search knowledge base..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="kb-stats">
        <span>{SEED_DOCS.length} documents</span>
        {searchQuery && <span> · {filtered.length} matches</span>}
      </div>

      <div className="kb-list">
        {filtered.map((doc) => (
          <div key={doc.id} className="kb-item">
            <div className="kb-item-header">
              <span className="kb-item-title">{doc.title}</span>
              <span className="kb-item-category">{doc.category}</span>
            </div>
            <div className="kb-item-content">{doc.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
