// Netlify serverless function: /api/content-audit
//
// SECURITY: API key stored ONLY in Netlify env vars (server-side).
//
// Flow:
// 1. Client POSTs { url }
// 2. Claude uses web_search to access and analyse the page itself
// 3. No server-side HTML fetch — no 4xx issues from bot blocking
// 4. Returns structured JSON audit

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

  const apiKey = process.env.Anthropicv2;
  if (!apiKey) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server configuration error. Contact administrator.' }) };
  }

  let url;
  try {
    const body = JSON.parse(event.body || '{}');
    url = body.url;
    if (!url || typeof url !== 'string') throw new Error('Missing url');
    url = url.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) url = 'https://' + url;
    new URL(url);
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid or missing URL' }) };
  }

  const systemPrompt = `You are an expert SEO analyst. You will be given a URL to audit. Use your web_search tool to access and analyse the page. Examine the live page content, meta tags, headings, structure, and all SEO elements.

Return ONLY a JSON object (no markdown fences, no preamble, no explanation) with this exact structure:

{"url":"...","pageType":"Product Listing Page|Product Detail Page|Blog Post|Homepage|Service Page|Category Page|Other","industry":"...","title":{"value":"...","length":0,"status":"PASS|FAIL|NEEDS WORK","note":"..."},"metaDescription":{"value":"...","length":0,"status":"PASS|FAIL|NEEDS WORK","note":"..."},"h1":{"value":"...","status":"PASS|FAIL|NEEDS WORK","note":"..."},"canonical":{"value":"...","status":"PASS|FAIL|MISSING","note":"..."},"ogUrl":{"status":"PASS|MISMATCH|MISSING","note":"..."},"schema":{"count":0,"types":[],"status":"PASS|MISSING","note":"..."},"hreflang":{"count":0,"status":"PASS|MISSING","note":"..."},"contentQualityScore":0,"aiCitationReadiness":0,"eeat":{"experience":{"score":0,"signals":"..."},"expertise":{"score":0,"signals":"..."},"authoritativeness":{"score":0,"signals":"..."},"trustworthiness":{"score":0,"signals":"..."},"overall":0,"rating":"Strong|Moderate|Weak|Very Low"},"contentMetrics":{"wordCount":0,"editorialContent":"...","avgSentenceLength":0,"headingStructure":{"h1Count":0,"h2s":[],"h3s":[]},"internalLinks":0,"externalLinks":0,"images":{"total":0,"withAlt":0,"withoutAlt":0,"altQuality":"..."}},"geoSignals":[{"signal":"...","present":false,"impact":"High|Medium|Low"}],"issues":[{"priority":"Critical|High|Medium|Low","issue":"...","category":"Content|E-E-A-T|Images|Schema|Technical|i18n|GEO|Social|Freshness"}],"recommendations":[{"priority":"Critical|High|Medium|Low","title":"...","description":"..."}],"summary":"..."}

RULES:
- H1 should focus on main target ranking keyword. Do NOT recommend adding modifiers or brand qualifiers.
- Missing structured data = Medium priority max. LLMs parse front-end content directly.
- OG tag mismatches = Low priority. Social sharing only.
- Missing hreflang = Medium unless wrong regional page is ranking.
- For PLP/PDP: do NOT penalise missing physical address or policy page links. Site-level signals.
- Critical = blocks indexing or triggers penalties ONLY.
- Return ONLY valid JSON, nothing else.`;

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
        max_tokens: 16000,
        system: systemPrompt,
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
        messages: [{
          role: 'user',
          content: `Perform a full SEO content and E-E-A-T audit on this URL: ${url}\n\nUse web search to access and examine the live page. Analyse everything you can find about the page content, meta tags, headings, images, structured data, and all on-page SEO elements. Then return ONLY the JSON audit object.`
        }],
      }),
    });

    if (!claudeRes.ok) {
      const errText = await claudeRes.text();
      console.error('Anthropic API error:', claudeRes.status, errText);
      return { statusCode: 502, headers, body: JSON.stringify({ error: 'Analysis service unavailable. Try again shortly.' }) };
    }

    const claudeData = await claudeRes.json();
    const textBlocks = (claudeData.content || []).filter((b) => b.type === 'text');
    const rawText = textBlocks.map((b) => b.text).join('');

    let audit;
    try {
      const clean = rawText.replace(/^```json\s*/m, '').replace(/```\s*$/m, '').trim();
      const jsonMatch = clean.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON found');
      audit = JSON.parse(jsonMatch[0]);
    } catch (parseErr) {
      console.error('JSON parse error:', parseErr.message, 'Raw:', rawText.substring(0, 500));
      return { statusCode: 200, headers, body: JSON.stringify({ error: 'Analysis completed but output was malformed. Retrying may help.', partial: rawText.substring(0, 1000) }) };
    }

    audit._meta = {
      analysedAt: new Date().toISOString(),
      model: 'claude-sonnet-4-20250514',
      inputTokens: claudeData.usage?.input_tokens || null,
      outputTokens: claudeData.usage?.output_tokens || null,
    };

    return { statusCode: 200, headers, body: JSON.stringify(audit) };

  } catch (e) {
    console.error('Unexpected error:', e);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Unexpected server error. Try again.' }) };
  }
};
