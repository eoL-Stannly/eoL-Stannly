import React, { useState } from 'react';

const SEO_KNOWLEDGE = [
  {
    id: 'site-architecture',
    title: 'Site Architecture & Crawlability',
    content: 'Crawl budget optimization, URL structure, internal linking, XML sitemaps. Foundation of technical SEO ensuring search engines can discover and index all important content.',
    category: 'technical-seo',
    owner: 'Rob',
  },
  {
    id: 'core-web-vitals',
    title: 'Core Web Vitals & Page Experience',
    content: 'LCP (under 2.5s), INP (under 200ms), CLS (under 0.1). Google ranking signal measuring real-world user experience. Measured via CrUX field data.',
    category: 'technical-seo',
    owner: 'Rob',
  },
  {
    id: 'indexation-management',
    title: 'Indexation Management',
    content: 'Meta robots tags, canonical tags, robots.txt, GSC index coverage. Managing what Google indexes to prevent crawl waste and duplicate content issues.',
    category: 'technical-seo',
    owner: 'Rob',
  },
  {
    id: 'structured-data',
    title: 'Structured Data & Schema Markup',
    content: 'JSON-LD implementation for Organization, Article, Product, FAQ, BreadcrumbList, Review schema. Unlocks rich results in SERPs.',
    category: 'technical-seo',
    owner: 'Rob',
  },
  {
    id: 'keyword-research',
    title: 'Keyword Research & Search Intent',
    content: 'Search intent mapping (informational, navigational, commercial, transactional), keyword expansion, clustering, and prioritization framework.',
    category: 'content-strategy',
    owner: 'Craig',
  },
  {
    id: 'on-page-optimization',
    title: 'On-Page SEO Optimization',
    content: 'Title tags, meta descriptions, heading structure, content optimization, image optimization, internal linking, URL optimization.',
    category: 'content-strategy',
    owner: 'Craig',
  },
  {
    id: 'topic-clusters',
    title: 'Topic Clusters & Content Architecture',
    content: 'Pillar pages + cluster pages strategy. Build topical authority through comprehensive coverage with tight internal linking patterns.',
    category: 'content-strategy',
    owner: 'Craig',
  },
  {
    id: 'google-business-profile',
    title: 'Google Business Profile Optimization',
    content: 'GBP setup, categories, photos, posts, reviews, Q&A, products/services. Cornerstone of local SEO for Maps and local pack rankings.',
    category: 'local-seo',
    owner: 'Leo',
  },
  {
    id: 'eeat-signals',
    title: 'E-E-A-T: Experience, Expertise, Authority, Trust',
    content: 'Author pages, content signals, site-level trust signals, YMYL considerations. Google quality framework for evaluating content credibility.',
    category: 'local-seo',
    owner: 'Leo',
  },
  {
    id: 'citation-building',
    title: 'Citation Building & Local Links',
    content: 'NAP consistency, structured/unstructured citations, core platforms (Google, Bing, Apple, Yelp), local link acquisition strategies.',
    category: 'local-seo',
    owner: 'Leo',
  },
  {
    id: 'gsc-analytics',
    title: 'Google Search Console & Analytics',
    content: 'Performance reports, index coverage, Core Web Vitals, links report, GSC API. GA4 integration for organic traffic analysis and reporting.',
    category: 'data-analytics',
    owner: 'Alex',
  },
  {
    id: 'log-file-analysis',
    title: 'Log File Analysis for SEO',
    content: 'Server log analysis reveals real bot crawl behavior. Track Googlebot crawl distribution, frequency, status codes, and response times.',
    category: 'data-analytics',
    owner: 'Alex',
  },
  {
    id: 'seo-data-pipelines',
    title: 'SEO Data Pipelines & Automation',
    content: 'ETL from GSC, GA4, Ahrefs, Semrush APIs. BigQuery warehousing, Looker Studio dashboards, automated daily/weekly/monthly reports.',
    category: 'data-analytics',
    owner: 'Ken',
  },
  {
    id: 'link-building',
    title: 'Link Building Strategies',
    content: 'Digital PR, content-led link building, broken link building, competitor analysis, guest posting, unlinked brand mentions. Outreach best practices.',
    category: 'link-building',
    owner: 'Ewan',
  },
  {
    id: 'project-management',
    title: 'SEO Project Management',
    content: 'Client onboarding, discovery audits, strategy development, task prioritization (impact vs effort), reporting cadence, team coordination.',
    category: 'operations',
    owner: 'Mike',
  },
];

const CATEGORIES = [
  { value: '', label: 'All' },
  { value: 'technical-seo', label: 'Technical SEO' },
  { value: 'content-strategy', label: 'Content Strategy' },
  { value: 'local-seo', label: 'Local SEO' },
  { value: 'data-analytics', label: 'Data & Analytics' },
  { value: 'link-building', label: 'Link Building' },
  { value: 'operations', label: 'Operations' },
];

const OWNERS = ['Rob', 'Mike', 'Craig', 'Leo', 'Ewan', 'Mya', 'Alex', 'Ken'];

const FILE_TREE = [
  {
    folder: 'technical-seo',
    label: 'Technical SEO',
    icon: '\u2699',
    files: ['site-architecture', 'core-web-vitals', 'indexation-management', 'structured-data'],
  },
  {
    folder: 'content-strategy',
    label: 'Content Strategy',
    icon: '\u270D',
    files: ['keyword-research', 'on-page-optimization', 'topic-clusters'],
  },
  {
    folder: 'local-seo',
    label: 'Local SEO',
    icon: '\uD83D\uDCCD',
    files: ['google-business-profile', 'eeat-signals', 'citation-building'],
  },
  {
    folder: 'data-analytics',
    label: 'Data & Analytics',
    icon: '\uD83D\uDCCA',
    files: ['gsc-analytics', 'log-file-analysis', 'seo-data-pipelines'],
  },
  {
    folder: 'link-building',
    label: 'Link Building',
    icon: '\uD83D\uDD17',
    files: ['link-building-strategies'],
  },
  {
    folder: 'operations',
    label: 'Operations',
    icon: '\uD83D\uDCCB',
    files: ['seo-project-management'],
  },
];

export default function KnowledgePanel() {
  const [docs, setDocs] = useState(SEO_KNOWLEDGE);
  const [view, setView] = useState('search'); // search | tree | add
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [expandedDoc, setExpandedDoc] = useState(null);

  // Add form state
  const [addTitle, setAddTitle] = useState('');
  const [addContent, setAddContent] = useState('');
  const [addCategory, setAddCategory] = useState('technical-seo');
  const [addOwner, setAddOwner] = useState('Rob');

  // Tree state
  const [expandedFolders, setExpandedFolders] = useState({});
  const [treeSelectedDoc, setTreeSelectedDoc] = useState(null);

  const filtered = docs.filter((d) => {
    const matchesCategory = !activeCategory || d.category === activeCategory;
    const matchesSearch = !searchQuery ||
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.owner.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddDoc = (e) => {
    e.preventDefault();
    if (!addTitle.trim() || !addContent.trim()) return;
    const newDoc = {
      id: `doc_${Date.now()}`,
      title: addTitle.trim(),
      content: addContent.trim(),
      category: addCategory,
      owner: addOwner,
    };
    setDocs((prev) => [newDoc, ...prev]);
    setAddTitle('');
    setAddContent('');
    setAddCategory('technical-seo');
    setAddOwner('Rob');
    setView('search');
  };

  const toggleFolder = (folder) => {
    setExpandedFolders((prev) => ({ ...prev, [folder]: !prev[folder] }));
  };

  const getDocById = (id) => docs.find((d) => d.id === id);

  const getDocsByFolder = (folder) => docs.filter((d) => d.category === folder);

  return (
    <div className="knowledge-panel">
      <h3 className="panel-title">
        <span className="panel-icon">&#128218;</span>
        Knowledge Base
        <span className="kb-doc-count">{docs.length} docs</span>
      </h3>

      {/* Sub-navigation tabs */}
      <div className="kb-view-tabs">
        <button
          className={`kb-view-tab ${view === 'search' ? 'kb-view-active' : ''}`}
          onClick={() => setView('search')}
        >
          &#128269; Search
        </button>
        <button
          className={`kb-view-tab ${view === 'tree' ? 'kb-view-active' : ''}`}
          onClick={() => setView('tree')}
        >
          &#128193; Browse
        </button>
        <button
          className={`kb-view-tab ${view === 'add' ? 'kb-view-active' : ''}`}
          onClick={() => setView('add')}
        >
          &#10010; Add
        </button>
      </div>

      {/* ===== SEARCH VIEW ===== */}
      {view === 'search' && (
        <>
          <div className="kb-search">
            <input
              type="text"
              className="kb-search-input"
              placeholder="Search SEO knowledge..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="kb-categories">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                className={`kb-cat-btn ${activeCategory === cat.value ? 'kb-cat-active' : ''}`}
                onClick={() => setActiveCategory(cat.value)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="kb-stats">
            <span>{filtered.length} results</span>
            {searchQuery && <span> for &quot;{searchQuery}&quot;</span>}
          </div>

          <div className="kb-list">
            {filtered.map((doc) => (
              <div
                key={doc.id}
                className={`kb-item ${expandedDoc === doc.id ? 'kb-item-expanded' : ''}`}
                onClick={() => setExpandedDoc(expandedDoc === doc.id ? null : doc.id)}
              >
                <div className="kb-item-header">
                  <span className="kb-item-title">{doc.title}</span>
                  <span className="kb-item-category">{doc.category}</span>
                </div>
                <div className="kb-item-content">
                  {expandedDoc === doc.id ? doc.content : doc.content.slice(0, 80) + (doc.content.length > 80 ? '...' : '')}
                </div>
                {expandedDoc === doc.id && (
                  <div className="kb-item-meta">
                    <span className="kb-meta-tag">&#128194; {doc.category}</span>
                    <span className="kb-meta-tag">&#128100; {doc.owner}</span>
                    <span className="kb-meta-tag">ID: {doc.id}</span>
                  </div>
                )}
                <div className="kb-item-footer">
                  <span className="kb-item-owner">{doc.owner}</span>
                  <span className="kb-expand-hint">{expandedDoc === doc.id ? '▲' : '▼'}</span>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="kb-empty">No documents found.</div>
            )}
          </div>
        </>
      )}

      {/* ===== FILE TREE VIEW ===== */}
      {view === 'tree' && (
        <div className="kb-tree">
          <div className="kb-tree-header">
            <span className="kb-tree-root">&#128193; knowledge/</span>
          </div>
          <div className="kb-tree-list">
            {FILE_TREE.map((folder) => {
              const folderDocs = getDocsByFolder(folder.folder);
              const isOpen = expandedFolders[folder.folder];
              return (
                <div key={folder.folder} className="kb-tree-folder">
                  <div
                    className={`kb-tree-folder-header ${isOpen ? 'kb-folder-open' : ''}`}
                    onClick={() => toggleFolder(folder.folder)}
                  >
                    <span className="kb-folder-arrow">{isOpen ? '▼' : '▶'}</span>
                    <span className="kb-folder-icon">{folder.icon}</span>
                    <span className="kb-folder-name">{folder.label}/</span>
                    <span className="kb-folder-count">{folderDocs.length}</span>
                  </div>
                  {isOpen && (
                    <div className="kb-tree-files">
                      {folderDocs.map((doc) => (
                        <div
                          key={doc.id}
                          className={`kb-tree-file ${treeSelectedDoc === doc.id ? 'kb-tree-file-selected' : ''}`}
                          onClick={() => setTreeSelectedDoc(treeSelectedDoc === doc.id ? null : doc.id)}
                        >
                          <span className="kb-file-icon">&#128196;</span>
                          <span className="kb-file-name">{doc.id}.md</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Document preview pane */}
          {treeSelectedDoc && (() => {
            const doc = getDocById(treeSelectedDoc);
            if (!doc) return null;
            return (
              <div className="kb-tree-preview">
                <div className="kb-preview-header">
                  <span className="kb-preview-title">{doc.title}</span>
                  <button className="kb-preview-close" onClick={() => setTreeSelectedDoc(null)}>&#10005;</button>
                </div>
                <div className="kb-preview-meta">
                  <span className="kb-meta-tag">&#128194; {doc.category}</span>
                  <span className="kb-meta-tag">&#128100; {doc.owner}</span>
                </div>
                <div className="kb-preview-content">{doc.content}</div>
                <div className="kb-preview-path">knowledge/{doc.category}/{doc.id}.md</div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ===== ADD DOCUMENT VIEW ===== */}
      {view === 'add' && (
        <form className="kb-add-form" onSubmit={handleAddDoc}>
          <div className="kb-form-group">
            <label className="kb-form-label">Title</label>
            <input
              type="text"
              className="kb-form-input"
              placeholder="Document title..."
              value={addTitle}
              onChange={(e) => setAddTitle(e.target.value)}
              required
            />
          </div>

          <div className="kb-form-group">
            <label className="kb-form-label">Content</label>
            <textarea
              className="kb-form-textarea"
              placeholder="Document content..."
              value={addContent}
              onChange={(e) => setAddContent(e.target.value)}
              rows={5}
              required
            />
          </div>

          <div className="kb-form-row">
            <div className="kb-form-group kb-form-half">
              <label className="kb-form-label">Category</label>
              <select
                className="kb-form-select"
                value={addCategory}
                onChange={(e) => setAddCategory(e.target.value)}
              >
                {CATEGORIES.filter((c) => c.value).map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div className="kb-form-group kb-form-half">
              <label className="kb-form-label">Owner</label>
              <select
                className="kb-form-select"
                value={addOwner}
                onChange={(e) => setAddOwner(e.target.value)}
              >
                {OWNERS.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" className="kb-form-submit">
            &#10010; Add to Knowledge Base
          </button>
        </form>
      )}
    </div>
  );
}
