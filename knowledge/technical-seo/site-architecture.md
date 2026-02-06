# Site Architecture & Crawlability

## Overview
Site architecture is the foundation of technical SEO. A well-structured site ensures search engines can efficiently discover, crawl, and index all important content.

## Key Principles

### Crawl Budget Optimization
- Minimize crawl waste on low-value pages (faceted navigation, session IDs, infinite scroll)
- Use robots.txt to block crawl traps and non-indexable paths
- Monitor crawl stats in Google Search Console under Settings > Crawl Stats
- Implement pagination with rel="next"/"prev" or load-more patterns
- Consolidate URL parameters via GSC parameter handling

### URL Structure
- Keep URLs short, descriptive, and keyword-relevant
- Use hyphens as word separators (never underscores)
- Maintain consistent trailing slash policy
- Implement proper canonical tags on every indexable page
- Avoid query parameters for content differentiation where possible

### Internal Linking
- Every important page should be reachable within 3 clicks from homepage
- Use descriptive anchor text that signals page topic
- Build topic clusters with pillar pages linking to cluster content
- Audit orphan pages regularly (pages with no internal links)
- Use breadcrumbs for hierarchical navigation and structured data

### XML Sitemaps
- Include only indexable, canonical URLs
- Keep sitemaps under 50,000 URLs / 50MB
- Use sitemap index files for large sites
- Update lastmod dates only when content genuinely changes
- Submit sitemaps via GSC and reference in robots.txt

## Common Issues
- Redirect chains (keep to single 301 hops)
- Mixed content (HTTP resources on HTTPS pages)
- Soft 404s (pages returning 200 but showing error content)
- Infinite crawl spaces from calendar widgets or filters
- Duplicate content from www/non-www, HTTP/HTTPS, trailing slash variants
