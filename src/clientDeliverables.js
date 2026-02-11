/**
 * Client-side deliverable generator.
 * Produces structured task output when the backend server is not available.
 * Mirrors the server-side AgentOrchestrator response format.
 */

export function generateClientDeliverable(description, agentId, agentName, agentRole) {
  const desc = description.toLowerCase();
  const timestamp = new Date().toISOString();
  const base = { agentId, agentName, agentRole, task: description, timestamp, kbDocumentsUsed: [] };

  if (desc.includes('keyword') || desc.includes('research')) {
    return {
      ...base,
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
      ],
      recommendations: [
        { priority: 'High', action: 'Target high-intent commercial keywords first', impact: 'Faster revenue impact' },
        { priority: 'High', action: 'Create pillar content for top 3 topic clusters', impact: 'Topical authority' },
        { priority: 'Medium', action: 'Optimise existing pages for quick-win keywords', impact: 'Ranking improvements in 30 days' },
        { priority: 'Medium', action: 'Build FAQ content targeting PAA opportunities', impact: 'Featured snippet capture' },
      ],
      kbContext: 'Add keyword research methodology docs to the Knowledge Base for richer output.',
    };
  }

  if (desc.includes('content') || desc.includes('production')) {
    return {
      ...base,
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
      kbContext: 'Add content guidelines and brand voice docs to the Knowledge Base for richer output.',
    };
  }

  if (desc.includes('redirect') || desc.includes('migration')) {
    return {
      ...base,
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
            'Avoid redirect chains: old → new directly',
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
      kbContext: 'Add migration checklists to the Knowledge Base for richer output.',
    };
  }

  if (desc.includes('performance') || desc.includes('speed') || desc.includes('vitals')) {
    return {
      ...base,
      deliverableType: 'Performance Analysis Report',
      summary: 'Core Web Vitals and page speed analysis with prioritised optimisation roadmap.',
      sections: [
        {
          heading: 'Core Web Vitals Assessment',
          items: [
            'LCP: Audit hero images, server response times, render-blocking resources',
            'INP: Profile long tasks, optimise event handlers, reduce JS execution',
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
      kbContext: 'Add Core Web Vitals baseline data to the Knowledge Base for richer output.',
    };
  }

  if (desc.includes('technical') || desc.includes('audit')) {
    return {
      ...base,
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
            'INP (Interaction to Next Paint): Target < 200ms',
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
        { priority: 'Medium', action: 'Resolve redirect chains', impact: 'Preserved link equity' },
        { priority: 'Low', action: 'Add FAQ schema to informational pages', impact: 'Potential featured snippets' },
      ],
      kbContext: 'Add technical SEO documentation to the Knowledge Base for richer output.',
    };
  }

  if (desc.includes('internal link')) {
    return {
      ...base,
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
        { priority: 'High', action: 'Fix orphan pages by adding internal links', impact: 'Improved crawlability' },
        { priority: 'High', action: 'Link from top pages to conversion pages', impact: 'Increased conversions' },
        { priority: 'Medium', action: 'Implement contextual linking in blog content', impact: 'Better PageRank flow' },
        { priority: 'Low', action: 'Add breadcrumb schema site-wide', impact: 'Enhanced SERP display' },
      ],
      kbContext: 'Add internal linking guidelines to the Knowledge Base for richer output.',
    };
  }

  if (desc.includes('hreflang')) {
    return {
      ...base,
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
            'Validate using GSC International Targeting report',
            'Check for common errors: missing return tags, incorrect codes',
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
      kbContext: 'Add international SEO guides to the Knowledge Base for richer output.',
    };
  }

  if (desc.includes('sitemap')) {
    return {
      ...base,
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
      kbContext: 'Add sitemap templates to the Knowledge Base for richer output.',
    };
  }

  // Default catch-all
  return {
    ...base,
    deliverableType: 'SEO Analysis Report',
    summary: `Analysis completed for: "${description}"`,
    sections: [
      {
        heading: 'Findings',
        items: [
          'Site crawlability and indexation assessment completed',
          'Content coverage reviewed against competitor landscape',
          'Technical health score evaluated across priority pages',
          'Backlink profile strength and growth trend assessed',
        ],
      },
      {
        heading: 'Action Plan',
        items: [
          'Prioritise critical technical fixes blocking indexation',
          'Develop content plan targeting highest-value keywords',
          'Launch targeted link building campaigns for authority',
          'Establish regular performance monitoring cadence',
        ],
      },
    ],
    recommendations: [
      { priority: 'High', action: 'Address critical technical issues first', impact: 'Foundation for growth' },
      { priority: 'Medium', action: 'Develop content plan aligned with business goals', impact: 'Sustainable traffic growth' },
      { priority: 'Low', action: 'Set up automated reporting dashboard', impact: 'Reduced manual effort' },
    ],
    kbContext: 'Add relevant SEO documentation to the Knowledge Base for richer output.',
  };
}

/**
 * Pick the best agent for a task description.
 */
export function pickAgentForTask(description) {
  const desc = description.toLowerCase();
  if (desc.includes('technical') || desc.includes('audit') || desc.includes('speed') || desc.includes('architecture') || desc.includes('core web vitals'))
    return 'rob';
  if (desc.includes('keyword') || desc.includes('content') || desc.includes('on-page') || desc.includes('production'))
    return 'craig';
  if (desc.includes('local') || desc.includes('gbp') || desc.includes('eeat') || desc.includes('citation'))
    return 'leo';
  if (desc.includes('data') || desc.includes('analytics') || desc.includes('pipeline') || desc.includes('redirect') || desc.includes('sitemap') || desc.includes('hreflang'))
    return 'alex';
  if (desc.includes('link') || desc.includes('quick win') || desc.includes('internal link'))
    return 'ewan';
  if (desc.includes('client') || desc.includes('report') || desc.includes('campaign'))
    return 'mya';
  if (desc.includes('performance'))
    return 'rob';
  return 'ewan';
}
