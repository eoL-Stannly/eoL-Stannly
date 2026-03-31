# Indexation Management

## Overview
Managing what Google indexes is critical for SEO. Over-indexation dilutes crawl budget and can create duplicate content issues. Under-indexation means lost organic visibility.

## Index Control Mechanisms

### Meta Robots Tags
- `noindex` — prevent page from appearing in search results
- `nofollow` — don't follow links on this page for crawling/ranking
- `noindex, follow` — don't index but still follow links (useful for faceted pages)
- Applied via `<meta name="robots">` tag or X-Robots-Tag HTTP header
- X-Robots-Tag works for non-HTML resources (PDFs, images)

### Canonical Tags
- `<link rel="canonical" href="...">` signals the preferred version of a page
- Self-referencing canonicals are best practice on every indexable page
- Cross-domain canonicals supported but treated as hints
- Must point to indexable (200 status, not noindexed) pages
- Google may ignore canonicals if signals conflict (internal links, sitemaps)

### Robots.txt
- Controls crawling, NOT indexing (blocked pages can still be indexed via links)
- Use for: crawl budget optimization, blocking dev/staging, preventing parameter crawling
- Don't use for: keeping pages out of index (use noindex instead)
- Test in GSC Robots.txt Tester before deploying changes

## Google Search Console Index Coverage
- Monitor "Pages" report for indexing status
- Key statuses: Indexed, Discovered/Not indexed, Crawled/Not indexed, Excluded
- "Discovered — currently not indexed" often indicates quality or crawl budget issues
- "Crawled — currently not indexed" suggests content quality concerns
- Use URL Inspection tool to check individual page status and request indexing

## Index Bloat Signals
- Site: search showing significantly more results than expected
- Large gap between submitted URLs and indexed URLs in GSC
- Thin/duplicate pages appearing in search results
- GSC showing thousands of "Excluded by noindex" (check if intentional)

## Remediation
1. Audit indexed pages vs intended pages
2. Noindex low-value pages (tag pages, author archives, search results)
3. Consolidate duplicates via canonicals or 301 redirects
4. Improve internal linking to important under-indexed pages
5. Use Google's URL removal tool for urgent removals (temporary, 6 months)
