# PRD: Redirect Mapping & Migration Deliverable

**Version:** 1.0
**Last Updated:** 2026-02-12

---

## Deliverable Overview

A comprehensive redirect mapping document that ensures SEO equity preservation during site migrations, URL restructures, or domain changes. Includes 1:1 URL mappings, redirect rules, and a pre/post-migration checklist.

## Deliverable Type

`Redirect Mapping & Migration Plan`

## Required Sections

### 1. Executive Summary
- Migration scope (number of URLs affected)
- Traffic-at-risk calculation
- High-risk areas identified
- Recommended migration timeline
- Key dependencies and prerequisites

### 2. Migration Overview
- Migration type (platform, domain, URL restructure, HTTPS, etc.)
- Source and destination domain/structure
- Scope boundaries (what's included/excluded)
- Technical approach (server-level, CDN, application-level)

### 3. URL Inventory
| Source URL | Traffic (12mo) | Keywords Ranked | Backlinks | Status | Notes |
|-----------|---------------|-----------------|-----------|--------|-------|
| ...       | ...           | ...             | ...       | Active | ...   |

- Complete inventory of all source URLs
- Sorted by traffic/importance
- Tagged by page type and priority tier

### 4. Redirect Map
| Source URL | Destination URL | Redirect Type | Confidence | Rationale |
|-----------|----------------|---------------|------------|-----------|
| /old-page | /new-page      | 301           | High       | 1:1 match |

- Every source URL mapped to a destination
- Redirect type specified (301, 302, 410)
- Confidence level (High, Medium, Low)
- Rationale for non-obvious mappings

### 5. High-Risk Redirects
- Top 50 pages by traffic with their mappings
- Top 50 pages by backlinks with their mappings
- Any pages mapped to homepage (with justification)
- Pages with no suitable destination (flagged for review)

### 6. Redirect Rules
- Server-configuration-ready rules (platform-specific)
- Pattern-based rules (regex) for bulk URL changes
- Implementation order (specific rules before wildcards)
- Example for each platform variant:
  - Apache (.htaccess)
  - Nginx (server block)
  - Cloudflare (Page Rules / Bulk Redirects)

### 7. Redirect Chain Audit
- Existing redirect chains identified
- Chain resolution recommendations
- Loop detection results
- Maximum hop count analysis

### 8. Pre-Migration Checklist
- [ ] Baseline metrics captured (traffic, rankings, indexed pages)
- [ ] All redirects tested in staging
- [ ] DNS TTL lowered (if domain change)
- [ ] Old sitemaps archived, new sitemaps ready
- [ ] GSC change of address prepared (if domain change)
- [ ] Monitoring alerts configured
- [ ] Rollback plan documented

### 9. Post-Migration Monitoring Plan
- Day 1, Week 1, Week 2, Month 1, Month 2, Month 3 checklists
- KPIs to track and acceptable thresholds
- Rollback triggers defined
- Escalation procedures

### 10. Recommendations
Each recommendation must include:
- **Priority** (Critical / High / Medium / Low)
- **Action** — specific migration action
- **Impact** — what happens if not done
- **Owner** — responsible team member

## Acceptance Criteria

- [ ] Every source URL has a mapped destination
- [ ] All redirect types are explicitly specified
- [ ] Top 100 pages (by traffic + backlinks) have 1:1 mappings
- [ ] No redirect chains longer than 2 hops
- [ ] Server-ready redirect rules are syntactically correct
- [ ] Pre and post-migration checklists are complete
- [ ] Traffic-at-risk is calculated and documented

## Output Formats

- **Primary:** Markdown report with redirect map tables
- **Optional:** CSV redirect map (for bulk import tools), server config files
