// Netlify serverless function: /api/seo-tool
// Single-call Claude API with server-managed web_search.
// No multi-turn loop needed - the API executes web_search automatically.

const COMMAND_PROMPTS = {
  audit: { label: 'Full Website Audit', system: `You are an expert SEO analyst. Use web_search to access the given URL and perform a full website audit. Analyse crawlability, indexability, technical SEO, content quality, E-E-A-T, schema, images, and AI search readiness. Return ONLY valid JSON: {url, pageType, industry, overallScore (0-100), scores:{technical,content,onPage,schema,performance,aiReadiness,images}, issues:[{priority,issue,category}], recommendations:[{priority,title,description}], summary}` },
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
    // Single API call - web_search is server-managed, no multi-turn needed
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 12000,
        system: cmdConfig.system + '\n\nReturn ONLY valid JSON. No markdown fences, no preamble, no explanation outside the JSON.',
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
        messages: [{
          role: 'user',
          content: `Run /seo ${command} on: ${url}\n\nSearch for and analyse this URL. Return ONLY the JSON result.`
        }],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Anthropic API error:', res.status, errText.substring(0, 500));
      return { statusCode: 502, headers, body: JSON.stringify({ error: `API error (${res.status}). Try again.` }) };
    }

    const data = await res.json();

    // Extract text from all content blocks
    const textBlocks = (data.content || []).filter(b => b.type === 'text');
    const rawText = textBlocks.map(b => b.text).join('');

    if (!rawText || rawText.trim().length === 0) {
      // Claude used web_search but didn't return text yet - this shouldn't happen with server-managed tools
      // but handle gracefully
      return { statusCode: 200, headers, body: JSON.stringify({ error: 'Analysis incomplete - Claude searched but did not return results. Please try again.', debug_stop_reason: data.stop_reason }) };
    }

    // Parse JSON from response
    let result;
    try {
      const clean = rawText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      const jsonMatch = clean.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON object found');
      result = JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.error('JSON parse error:', e.message, 'Raw text:', rawText.substring(0, 300));
      return { statusCode: 200, headers, body: JSON.stringify({ error: 'Analysis completed but output format was unexpected. Try again.', partial: rawText.substring(0, 1500) }) };
    }

    result._meta = {
      command,
      label: cmdConfig.label,
      analysedAt: new Date().toISOString(),
      model: 'claude-sonnet-4-20250514',
      inputTokens: data.usage?.input_tokens || null,
      outputTokens: data.usage?.output_tokens || null,
    };

    return { statusCode: 200, headers, body: JSON.stringify(result) };

  } catch (e) {
    console.error('Function error:', e.message, e.stack);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server error: ' + e.message }) };
  }
};
