# SOP: Internal Linking Audit & Strategy

**Owner:** Rob (Principal SEO — Technical) & Craig (SEO Director — Content)
**Version:** 1.0
**Last Updated:** 2026-02-12

---

## Purpose

Define the standard procedure for auditing internal link structures and developing linking strategies that improve crawlability, distribute page authority, and support topic cluster architecture.

## Scope

Covers internal linking audits, anchor text analysis, topic cluster linking strategies, orphan page remediation, and link equity flow optimisation.

## Prerequisites

- Full site crawl with internal link data
- Site architecture map or content inventory
- Keyword-to-page mapping (from keyword research)
- Google Search Console data (internal links report)
- Analytics data (page-level traffic)

## Procedure

### Step 1: Current State Audit

1. Crawl the site and extract internal link graph:
   - Total internal links per page (inbound and outbound)
   - Anchor text distribution
   - Link depth (clicks from homepage)
   - Follow vs. nofollow internal links
2. Identify structural issues:
   - **Orphan pages** — pages with zero internal links pointing to them
   - **Dead-end pages** — pages with no outbound internal links
   - **Thin link pages** — important pages with <3 inbound internal links
   - **Over-linked pages** — pages with excessive outbound links (>100)
3. Map link equity flow using crawl depth + link count data

### Step 2: Content Cluster Mapping

1. Group all pages into topic clusters (align with keyword research clusters)
2. Identify pillar pages for each cluster
3. Map supporting content to each pillar
4. For each cluster, verify:
   - Pillar page links to all supporting pages
   - Supporting pages link back to pillar
   - Supporting pages cross-link where topically relevant
   - No cross-cluster dilution (irrelevant cross-linking)

### Step 3: Anchor Text Analysis

1. Audit anchor text usage across internal links:
   - Primary keyword anchor usage (should be natural, not over-optimised)
   - Generic anchors ("click here", "read more") — flag for improvement
   - Descriptive anchors — verify they match target page topic
2. Check for anchor text conflicts:
   - Multiple pages linking with same anchor to different targets
   - Same page being linked with conflicting anchor text
3. Develop anchor text guidelines per cluster

### Step 4: Strategic Link Recommendations

1. For each cluster, recommend specific internal links to add:
   - **Source page** (where the link will be placed)
   - **Target page** (where the link points to)
   - **Anchor text** (recommended phrasing)
   - **Placement** (in-content, sidebar, related posts, breadcrumb)
   - **Priority** (based on target page importance)
2. Prioritise recommendations by:
   - Target page traffic potential (keyword opportunity)
   - Current link deficit (how underlinked is the target)
   - Source page authority (stronger pages = more valuable links)
   - Topical relevance between source and target

### Step 5: Navigation & Sitewide Link Review

1. Evaluate main navigation:
   - Are high-priority pages accessible from nav?
   - Is navigation too deep (>7 items per level)?
   - Mobile navigation usability
2. Review footer links:
   - Relevant category/service links present
   - No excessive footer link stuffing
3. Review breadcrumb implementation:
   - Breadcrumbs present on all sub-pages
   - Breadcrumb schema markup implemented
   - Hierarchy matches URL structure
4. Evaluate sidebar/related content modules:
   - Dynamically populated with relevant content
   - Not pulling in unrelated pages

### Step 6: Implementation Guide

1. Create prioritised link addition list (spreadsheet format):
   - Phase 1: Critical orphan page fixes
   - Phase 2: Pillar-to-cluster connections
   - Phase 3: Cross-cluster strategic links
   - Phase 4: Anchor text optimisation
2. Provide CMS-specific implementation guidance where applicable
3. Define ongoing internal linking best practices for new content

### Step 7: Quality Assurance

- Verify all recommended links are topically relevant
- Check no recommendations create redirect chains
- Ensure link additions won't cause over-optimisation
- Peer review linking strategy against site architecture

## Escalation

- Major site architecture changes: escalate to Ewan for client alignment
- Content reorganisation needed: coordinate with Craig
- Technical implementation issues: Rob to provide dev specifications

## Output

Deliverable must conform to the **Internal Linking PRD** specification.
