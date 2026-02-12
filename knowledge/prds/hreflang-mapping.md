# PRD: HREFLANG & International SEO Deliverable

**Version:** 1.0
**Last Updated:** 2026-02-12

---

## Deliverable Overview

A complete hreflang mapping and international SEO implementation specification that ensures correct language/region targeting across all site variants, preventing duplicate content issues and maximising international search visibility.

## Deliverable Type

`HREFLANG Mapping & International SEO`

## Required Sections

### 1. Executive Summary
- Number of language/region variants covered
- Current implementation status (new, partial, needs fixes)
- Critical errors found (if auditing existing implementation)
- Scope of implementation
- Key risks and dependencies

### 2. Language/Region Matrix
| Language | Region | Hreflang Code | Domain/Path | Total Pages |
|----------|--------|---------------|-------------|-------------|
| English | US | en-US | /en-us/ | ... |
| English | GB | en-GB | /en-gb/ | ... |
| French | France | fr-FR | /fr/ | ... |

- Complete market coverage table
- x-default designation
- Domain structure documentation (ccTLD, subdirectory, subdomain)

### 3. URL Mapping Table
| Page | en-US | en-GB | fr-FR | de-DE | x-default |
|------|-------|-------|-------|-------|-----------|
| Homepage | /en-us/ | /en-gb/ | /fr/ | /de/ | / |
| Product A | /en-us/product-a | /en-gb/product-a | /fr/produit-a | /de/produkt-a | /product-a |

- Complete page-by-page mapping across all variants
- Pages with partial translations marked
- Pages with no equivalent in certain languages flagged
- All URLs verified as 200-status and indexable

### 4. Existing Implementation Audit (if applicable)
| Error Type | Count | Severity | Example |
|-----------|-------|----------|---------|
| Missing return tags | ... | Critical | ... |
| Incorrect codes | ... | Critical | ... |
| Missing self-reference | ... | High | ... |
| Missing x-default | ... | High | ... |
| Canonical conflicts | ... | Critical | ... |
| Noindex conflicts | ... | Critical | ... |

- Full error inventory
- Specific URLs affected per error type
- Fix instructions for each error type

### 5. Hreflang Tag Specification
For each page, the complete tag set:
```html
<!-- Example: /en-us/product-a -->
<link rel="alternate" hreflang="en-US" href="https://example.com/en-us/product-a" />
<link rel="alternate" hreflang="en-GB" href="https://example.com/en-gb/product-a" />
<link rel="alternate" hreflang="fr-FR" href="https://example.com/fr/produit-a" />
<link rel="alternate" hreflang="x-default" href="https://example.com/product-a" />
```

- Tags for every page in every variant
- Absolute URLs only
- Sorted by page for easy implementation

### 6. Implementation Guide
- Recommended method (HTML tags, XML sitemap, HTTP headers)
- Platform-specific instructions
- Code examples for the chosen method
- Deployment checklist:
  - [ ] Tags added to all pages in all variants
  - [ ] Self-referencing tags present
  - [ ] Return tags verified (every page references every variant)
  - [ ] x-default set on all page sets
  - [ ] Canonicals aligned with hreflang URLs
  - [ ] No hreflang URLs redirect

### 7. XML Sitemap Hreflang (if sitemap method chosen)
- Sitemap XML structure with hreflang entries
- Example markup for each page type
- Sitemap organisation (per-language or combined)

### 8. Validation Results
- Pre-deployment validation checks passed/failed
- Reciprocal tag completeness verification
- Redirect check (no hreflang pointing to redirects)
- Canonical consistency check

### 9. Monitoring Plan
- GSC International Targeting setup
- Monthly monitoring checklist
- Error alert thresholds
- New page hreflang workflow (process for adding tags to new content)

### 10. Recommendations
Each recommendation must include:
- **Priority** (Critical / High / Medium / Low)
- **Action** — specific implementation step
- **Impact** — what happens if not done
- **Owner** — developer, SEO team, or content team

## Acceptance Criteria

- [ ] All language/region variants documented in matrix
- [ ] Every page has a complete hreflang set with all variants
- [ ] All tags include self-referencing and x-default
- [ ] No hreflang URLs point to redirecting, noindexed, or non-canonical pages
- [ ] Reciprocal tags verified (A→B implies B→A)
- [ ] Implementation guide is platform-specific and actionable
- [ ] Validation checks all pass before delivery
- [ ] Monitoring plan defined

## Output Formats

- **Primary:** Markdown report with tag specifications
- **Optional:** CSV URL mapping, XML sitemap files, HTML tag snippets for development
