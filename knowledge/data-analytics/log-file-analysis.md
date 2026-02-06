# Log File Analysis for SEO

## Overview
Server log file analysis reveals exactly how search engine bots crawl your site. Unlike third-party crawl tools, log data shows real bot behavior — what they actually request, how often, and what responses they get.

## What Log Files Tell You
- Which URLs Googlebot actually crawls (vs what you think it crawls)
- Crawl frequency per section/template
- HTTP status codes returned to bots
- Crawl waste on non-indexable URLs
- Bot response time (slow pages get crawled less)
- Googlebot rendering requests (separate from crawl requests)

## Key Bots to Track
- **Googlebot** (desktop): `Googlebot/2.1`
- **Googlebot** (smartphone): `Googlebot Smartphone`
- **Googlebot-Image**: Image crawling
- **Googlebot-Video**: Video crawling
- **Bingbot**: Bing's crawler
- **AdsBot-Google**: Ads quality checks (separate crawl budget)

## Analysis Framework

### 1. Crawl Distribution
- What % of crawls go to indexable vs non-indexable URLs?
- Are important pages being crawled frequently enough?
- Is crawl budget being wasted on parameter URLs, redirects, or 404s?

### 2. Crawl Frequency
- How often are key pages recrawled?
- Do new pages get discovered quickly?
- Has crawl rate changed after a site update or algorithm change?

### 3. Status Code Analysis
- What % of bot requests return 200 vs 301 vs 404 vs 500?
- Are there 5xx errors the bot is encountering that users aren't?
- Are redirect chains visible in the logs?

### 4. Response Time
- Average server response time for bot requests
- Pages with consistently slow response times (>500ms)
- Correlation between response time and crawl frequency

## Tools
- **Screaming Frog Log Analyser**: Import and visualize log data
- **Splunk / ELK Stack**: Enterprise-level log analysis
- **BigQuery**: Import logs for SQL-based analysis at scale
- **Custom Python scripts**: pandas for parsing and aggregating log data

## Implementation
1. Request raw access logs from hosting provider (Apache/Nginx format)
2. Filter to bot traffic only (user agent matching)
3. Map crawled URLs to your site's URL taxonomy
4. Cross-reference with GSC data and crawl tool data
5. Identify crawl budget waste and optimization opportunities
6. Repeat monthly or after major site changes
