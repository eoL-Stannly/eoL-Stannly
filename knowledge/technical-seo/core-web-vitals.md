# Core Web Vitals & Page Experience

## Overview
Core Web Vitals (CWV) are Google's metrics for measuring real-world user experience. They are a confirmed ranking signal as part of the page experience update.

## The Three Metrics

### Largest Contentful Paint (LCP)
- **Target**: Under 2.5 seconds
- Measures loading performance — when the largest visible element renders
- Common culprits: unoptimized images, render-blocking JS/CSS, slow server response
- Fixes: preload hero images, use CDN, implement critical CSS, lazy-load below-fold

### Interaction to Next Paint (INP)
- **Target**: Under 200 milliseconds
- Replaced FID in March 2024 as the responsiveness metric
- Measures latency of all user interactions throughout the page lifecycle
- Fixes: break up long tasks, use web workers, defer non-critical JS, optimize event handlers

### Cumulative Layout Shift (CLS)
- **Target**: Under 0.1
- Measures visual stability — unexpected layout shifts during page load
- Common culprits: images without dimensions, dynamic ad slots, web fonts (FOIT/FOUT)
- Fixes: set explicit width/height on media, reserve ad slots, use font-display: swap

## Measurement Tools
- **Field data**: Chrome User Experience Report (CrUX), GSC Core Web Vitals report, PageSpeed Insights
- **Lab data**: Lighthouse, Chrome DevTools Performance panel, WebPageTest
- Field data is what Google uses for ranking; lab data helps diagnose issues

## Optimization Strategy
1. Identify worst-performing page templates using CrUX data
2. Prioritize by traffic volume × failure rate
3. Fix template-level issues (affects all pages using that template)
4. Monitor field data for 28-day rolling improvements
5. Target "good" threshold for 75th percentile of page loads
