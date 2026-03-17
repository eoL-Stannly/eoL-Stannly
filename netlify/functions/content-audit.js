// Netlify serverless function: /api/content-audit
//
// SECURITY: The Anthropic API key is stored ONLY in Netlify environment
// variables (server-side). It never reaches the client browser.
// Set it in Netlify Dashboard > Site > Environment Variables > ANTHROPIC_API_KEY
//
// Flow:
// 1. Client POSTs { url } to /api/content-audit
// 2. This function fetches the page HTML server-side
// 3. Sends HTML to Claude API for analysis (key used server-side only)
// 4. Returns structured JSON audit results to client

export const handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  // API key is read from server-side env only — never sent to client
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500, headers,
      body: JSON.stringify({ error: 'Server configuration error. Contact administrator.' }),
    };
  }

  // Parse and validate input URL
  let url;
  try {
    const body = JSON.parse(event.body || '{}');
    url = body.url;
    if (!url || typeof url !== 'string') throw new Error('Missing url');
    url = url.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    new URL(url);
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid or missing URL' }) };
  }

  // Step 1: Fetch the target page HTML (server-side, no CORS issues)
  let pageHtml;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AyimaSEOAudit/1.0; +https://ayima.ai)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      redirect: 'follow',
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return {
        statusCode: 422, headers,
        body: JSON.stringify({ error: `Target returned HTTP ${res.status}`, url }),
      };
    }

    pageHtml = await res.text();
    // Cap at ~80k chars to stay within token budget
    if (pageHtml.length > 80000) {
      pageHtml = pageHtml.substring(0, 80000) + '\n<!-- TRUNCATED -->';
    }
  } catch (e) {
    return {
      statusCode: 422, headers,
      body: JSON.stringify({ error: `Could not fetch URL: ${e.message}`, url }),
    };
  }

  // Step 2: Call Anthropic API (server-side, key never leaves this function)
  const systemPrompt = `You are an expert SEO analyst performing a Page Content & E-E-A-T audit. You receive raw HTML of a web page. Analyse it and return ONLY a JSON object (no markdown fences, no preamble) with this structure:

{
  "url": "the URL",
  "pageType": "Product Listing Page|Product Detail Page|Blog Post|Homepage|Service Page|Category Page|Other",
  "industry": "detected industry",
  "title": { "value": "title tag text", "length": number, "status": "PASS|FAIL|NEEDS WORK", "note": "..." },
  "metaDescription": { "value": "meta desc text", "length": number, "status": "PASS|FAIL|NEEDS WORK", "note": "..." },
  "h1": { "value": "H1 text", "status": "PASS|FAIL|NEEDS WORK", "note": "..." },
  "canonical": { "value": "url or null", "status": "PASS|FAIL|MISSING", "note": "..." },
  "ogUrl": { "status": "PASS|MISMATCH|MISSING", "note": "..." },
  "schema": { "count": number, "types": [], "status": "PASS|MISSING", "note": "..." },
  "hreflang": { "count": number, "status": "PASS|MISSING", "note": "..." },
  "contentQualityScore": 0-100,
  "aiCitationReadiness": 0-100,
  "eeat": {
    "experience": { "score": 0-25, "signals": "brief description" },
    "expertise": { "score": 0-25, "signals": "brief description" },
    "authoritativeness": { "score": 0-25, "signals": "brief description" },
    "trustworthiness": { "score": 0-25, "signals": "brief description" },
    "overall": 0-100,
    "rating": "Strong|Moderate|Weak|Very Low"
  },
  "contentMetrics": {
    "wordCount": number,
    "editorialContent": "description",
    "avgSentenceLength": number,
    "headingStructure": { "h1Count": n, "h2s": ["..."], "h3s": ["..."] },
    "internalLinks": number,
    "externalLinks": number,
    "images": { "total": n, "withAlt": n, "withoutAlt": n, "altQuality": "description" }
  },
  "geoSignals": [
    { "signal": "name", "present": true|false, "impact": "High|Medium|Low" }
  ],
  "issues": [
    { "priority": "Critical|High|Medium|Low", "issue": "description", "category": "Content|E-E-A-T|Images|Schema|Technical|i18n|GEO|Social|Freshness" }
  ],
  "recommendations": [
    { "priority": "Critical|High|Medium|Low", "title": "short title", "description": "actionable detail" }
  ],
  "summary": "2-3 sentence executive summary"
}

RULES:
- H1 should focus on main target ranking keyword. Do NOT recommend adding modifiers or brand qualifiers.
- Missing structured data = Medium priority max. LLMs parse front-end content directly.
- OG tag mismatches = Low priority. Social sharing only.
- Missing hreflang = Medium unless wrong regional page is ranking.
- For PLP/PDP: do NOT penalise missing physical address or policy page links. Site-level signals.
- Critical = blocks indexing or triggers penalties ONLY.
- Return ONLY valid JSON.`;

  try {
    const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8000,
        system: systemPrompt,
        messages: [{ role: 'user', content: `Analyse this page.\n\nURL: ${url}\n\nHTML:\n${pageHtml}` }],
      }),
    });

    if (!claudeRes.ok) {
      const errText = await claudeRes.text();
      console.error('Anthropic API error:', claudeRes.status, errText);
      return {
        statusCode: 502, headers,
        body: JSON.stringify({ error: 'Analysis service unavailable. Try again shortly.' }),
      };
    }

    const claudeData = await claudeRes.json();
    const textBlock = claudeData.content?.find((b) => b.type === 'text');
    const rawText = textBlock?.text || '';

    // Parse JSON response
    let audit;
    try {
      const clean = rawText.replace(/^```json\s*/m, '').replace(/```\s*$/m, '').trim();
      audit = JSON.parse(clean);
    } catch {
      console.error('JSON parse error. Raw:', rawText.substring(0, 500));
      return {
        statusCode: 200, headers,
        body: JSON.stringify({ error: 'Analysis completed but output was malformed. Retrying may help.', partial: rawText.substring(0, 1000) }),
      };
    }

    // Add metadata
    audit._meta = {
      analysedAt: new Date().toISOString(),
      model: 'claude-sonnet-4-20250514',
      inputTokens: claudeData.usage?.input_tokens || null,
      outputTokens: claudeData.usage?.output_tokens || null,
    };

    return { statusCode: 200, headers, body: JSON.stringify(audit) };

  } catch (e) {
    console.error('Unexpected error:', e);
    return {
      statusCode: 500, headers,
      body: JSON.stringify({ error: 'Unexpected server error. Try again.' }),
    };
  }
};
