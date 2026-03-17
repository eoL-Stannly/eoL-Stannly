// Netlify serverless function: /api/seo-tool
//
// General-purpose SEO analysis function.
// Accepts { command, url, options } and routes to the right Claude prompt.
// Claude uses web_search to crawl and analyse pages.

// Command-specific system prompts
const COMMAND_PROMPTS = {
  audit: {
    label: 'Full Website Audit',
    system: `You are an expert SEO analyst performing a full website audit. Use web_search to access the given URL. Analyse crawlability, indexability, technical SEO, content quality, E-E-A-T, schema, images, and AI search readiness. Return ONLY a JSON object with: url, pageType, industry, scores (technical, content, onPage, schema, performance, aiReadiness, images — each 0-100), overallScore (0-100 weighted), issues array [{priority, issue, category}], recommendations array [{priority, title, description}], summary.`,
  },
  page: {
    label: 'Deep Page Analysis',
    system: `You are an expert SEO analyst performing a deep single-page analysis. Use web_search to access the given URL. Examine every on-page SEO element: title, meta description, H1-H6 hierarchy, content quality, keyword usage, internal/external links, images, schema, canonical, OG tags, and mobile signals. Return ONLY a JSON object with: url, pageType, title {value, length, status, note}, metaDescription {value, length, status, note}, h1 {value, status, note}, headingStructure {h1Count, h2s[], h3s[]}, canonical {value, status}, schema {count, types[], status}, contentMetrics {wordCount, readability, keywordDensity}, links {internal, external, broken}, images {total, withAlt, withoutAlt}, issues[], recommendations[], summary.`,
  },
  technical: {
    label: 'Technical SEO Audit',
    system: `You are an expert technical SEO analyst. Use web_search to access the given URL. Audit 9 technical categories: crawlability (robots.txt, meta robots), indexability (canonical, noindex), site speed indicators, HTTPS/security, mobile-friendliness, URL structure, structured data, Core Web Vitals (INP not FID), and international targeting. Return ONLY a JSON object with: url, technicalScore (0-100), categories [{name, score, status, findings[]}], issues [{priority, issue, category}], recommendations [{priority, title, description}], summary. Priority rules: Critical = blocks indexing only. Missing schema = Medium. OG issues = Low.`,
  },
  content: {
    label: 'E-E-A-T Content Analysis',
    system: `You are an expert SEO analyst performing a Page Content & E-E-A-T audit. Use web_search to access the given URL. Return ONLY a JSON object with: url, pageType, industry, title {value, length, status, note}, metaDescription {value, length, status, note}, h1 {value, status, note}, canonical {value, status, note}, ogUrl {status, note}, schema {count, types[], status, note}, hreflang {count, status, note}, contentQualityScore (0-100), aiCitationReadiness (0-100), eeat {experience {score 0-25, signals}, expertise {score 0-25, signals}, authoritativeness {score 0-25, signals}, trustworthiness {score 0-25, signals}, overall 0-100, rating}, contentMetrics {wordCount, editorialContent, avgSentenceLength, headingStructure, internalLinks, externalLinks, images {total, withAlt, withoutAlt, altQuality}}, issues [{priority, issue, category}], recommendations [{priority, title, description}], summary. RULES: H1 = keyword focused only. Missing schema = Medium max. OG = Low. PLP/PDP: no penalty for missing address/policy. Critical = indexing blockers only.`,
  },
  schema: {
    label: 'Schema Markup Analysis',
    system: `You are an expert in Schema.org structured data. Use web_search to access the given URL. Detect all existing schema markup, validate it against Schema.org specs, identify missing schema opportunities, and generate recommended schema. Return ONLY a JSON object with: url, pageType, existingSchema [{type, valid, issues[]}], missingSchema [{type, priority, reason}], recommendations [{type, json (the actual schema JSON to implement), priority}], schemaScore (0-100), issues [{priority, issue}], summary. Never recommend HowTo schema (deprecated Sept 2023). FAQ schema: only for govt/healthcare for Google rich results.`,
  },
  images: {
    label: 'Image Optimization',
    system: `You are an expert in image SEO optimization. Use web_search to access the given URL. Analyse all images for: alt text quality, file naming, format optimization, lazy loading, dimensions, decorative vs content images, and image sitemap inclusion. Return ONLY a JSON object with: url, imageScore (0-100), totalImages, withAlt, withoutAlt, altQuality (description), issues [{priority, issue, imageUrl, currentAlt}], recommendations [{priority, title, description}], suggestedAlts [{currentAlt, suggestedAlt, imageContext}], summary.`,
  },
  sitemap: {
    label: 'Sitemap Analysis',
    system: `You are an expert in XML sitemaps and site architecture. Use web_search to find and analyse the sitemap for the given URL (check /sitemap.xml, /sitemap_index.xml, robots.txt reference). Evaluate: sitemap existence, format validity, URL count, lastmod dates, changefreq, priority values, index vs child sitemaps, coverage completeness. Return ONLY a JSON object with: url, sitemapUrl, sitemapFound (boolean), format, urlCount, lastModified, hasIndex (boolean), childSitemaps[], issues [{priority, issue}], recommendations [{priority, title, description}], sitemapScore (0-100), summary.`,
  },
  geo: {
    label: 'AI/GEO Optimization',
    system: `You are an expert in Generative Engine Optimization (GEO) and AI search visibility. Use web_search to access the given URL. Analyse AI citation readiness: quotable statements, structured data, heading hierarchy, answer-first formatting, comparison tables, source citations. Check AI crawler accessibility (GPTBot, ClaudeBot, PerplexityBot via robots.txt), llms.txt compliance, brand mention signals, passage-level citability. Return ONLY a JSON object with: url, geoScore (0-100), aiCrawlerAccess [{crawler, status}], llmsTxt {exists, compliant}, citabilitySignals [{signal, present, impact}], brandMentions (description), issues [{priority, issue}], recommendations [{priority, title, description}], summary.`,
  },
  plan: {
    label: 'Strategic SEO Plan',
    system: `You are a senior SEO strategist creating a comprehensive SEO plan. Use web_search to research the given business/website. Develop a strategic plan covering: business type detection, competitive landscape, keyword strategy, content pillars, technical priorities, link building approach, local SEO (if applicable), and 90-day action plan. Return ONLY a JSON object with: url, businessType, industry, competitiveAnalysis (description), keywordStrategy {primaryKeywords[], secondaryKeywords[], longTail[]}, contentPillars [{topic, priority, description}], technicalPriorities [{item, priority}], linkStrategy (description), actionPlan [{phase, timeline, actions[]}], kpis [], summary.`,
  },
  programmatic: {
    label: 'Programmatic SEO',
    system: `You are an expert in programmatic SEO. Use web_search to access the given URL. Analyse programmatic page patterns: template detection, content uniqueness, thin content risks, doorway page indicators, internal linking patterns, and scaling opportunities. Return ONLY a JSON object with: url, pageType, templateDetected (boolean), templatePattern (description), contentUniqueness (0-100), thinContentRisk (Low/Medium/High), doorwayRisk (Low/Medium/High), scalingOpportunities [{opportunity, priority, description}], issues [{priority, issue}], recommendations [{priority, title, description}], summary. WARNING at 30+ location pages. HARD STOP at 50+.`,
  },
  'competitor-pages': {
    label: 'Competitor Comparison',
    system: `You are an expert SEO competitive analyst. Use web_search to analyse the given URL and identify its top competitors. Compare: content depth, keyword targeting, schema implementation, E-E-A-T signals, page structure, and unique value propositions. Return ONLY a JSON object with: url, pageType, competitors [{url, domain, strengths[], weaknesses[]}], comparisonMatrix [{factor, yourSite, competitor1, competitor2}], gaps [{gap, priority, description}], opportunities [{opportunity, priority, description}], recommendations [{priority, title, description}], summary.`,
  },
  hreflang: {
    label: 'Hreflang/i18n Audit',
    system: `You are an expert in international SEO and hreflang implementation. Use web_search to access the given URL. Audit: hreflang tag presence, x-default, self-referencing, return tag validation, language/region codes, implementation method (HTML head, HTTP header, sitemap). Check for common errors: missing return tags, incorrect codes, conflicting signals. Return ONLY a JSON object with: url, hreflangTags [{lang, href, valid, issues[]}], hasXDefault (boolean), selfReferencing (boolean), implementationMethod, regionalVariants [{region, url}], issues [{priority, issue}], recommendations [{priority, title, description}], hreflangScore (0-100), summary.`,
  },
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
    if (!command || !COMMAND_PROMPTS[command]) throw new Error('Invalid command');
    if (!url || typeof url !== 'string') throw new Error('Missing url');
    url = url.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) url = 'https://' + url;
    new URL(url);
  } catch (e) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: e.message || 'Invalid request' }) };
  }

  const cmdConfig = COMMAND_PROMPTS[command];
  const systemPrompt = cmdConfig.system + '\n\nReturn ONLY valid JSON, no markdown fences, no preamble.';

  const apiUrl = 'https://api.anthropic.com/v1/messages';
  const apiHeaders = {
    'Content-Type': 'application/json',
    'x-api-key': apiKey,
    'anthropic-version': '2023-06-01',
  };

  let messages = [{
    role: 'user',
    content: `Run /seo ${command} on: ${url}\n\nUse web search to access and thoroughly analyse this page/site. Return ONLY the JSON result object.`
  }];

  let totalInput = 0, totalOutput = 0;

  try {
    const MAX_TURNS = 8;
    for (let turn = 0; turn < MAX_TURNS; turn++) {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: apiHeaders,
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 16000,
          system: systemPrompt,
          tools: [{ type: 'web_search_20250305', name: 'web_search' }],
          messages,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error(`API error (turn ${turn}):`, res.status, errText);
        return { statusCode: 502, headers, body: JSON.stringify({ error: 'Analysis service error.' }) };
      }

      const data = await res.json();
      totalInput += data.usage?.input_tokens || 0;
      totalOutput += data.usage?.output_tokens || 0;

      if (data.stop_reason === 'end_turn') {
        const textBlocks = (data.content || []).filter(b => b.type === 'text');
        const rawText = textBlocks.map(b => b.text).join('');

        let result;
        try {
          const clean = rawText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
          const jsonMatch = clean.match(/\{[\s\S]*\}/);
          if (!jsonMatch) throw new Error('No JSON found');
          result = JSON.parse(jsonMatch[0]);
        } catch (e) {
          console.error('Parse error:', e.message);
          return { statusCode: 200, headers, body: JSON.stringify({ error: 'Output malformed. Try again.', partial: rawText.substring(0, 2000) }) };
        }

        result._meta = {
          command,
          label: cmdConfig.label,
          analysedAt: new Date().toISOString(),
          model: 'claude-sonnet-4-20250514',
          inputTokens: totalInput,
          outputTokens: totalOutput,
          turns: turn + 1,
        };

        return { statusCode: 200, headers, body: JSON.stringify(result) };
      }

      // Handle tool_use continuation
      messages.push({ role: 'assistant', content: data.content });

      const hasServerResults = (data.content || []).some(b => b.type === 'server_tool_result');
      if (hasServerResults) {
        messages.push({ role: 'user', content: 'Now return ONLY the JSON result object. No explanation.' });
      } else {
        const toolUseBlocks = (data.content || []).filter(b => b.type === 'tool_use');
        if (toolUseBlocks.length === 0) break;
        const toolResults = toolUseBlocks.map(tu => ({
          type: 'tool_result', tool_use_id: tu.id,
          content: 'Tool not available. Provide your best analysis from your knowledge.',
        }));
        messages.push({ role: 'user', content: toolResults });
      }
    }

    return { statusCode: 200, headers, body: JSON.stringify({ error: 'Analysis timed out. Try again.' }) };
  } catch (e) {
    console.error('Error:', e);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server error: ' + e.message }) };
  }
};
