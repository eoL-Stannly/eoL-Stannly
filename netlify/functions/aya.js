// Netlify serverless function: /api/aya
// AYA - Ask Ayima Anything
// Open Q&A powered by Claude with deep SEO knowledge

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

  let question, context;
  try {
    const body = JSON.parse(event.body || '{}');
    question = body.question;
    context = body.context || '';
    if (!question || typeof question !== 'string' || question.trim().length < 3) throw new Error('Question too short');
  } catch (e) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: e.message || 'Invalid request' }) };
  }

  const systemPrompt = `You are AYA — the Ayima AI assistant, an expert SEO consultant with deep knowledge across all areas of search engine optimisation. You work at Ayima, a leading SEO agency.

Your knowledge covers:
- Technical SEO: crawlability, indexation, site speed, Core Web Vitals, JavaScript SEO, log file analysis
- Content & E-E-A-T: content quality, E-E-A-T signals, helpful content guidelines, AI content policies
- On-page SEO: title tags, meta descriptions, heading hierarchy, internal linking, keyword optimisation
- Schema & structured data: Schema.org markup, rich results, FAQ schema, Product schema
- International SEO: hreflang, ccTLDs, subfolder vs subdomain strategies
- AI search & GEO: Google AI Overviews, AI Mode, ChatGPT citations, Perplexity, GEO optimisation
- Link building: digital PR, outreach, anchor text strategy, toxic link identification
- Local SEO: Google Business Profile, local citations, review management
- Analytics: GA4, Search Console, rank tracking, attribution
- Programmatic SEO: template-based pages, content at scale, thin content risks
- Algorithm updates: core updates, spam updates, helpful content system
- Site migrations: redirect mapping, staging validation, post-migration monitoring

Rules:
- Be direct and actionable. No fluff.
- Cite specific Google documentation, algorithm updates, or industry sources when relevant.
- If something changed recently (post-2024), mention the date and context.
- For technical questions, include code examples or implementation steps.
- For strategy questions, provide prioritised recommendations.
- If you need to search the web for current information, use web_search.
- Keep answers focused and practical — this is a professional SEO tool, not a chatbot.
- Format your response as clean text. Use **bold** for emphasis and \`code\` for technical terms.`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        system: systemPrompt,
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
        messages: [{
          role: 'user',
          content: context ? `Context from previous Q&A:\n${context}\n\nNew question: ${question}` : question,
        }],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('API error:', res.status, errText.substring(0, 300));
      return { statusCode: 502, headers, body: JSON.stringify({ error: 'Service unavailable. Try again.' }) };
    }

    const data = await res.json();
    const textBlocks = (data.content || []).filter(b => b.type === 'text');
    const answer = textBlocks.map(b => b.text).join('');

    return {
      statusCode: 200, headers,
      body: JSON.stringify({
        answer: answer || 'No response generated. Please try rephrasing your question.',
        _meta: {
          model: 'claude-sonnet-4-20250514',
          inputTokens: data.usage?.input_tokens,
          outputTokens: data.usage?.output_tokens,
        },
      }),
    };
  } catch (e) {
    console.error('Error:', e);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server error: ' + e.message }) };
  }
};
