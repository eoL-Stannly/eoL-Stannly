# PRD: Internal Linking Audit & Strategy Deliverable

**Version:** 1.0
**Last Updated:** 2026-02-12

---

## Deliverable Overview

An internal linking audit and strategy document that analyses the current link structure, identifies opportunities to improve crawlability and authority distribution, and provides a prioritised implementation plan.

## Deliverable Type

`Internal Linking Audit & Strategy`

## Required Sections

### 1. Executive Summary
- Current internal linking health assessment
- Key issues found (orphans, dead-ends, thin-link pages)
- Top 3 opportunities for improvement
- Expected impact of implementing recommendations

### 2. Methodology
- Crawl tool and date
- Link extraction methodology
- Scoring criteria
- Pages and links analysed (totals)

### 3. Current State Overview
| Metric | Value | Benchmark | Status |
|--------|-------|-----------|--------|
| Total internal links | ... | — | — |
| Avg. links per page (inbound) | ... | 5–10 | ✅/⚠/❌ |
| Avg. links per page (outbound) | ... | 3–8 | ✅/⚠/❌ |
| Orphan pages | ... | 0 | ✅/⚠/❌ |
| Dead-end pages | ... | 0 | ✅/⚠/❌ |
| Max crawl depth | ... | ≤3 | ✅/⚠/❌ |
| Pages at depth >3 | ... | <10% | ✅/⚠/❌ |

### 4. Orphan Page Report
| Page URL | Traffic | Keywords | Backlinks | Recommendation |
|----------|---------|----------|-----------|----------------|
| ... | ... | ... | ... | Link from [page] |

- Pages with zero internal links pointing to them
- Prioritised by traffic potential
- Specific linking recommendation for each

### 5. Thin-Link Page Report
| Page URL | Current Inbound Links | Target | Priority |
|----------|----------------------|--------|----------|
| ... | 1 | 5+ | High |

- Important pages with insufficient internal links (<3)
- Prioritised by keyword opportunity and current performance

### 6. Topic Cluster Linking Map
For each topic cluster:
- **Pillar page** URL and inbound link count
- **Supporting pages** with link status to/from pillar
- **Missing links** identified (specific source → target pairs)
- **Cross-cluster links** (relevant links between clusters)
- Visual cluster map (text-based representation)

### 7. Anchor Text Analysis
| Pattern | Count | % of Total | Assessment |
|---------|-------|------------|------------|
| Keyword-rich anchors | ... | ...% | ✅ if balanced |
| Generic anchors ("click here") | ... | ...% | ⚠ if >20% |
| URL anchors | ... | ...% | ⚠ if >10% |
| Image links (no text) | ... | ...% | ⚠ if >5% |

- Anchor text distribution summary
- Over-optimised anchor patterns flagged
- Generic anchor improvement opportunities

### 8. Link Addition Recommendations
| # | Source Page | Target Page | Anchor Text | Placement | Priority |
|---|-----------|-------------|-------------|-----------|----------|
| 1 | /blog/guide | /service/x | ... | In-content | High |

- Specific, actionable link additions
- Minimum 25 recommendations
- Prioritised by expected impact
- Grouped by implementation phase

### 9. Navigation & Sitewide Recommendations
- Main navigation improvements
- Footer link optimisation
- Breadcrumb implementation/fixes
- Related content module recommendations
- Sidebar link suggestions

### 10. Implementation Roadmap
- **Phase 1** (Week 1) — Orphan page fixes and critical links
- **Phase 2** (Weeks 2–3) — Pillar-to-cluster connections
- **Phase 3** (Weeks 4–6) — Cross-cluster strategic links
- **Phase 4** (Ongoing) — Anchor text optimisation and new content linking

### 11. Ongoing Best Practices
- Internal linking checklist for new content
- Anchor text guidelines
- Linking frequency targets
- Quarterly audit schedule

## Acceptance Criteria

- [ ] All orphan pages identified and mapped
- [ ] Topic clusters have complete linking maps
- [ ] Minimum 25 specific link addition recommendations
- [ ] Anchor text analysis covers all internal links
- [ ] Navigation review is included
- [ ] Implementation is phased and prioritised
- [ ] Each recommendation has a specific source, target, and anchor text

## Output Formats

- **Primary:** Markdown report with tables
- **Optional:** CSV link recommendations (for bulk implementation), visual cluster map
