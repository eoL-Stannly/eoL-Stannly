/**
 * Data Parser
 * Parses CSV/TSV data from user-attached files and extracts structured
 * SEO data (keywords, volumes, rankings, URLs, etc.) for deliverable generation.
 */

/**
 * Extract attached file content blocks from a task description.
 * Returns array of { name, content } objects.
 */
export function extractAttachments(description) {
  const attachments = [];
  const regex = /--- (.+?) ---\n([\s\S]*?)(?=\n--- |\n*$)/g;
  let match;
  while ((match = regex.exec(description)) !== null) {
    attachments.push({ name: match[1].trim(), content: match[2].trim() });
  }
  return attachments;
}

/**
 * Parse CSV or TSV text into an array of objects.
 * Auto-detects delimiter (comma vs tab) and handles quoted fields.
 */
export function parseCSV(text) {
  if (!text || typeof text !== 'string') return [];

  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return []; // need header + at least 1 row

  // Detect delimiter: tab if first line has more tabs than commas
  const firstLine = lines[0];
  const tabs = (firstLine.match(/\t/g) || []).length;
  const commas = (firstLine.match(/,/g) || []).length;
  const delimiter = tabs > commas ? '\t' : ',';

  // Parse a single line respecting quoted fields
  const parseLine = (line) => {
    const fields = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === delimiter && !inQuotes) {
        fields.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    fields.push(current.trim());
    return fields;
  };

  const headers = parseLine(lines[0]).map((h) => normalizeHeader(h));
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]);
    if (values.length === 0 || (values.length === 1 && !values[0])) continue;
    const row = {};
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = values[j] || '';
    }
    rows.push(row);
  }

  return rows;
}

/**
 * Normalise a CSV header to a canonical column name.
 */
function normalizeHeader(raw) {
  const h = raw.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');

  // Map common variations to canonical names
  const aliases = {
    keyword: ['keyword', 'query', 'search_term', 'term', 'kw', 'search_query', 'keyphrase'],
    volume: ['volume', 'search_volume', 'avg_monthly_searches', 'monthly_volume', 'vol', 'searches', 'avg_volume'],
    difficulty: ['difficulty', 'kd', 'keyword_difficulty', 'kw_difficulty', 'seo_difficulty', 'competition', 'comp'],
    cpc: ['cpc', 'cost_per_click', 'avg_cpc', 'cpc_usd', 'bid'],
    position: ['position', 'rank', 'ranking', 'avg_position', 'current_position', 'pos'],
    url: ['url', 'page', 'landing_page', 'page_url', 'target_url', 'destination', 'address'],
    clicks: ['clicks', 'total_clicks', 'organic_clicks'],
    impressions: ['impressions', 'total_impressions', 'impr'],
    ctr: ['ctr', 'click_through_rate', 'click_rate'],
    intent: ['intent', 'search_intent', 'intent_type'],
    traffic: ['traffic', 'organic_traffic', 'est_traffic', 'estimated_traffic'],
    source_url: ['source_url', 'old_url', 'from', 'source', 'origin', 'old_page', 'from_url'],
    destination_url: ['destination_url', 'new_url', 'to', 'destination', 'target', 'new_page', 'to_url', 'redirect_url'],
    status_code: ['status_code', 'status', 'http_status', 'response_code', 'code'],
    backlinks: ['backlinks', 'referring_domains', 'ref_domains', 'links', 'external_links'],
    title: ['title', 'page_title', 'meta_title', 'seo_title'],
    language: ['language', 'lang', 'locale', 'hreflang'],
    region: ['region', 'country', 'geo', 'market'],
  };

  for (const [canonical, variants] of Object.entries(aliases)) {
    if (variants.includes(h)) return canonical;
  }
  return h;
}

/**
 * Identify what type of SEO data a CSV contains based on its columns.
 */
export function identifyDataType(rows) {
  if (!rows.length) return 'unknown';
  const cols = Object.keys(rows[0]);

  const has = (names) => names.some((n) => cols.includes(n));

  if (has(['source_url', 'destination_url'])) return 'redirect';
  if (has(['language', 'hreflang']) || (has(['region']) && has(['url']))) return 'hreflang';
  if (has(['keyword']) && has(['volume', 'difficulty', 'cpc'])) return 'keyword_full';
  if (has(['keyword']) && has(['clicks', 'impressions', 'position'])) return 'gsc';
  if (has(['keyword'])) return 'keyword_basic';
  if (has(['url']) && has(['status_code'])) return 'crawl';
  if (has(['url']) && has(['traffic', 'clicks'])) return 'performance';
  return 'generic';
}

/**
 * Parse a task description and extract structured data from any attached CSVs.
 * Returns { dataType, rows, columns, summary } or null if no parseable data.
 */
export function parseTaskData(description) {
  const attachments = extractAttachments(description);
  if (!attachments.length) return null;

  // Try each attachment for CSV data
  for (const att of attachments) {
    if (att.name.match(/\.(csv|tsv|txt)$/i) || att.content.includes(',') || att.content.includes('\t')) {
      const rows = parseCSV(att.content);
      if (rows.length > 0) {
        const dataType = identifyDataType(rows);
        const columns = Object.keys(rows[0]);
        return {
          fileName: att.name,
          dataType,
          rows,
          columns,
          rowCount: rows.length,
        };
      }
    }
  }

  return null;
}

// ---- Data-driven deliverable builders ----

/**
 * Build a keyword research deliverable from parsed keyword data.
 */
export function buildKeywordDeliverable(data, agentId, agentName, agentRole) {
  const rows = data.rows;
  const hasVolume = rows.some((r) => r.volume);
  const hasDifficulty = rows.some((r) => r.difficulty);
  const hasPosition = rows.some((r) => r.position);
  const hasClicks = rows.some((r) => r.clicks);
  const hasIntent = rows.some((r) => r.intent);
  const hasCPC = rows.some((r) => r.cpc);

  // Parse numeric values
  const parsed = rows.map((r) => ({
    ...r,
    volume: parseInt(r.volume) || 0,
    difficulty: parseInt(r.difficulty) || parseFloat(r.difficulty) || 0,
    position: parseFloat(r.position) || 0,
    clicks: parseInt(r.clicks) || 0,
    impressions: parseInt(r.impressions) || 0,
    cpc: parseFloat(r.cpc) || 0,
  }));

  // Sort by volume descending
  const byVolume = [...parsed].sort((a, b) => b.volume - a.volume);

  // Quick wins: ranking 4-20, lower difficulty
  const quickWins = parsed
    .filter((r) => r.position >= 4 && r.position <= 20 && r.difficulty < 50)
    .sort((a, b) => a.position - b.position)
    .slice(0, 10);

  // High-volume opportunities: top by volume, not ranking top 3
  const opportunities = byVolume
    .filter((r) => r.position === 0 || r.position > 3)
    .slice(0, 10);

  // Top performers: already ranking well
  const topPerformers = parsed
    .filter((r) => r.position > 0 && r.position <= 10)
    .sort((a, b) => a.position - b.position)
    .slice(0, 10);

  // Intent distribution
  const intentDist = {};
  if (hasIntent) {
    for (const r of parsed) {
      const intent = r.intent || 'unclassified';
      intentDist[intent] = (intentDist[intent] || 0) + 1;
    }
  }

  // Volume distribution
  const totalVolume = parsed.reduce((sum, r) => sum + r.volume, 0);
  const avgDifficulty = hasDifficulty
    ? (parsed.reduce((sum, r) => sum + r.difficulty, 0) / parsed.length).toFixed(1)
    : null;

  // Build sections
  const sections = [];

  // Overview
  sections.push({
    heading: `Dataset Overview (${data.fileName})`,
    items: [
      `Total keywords analysed: ${parsed.length}`,
      hasVolume ? `Total monthly search volume: ${totalVolume.toLocaleString()}` : null,
      hasDifficulty ? `Average keyword difficulty: ${avgDifficulty}` : null,
      hasPosition ? `Keywords with rankings: ${parsed.filter((r) => r.position > 0).length}` : null,
      hasClicks ? `Total clicks: ${parsed.reduce((s, r) => s + r.clicks, 0).toLocaleString()}` : null,
      hasIntent ? `Intent distribution: ${Object.entries(intentDist).map(([k, v]) => `${k} (${v})`).join(', ')}` : null,
    ].filter(Boolean),
  });

  // Top keywords by volume
  if (hasVolume) {
    sections.push({
      heading: 'Top Keywords by Search Volume',
      items: byVolume.slice(0, 15).map((r) => {
        let line = `"${r.keyword}" — Vol: ${r.volume.toLocaleString()}`;
        if (r.difficulty) line += ` | KD: ${r.difficulty}`;
        if (r.position) line += ` | Pos: ${r.position}`;
        if (r.cpc) line += ` | CPC: $${r.cpc.toFixed(2)}`;
        return line;
      }),
    });
  }

  // Quick wins
  if (quickWins.length > 0) {
    sections.push({
      heading: 'Quick Wins (Pos 4-20, Low Difficulty)',
      items: quickWins.map((r) => {
        let line = `"${r.keyword}" — Pos: ${r.position}`;
        if (r.difficulty) line += ` | KD: ${r.difficulty}`;
        if (r.volume) line += ` | Vol: ${r.volume.toLocaleString()}`;
        if (r.url) line += ` | Page: ${r.url}`;
        return line;
      }),
    });
  }

  // Top performers
  if (topPerformers.length > 0) {
    sections.push({
      heading: 'Top Performers (Currently Ranking 1-10)',
      items: topPerformers.map((r) => {
        let line = `"${r.keyword}" — Pos: ${r.position}`;
        if (r.volume) line += ` | Vol: ${r.volume.toLocaleString()}`;
        if (r.clicks) line += ` | Clicks: ${r.clicks.toLocaleString()}`;
        if (r.url) line += ` | Page: ${r.url}`;
        return line;
      }),
    });
  }

  // Growth opportunities
  if (opportunities.length > 0) {
    sections.push({
      heading: 'Growth Opportunities (High Volume, Not Top 3)',
      items: opportunities.map((r) => {
        let line = `"${r.keyword}" — Vol: ${r.volume.toLocaleString()}`;
        if (r.difficulty) line += ` | KD: ${r.difficulty}`;
        if (r.position) line += ` | Current: ${r.position > 0 ? `Pos ${r.position}` : 'Not ranking'}`;
        return line;
      }),
    });
  }

  // Recommendations from actual data
  const recommendations = [];

  if (quickWins.length > 0) {
    recommendations.push({
      priority: 'High',
      action: `Optimise title tags and content for ${quickWins.length} quick-win keywords (positions 4-20)`,
      impact: `Potential to capture ${quickWins.reduce((s, r) => s + r.volume, 0).toLocaleString()} monthly searches`,
    });
  }

  const noRanking = parsed.filter((r) => r.position === 0 && r.volume > 100);
  if (noRanking.length > 0) {
    recommendations.push({
      priority: 'High',
      action: `Create content targeting ${Math.min(noRanking.length, 20)} unranked high-volume keywords`,
      impact: `Address ${noRanking.reduce((s, r) => s + r.volume, 0).toLocaleString()} monthly search volume gap`,
    });
  }

  if (topPerformers.length > 0) {
    recommendations.push({
      priority: 'Medium',
      action: `Protect and strengthen ${topPerformers.length} top-10 rankings with content refreshes`,
      impact: `Defend ${topPerformers.reduce((s, r) => s + r.clicks, 0).toLocaleString()} monthly clicks`,
    });
  }

  const highDifficulty = parsed.filter((r) => r.difficulty > 70 && r.volume > 500);
  if (highDifficulty.length > 0) {
    recommendations.push({
      priority: 'Medium',
      action: `Build pillar content + link strategy for ${highDifficulty.length} competitive keywords (KD > 70)`,
      impact: 'Long-term authority building for high-value terms',
    });
  }

  if (hasCPC) {
    const highValue = [...parsed].sort((a, b) => b.cpc - a.cpc).slice(0, 5);
    recommendations.push({
      priority: 'Low',
      action: `Prioritise commercial intent: top CPC keywords include "${highValue[0]?.keyword}" ($${highValue[0]?.cpc.toFixed(2)})`,
      impact: 'Higher conversion potential from organic traffic',
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      priority: 'Medium',
      action: 'Enrich keyword data with search volume and difficulty scores for deeper analysis',
      impact: 'Enables prioritisation and opportunity scoring',
    });
  }

  return {
    agentId,
    agentName,
    agentRole,
    timestamp: new Date().toISOString(),
    deliverableType: 'Keyword Research Report (Data-Backed)',
    summary: `Analysis of ${parsed.length} keywords from ${data.fileName}. Total search volume: ${totalVolume.toLocaleString()}. Found ${quickWins.length} quick wins and ${noRanking.length} content gaps.`,
    sections,
    recommendations,
    kbDocumentsUsed: [data.fileName],
    dataSource: data.fileName,
    kbContext: `Deliverable generated from user-supplied data: ${data.fileName} (${parsed.length} rows, ${data.columns.join(', ')})`,
  };
}

/**
 * Build a redirect mapping deliverable from parsed redirect data.
 */
export function buildRedirectDeliverable(data, agentId, agentName, agentRole) {
  const rows = data.rows;
  const hasStatus = rows.some((r) => r.status_code);
  const hasTraffic = rows.some((r) => r.traffic || r.clicks);

  const parsed = rows.map((r) => ({
    ...r,
    traffic: parseInt(r.traffic) || parseInt(r.clicks) || 0,
    status_code: parseInt(r.status_code) || 301,
  }));

  const sections = [];

  sections.push({
    heading: `Redirect Map Overview (${data.fileName})`,
    items: [
      `Total URLs to redirect: ${parsed.length}`,
      hasTraffic ? `Total traffic at risk: ${parsed.reduce((s, r) => s + r.traffic, 0).toLocaleString()} sessions` : null,
      hasStatus ? `Redirect types: ${[...new Set(parsed.map((r) => r.status_code))].join(', ')}` : 'Default redirect type: 301 Permanent',
      `URLs with destinations mapped: ${parsed.filter((r) => r.destination_url || r.url).length}`,
    ].filter(Boolean),
  });

  // High-traffic redirects
  if (hasTraffic) {
    const highTraffic = [...parsed].sort((a, b) => b.traffic - a.traffic).slice(0, 15);
    sections.push({
      heading: 'High-Traffic Redirects (Prioritise)',
      items: highTraffic.map((r) => {
        const from = r.source_url || r.url || '(missing)';
        const to = r.destination_url || '(needs mapping)';
        return `${from} → ${to} | Traffic: ${r.traffic.toLocaleString()}`;
      }),
    });
  }

  // Unmapped URLs
  const unmapped = parsed.filter((r) => !r.destination_url);
  if (unmapped.length > 0) {
    sections.push({
      heading: `Unmapped URLs (${unmapped.length} need destinations)`,
      items: unmapped.slice(0, 15).map((r) => {
        const from = r.source_url || r.url || r.keyword || '(unknown)';
        return `${from} — needs destination mapping`;
      }),
    });
  }

  // Sample redirect rules
  const mapped = parsed.filter((r) => r.source_url && r.destination_url).slice(0, 10);
  if (mapped.length > 0) {
    sections.push({
      heading: 'Sample Redirect Rules',
      items: mapped.map((r) =>
        `Redirect ${r.status_code || 301} ${r.source_url} ${r.destination_url}`
      ),
    });
  }

  const recommendations = [
    { priority: 'High', action: `Verify all ${parsed.length} redirect destinations return 200 status`, impact: 'Prevent broken redirect chains' },
    { priority: 'High', action: `Map ${unmapped.length} URLs still missing destinations`, impact: 'Complete redirect coverage' },
    { priority: 'Medium', action: 'Test redirect rules in staging before go-live', impact: 'Avoid traffic loss on launch' },
  ];

  if (hasTraffic) {
    const topTraffic = parsed.reduce((s, r) => s + r.traffic, 0);
    recommendations.unshift({
      priority: 'Critical',
      action: `Prioritise top 20 redirects accounting for highest traffic share`,
      impact: `Protect ${topTraffic.toLocaleString()} sessions of organic traffic`,
    });
  }

  return {
    agentId, agentName, agentRole,
    timestamp: new Date().toISOString(),
    deliverableType: 'Redirect Mapping Document (Data-Backed)',
    summary: `Redirect map for ${parsed.length} URLs from ${data.fileName}. ${unmapped.length} URLs need destination mapping.${hasTraffic ? ` Total traffic at risk: ${parsed.reduce((s, r) => s + r.traffic, 0).toLocaleString()}.` : ''}`,
    sections,
    recommendations,
    kbDocumentsUsed: [data.fileName],
    dataSource: data.fileName,
    kbContext: `Deliverable generated from user-supplied data: ${data.fileName} (${parsed.length} rows)`,
  };
}

/**
 * Build a performance analysis deliverable from GSC or analytics data.
 */
export function buildPerformanceDeliverable(data, agentId, agentName, agentRole) {
  const rows = data.rows;
  const parsed = rows.map((r) => ({
    ...r,
    clicks: parseInt(r.clicks) || 0,
    impressions: parseInt(r.impressions) || 0,
    ctr: parseFloat(r.ctr) || 0,
    position: parseFloat(r.position) || 0,
    traffic: parseInt(r.traffic) || 0,
  }));

  const totalClicks = parsed.reduce((s, r) => s + r.clicks, 0);
  const totalImpressions = parsed.reduce((s, r) => s + r.impressions, 0);
  const avgCTR = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : 0;

  const sections = [];

  sections.push({
    heading: `Performance Overview (${data.fileName})`,
    items: [
      `Total entries: ${parsed.length}`,
      totalClicks > 0 ? `Total clicks: ${totalClicks.toLocaleString()}` : null,
      totalImpressions > 0 ? `Total impressions: ${totalImpressions.toLocaleString()}` : null,
      totalImpressions > 0 ? `Average CTR: ${avgCTR}%` : null,
    ].filter(Boolean),
  });

  // Top pages/keywords by clicks
  const hasKeyword = parsed.some((r) => r.keyword);
  const byClicks = [...parsed].sort((a, b) => b.clicks - a.clicks).slice(0, 15);
  if (byClicks.length > 0 && byClicks[0].clicks > 0) {
    sections.push({
      heading: `Top ${hasKeyword ? 'Queries' : 'Pages'} by Clicks`,
      items: byClicks.map((r) => {
        const label = r.keyword || r.url || r.page || '(unknown)';
        let line = `"${label}" — Clicks: ${r.clicks.toLocaleString()}`;
        if (r.impressions) line += ` | Impr: ${r.impressions.toLocaleString()}`;
        if (r.position) line += ` | Pos: ${r.position.toFixed(1)}`;
        return line;
      }),
    });
  }

  // High impression, low CTR opportunities
  const lowCTR = parsed
    .filter((r) => r.impressions > 100 && r.clicks / (r.impressions || 1) < 0.03)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 10);

  if (lowCTR.length > 0) {
    sections.push({
      heading: 'Low CTR Opportunities (High Impressions, < 3% CTR)',
      items: lowCTR.map((r) => {
        const label = r.keyword || r.url || '(unknown)';
        const ctr = ((r.clicks / (r.impressions || 1)) * 100).toFixed(1);
        return `"${label}" — Impr: ${r.impressions.toLocaleString()} | CTR: ${ctr}% | Pos: ${r.position?.toFixed(1) || 'N/A'}`;
      }),
    });
  }

  const recommendations = [];
  if (lowCTR.length > 0) {
    recommendations.push({
      priority: 'High',
      action: `Optimise title tags and meta descriptions for ${lowCTR.length} low-CTR queries`,
      impact: `Unlock up to ${lowCTR.reduce((s, r) => s + r.impressions, 0).toLocaleString()} impressions with better CTR`,
    });
  }
  recommendations.push({
    priority: 'Medium',
    action: 'Set up monthly GSC data export pipeline for trend tracking',
    impact: 'Data-driven decision making across reporting periods',
  });

  return {
    agentId, agentName, agentRole,
    timestamp: new Date().toISOString(),
    deliverableType: 'Performance Analysis (Data-Backed)',
    summary: `Performance analysis of ${parsed.length} entries from ${data.fileName}. Total clicks: ${totalClicks.toLocaleString()}, impressions: ${totalImpressions.toLocaleString()}, avg CTR: ${avgCTR}%.`,
    sections,
    recommendations,
    kbDocumentsUsed: [data.fileName],
    dataSource: data.fileName,
    kbContext: `Deliverable generated from user-supplied data: ${data.fileName} (${parsed.length} rows)`,
  };
}

/**
 * Build a generic data deliverable when type isn't specific.
 */
export function buildGenericDataDeliverable(data, agentId, agentName, agentRole) {
  const rows = data.rows;
  const columns = data.columns;

  const sections = [
    {
      heading: `Data Summary (${data.fileName})`,
      items: [
        `Rows: ${rows.length}`,
        `Columns: ${columns.join(', ')}`,
        `Data type detected: ${data.dataType}`,
      ],
    },
    {
      heading: 'Sample Data (First 10 Rows)',
      items: rows.slice(0, 10).map((r, i) => {
        const vals = columns.map((c) => `${c}: ${r[c] || '-'}`).join(' | ');
        return `Row ${i + 1}: ${vals}`;
      }),
    },
  ];

  return {
    agentId, agentName, agentRole,
    timestamp: new Date().toISOString(),
    deliverableType: 'Data Analysis Report',
    summary: `Parsed ${rows.length} rows from ${data.fileName} with columns: ${columns.join(', ')}.`,
    sections,
    recommendations: [
      { priority: 'Medium', action: 'Enrich data with additional columns (volume, difficulty) for deeper analysis', impact: 'More actionable insights' },
    ],
    kbDocumentsUsed: [data.fileName],
    dataSource: data.fileName,
    kbContext: `Deliverable generated from user-supplied data: ${data.fileName}`,
  };
}

/**
 * Main entry: attempt to build a data-driven deliverable from the task description.
 * Returns a complete deliverable object if data was found, or null to fall back to template.
 */
export function tryBuildFromData(description, agentId, agentName, agentRole) {
  const data = parseTaskData(description);
  if (!data) return null;

  const type = data.dataType;

  if (type === 'keyword_full' || type === 'keyword_basic' || type === 'gsc') {
    // GSC data and keyword data both feed into keyword analysis
    const descLower = description.toLowerCase();
    if (descLower.includes('performance') || descLower.includes('report')) {
      return buildPerformanceDeliverable(data, agentId, agentName, agentRole);
    }
    return buildKeywordDeliverable(data, agentId, agentName, agentRole);
  }

  if (type === 'redirect') {
    return buildRedirectDeliverable(data, agentId, agentName, agentRole);
  }

  if (type === 'performance') {
    return buildPerformanceDeliverable(data, agentId, agentName, agentRole);
  }

  return buildGenericDataDeliverable(data, agentId, agentName, agentRole);
}
