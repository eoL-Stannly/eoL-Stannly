// Netlify serverless function: /api/content-audit
//
// Calls Claude with web_search tool, handles the multi-turn tool use loop,
// then returns the structured JSON audit.

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
    if (!url || typeof url !== 'string') throw new Error('Missing');
    url = url.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) url = 'https://' + url;
    new URL(url);
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid or missing URL' }) };
  }

  const systemPrompt = `You are an expert SEO analyst. Use web_search to access the given URL and analyse its content. After researching, return ONLY a valid JSON object with this structure (no markdown, no explanation, no preamble — JSON only):

{"url":"...","pageType":"...","industry":"...","title":{"value":"...","length":0,"status":"PASS|FAIL|NEEDS WORK","note":"..."},"metaDescription":{"value":"...","length":0,"status":"PASS|FAIL|NEEDS WORK","note":"..."},"h1":{"value":"...","status":"PASS|FAIL|NEEDS WORK","note":"..."},"canonical":{"value":"...","status":"PASS|FAIL|MISSING","note":"..."},"ogUrl":{"status":"PASS|MISMATCH|MISSING","note":"..."},"schema":{"count":0,"types":[],"status":"PASS|MISSING","note":"..."},"hreflang":{"count":0,"status":"PASS|MISSING","note":"..."},"contentQualityScore":0,"aiCitationReadiness":0,"eeat":{"experience":{"score":0,"signals":"..."},"expertise":{"score":0,"signals":"..."},"authoritativeness":{"score":0,"signals":"..."},"trustworthiness":{"score":0,"signals":"..."},"overall":0,"rating":"..."},"contentMetrics":{"wordCount":0,"editorialContent":"...","avgSentenceLength":0,"headingStructure":{"h1Count":0,"h2s":[],"h3s":[]},"internalLinks":0,"externalLinks":0,"images":{"total":0,"withAlt":0,"withoutAlt":0,"altQuality":"..."}},"geoSignals":[],"issues":[{"priority":"Critical|High|Medium|Low","issue":"...","category":"..."}],"recommendations":[{"priority":"Critical|High|Medium|Low","title":"...","description":"..."}],"summary":"..."}

SCORING RULES:
- H1 should focus on target keyword only. No modifiers.
- Missing schema = Medium max. LLMs parse front-end directly.
- OG mismatch = Low. Social only.
- PLP/PDP: no penalty for missing address/policy links.
- Critical = indexing blockers or penalties ONLY.`;

  const apiUrl = 'https://api.anthropic.com/v1/messages';
  const apiHeaders = {
    'Content-Type': 'application/json',
    'x-api-key': apiKey,
    'anthropic-version': '2023-06-01',
  };

  // Build initial messages
  let messages = [{
    role: 'user',
    content: `Perform a full SEO content and E-E-A-T audit on: ${url}\n\nSearch for this URL and examine the page. Then return ONLY the JSON audit.`
  }];

  let totalInput = 0;
  let totalOutput = 0;

  try {
    // Multi-turn loop: handle tool_use responses
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
        return { statusCode: 502, headers, body: JSON.stringify({ error: 'Analysis service error. Try again.' }) };
      }

      const data = await res.json();
      totalInput += data.usage?.input_tokens || 0;
      totalOutput += data.usage?.output_tokens || 0;

      // Check if we got a final text response (end_turn)
      if (data.stop_reason === 'end_turn') {
        // Extract text blocks for the JSON
        const textBlocks = (data.content || []).filter(b => b.type === 'text');
        const rawText = textBlocks.map(b => b.text).join('');

        let audit;
        try {
          const clean = rawText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
          const jsonMatch = clean.match(/\{[\s\S]*\}/);
          if (!jsonMatch) throw new Error('No JSON object found in response');
          audit = JSON.parse(jsonMatch[0]);
        } catch (e) {
          console.error('Parse error:', e.message, 'Raw:', rawText.substring(0, 800));
          return { statusCode: 200, headers, body: JSON.stringify({ error: 'Analysis ran but output was malformed. Try again.', partial: rawText.substring(0, 2000) }) };
        }

        audit._meta = {
          analysedAt: new Date().toISOString(),
          model: 'claude-sonnet-4-20250514',
          inputTokens: totalInput,
          outputTokens: totalOutput,
          turns: turn + 1,
        };

        return { statusCode: 200, headers, body: JSON.stringify(audit) };
      }

      // If stop_reason is tool_use, we need to continue the conversation
      // Add the assistant's response (with tool_use blocks) to messages
      messages.push({ role: 'assistant', content: data.content });

      // Build tool_result blocks for each tool_use
      const toolUseBlocks = (data.content || []).filter(b => b.type === 'tool_use');
      if (toolUseBlocks.length === 0) {
        // No tool use and not end_turn — unexpected, return what we have
        const textBlocks = (data.content || []).filter(b => b.type === 'text');
        const rawText = textBlocks.map(b => b.text).join('');
        return { statusCode: 200, headers, body: JSON.stringify({ error: 'Unexpected response state', partial: rawText.substring(0, 1000) }) };
      }

      // For web_search, the API handles execution server-side — we just need to
      // check if there are server_tool_use blocks (which auto-execute) vs regular tool_use
      // With web_search_20250305, it's a server-managed tool — results come back in the same response
      // If we're here, it means the model wants to do more tool calls
      // The web_search results should already be in data.content as server_tool_result blocks

      // Check if there are server_tool_use results already
      const hasServerResults = (data.content || []).some(b => b.type === 'server_tool_result');
      if (hasServerResults) {
        // Server already executed the tool — just continue the loop
        // The assistant message with results is already added
        // Add a user message to prompt for the final JSON
        messages.push({
          role: 'user',
          content: 'Now return ONLY the JSON audit object based on what you found. No explanation, just the JSON.'
        });
      } else {
        // Regular tool_use that needs manual tool_result — shouldn't happen with web_search
        // but handle gracefully
        const toolResults = toolUseBlocks.map(tu => ({
          type: 'tool_result',
          tool_use_id: tu.id,
          content: 'Tool execution not available. Please provide your best analysis based on your knowledge of the URL.',
        }));
        messages.push({ role: 'user', content: toolResults });
      }
    }

    // If we exhausted turns
    return { statusCode: 200, headers, body: JSON.stringify({ error: 'Analysis timed out after maximum turns. Try again.' }) };

  } catch (e) {
    console.error('Unexpected error:', e);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server error: ' + e.message }) };
  }
};
