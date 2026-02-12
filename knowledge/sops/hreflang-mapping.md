# SOP: HREFLANG & International SEO Mapping

**Owner:** Alex (Data Scientist & Engineer) & Rob (Principal SEO — Technical)
**Version:** 1.0
**Last Updated:** 2026-02-12

---

## Purpose

Define the standard procedure for auditing and implementing hreflang tags across multi-language and multi-regional websites. Ensures correct language/region targeting, prevents duplicate content issues, and maximises international search visibility.

## Scope

Covers hreflang audits, tag generation, implementation specifications, and ongoing monitoring for international SEO deployments.

## Prerequisites

- Complete URL inventory for all language/region variants
- Market/language targeting matrix from client
- Current hreflang implementation (if any)
- Google Search Console data for all properties/variants
- CMS/platform documentation for implementation method

## Procedure

### Step 1: Language/Region Matrix Definition

1. Document all target markets:
   - Language code (ISO 639-1): en, fr, de, es, etc.
   - Region code (ISO 3166-1): US, GB, FR, DE, etc.
   - Combined hreflang value: en-US, en-GB, fr-FR, de-DE, etc.
2. Define the x-default target (usually the primary/English version)
3. Map domain structure:
   - ccTLDs (example.co.uk, example.fr)
   - Subdirectories (example.com/en/, example.com/fr/)
   - Subdomains (en.example.com, fr.example.com)
4. Document any partial translations (pages existing in some languages but not all)

### Step 2: URL Mapping Across Variants

1. For each page in the primary language, identify equivalents in all other languages:
   - 1:1 mapped pages (direct translations)
   - Pages with no equivalent (language-specific content)
   - Partially translated pages
2. Create a mapping table:
   | Primary URL | en-US | en-GB | fr-FR | de-DE | x-default |
   |------------|-------|-------|-------|-------|-----------|
   | /product-a | URL   | URL   | URL   | URL   | URL       |
3. Validate all mapped URLs return 200 status codes
4. Flag URLs that redirect (redirecting hreflang targets are invalid)

### Step 3: Current Implementation Audit

1. If hreflang tags exist, audit for:
   - **Missing return tags** — every hreflang must have reciprocal tags
   - **Incorrect language/region codes** — common errors: en-UK (should be en-GB), zh-CN vs zh-TW
   - **Self-referencing tags** — each page must include itself in the hreflang set
   - **x-default missing** — every set should have an x-default
   - **Canonical conflicts** — canonical URL differs from hreflang URL
   - **Indexability conflicts** — noindex pages in hreflang sets
   - **Mixed implementation** — tags in HTML head AND sitemap (choose one)
2. Document all errors with specific URLs

### Step 4: Hreflang Tag Generation

1. Generate complete hreflang tag sets for each page:
   ```html
   <link rel="alternate" hreflang="en-US" href="https://example.com/en-us/page" />
   <link rel="alternate" hreflang="en-GB" href="https://example.com/en-gb/page" />
   <link rel="alternate" hreflang="fr-FR" href="https://example.com/fr/page" />
   <link rel="alternate" hreflang="x-default" href="https://example.com/page" />
   ```
2. Verify every tag set includes:
   - Self-referencing tag
   - All language variants for that page
   - x-default designation
   - Absolute URLs (not relative)
   - Canonical-consistent URLs

### Step 5: Implementation Specification

1. Recommend implementation method based on site size/CMS:
   - **HTML link tags** — best for smaller sites (<1000 pages per language)
   - **XML sitemap** — best for large sites or dynamic implementations
   - **HTTP headers** — for non-HTML files (PDFs, etc.)
2. Provide platform-specific implementation guide
3. Include testing/validation steps for development team
4. Define rollout plan (phased by template/section if large site)

### Step 6: Validation & Testing

1. Pre-launch validation:
   - Parse all generated tags for syntax errors
   - Verify reciprocal tag completeness (every page references every variant)
   - Check no hreflang points to redirecting URLs
   - Confirm canonical and hreflang alignment
2. Post-launch validation:
   - Crawl all variants to verify tags are live
   - Check GSC International Targeting report for errors
   - Monitor for hreflang errors in GSC (typically appears within 1–2 weeks)

### Step 7: Ongoing Monitoring

1. Define monitoring cadence (monthly minimum)
2. Track:
   - New pages added without hreflang
   - Language variants with indexation discrepancies
   - GSC hreflang error trends
   - International traffic distribution changes

## Escalation

- Conflicting client requirements on market targeting: escalate to Ewan
- CMS limitations preventing implementation: Rob to spec technical workaround
- Multi-market performance analysis: coordinate with Alex/Ken

## Output

Deliverable must conform to the **HREFLANG Mapping PRD** specification.
