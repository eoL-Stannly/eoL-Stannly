# Google Search Console & Analytics for SEO

## Google Search Console (GSC)

### Key Reports

#### Performance Report
- **Queries**: What users searched for to find your pages
- **Pages**: Which pages received clicks/impressions
- **Metrics**: Clicks, Impressions, CTR, Average Position
- **Filters**: Date range, query, page, country, device, search appearance
- **Export**: Up to 1,000 rows in UI, 50,000 via API
- **Data retention**: 16 months of data

#### Index Coverage / Pages Report
- Shows indexing status of all discovered URLs
- Statuses: Indexed, Not indexed (with reasons)
- Common issues: Redirect errors, 404s, soft 404s, server errors
- "Excluded" is not always bad (noindex, canonical, duplicates may be intentional)

#### Core Web Vitals Report
- Shows CWV pass/fail rates by URL group (template)
- Separates mobile and desktop
- Based on CrUX field data (real users)
- Shows trends over time

#### Links Report
- Top linked pages (external)
- Top linking sites
- Top linking text (anchor text)
- Internal links per page

### GSC API
- Programmatic access to Performance and Inspection data
- Up to 50,000 rows per query (vs 1,000 in UI)
- Useful for large-scale keyword and page analysis
- Rate limit: 1,200 queries per minute per project
- Python client: `google-api-python-client` with service account auth

## Google Analytics 4 (GA4)

### Key SEO Reports
- **Traffic Acquisition**: Filter by "Organic Search" to see SEO traffic
- **Landing Pages**: Which pages users arrive on from organic search
- **Engagement**: Bounce rate, engaged sessions, time on page
- **Conversions**: Track goal completions from organic traffic

### GA4 + GSC Integration
- Link GA4 and GSC properties for combined data
- See search queries alongside engagement/conversion data
- Available in GA4 under Acquisition > Search Console

## Reporting Best Practices
- Report on business outcomes, not just rankings
- Track: organic sessions, conversions, revenue (if e-commerce), leads
- Segment by brand vs non-brand traffic
- Compare period-over-period and year-over-year
- Include competitor visibility trends
- Use annotations for algorithm updates and major changes
