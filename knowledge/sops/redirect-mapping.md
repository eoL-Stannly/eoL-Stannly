# SOP: Redirect Mapping & Migration Planning

**Owner:** Rob (Principal SEO — Technical)
**Version:** 1.0
**Last Updated:** 2026-02-12

---

## Purpose

Define the standard procedure for creating redirect maps during site migrations, domain changes, URL restructures, or platform migrations. Ensures preservation of SEO equity, prevention of traffic loss, and correct HTTP status code implementation.

## Scope

Covers 301/302 redirect mapping, migration planning checklists, pre/post-migration validation, and redirect chain auditing.

## Prerequisites

- Full crawl of the current site (all indexable URLs)
- Crawl or sitemap of the new/target URL structure
- Google Search Console data (indexed pages, top performing URLs)
- Analytics data (top traffic-driving pages, conversion pages)
- Backlink profile data (pages with external link equity)

## Procedure

### Step 1: Source URL Inventory

1. Compile complete URL list from:
   - Site crawl (all 200-status URLs)
   - XML sitemap(s)
   - Google Search Console indexed pages
   - Analytics top pages (by traffic and conversions)
   - Backlink profile (pages receiving external links)
2. Deduplicate and normalise URLs
3. Tag each URL with:
   - Traffic volume (last 12 months)
   - Ranking keywords count
   - External backlink count
   - Revenue/conversion attribution (if available)

### Step 2: Destination URL Mapping

1. For each source URL, identify the best destination URL on the new structure
2. Mapping priority rules:
   - **Exact match** — same content at new URL (1:1 mapping)
   - **Near match** — similar content or merged pages
   - **Category match** — content retired, map to parent category
   - **Homepage fallback** — only for truly deprecated content with no alternative
3. Flag URLs with no suitable destination for stakeholder review
4. Never map high-traffic pages to homepage without explicit approval

### Step 3: Redirect Type Assignment

For each mapping, assign redirect type:
- **301 Permanent** — content permanently moved (default for migrations)
- **302 Temporary** — temporary redirect (seasonal content, A/B tests)
- **410 Gone** — content intentionally removed with no replacement
- **No redirect** — URL structure unchanged

### Step 4: Redirect Chain & Loop Detection

1. Check existing redirects for chains (A→B→C — should be A→C)
2. Identify redirect loops
3. Flag any chain longer than 2 hops
4. Document all existing redirects that need updating

### Step 5: Validation & Risk Assessment

1. Calculate traffic-at-risk (sum of traffic to redirected URLs)
2. Identify high-risk redirects (top 50 pages by traffic/links)
3. Verify:
   - No orphaned pages (pages on new site with no inbound links)
   - No redirect chains exceed 2 hops
   - All high-traffic pages have 1:1 mappings
   - All pages with significant backlinks are mapped
4. Create pre-migration baseline metrics snapshot

### Step 6: Implementation Specification

1. Produce server-configuration-ready redirect rules
2. Format for target platform (Apache .htaccess, Nginx conf, Cloudflare rules, etc.)
3. Include regex patterns for bulk URL pattern changes
4. Document redirect implementation order (specifics before wildcards)

### Step 7: Post-Migration Monitoring Plan

1. Define monitoring checklist:
   - Crawl new site within 24 hours
   - Check GSC for crawl errors daily (first 2 weeks)
   - Monitor organic traffic daily (first 4 weeks)
   - Verify key rankings weekly (first 8 weeks)
2. Define rollback triggers and procedures
3. Schedule 30/60/90 day review milestones

## Escalation

- Redirects affecting 10,000+ URLs require Ewan (Head of SEO) sign-off
- International domain migrations require data team (Alex/Ken) support
- Client-facing migration comms go through Mya (Account Manager)

## Output

Deliverable must conform to the **Redirect Mapping PRD** specification.
