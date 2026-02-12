# PRD: Technical SEO Audit Deliverable

**Version:** 1.0
**Last Updated:** 2026-02-12

---

## Deliverable Overview

A comprehensive technical SEO audit that systematically evaluates all technical factors affecting a site's search engine crawlability, indexability, and performance. Provides prioritised, actionable recommendations.

## Deliverable Type

`Technical SEO Audit`

## Required Sections

### 1. Executive Summary
- Overall technical health score (Critical / Needs Work / Good / Excellent)
- Top 5 critical issues requiring immediate attention
- Total issues found by severity
- Estimated traffic impact of fixing critical issues
- Recommended priority actions

### 2. Audit Scope & Methodology
- Pages crawled and tools used
- Date of crawl
- Scope boundaries (full site, specific sections, etc.)
- Comparison to previous audit (if available)

### 3. Crawlability & Indexation
| Metric | Value | Status |
|--------|-------|--------|
| Total URLs crawled | ... | — |
| Indexable pages | ... | — |
| Non-indexable pages | ... | ⚠ if >20% |
| GSC indexed pages | ... | — |
| Indexation rate | ...% | ✅/⚠/❌ |
| Orphan pages | ... | ⚠ if >0 |
| Redirect chains | ... | ⚠ if >0 |

- Robots.txt analysis and recommendations
- Meta robots usage audit
- Canonical tag implementation review
- XML sitemap vs. crawl comparison

### 4. Site Architecture & Internal Linking
- Crawl depth distribution chart/table
- Pages beyond depth 3 (list + recommendation)
- Internal link distribution analysis
- Orphaned pages (no internal links)
- Navigation structure assessment
- URL structure evaluation

### 5. Page Speed & Core Web Vitals
| Metric | Mobile | Desktop | Threshold | Status |
|--------|--------|---------|-----------|--------|
| LCP | ...s | ...s | <2.5s | ✅/⚠/❌ |
| INP | ...ms | ...ms | <200ms | ✅/⚠/❌ |
| CLS | ... | ... | <0.1 | ✅/⚠/❌ |
| TTFB | ...ms | ...ms | <800ms | ✅/⚠/❌ |

- Per-template CWV breakdown
- Top performance bottlenecks identified
- Specific optimisation recommendations per issue

### 6. Mobile Usability
- Mobile-friendliness test results
- Viewport configuration
- Touch target compliance
- Content rendering on mobile
- Mobile-specific issues

### 7. Structured Data
| Schema Type | Pages | Errors | Warnings | Status |
|------------|-------|--------|----------|--------|
| ... | ... | ... | ... | ✅/⚠/❌ |

- Current implementation review
- Validation results
- Missing schema opportunities
- Implementation recommendations

### 8. Security & HTTPS
- HTTPS implementation status
- Mixed content issues
- Certificate health
- HSTS implementation
- Security header review

### 9. International SEO (if applicable)
- Hreflang implementation status
- Language targeting issues
- Geotargeting configuration

### 10. Issue Register
| # | Issue | Severity | Category | Pages Affected | Recommendation |
|---|-------|----------|----------|---------------|----------------|
| 1 | ... | Critical | Indexation | ... | ... |

- Complete list of all issues found
- Severity: Critical, High, Medium, Low
- Category for easy filtering
- Specific page examples for each issue
- Clear fix instruction for each issue

### 11. Recommendations & Roadmap
Each recommendation must include:
- **Priority** (Critical / High / Medium / Low)
- **Action** — specific technical fix
- **Impact** — expected SEO improvement
- **Effort** — development effort estimate (hours/days)
- **Dependencies** — other fixes that must happen first
- **Owner** — developer, SEO team, or platform

Implementation roadmap:
- **Immediate** (this week) — Critical issues
- **Short-term** (1–2 weeks) — High issues
- **Medium-term** (1–2 months) — Medium issues
- **Ongoing** — Low priority and maintenance items

## Acceptance Criteria

- [ ] Full site crawl completed (all discoverable URLs)
- [ ] All 8 audit categories are covered
- [ ] Every issue has a severity rating and fix instruction
- [ ] Core Web Vitals data uses field data (CrUX) not just lab data
- [ ] Issue register is complete and deduplicated
- [ ] Recommendations include effort estimates
- [ ] Executive summary is understandable by non-technical stakeholders
- [ ] Comparison to previous audit included (if available)

## Output Formats

- **Primary:** Markdown report with data tables
- **Optional:** HTML report, CSV issue register, PDF executive summary
