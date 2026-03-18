// Backwards-compatible redirect: /api/content-audit -> /api/seo-tool with command=content
// The PageContentAuditModal may still call this endpoint

export const handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  // Just forward to the seo-tool function logic
  const apiKey = process.env.Anthropicv2;
  if (!apiKey) return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server configuration error.' }) };

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

  const systemPrompt = `You are an expert SEO analyst. Use web_search to access the given URL. Analyse E-E-A-T and content quality. Return ONLY valid JSON: {url, pageType, industry, contentQualityScore (0-100), aiCitationReadiness (0-100), eeat:{experience:{score,signals},expertise:{score,signals},authoritativeness:{score,signals},trustworthiness:{score,signals},overall,rating}, title:{value,length,status,note}, metaDescription:{value,length,status,note}, h1:{value,status,note}, schema:{count,types[],status,note}, issues:[{priority,issue,category}], recommendations:[{priority,title,description}], summary}. No markdown, no preamble.`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 12000,
        system: systemPrompt,
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
        messages: [{ role: 'user', content: `Run a content & E-E-A-T audit on: ${url}` }],
      }),
    });

    if (!res.ok) return { statusCode: 502, headers, body: JSON.stringify({ error: 'API error. Try again.' }) };
    const data = await res.json();
    const rawText = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('');
    
    let audit;
    try {
      const clean = rawText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      const m = clean.match(/\{[\s\S]*\}/);
      if (!m) throw new Error('No JSON');
      audit = JSON.parse(m[0]);
    } catch {
      return { statusCode: 200, headers, body: JSON.stringify({ error: 'Output malformed. Try again.', partial: rawText.substring(0, 1000) }) };
    }
    
    audit._meta = { analysedAt: new Date().toISOString(), model: 'claude-sonnet-4-20250514', inputTokens: data.usage?.input_tokens, outputTokens: data.usage?.output_tokens };
    return { statusCode: 200, headers, body: JSON.stringify(audit) };
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server error: ' + e.message }) };
  }
};
