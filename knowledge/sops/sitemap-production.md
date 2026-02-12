# SOP: XML Sitemap Production & Optimisation

**Owner:** Ken (Data Scientist & Engineer) & Rob (Principal SEO — Technical)
**Version:** 1.0
**Last Updated:** 2026-02-12

---

## Purpose

Define the standard procedure for auditing, producing, and optimising XML sitemaps. Ensures efficient crawl budget utilisation, correct indexation signals, and alignment between sitemap contents and the site's canonical, indexable URL set.

## Scope

Covers XML sitemap audits, sitemap generation, sitemap index files, image/video sitemaps, and submission/monitoring.

## Prerequisites

- Full site crawl data
- Google Search Console access
- Robots.txt access
- Current sitemap files (if any)
- CMS/platform documentation for sitemap generation

## Procedure

### Step 1: Current Sitemap Audit

1. Locate all existing sitemaps:
   - Check robots.txt for sitemap declarations
   - Check common paths: /sitemap.xml, /sitemap_index.xml
   - Check GSC submitted sitemaps
2. Validate existing sitemaps:
   - XML syntax validation (well-formed XML)
   - URL count per sitemap (max 50,000 URLs per file)
   - File size (max 50MB uncompressed per file)
   - Correct namespace declarations
3. Audit sitemap contents against crawl data:
   - URLs in sitemap returning non-200 status codes
   - URLs in sitemap that are noindexed
   - URLs in sitemap that redirect
   - URLs in sitemap that are non-canonical
   - Indexable URLs missing from sitemap
4. Check `<lastmod>` accuracy (does it reflect actual content changes?)
5. Check `<changefreq>` and `<priority>` usage (optional but review if present)

### Step 2: Indexable URL Set Definition

1. Define the canonical, indexable URL set:
   - 200 status code
   - Self-canonicalised
   - No noindex directive
   - Not blocked by robots.txt
   - Not a duplicate or near-duplicate
2. Segment URLs by type/template:
   - Homepage
   - Category/hub pages
   - Product/service pages
   - Blog/article pages
   - Location/local pages
   - Utility pages (about, contact, etc.)
3. Calculate total indexable URLs and compare to GSC indexed count

### Step 3: Sitemap Architecture Design

1. Design sitemap structure based on site size:
   - **Small sites (<1,000 URLs)**: Single sitemap.xml
   - **Medium sites (1,000–50,000 URLs)**: Sitemap index with type-based sub-sitemaps
   - **Large sites (50,000+ URLs)**: Sitemap index with multiple sub-sitemaps per type
2. Recommended sitemap index structure:
   ```xml
   sitemap-index.xml
   ├── sitemap-pages.xml        (core pages)
   ├── sitemap-blog.xml         (articles/posts)
   ├── sitemap-products.xml     (product pages)
   ├── sitemap-categories.xml   (category pages)
   ├── sitemap-images.xml       (image sitemap, optional)
   └── sitemap-videos.xml       (video sitemap, optional)
   ```
3. Ensure each sub-sitemap stays under 50,000 URLs / 50MB

### Step 4: Sitemap Generation

1. Generate sitemaps including only the defined indexable URL set
2. For each URL, include:
   - `<loc>` — full absolute URL (HTTPS, canonical version)
   - `<lastmod>` — accurate last modification date (ISO 8601)
3. Optional elements (include if data is reliable):
   - `<changefreq>` — based on actual update patterns
   - `<priority>` — relative importance within the site
4. For image sitemaps:
   - Include `<image:image>` entries for key images
   - Add `<image:title>` and `<image:caption>` where available
5. For video sitemaps:
   - Include `<video:video>` entries with required fields
   - Add thumbnail URL, title, description, duration

### Step 5: Validation

1. Validate all generated sitemaps:
   - XML well-formedness
   - Schema validation against sitemap protocol
   - All URLs return 200 status
   - All URLs are HTTPS
   - All URLs are canonical
   - No duplicate URLs across sitemaps
2. Verify sitemap index references all sub-sitemaps correctly
3. Test gzip compression if using compressed sitemaps

### Step 6: Submission & Deployment

1. Deploy sitemaps to the site root (or agreed location)
2. Update robots.txt with sitemap location:
   ```
   Sitemap: https://example.com/sitemap-index.xml
   ```
3. Submit sitemaps via Google Search Console
4. Submit sitemaps via Bing Webmaster Tools (if applicable)
5. Verify successful processing in GSC (check for errors)

### Step 7: Ongoing Maintenance

1. Define sitemap update cadence:
   - Dynamic sitemaps: auto-update with content changes (preferred)
   - Static sitemaps: regenerate monthly or with significant content changes
2. Monitor in GSC:
   - Submitted vs. indexed URL counts
   - Sitemap errors and warnings
   - Coverage report trends
3. Re-audit quarterly or after major site changes

## Escalation

- Sitemap generation tool issues: Ken to develop custom solution
- Indexation discrepancies >20%: escalate to Rob for technical investigation
- Large-scale sitemap restructuring: coordinate with Ewan for client planning

## Output

Deliverable must conform to the **Sitemap Production PRD** specification.
