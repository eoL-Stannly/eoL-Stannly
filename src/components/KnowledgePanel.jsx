import React, { useState, useRef } from 'react';

const SEO_KNOWLEDGE = [
  {
    id: 'site-architecture',
    title: 'Site Architecture & Crawlability',
    content: 'Crawl budget optimization, URL structure, internal linking, XML sitemaps. Foundation of technical SEO ensuring search engines can discover and index all important content.',
    category: 'technical-seo',
    owner: 'Rob',
    source: 'seed',
  },
  {
    id: 'core-web-vitals',
    title: 'Core Web Vitals & Page Experience',
    content: 'LCP (under 2.5s), INP (under 200ms), CLS (under 0.1). Google ranking signal measuring real-world user experience. Measured via CrUX field data.',
    category: 'technical-seo',
    owner: 'Rob',
    source: 'seed',
  },
  {
    id: 'indexation-management',
    title: 'Indexation Management',
    content: 'Meta robots tags, canonical tags, robots.txt, GSC index coverage. Managing what Google indexes to prevent crawl waste and duplicate content issues.',
    category: 'technical-seo',
    owner: 'Rob',
    source: 'seed',
  },
  {
    id: 'structured-data',
    title: 'Structured Data & Schema Markup',
    content: 'JSON-LD implementation for Organization, Article, Product, FAQ, BreadcrumbList, Review schema. Unlocks rich results in SERPs.',
    category: 'technical-seo',
    owner: 'Rob',
    source: 'seed',
  },
  {
    id: 'keyword-research',
    title: 'Keyword Research & Search Intent',
    content: 'Search intent mapping (informational, navigational, commercial, transactional), keyword expansion, clustering, and prioritization framework.',
    category: 'content-strategy',
    owner: 'Craig',
    source: 'seed',
  },
  {
    id: 'on-page-optimization',
    title: 'On-Page SEO Optimization',
    content: 'Title tags, meta descriptions, heading structure, content optimization, image optimization, internal linking, URL optimization.',
    category: 'content-strategy',
    owner: 'Craig',
    source: 'seed',
  },
  {
    id: 'topic-clusters',
    title: 'Topic Clusters & Content Architecture',
    content: 'Pillar pages + cluster pages strategy. Build topical authority through comprehensive coverage with tight internal linking patterns.',
    category: 'content-strategy',
    owner: 'Craig',
    source: 'seed',
  },
  {
    id: 'google-business-profile',
    title: 'Google Business Profile Optimization',
    content: 'GBP setup, categories, photos, posts, reviews, Q&A, products/services. Cornerstone of local SEO for Maps and local pack rankings.',
    category: 'local-seo',
    owner: 'Leo',
    source: 'seed',
  },
  {
    id: 'eeat-signals',
    title: 'E-E-A-T: Experience, Expertise, Authority, Trust',
    content: 'Author pages, content signals, site-level trust signals, YMYL considerations. Google quality framework for evaluating content credibility.',
    category: 'local-seo',
    owner: 'Leo',
    source: 'seed',
  },
  {
    id: 'citation-building',
    title: 'Citation Building & Local Links',
    content: 'NAP consistency, structured/unstructured citations, core platforms (Google, Bing, Apple, Yelp), local link acquisition strategies.',
    category: 'local-seo',
    owner: 'Leo',
    source: 'seed',
  },
  {
    id: 'gsc-analytics',
    title: 'Google Search Console & Analytics',
    content: 'Performance reports, index coverage, Core Web Vitals, links report, GSC API. GA4 integration for organic traffic analysis and reporting.',
    category: 'data-analytics',
    owner: 'Alex',
    source: 'seed',
  },
  {
    id: 'log-file-analysis',
    title: 'Log File Analysis for SEO',
    content: 'Server log analysis reveals real bot crawl behavior. Track Googlebot crawl distribution, frequency, status codes, and response times.',
    category: 'data-analytics',
    owner: 'Alex',
    source: 'seed',
  },
  {
    id: 'seo-data-pipelines',
    title: 'SEO Data Pipelines & Automation',
    content: 'ETL from GSC, GA4, Ahrefs, Semrush APIs. BigQuery warehousing, Looker Studio dashboards, automated daily/weekly/monthly reports.',
    category: 'data-analytics',
    owner: 'Ken',
    source: 'seed',
  },
  {
    id: 'link-building',
    title: 'Link Building Strategies',
    content: 'Digital PR, content-led link building, broken link building, competitor analysis, guest posting, unlinked brand mentions. Outreach best practices.',
    category: 'link-building',
    owner: 'Ewan',
    source: 'seed',
  },
  {
    id: 'project-management',
    title: 'SEO Project Management',
    content: 'Client onboarding, discovery audits, strategy development, task prioritization (impact vs effort), reporting cadence, team coordination.',
    category: 'operations',
    owner: 'Mike',
    source: 'seed',
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
  { folder: 'technical-seo', label: 'Technical SEO', icon: '\u2699' },
  { folder: 'content-strategy', label: 'Content Strategy', icon: '\u270D' },
  { folder: 'local-seo', label: 'Local SEO', icon: '\uD83D\uDCCD' },
  { folder: 'data-analytics', label: 'Data & Analytics', icon: '\uD83D\uDCCA' },
  { folder: 'link-building', label: 'Link Building', icon: '\uD83D\uDD17' },
  { folder: 'operations', label: 'Operations', icon: '\uD83D\uDCCB' },
];

const ACCEPTED_FILE_TYPES = '.pdf,.txt,.md,.csv,.html,.htm,.json,.xml,.doc,.docx,.rtf';

function getFileExtIcon(name) {
  if (!name) return '\uD83D\uDCC4';
  const ext = name.split('.').pop().toLowerCase();
  const map = {
    pdf: '\uD83D\uDCC4', txt: '\uD83D\uDCDD', md: '\uD83D\uDCDD',
    csv: '\uD83D\uDCCA', html: '\uD83C\uDF10', htm: '\uD83C\uDF10',
    json: '\u2699', xml: '\u2699', doc: '\uD83D\uDCC3', docx: '\uD83D\uDCC3', rtf: '\uD83D\uDCC3',
  };
  return map[ext] || '\uD83D\uDCC4';
}

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

function parseCSVToMarkdown(text) {
  const lines = text.trim().split('\n');
  if (lines.length === 0) return text;
  const header = lines[0].split(',').map((h) => h.trim());
  let md = '| ' + header.join(' | ') + ' |\n';
  md += '| ' + header.map(() => '---').join(' | ') + ' |\n';
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map((c) => c.trim());
    md += '| ' + cols.join(' | ') + ' |\n';
  }
  return md;
}

function stripHTMLToMarkdown(html) {
  let content = html;
  content = content
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '');
  content = content
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n')
    .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
    .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
    .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
  content = content.replace(/<[^>]+>/g, '');
  content = content
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n').trim();
  return content;
}

export default function KnowledgePanel() {
  const [docs, setDocs] = useState(SEO_KNOWLEDGE);
  const [view, setView] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [expandedDoc, setExpandedDoc] = useState(null);

  // Add form state
  const [addTitle, setAddTitle] = useState('');
  const [addContent, setAddContent] = useState('');
  const [addCategory, setAddCategory] = useState('technical-seo');
  const [addOwner, setAddOwner] = useState('Rob');
  const [addMode, setAddMode] = useState('manual'); // manual | upload | url

  // Upload state
  const [uploadFiles, setUploadFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState(''); // '' | 'processing' | 'done' | 'error'
  const [uploadMessage, setUploadMessage] = useState('');
  const fileInputRef = useRef(null);

  // URL fetch state
  const [fetchUrl, setFetchUrl] = useState('');
  const [fetchStatus, setFetchStatus] = useState('');
  const [fetchMessage, setFetchMessage] = useState('');

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
      source: 'manual',
    };
    setDocs((prev) => [newDoc, ...prev]);
    setAddTitle('');
    setAddContent('');
    setAddCategory('technical-seo');
    setAddOwner('Rob');
    setView('search');
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setUploadFiles(files);
    setUploadStatus('');
    setUploadMessage('');
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    setUploadFiles(files);
    setUploadStatus('');
    setUploadMessage('');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const processUploadedFiles = async () => {
    if (uploadFiles.length === 0) return;
    setUploadStatus('processing');
    setUploadMessage(`Processing ${uploadFiles.length} file(s)...`);

    const newDocs = [];
    const errors = [];

    for (const file of uploadFiles) {
      try {
        const ext = file.name.split('.').pop().toLowerCase();
        let content = '';
        const titleBase = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');

        if (ext === 'pdf') {
          // PDFs are read as text - best effort extraction
          try {
            content = await readFileAsText(file);
            // If it's binary gibberish, note that
            if (content.includes('%PDF') && content.length < 200) {
              content = `[PDF file: ${file.name} — ${(file.size / 1024).toFixed(1)}KB. PDF text extraction requires server-side processing. The file has been registered in the knowledge base.]`;
            } else {
              // Try to extract readable text between stream markers
              const textChunks = [];
              const streamRegex = /stream\s*([\s\S]*?)\s*endstream/g;
              let match;
              while ((match = streamRegex.exec(content)) !== null) {
                const chunk = match[1].replace(/[^\x20-\x7E\n\r\t]/g, '').trim();
                if (chunk.length > 10) textChunks.push(chunk);
              }
              if (textChunks.length > 0) {
                content = textChunks.join('\n\n');
              } else {
                // Fallback: extract any readable ASCII runs
                const readable = content.match(/[\x20-\x7E]{20,}/g);
                content = readable ? readable.join('\n') : `[PDF file: ${file.name} — binary content, ${(file.size / 1024).toFixed(1)}KB]`;
              }
            }
          } catch {
            content = `[PDF file: ${file.name} — could not extract text, ${(file.size / 1024).toFixed(1)}KB]`;
          }
        } else if (ext === 'csv') {
          const raw = await readFileAsText(file);
          content = parseCSVToMarkdown(raw);
        } else if (ext === 'html' || ext === 'htm') {
          const raw = await readFileAsText(file);
          content = stripHTMLToMarkdown(raw);
        } else if (ext === 'json') {
          const raw = await readFileAsText(file);
          try {
            const parsed = JSON.parse(raw);
            content = '```json\n' + JSON.stringify(parsed, null, 2) + '\n```';
          } catch {
            content = raw;
          }
        } else {
          // txt, md, xml, rtf, doc/docx (text only)
          content = await readFileAsText(file);
        }

        // Truncate very large files
        if (content.length > 100000) {
          content = content.slice(0, 100000) + '\n\n[Content truncated at 100KB]';
        }

        newDocs.push({
          id: `upload_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          title: titleBase.charAt(0).toUpperCase() + titleBase.slice(1),
          content,
          category: addCategory,
          owner: addOwner,
          source: 'upload',
          fileName: file.name,
          fileSize: file.size,
        });
      } catch (err) {
        errors.push(`${file.name}: ${err.message}`);
      }
    }

    if (newDocs.length > 0) {
      setDocs((prev) => [...newDocs, ...prev]);
    }

    if (errors.length > 0) {
      setUploadStatus('error');
      setUploadMessage(`Added ${newDocs.length} doc(s). Errors: ${errors.join('; ')}`);
    } else {
      setUploadStatus('done');
      setUploadMessage(`Successfully added ${newDocs.length} document(s) to the knowledge base.`);
    }

    setUploadFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFetchUrl = async (e) => {
    e.preventDefault();
    if (!fetchUrl.trim()) return;

    // Basic URL validation
    let urlStr = fetchUrl.trim();
    if (!/^https?:\/\//i.test(urlStr)) urlStr = 'https://' + urlStr;

    setFetchStatus('fetching');
    setFetchMessage('Fetching page content...');

    try {
      // Try the server endpoint first (works with dev:local)
      let title, content, sourceUrl;
      try {
        const resp = await fetch('/api/knowledge/fetch-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: urlStr }),
        });
        if (resp.ok) {
          const data = await resp.json();
          title = data.title;
          content = data.content;
          sourceUrl = data.url;
        } else {
          throw new Error('Server fetch unavailable');
        }
      } catch {
        // Fallback: client-side fetch via CORS (may fail for many sites)
        try {
          const resp = await fetch(urlStr);
          const text = await resp.text();
          const contentType = resp.headers.get('content-type') || '';
          if (contentType.includes('html')) {
            const titleMatch = text.match(/<title[^>]*>(.*?)<\/title>/i);
            title = titleMatch ? titleMatch[1].trim() : new URL(urlStr).hostname;
            content = stripHTMLToMarkdown(text);
          } else {
            title = new URL(urlStr).hostname + ' - ' + new URL(urlStr).pathname;
            content = text;
          }
          sourceUrl = urlStr;
        } catch (fetchErr) {
          throw new Error('Could not fetch URL. CORS may be blocking the request. Try running with dev:local for server-side fetching.');
        }
      }

      if (content && content.length > 100000) {
        content = content.slice(0, 100000) + '\n\n[Content truncated at 100KB]';
      }

      const newDoc = {
        id: `url_${Date.now()}`,
        title: title || new URL(urlStr).hostname,
        content: content || '[No content extracted]',
        category: addCategory,
        owner: addOwner,
        source: 'url',
        sourceUrl: sourceUrl || urlStr,
      };

      setDocs((prev) => [newDoc, ...prev]);
      setFetchStatus('done');
      setFetchMessage(`Added "${newDoc.title}" to the knowledge base.`);
      setFetchUrl('');
    } catch (err) {
      setFetchStatus('error');
      setFetchMessage(err.message || 'Failed to fetch URL');
    }
  };

  const toggleFolder = (folder) => {
    setExpandedFolders((prev) => ({ ...prev, [folder]: !prev[folder] }));
  };

  const getDocById = (id) => docs.find((d) => d.id === id);
  const getDocsByFolder = (folder) => docs.filter((d) => d.category === folder);

  const getSourceBadge = (doc) => {
    if (doc.source === 'upload') return '\uD83D\uDCCE';
    if (doc.source === 'url') return '\uD83C\uDF10';
    if (doc.source === 'manual') return '\u270D';
    return '';
  };

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
                  <span className="kb-item-title">
                    {getSourceBadge(doc) && <span className="kb-source-badge">{getSourceBadge(doc)} </span>}
                    {doc.title}
                  </span>
                  <span className="kb-item-category">{doc.category}</span>
                </div>
                <div className="kb-item-content">
                  {expandedDoc === doc.id ? doc.content : doc.content.slice(0, 80) + (doc.content.length > 80 ? '...' : '')}
                </div>
                {expandedDoc === doc.id && (
                  <div className="kb-item-meta">
                    <span className="kb-meta-tag">&#128194; {doc.category}</span>
                    <span className="kb-meta-tag">&#128100; {doc.owner}</span>
                    {doc.source === 'upload' && doc.fileName && (
                      <span className="kb-meta-tag">&#128206; {doc.fileName} ({(doc.fileSize / 1024).toFixed(1)}KB)</span>
                    )}
                    {doc.source === 'url' && doc.sourceUrl && (
                      <span className="kb-meta-tag">&#127760; {doc.sourceUrl}</span>
                    )}
                    <span className="kb-meta-tag">ID: {doc.id}</span>
                  </div>
                )}
                <div className="kb-item-footer">
                  <span className="kb-item-owner">{doc.owner}</span>
                  <span className="kb-expand-hint">{expandedDoc === doc.id ? '\u25B2' : '\u25BC'}</span>
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
                    <span className="kb-folder-arrow">{isOpen ? '\u25BC' : '\u25B6'}</span>
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
                          <span className="kb-file-icon">
                            {doc.source === 'upload' ? getFileExtIcon(doc.fileName) : '\uD83D\uDCC4'}
                          </span>
                          <span className="kb-file-name">
                            {doc.fileName || (doc.id + '.md')}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

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
                  {doc.source === 'upload' && <span className="kb-meta-tag">&#128206; uploaded</span>}
                  {doc.source === 'url' && <span className="kb-meta-tag">&#127760; web</span>}
                </div>
                <div className="kb-preview-content">{doc.content}</div>
                <div className="kb-preview-path">
                  {doc.source === 'url' && doc.sourceUrl
                    ? doc.sourceUrl
                    : `knowledge/${doc.category}/${doc.fileName || doc.id + '.md'}`}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ===== ADD DOCUMENT VIEW ===== */}
      {view === 'add' && (
        <div className="kb-add-view">
          {/* Add mode tabs */}
          <div className="kb-add-mode-tabs">
            <button
              className={`kb-add-mode-tab ${addMode === 'manual' ? 'kb-add-mode-active' : ''}`}
              onClick={() => setAddMode('manual')}
            >
              &#9998; Manual
            </button>
            <button
              className={`kb-add-mode-tab ${addMode === 'upload' ? 'kb-add-mode-active' : ''}`}
              onClick={() => setAddMode('upload')}
            >
              &#128206; Upload
            </button>
            <button
              className={`kb-add-mode-tab ${addMode === 'url' ? 'kb-add-mode-active' : ''}`}
              onClick={() => setAddMode('url')}
            >
              &#127760; URL
            </button>
          </div>

          {/* Shared category/owner selectors */}
          <div className="kb-form-row" style={{ marginBottom: 8 }}>
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

          {/* ---- Manual Entry ---- */}
          {addMode === 'manual' && (
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
              <button type="submit" className="kb-form-submit">
                &#10010; Add to Knowledge Base
              </button>
            </form>
          )}

          {/* ---- File Upload ---- */}
          {addMode === 'upload' && (
            <div className="kb-upload-section">
              <div
                className="kb-drop-zone"
                onDrop={handleFileDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="kb-drop-icon">&#128194;</div>
                <div className="kb-drop-text">
                  Drop files here or click to browse
                </div>
                <div className="kb-drop-formats">
                  PDF, TXT, MD, CSV, HTML, JSON, XML, DOC, RTF
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="kb-file-input-hidden"
                  accept={ACCEPTED_FILE_TYPES}
                  multiple
                  onChange={handleFileSelect}
                />
              </div>

              {uploadFiles.length > 0 && (
                <div className="kb-upload-file-list">
                  {uploadFiles.map((f, i) => (
                    <div key={i} className="kb-upload-file-item">
                      <span className="kb-upload-file-icon">{getFileExtIcon(f.name)}</span>
                      <span className="kb-upload-file-name">{f.name}</span>
                      <span className="kb-upload-file-size">{(f.size / 1024).toFixed(1)}KB</span>
                    </div>
                  ))}
                  <button
                    className="kb-form-submit"
                    onClick={processUploadedFiles}
                    disabled={uploadStatus === 'processing'}
                  >
                    {uploadStatus === 'processing' ? '&#9203; Processing...' : `&#128228; Import ${uploadFiles.length} file(s)`}
                  </button>
                </div>
              )}

              {uploadMessage && (
                <div className={`kb-status-msg kb-status-${uploadStatus}`}>
                  {uploadMessage}
                </div>
              )}
            </div>
          )}

          {/* ---- URL Fetch ---- */}
          {addMode === 'url' && (
            <div className="kb-url-section">
              <form className="kb-add-form" onSubmit={handleFetchUrl}>
                <div className="kb-form-group">
                  <label className="kb-form-label">Web URL</label>
                  <div className="kb-url-input-row">
                    <input
                      type="text"
                      className="kb-form-input"
                      placeholder="https://example.com/article..."
                      value={fetchUrl}
                      onChange={(e) => setFetchUrl(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="kb-url-hint">
                  Enter a URL to fetch its content, convert to markdown, and store in the knowledge base.
                </div>
                <button
                  type="submit"
                  className="kb-form-submit"
                  disabled={fetchStatus === 'fetching'}
                >
                  {fetchStatus === 'fetching' ? '&#9203; Fetching...' : '&#127760; Fetch & Import'}
                </button>
              </form>

              {fetchMessage && (
                <div className={`kb-status-msg kb-status-${fetchStatus}`}>
                  {fetchMessage}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
