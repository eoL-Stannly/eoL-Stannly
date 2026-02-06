const DOCUMENTS = [
  {
    id: 'site-architecture',
    title: 'Site Architecture & Crawlability',
    content: 'Crawl budget optimization, URL structure, internal linking, XML sitemaps. Foundation of technical SEO.',
    metadata: { category: 'technical-seo', owner: 'Rob' },
  },
  {
    id: 'core-web-vitals',
    title: 'Core Web Vitals & Page Experience',
    content: 'LCP, INP, CLS metrics. Google ranking signal measuring real-world user experience via CrUX field data.',
    metadata: { category: 'technical-seo', owner: 'Rob' },
  },
  {
    id: 'indexation-management',
    title: 'Indexation Management',
    content: 'Meta robots, canonical tags, robots.txt, GSC index coverage. Control what Google indexes.',
    metadata: { category: 'technical-seo', owner: 'Rob' },
  },
  {
    id: 'structured-data',
    title: 'Structured Data & Schema Markup',
    content: 'JSON-LD for Organization, Article, Product, FAQ, BreadcrumbList. Unlocks rich results in SERPs.',
    metadata: { category: 'technical-seo', owner: 'Rob' },
  },
  {
    id: 'keyword-research',
    title: 'Keyword Research & Search Intent',
    content: 'Search intent mapping, keyword expansion, clustering, and prioritization framework.',
    metadata: { category: 'content-strategy', owner: 'Craig' },
  },
  {
    id: 'on-page-optimization',
    title: 'On-Page SEO Optimization',
    content: 'Title tags, meta descriptions, heading structure, content and image optimization, internal linking.',
    metadata: { category: 'content-strategy', owner: 'Craig' },
  },
  {
    id: 'topic-clusters',
    title: 'Topic Clusters & Content Architecture',
    content: 'Pillar pages + cluster pages. Build topical authority through comprehensive internal linking.',
    metadata: { category: 'content-strategy', owner: 'Craig' },
  },
  {
    id: 'google-business-profile',
    title: 'Google Business Profile Optimization',
    content: 'GBP setup, categories, photos, posts, reviews, Q&A. Cornerstone of local SEO.',
    metadata: { category: 'local-seo', owner: 'Leo' },
  },
  {
    id: 'eeat-signals',
    title: 'E-E-A-T Signals',
    content: 'Experience, Expertise, Authoritativeness, Trustworthiness. Google quality framework for content.',
    metadata: { category: 'local-seo', owner: 'Leo' },
  },
  {
    id: 'citation-building',
    title: 'Citation Building & Local Links',
    content: 'NAP consistency, structured/unstructured citations, local link acquisition strategies.',
    metadata: { category: 'local-seo', owner: 'Leo' },
  },
  {
    id: 'gsc-analytics',
    title: 'Google Search Console & Analytics',
    content: 'Performance reports, index coverage, Core Web Vitals, GSC API, GA4 integration.',
    metadata: { category: 'data-analytics', owner: 'Alex' },
  },
  {
    id: 'log-file-analysis',
    title: 'Log File Analysis for SEO',
    content: 'Server log analysis for bot crawl behavior. Crawl distribution, frequency, status codes.',
    metadata: { category: 'data-analytics', owner: 'Alex' },
  },
  {
    id: 'seo-data-pipelines',
    title: 'SEO Data Pipelines & Automation',
    content: 'ETL from GSC, GA4, Ahrefs APIs. BigQuery, Looker Studio dashboards, automated reports.',
    metadata: { category: 'data-analytics', owner: 'Ken' },
  },
  {
    id: 'link-building',
    title: 'Link Building Strategies',
    content: 'Digital PR, content-led link building, broken link building, competitor analysis, outreach.',
    metadata: { category: 'link-building', owner: 'Ewan' },
  },
  {
    id: 'project-management',
    title: 'SEO Project Management',
    content: 'Client onboarding, audits, strategy, task prioritization, reporting cadence, team coordination.',
    metadata: { category: 'operations', owner: 'Mike' },
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

  const params = event.queryStringParameters || {};

  let results = DOCUMENTS;

  if (params.category) {
    results = results.filter((d) => d.metadata.category === params.category);
  }

  if (params.q) {
    const query = params.q.toLowerCase();
    results = results.filter(
      (d) =>
        d.title.toLowerCase().includes(query) ||
        d.content.toLowerCase().includes(query) ||
        d.metadata.owner.toLowerCase().includes(query)
    );
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(results),
  };
};
