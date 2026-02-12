# PRD: XML Sitemap Production Deliverable

**Version:** 1.0
**Last Updated:** 2026-02-12

---

## Deliverable Overview

Optimised XML sitemaps and a sitemap strategy that ensures efficient crawl budget utilisation, accurate indexation signals, and alignment between sitemap contents and the site's canonical, indexable URL set.

## Deliverable Type

`XML Sitemap Production & Optimisation`

## Required Sections

### 1. Executive Summary
- Current sitemap health assessment
- Key issues found
- Total indexable URLs vs. current sitemap coverage
- Recommended sitemap architecture
- Expected indexation improvement

### 2. Current Sitemap Audit
| Metric | Value | Status |
|--------|-------|--------|
| Current sitemaps found | ... | — |
| URLs in current sitemaps | ... | — |
| URLs returning non-200 | ... | ❌ if >0 |
| Noindexed URLs in sitemap | ... | ❌ if >0 |
| Redirecting URLs in sitemap | ... | ❌ if >0 |
| Non-canonical URLs in sitemap | ... | ❌ if >0 |
| Indexable URLs missing from sitemap | ... | ⚠ if >0 |
| lastmod accuracy | ...% | ✅ if >90% |

- Detailed audit findings
- Specific problematic URLs listed

### 3. Indexable URL Inventory
| Page Type | Count | In Current Sitemap | Missing | Status |
|-----------|-------|--------------------|---------|--------|
| Homepage | 1 | ✅ | 0 | ✅ |
| Categories | ... | ... | ... | ✅/⚠/❌ |
| Products | ... | ... | ... | ✅/⚠/❌ |
| Blog posts | ... | ... | ... | ✅/⚠/❌ |

- Complete inventory of canonical, indexable URLs
- Segmented by page type/template
- Gap analysis vs. current sitemaps

### 4. Recommended Sitemap Architecture
```
sitemap-index.xml
├── sitemap-pages.xml          (X URLs)
├── sitemap-categories.xml     (X URLs)
├── sitemap-products.xml       (X URLs)
├── sitemap-blog.xml           (X URLs)
└── sitemap-images.xml         (X URLs, optional)
```

- Sitemap index structure
- Sub-sitemap breakdown by content type
- URL count per sitemap (max 50,000)
- File size estimates (max 50MB)

### 5. Generated Sitemaps
For each sitemap file:
- Complete XML content (or generation instructions)
- URL count
- Namespace declarations
- `<loc>` — absolute, canonical, HTTPS URLs only
- `<lastmod>` — accurate ISO 8601 dates
- Optional: `<changefreq>`, `<priority>` if reliable data exists

### 6. Image Sitemap (if applicable)
- Pages with key images included
- `<image:loc>`, `<image:title>`, `<image:caption>` entries
- Image count per page type

### 7. Video Sitemap (if applicable)
- Pages with video content
- Required video sitemap fields populated
- Thumbnail, title, description for each video

### 8. Robots.txt Updates
```
# Recommended robots.txt sitemap declaration
Sitemap: https://example.com/sitemap-index.xml
```

- Current robots.txt sitemap declarations
- Recommended updates
- Any blocking rules affecting sitemap URLs

### 9. Submission Plan
- Google Search Console submission steps
- Bing Webmaster Tools submission steps
- Verification checklist:
  - [ ] All sitemaps accessible at declared URLs
  - [ ] Sitemap index references all sub-sitemaps
  - [ ] Robots.txt updated with sitemap location
  - [ ] GSC shows successful processing
  - [ ] No errors reported in GSC sitemap report

### 10. Ongoing Maintenance Plan
- Update method: dynamic (CMS-generated) or static (periodic regeneration)
- Recommended update frequency
- Monitoring schedule (monthly GSC review)
- Process for handling new page types
- Quarterly audit checklist

### 11. Recommendations
Each recommendation must include:
- **Priority** (Critical / High / Medium / Low)
- **Action** — specific sitemap action
- **Impact** — indexation improvement expected
- **Effort** — implementation effort

## Acceptance Criteria

- [ ] All indexable URLs included in sitemaps
- [ ] No non-200, noindexed, redirecting, or non-canonical URLs in sitemaps
- [ ] Sitemap XML validates against protocol schema
- [ ] Each sitemap under 50,000 URLs and 50MB
- [ ] Sitemap index correctly references all sub-sitemaps
- [ ] Robots.txt declares sitemap location
- [ ] lastmod dates are accurate (not auto-generated current dates)
- [ ] Submission and monitoring plan included

## Output Formats

- **Primary:** Markdown report with audit findings and architecture
- **Secondary:** XML sitemap files ready for deployment
- **Optional:** CSV URL inventory for review
