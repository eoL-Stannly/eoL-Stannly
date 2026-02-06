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

export default function KnowledgePanel() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('');

  const filtered = SEO_KNOWLEDGE.filter((d) => {
    const matchesCategory = !activeCategory || d.category === activeCategory;
    const matchesSearch = !searchQuery ||
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.owner.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="knowledge-panel">
      <h3 className="panel-title">
        <span className="panel-icon">&#128218;</span>
        Knowledge Base
        <span className="kb-doc-count">{SEO_KNOWLEDGE.length} docs</span>
      </h3>

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
        {searchQuery && <span> for "{searchQuery}"</span>}
      </div>

      <div className="kb-list">
        {filtered.map((doc) => (
          <div key={doc.id} className="kb-item">
            <div className="kb-item-header">
              <span className="kb-item-title">{doc.title}</span>
              <span className="kb-item-category">{doc.category}</span>
            </div>
            <div className="kb-item-content">{doc.content}</div>
            <div className="kb-item-footer">
              <span className="kb-item-owner">{doc.owner}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
