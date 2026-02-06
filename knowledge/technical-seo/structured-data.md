# Structured Data & Schema Markup

## Overview
Structured data helps search engines understand page content and can unlock rich results (featured snippets, knowledge panels, carousels, FAQs, etc.) in SERPs.

## Implementation Format
- **JSON-LD** is Google's recommended format (placed in `<script type="application/ld+json">`)
- Microdata and RDFa are supported but less preferred
- JSON-LD can be injected dynamically via JavaScript (Google renders JS)

## High-Impact Schema Types

### Organization / LocalBusiness
- Company name, logo, contact info, social profiles
- Essential for brand knowledge panel
- LocalBusiness schema for local SEO (address, hours, geo coordinates)

### Article / BlogPosting
- Author, datePublished, dateModified, headline, image
- Supports rich results in Google News and Discover
- Use author schema with links to author pages for E-E-A-T

### Product
- Name, price, availability, reviews, SKU
- Powers product rich results and Google Shopping
- Requires price and availability for merchant listing experiences

### FAQ / HowTo
- FAQ schema can show expandable Q&A in SERPs
- HowTo schema shows step-by-step instructions
- Both drive additional SERP real estate

### BreadcrumbList
- Shows breadcrumb trail in search results
- Improves click-through rate and helps Google understand site hierarchy

### Review / AggregateRating
- Star ratings in search results
- Cannot be self-serving (must be from genuine third-party reviews)
- Google has strict guidelines — misuse can result in manual actions

## Validation & Testing
- Google Rich Results Test: test individual pages for eligibility
- Schema.org Validator: check syntax correctness
- GSC Enhancements reports: monitor site-wide structured data issues
- Google Structured Data Markup Helper: generate schema from existing pages

## Best Practices
- Only mark up content that is visible on the page
- Keep schema accurate and up-to-date (especially prices, availability)
- Don't mark up hidden or misleading content (spammy FAQ, fake reviews)
- Test all schema before deploying to production
- Monitor GSC for structured data errors and warnings
