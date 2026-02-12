/**
 * Export deliverable results to downloadable files.
 */

/**
 * Convert a deliverable result object to Markdown text.
 */
export function resultToMarkdown(result) {
  const lines = [];

  lines.push(`# ${result.deliverableType || 'Task Output'}`);
  if (result.agentName) {
    lines.push(`**Author:** ${result.agentName} (${result.agentRole})`);
  }
  if (result.timestamp) {
    lines.push(`**Date:** ${new Date(result.timestamp).toLocaleString()}`);
  }
  lines.push('');

  if (result.sopFollowed) lines.push(`> SOP: ${result.sopFollowed}`);
  if (result.prdConformed) lines.push(`> PRD: ${result.prdConformed}`);
  if (result.sopFollowed || result.prdConformed) lines.push('');

  if (result.summary) {
    lines.push(result.summary);
    lines.push('');
  }

  if (result.kbDocumentsUsed?.length > 0) {
    lines.push(`**KB Sources:** ${result.kbDocumentsUsed.join(', ')}`);
    lines.push('');
  }

  if (result.sections) {
    for (const section of result.sections) {
      lines.push(`## ${section.heading}`);
      if (Array.isArray(section.items)) {
        for (const item of section.items) {
          lines.push(`- ${item}`);
        }
      }
      // Support table data in sections
      if (section.table && Array.isArray(section.table) && section.table.length > 0) {
        const cols = Object.keys(section.table[0]);
        lines.push(`| ${cols.join(' | ')} |`);
        lines.push(`| ${cols.map(() => '---').join(' | ')} |`);
        for (const row of section.table) {
          lines.push(`| ${cols.map((c) => String(row[c] ?? '')).join(' | ')} |`);
        }
      }
      lines.push('');
    }
  }

  if (result.recommendations?.length > 0) {
    lines.push('## Recommendations');
    for (const rec of result.recommendations) {
      lines.push(`- **[${rec.priority}]** ${rec.action} — *${rec.impact}*`);
    }
    lines.push('');
  }

  if (result.kbContext) {
    lines.push(`---`);
    lines.push(result.kbContext);
  }

  return lines.join('\n');
}

/**
 * Convert a deliverable result to CSV text.
 * Flattens sections and recommendations into tabular format.
 */
export function resultToCSV(result) {
  const lines = [];

  // If sections contain table data, export the first table
  for (const section of (result.sections || [])) {
    if (section.table && Array.isArray(section.table) && section.table.length > 0) {
      const cols = Object.keys(section.table[0]);
      lines.push(cols.map(csvEscape).join(','));
      for (const row of section.table) {
        lines.push(cols.map((c) => csvEscape(String(row[c] ?? ''))).join(','));
      }
      return lines.join('\n');
    }
  }

  // Fallback: export sections as heading/item pairs
  lines.push('Section,Item');
  for (const section of (result.sections || [])) {
    for (const item of (section.items || [])) {
      lines.push(`${csvEscape(section.heading)},${csvEscape(item)}`);
    }
  }

  if (result.recommendations?.length > 0) {
    lines.push('');
    lines.push('Priority,Action,Impact');
    for (const rec of result.recommendations) {
      lines.push(`${csvEscape(rec.priority)},${csvEscape(rec.action)},${csvEscape(rec.impact)}`);
    }
  }

  return lines.join('\n');
}

function csvEscape(val) {
  if (val.includes(',') || val.includes('"') || val.includes('\n')) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}

/**
 * Trigger a file download in the browser.
 */
export function downloadFile(content, filename, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export a deliverable result as a downloadable file.
 */
export function exportDeliverable(result, format = 'markdown') {
  const type = (result.deliverableType || 'deliverable').replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase();
  const date = new Date().toISOString().split('T')[0];
  const baseName = `${type}-${date}`;

  if (format === 'csv') {
    downloadFile(resultToCSV(result), `${baseName}.csv`, 'text/csv');
  } else {
    downloadFile(resultToMarkdown(result), `${baseName}.md`, 'text/markdown');
  }
}
