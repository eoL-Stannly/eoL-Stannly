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
{"url":"the URL","pageType":"...","industry":"...","title":{"value":"...","length":0,"status":"...","note":"..."},"metaDescription":{"value":"...","length":0,"status":"...","note":"..."},"h1":{"value":"...","status":"...","note":"..."},"canonical":{"value":"...","status":"...","note":"..."},"ogUrl":{"status":"...","note":"..."},"schema":{"count":0,"types":[],"status":"...","note":"..."},"hreflang":{"count":0,"status":"...","note":"..."},"contentQualityScore":0,"aiCitationReadiness":0,"eeat":{"experience":{"score":0,"signals":"..."},"expertise":{"score":0,"signals":"..."},"authoritativeness":{"score":0,"signals":"..."},"trustworthiness":{"score":0,"signals":"..."},"overall":0,"rating":"..."},"contentMetrics":{},"geoSignals":[],"issues":[],"recommendations":[],"summary":"..."}

RULES: H1 = keyword focused. Missing schema = Medium max. OG tags = Low. Hreflang = Medium. PLP/PDP: no penalty for missing address/policy. Critical = indexing blockers only. Return ONLY valid JSON.`;

  try {
    const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST', headers: {'Content-Type': 'application/json','x-api-key': apiKey,'anthropic-version': '2023-06-01'},
      body: JSON.stringify({model: 'claude-sonnet-4-20250514', max_tokens: 8000, system: systemPrompt, messages: [{ role: 'user', content: `Analyse.\nURL: ${url}\nHTML:\n${pageHtml}` }]}),
    });
    if (!claudeRes.ok) { return { statusCode: 502, headers, body: JSON.stringify({ error: 'Analysis service unavailable.' }) }; }
    const claudeData = await claudeRes.json();
    const rawText = claudeData.content?.find(b => b.type === 'text')?.text || '';
    let audit;
    try { audit = JSON.parse(rawText.replace(/^```json\s*/m, '').replace(/```\s*$/m, '').trim()); }
    catch { return { statusCode: 200, headers, body: JSON.stringify({ error: 'Malformed output. Retry.' }) }; }
    audit._meta = { analysedAt: new Date().toISOString(), model: 'claude-sonnet-4-20250514', inputTokens: claudeData.usage?.input_tokens, outputTokens: claudeData.usage?.output_tokens };
    return { statusCode: 200, headers, body: JSON.stringify(audit) };
  } catch (e) { return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server error.' }) }; }
};