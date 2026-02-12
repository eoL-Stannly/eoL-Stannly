# SOP: Technical SEO Audit

**Owner:** Rob (Principal SEO — Technical)
**Version:** 1.0
**Last Updated:** 2026-02-12

---

## Purpose

Define the standard procedure for conducting comprehensive technical SEO audits. Ensures systematic evaluation of all technical factors affecting a site's crawlability, indexability, and overall search performance.

## Scope

Covers full-site technical audits, targeted audits (e.g., Core Web Vitals only), pre-launch audits, and post-migration audits.

## Prerequisites

- Full site crawl data (Screaming Frog or equivalent)
- Google Search Console access
- Server access or log files (for log file analysis)
- Robots.txt and XML sitemap access
- Current site architecture documentation (if available)

## Procedure

### Step 1: Crawl & Indexation Analysis

1. Run a full site crawl and analyse:
   - Total pages discovered vs. indexable pages
   - HTTP status code distribution (200, 301, 302, 404, 410, 500, etc.)
   - Robots.txt directives — blocked resources, disallowed paths
   - Meta robots tags — noindex, nofollow usage
   - Canonical tag implementation — self-referencing, cross-domain
   - XML sitemap analysis — pages in sitemap vs. crawled, orphaned URLs
2. Compare crawl inventory against GSC indexed pages
3. Identify indexation gaps and bloat

### Step 2: Site Architecture & Internal Linking

1. Analyse crawl depth distribution:
   - Pages at depth 1, 2, 3, 4+
   - Target: key pages within 3 clicks from homepage
2. Review internal linking:
   - Pages with low internal link count (<3 inbound)
   - Orphaned pages (no internal links)
   - Internal link equity distribution
3. Evaluate URL structure:
   - URL length and readability
   - Parameter handling
   - Trailing slashes consistency
   - HTTPS enforcement
4. Assess navigation and breadcrumb implementation

### Step 3: Page Speed & Core Web Vitals

1. Audit Core Web Vitals (field data from CrUX):
   - LCP (Largest Contentful Paint) — threshold: good < 2.5s
   - INP (Interaction to Next Paint) — threshold: good < 200ms
   - CLS (Cumulative Layout Shift) — threshold: good < 0.1
2. Analyse page-level performance:
   - Top templates/page types by traffic with CWV scores
   - Pages failing CWV thresholds
3. Identify common performance bottlenecks:
   - Render-blocking resources
   - Unoptimised images (format, compression, dimensions)
   - Excessive JavaScript (bundle size, execution time)
   - Third-party script impact
   - Font loading strategy
   - Server response time (TTFB)

### Step 4: Mobile & Rendering

1. Test mobile-friendliness:
   - Viewport configuration
   - Touch target sizing
   - Content width vs. viewport
   - Font legibility on mobile
2. Check JavaScript rendering:
   - Compare rendered vs. raw HTML for key templates
   - Identify content dependent on JS execution
   - Verify search engine can access rendered content
3. Review responsive implementation across breakpoints

### Step 5: Structured Data & Schema

1. Audit existing structured data:
   - Schema types implemented
   - Validation (errors, warnings)
   - Coverage across page types
2. Identify schema opportunities:
   - FAQ schema on informational pages
   - Product/Review schema on commercial pages
   - Article/Author schema on blog content
   - Organisation/LocalBusiness schema
   - Breadcrumb schema
3. Verify structured data aligns with visible page content

### Step 6: Security & Accessibility

1. HTTPS audit:
   - Mixed content issues
   - Certificate validity
   - HTTP→HTTPS redirect chains
   - HSTS implementation
2. Accessibility review (SEO-relevant):
   - Image alt text coverage
   - Heading hierarchy (H1–H6 structure)
   - Anchor text descriptiveness
   - Language attributes

### Step 7: Log File Analysis (if available)

1. Analyse search engine crawler behaviour:
   - Crawl frequency by page type
   - Crawl budget waste (crawling non-indexable pages)
   - Response code distribution from crawler's perspective
   - Orphaned pages being crawled (not in internal linking)
2. Identify crawl anomalies and priority issues

### Step 8: Findings & Recommendations

1. Categorise all issues by severity:
   - **Critical** — blocking indexation or causing significant traffic loss
   - **High** — degrading performance or user experience
   - **Medium** — suboptimal but not immediately harmful
   - **Low** — best practice improvements
2. Provide specific fix instructions for each issue
3. Estimate impact and effort for prioritisation
4. Create implementation roadmap (quick wins → medium-term → long-term)

### Step 9: Quality Assurance

- Verify all findings with at least 2 data sources
- Test fix recommendations in staging if possible
- Peer review by second technical SEO
- Ensure recommendations don't conflict with each other

## Escalation

- Critical security vulnerabilities: immediate escalation to client + Ewan
- Performance issues affecting Core Web Vitals: loop in Alex/Ken for deeper analysis
- Architecture changes affecting content: coordinate with Craig

## Output

Deliverable must conform to the **Technical Audit PRD** specification.
