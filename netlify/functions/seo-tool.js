// Netlify serverless function: /api/seo-tool
// Single-call Claude API with web_search + retry on 429

const COMMAND_PROMPTS = {
  audit: { label: 'Toplevel General Audit', system: `You are an expert SEO analyst. Use web_search to access the given URL and perform a full website audit. Analyse crawlability, indexability, technical SEO, content quality, E-E-A-T, schema, images, and AI search readiness. Return ONLY valid JSON: {url, pageType, industry, overallScore (0-100), scores:{technical,content,onPage,schema,performance,aiReadiness,images}, issues:[{priority,issue,category}], recommendations:[{priority,title,description}], summary}` },
  page: { label: 'Deep Page Analysis', system: `You are an expert SEO analyst. Use web_search to access the given URL and perform deep single-page analysis. Examine title, meta description, H1-H6, content quality, keyword usage, links, images, schema, canonical, OG tags. Return ONLY valid JSON: {url, pageType, title:{value,length,status,note}, metaDescription:{value,length,status,note}, h1:{value,status,note}, headingStructure:{h1Count,h2s[],h3s[]}, canonical:{value,status}, schema:{count,types[],status}, contentMetrics:{wordCount,readability}, links:{internal,external}, images:{total,withAlt,withoutAlt}, issues:[{priority,issue,category}], recommendations:[{priority,title,description}], summary}` },
  technical: { label: 'Technical SEO Audit', system: `You are an expert technical SEO analyst. Use web_search to access the given URL. Audit: crawlability, indexability, speed indicators, HTTPS, mobile, URL structure, structured data, Core Web Vitals, international. Return ONLY valid JSON: {url, technicalScore (0-100), categories:[{name,score,status,findings[]}], issues:[{priority,issue,category}], recommendations:[{priority,title,description}], summary}. Critical = indexing blockers only. Schema = Medium max.` },
  content: { label: 'E-E-A-T Content Analysis', system: `You are an expert SEO analyst. Use web_search to access the given URL. Analyse E-E-A-T and content quality. Return ONLY valid JSON: {url, pageType, industry, contentQualityScore (0-100), aiCitationReadiness (0-100), eeat:{experience:{score,signals},expertise:{score,signals},authoritativeness:{score,signals},trustworthiness:{score,signals},overall,rating}, contentMetrics:{wordCount,editorialContent,headingStructure,internalLinks,externalLinks,images:{total,withAlt,withoutAlt}}, title:{value,length,status,note}, metaDescription:{value,length,status,note}, h1:{value,status,note}, issues:[{priority,issue,category}], recommendations:[{priority,title,description}], summary}. H1=keyword focused. Schema=Medium. PLP/PDP: no penalty for missing address/policy.` },
  schema: { label: 'Schema Markup Analysis', system: `You are a Schema.org expert. Use web_search to access the given URL. Detect existing schema, validate it, identify missing opportunities, recommend implementations. Return ONLY valid JSON: {url, pageType, schemaScore (0-100), existingSchema:[{type,valid,issues[]}], missingSchema:[{type,priority,reason}], recommendations:[{priority,title,description}], issues:[{priority,issue,category}], summary}` },
  images: { label: 'Image Optimization', system: `You are an image SEO expert. Use web_search to access the given URL. Analyse images for: alt text, file naming, format, lazy loading, dimensions. Return ONLY valid JSON: {url, imageScore (0-100), totalImages, withAlt, withoutAlt, altQuality, issues:[{priority,issue,category}], recommendations:[{priority,title,description}], suggestedAlts:[{currentAlt,suggestedAlt}], summary}` },
  sitemap: { label: 'Sitemap Analysis', system: `You are a sitemap expert. Use web_search to find and analyse the sitemap (check /sitemap.xml, /sitemap_index.xml, robots.txt). Return ONLY valid JSON: {url, sitemapUrl, sitemapFound, format, urlCount, sitemapScore (0-100), issues:[{priority,issue,category}], recommendations:[{priority,title,description}], summary}` },
  geo: { label: 'AI/GEO Optimization', system: `You are a GEO expert. Use web_search to access the given URL. Analyse AI citation readiness, AI crawler access, content structure for AI engines. Return ONLY valid JSON: {url, geoScore (0-100), citabilitySignals:[{signal,present,impact}], issues:[{priority,issue,category}], recommendations:[{priority,title,description}], summary}` },
  plan: { label: 'Strategic SEO Plan', system: `You are a senior SEO strategist. Use web_search to research the given website. Create a strategic plan. Return ONLY valid JSON: {url, businessType, industry, keywordStrategy:{primaryKeywords[],secondaryKeywords[]}, contentPillars:[{topic,priority,description}], technicalPriorities:[{item,priority,description}], actionPlan:[{phase,timeline,actions[]}], issues:[{priority,issue,category}], recommendations:[{priority,title,description}], summary}` },
  programmatic: { label: 'Programmatic SEO', system: `You are a programmatic SEO expert. Use web_search to access the given URL. Analyse template patterns, content uniqueness, thin content risks, scaling opportunities. Return ONLY valid JSON: {url, pageType, contentUniqueness (0-100), thinContentRisk, scalingOpportunities:[{opportunity,priority,description}], issues:[{priority,issue,category}], recommendations:[{priority,title,description}], summary}` },
  'competitor-pages': { label: 'Competitor Comparison', system: `You are an SEO competitive analyst. Use web_search to analyse the given URL and find competitors. Return ONLY valid JSON: {url, pageType, competitors:[{url,domain,strengths[],weaknesses[]}], gaps:[{gap,priority,description}], issues:[{priority,issue,category}], recommendations:[{priority,title,description}], summary}` },
  hreflang: { label: 'Hreflang/i18n Audit', system: `You are an international SEO expert. Use web_search to access the given URL. Audit hreflang implementation. Return ONLY valid JSON: {url, hreflangScore (0-100), hreflangTags:[{lang,href,valid}], hasXDefault, implementationMethod, issues:[{priority,issue,category}], recommendations:[{priority,title,description}], summary}` },
};

// Retry helper with exponential backoff for 429s
async function callClaudeWithRetry(apiKey, body, maxRetries = 3) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });

    if (res.status === 429) {
      // Rate limited — wait and retry
      const retryAfter = res.headers.get('retry-after');
      const waitMs = retryAfter ? parseInt(retryAfter) * 1000 : Math.min(2000 * Math.pow(2, attempt), 15000);
      console.log(`Rate limited (429). Retry ${attempt + 1}/${maxRetries} in ${waitMs}ms`);
      if (attempt < maxRetries) {
        await new Promise(r => setTimeout(r, waitMs));
        continue;
      }
      return { ok: false, status: 429, error: 'Rate limited. Please wait a moment and try again.' };
    }

    if (res.status === 529) {
      // Overloaded
      const waitMs = Math.min(3000 * Math.pow(2, attempt), 15000);
      console.log(`API overloaded (529). Retry ${attempt + 1}/${maxRetries} in ${waitMs}ms`);
      if (attempt < maxRetries) {
        await new Promise(r => setTimeout(r, waitMs));
        continue;
      }
      return { ok: false, status: 529, error: 'Service temporarily busy. Please try again in a moment.' };
    }

    if (!res.ok) {
      const errText = await res.text();
      console.error('Anthropic API error:', res.status, errText.substring(0, 300));
      return { ok: false, status: res.status, error: `API error (${res.status}). Try again.` };
    }

    const data = await res.json();
    return { ok: true, data };
  }

  return { ok: false, status: 429, error: 'Rate limited after retries. Wait a moment and try again.' };
}

export const handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  const apiKey = process.env.Anthropicv2;
  if (!apiKey) return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server configuration error.' }) };

  let command, url;
  try {
    const body = JSON.parse(event.body || '{}');
    command = body.command;
    url = body.url;
    if (!command || !COMMAND_PROMPTS[command]) throw new Error('Invalid command: ' + command);
    if (!url || typeof url !== 'string') throw new Error('Missing url');
    url = url.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) url = 'https://' + url;
    new URL(url);
  } catch (e) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: e.message || 'Invalid request' }) };
  }

  const cmdConfig = COMMAND_PROMPTS[command];

  try {
    const result = await callClaudeWithRetry(apiKey, {
      model: 'claude-sonnet-4-20250514',
      max_tokens: 12000,
      system: cmdConfig.system + '\n\nReturn ONLY valid JSON. No markdown fences, no preamble, no explanation outside the JSON.',
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      messages: [{
        role: 'user',
        content: `Run /seo ${command} on: ${url}\n\nSearch for and analyse this URL. Return ONLY the JSON result.`
      }],
    });

    if (!result.ok) {
      return { statusCode: 200, headers, body: JSON.stringify({ error: result.error }) };
    }

    const data = result.data;
    const textBlocks = (data.content || []).filter(b => b.type === 'text');
    const rawText = textBlocks.map(b => b.text).join('');

    if (!rawText || rawText.trim().length === 0) {
      return { statusCode: 200, headers, body: JSON.stringify({ error: 'Analysis incomplete. Please try again.' }) };
    }

    let parsed;
    try {
      const clean = rawText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      const jsonMatch = clean.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON object found');
      parsed = JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.error('JSON parse error:', e.message);
      return { statusCode: 200, headers, body: JSON.stringify({ error: 'Output format error. Try again.', partial: rawText.substring(0, 1500) }) };
    }

    parsed._meta = {
      command,
      label: cmdConfig.label,
      analysedAt: new Date().toISOString(),
      model: 'claude-sonnet-4-20250514',
      inputTokens: data.usage?.input_tokens || null,
      outputTokens: data.usage?.output_tokens || null,
    };

    return { statusCode: 200, headers, body: JSON.stringify(parsed) };

  } catch (e) {
    console.error('Function error:', e.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server error: ' + e.message }) };
  }
};
