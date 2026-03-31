# SOP: Performance Analysis & Reporting

**Owner:** Alex (Data Scientist & Engineer)
**Version:** 1.0
**Last Updated:** 2026-02-12

---

## Purpose

Define the standard procedure for analysing SEO performance data, generating insights, and producing actionable reports. Ensures data accuracy, consistent methodology, and clear communication of findings.

## Scope

Covers organic traffic analysis, ranking performance, conversion tracking, Core Web Vitals assessment, competitive benchmarking, and custom reporting dashboards.

## Prerequisites

- Google Search Console access (verified property)
- Google Analytics access (GA4 preferred)
- Rank tracking tool data
- Client KPIs and reporting cadence agreement
- Historical baseline data (minimum 3 months)

## Procedure

### Step 1: Data Collection & Validation

1. Pull data from all sources for the reporting period:
   - GSC: clicks, impressions, CTR, average position by page and query
   - Analytics: organic sessions, users, bounce rate, engagement, conversions
   - Rank tracker: keyword positions, SERP features, visibility score
   - Core Web Vitals: LCP, INP, CLS (field and lab data)
2. Validate data integrity:
   - Check for tracking gaps or anomalies
   - Verify date ranges align across sources
   - Confirm conversion tracking is firing correctly
   - Flag any data discrepancies between sources

### Step 2: Traffic & Visibility Analysis

1. Calculate period-over-period changes:
   - Organic traffic (sessions/clicks) vs. previous period
   - Organic traffic vs. same period previous year (YoY)
   - Organic visibility/share of voice trend
2. Segment traffic by:
   - Page type (homepage, category, product, blog, etc.)
   - Device (desktop, mobile, tablet)
   - Geography (if multi-market)
   - Landing page groups
3. Identify:
   - Top gaining pages (traffic increase)
   - Top declining pages (traffic decrease)
   - New pages entering top 100
   - Pages dropping out of top 100

### Step 3: Keyword & Ranking Analysis

1. Analyse ranking movements:
   - Keywords moving into top 3, top 10, top 20
   - Keywords declining significantly (>5 positions)
   - New keyword rankings acquired
   - Featured snippet wins/losses
2. Map ranking changes to known actions:
   - Content published/updated
   - Technical changes deployed
   - Links acquired
   - Algorithm updates
3. Competitive ranking comparison on target keywords

### Step 4: Conversion & Revenue Analysis

1. Track organic conversion metrics:
   - Conversion rate by landing page group
   - Revenue attributed to organic (if e-commerce)
   - Lead volume from organic (if lead gen)
   - Assisted conversions from organic
2. Calculate ROI metrics:
   - Cost per organic acquisition vs. paid
   - Organic revenue growth rate
   - SEO investment vs. organic revenue ratio

### Step 5: Technical Health Assessment

1. Review Core Web Vitals trends:
   - LCP (Largest Contentful Paint) — target < 2.5s
   - INP (Interaction to Next Paint) — target < 200ms
   - CLS (Cumulative Layout Shift) — target < 0.1
2. Crawl health metrics:
   - Crawl budget utilisation
   - Indexation rate (indexed vs. submitted)
   - Error rates (4xx, 5xx, soft 404s)
3. Flag critical technical issues affecting performance

### Step 6: Insight Generation & Recommendations

1. Synthesise findings into actionable insights:
   - What happened (data-backed observation)
   - Why it happened (root cause analysis)
   - What to do about it (specific recommendation)
   - Expected impact (forecast based on data)
2. Prioritise recommendations by:
   - Potential traffic/revenue impact
   - Implementation effort
   - Time to impact
3. Tie recommendations to specific tasks/deliverables

### Step 7: Report Assembly & QA

1. Compile report in PRD-specified format
2. Include executive summary (3–5 key takeaways)
3. Visualise key metrics with charts/graphs
4. Add commentary explaining trends in plain language
5. QA all numbers — spot-check calculations against source data
6. Peer review before delivery

## Escalation

- Traffic drops >20% MoM require immediate Ewan (Head of SEO) notification
- Suspected algorithm update impacts should be escalated to Craig and Rob
- Client-facing report delivery coordinated through Mya

## Output

Deliverable must conform to the **Performance Analysis PRD** specification.
