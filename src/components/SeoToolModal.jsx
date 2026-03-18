import React, { useState, useRef, useEffect } from 'react';

const PRIORITY_COLORS = { Critical: '#D34F2D', High: '#F08D34', Medium: '#F7CC76', Low: '#20C997' };

// Normalise issues/recs from varying Claude response shapes
function normaliseIssue(item) {
  if (typeof item === 'string') return { priority: 'Medium', issue: item, category: '' };
  return {
    priority: item.priority || item.severity || item.impact || 'Medium',
    issue: item.issue || item.description || item.finding || item.problem || item.text || item.message || item.detail || item.gap || item.opportunity || Object.values(item).find(v => typeof v === 'string' && v.length > 10) || JSON.stringify(item),
    category: item.category || item.type || item.area || item.signal || '',
  };
}

function normaliseRec(item) {
  if (typeof item === 'string') return { priority: 'Medium', title: item, description: '' };
  // Try every possible field name Claude might use for the title
  const title = item.title || item.name || item.recommendation || item.action || item.item || item.topic || item.opportunity || item.gap || item.type || item.label || item.phase ||
    Object.values(item).find(v => typeof v === 'string' && v.length > 3 && v.length < 120) || 'Recommendation';
  // Try every possible field name for description
  const desc = item.description || item.details || item.explanation || item.rationale || item.text || item.note || item.reason || item.content || item.json ||
    (Array.isArray(item.actions) ? item.actions.join(', ') : '') ||
    (Array.isArray(item.strengths) ? 'Strengths: ' + item.strengths.join(', ') : '') ||
    (Array.isArray(item.weaknesses) ? 'Weaknesses: ' + item.weaknesses.join(', ') : '') ||
    (Array.isArray(item.findings) ? item.findings.join(', ') : '') || '';
  if (title === desc && title.length > 80) {
    return { priority: item.priority || 'Medium', title: title.substring(0, 80) + '...', description: title };
  }
  return {
    priority: item.priority || item.severity || item.impact || 'Medium',
    title: typeof title === 'string' ? title : JSON.stringify(title),
    description: typeof desc === 'string' ? desc : JSON.stringify(desc),
  };
}

// Normalise any list of objects into displayable items
function normaliseListItem(item) {
  if (typeof item === 'string') return { label: item, detail: '' };
  if (Array.isArray(item)) return { label: item.join(', '), detail: '' };
  // Try to extract a meaningful label and detail
  const entries = Object.entries(item).filter(([k]) => !k.startsWith('_'));
  const strEntries = entries.filter(([, v]) => typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean');
  const label = strEntries.length > 0 ? String(strEntries[0][1]) : '';
  const detail = strEntries.slice(1).map(([k, v]) => `${k}: ${v}`).join(' · ');
  const arrays = entries.filter(([, v]) => Array.isArray(v));
  const arrayDetail = arrays.map(([k, v]) => `${k}: ${v.join(', ')}`).join(' | ');
  return { label: label || JSON.stringify(item).substring(0, 80), detail: [detail, arrayDetail].filter(Boolean).join(' | ') };
}

function ScoreBar({ label, value, max = 100 }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  const color = pct >= 70 ? '#20C997' : pct >= 50 ? '#F7CC76' : pct >= 30 ? '#F08D34' : '#D34F2D';
  return (
    <div style={{ marginBottom: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8px', marginBottom: '3px' }}>
        <span style={{ color: '#ccc' }}>{label}</span><span style={{ color, fontWeight: 'bold' }}>{value}/{max}</span>
      </div>
      <div style={{ height: '6px', background: '#162240', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '3px' }} />
      </div>
    </div>
  );
}

function JsonViewer({ data, depth = 0 }) {
  if (!data || typeof data !== 'object') return <span style={{ color: '#F7CC76' }}>{JSON.stringify(data)}</span>;
  if (Array.isArray(data)) {
    if (data.length === 0) return <span style={{ color: '#666' }}>[]</span>;
    return data.map((item, i) => (
      <div key={i} style={{ marginLeft: depth > 0 ? '12px' : 0, padding: '3px 0', borderBottom: '1px solid #0C1526' }}>
        {typeof item === 'object' ? <JsonViewer data={item} depth={depth + 1} /> : <span style={{ color: '#ccc' }}>{String(item)}</span>}
      </div>
    ));
  }
  return Object.entries(data).filter(([k]) => !k.startsWith('_')).map(([key, val]) => (
    <div key={key} style={{ marginLeft: depth > 0 ? '12px' : 0, padding: '2px 0' }}>
      <span style={{ color: '#2EC4F3', fontSize: '4.5px' }}>{key}: </span>
      {typeof val === 'object' && val !== null ? <JsonViewer data={val} depth={depth + 1} /> : <span style={{ color: '#ccc', fontSize: '4.5px' }}>{String(val)}</span>}
    </div>
  ));
}

export default function SeoToolModal({ tool, onClose, onComplete, onAgentState, onAgentSpeech, onAgentComplete, addActivity }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [result, setResult] = useState(tool._preload || null);
  const [showExport, setShowExport] = useState(false);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);
  const pf = '"Press Start 2P", monospace';
  const agent = tool.agent || 'ewan';
  const agentName = { rob: 'Rob', mike: 'Mike', craig: 'Craig', leo: 'Leo', ewan: 'Ewan', mya: 'Mya', alex: 'Alex', ken: 'Ken' }[agent] || 'Ewan';

  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 100); }, []);
  useEffect(() => { if (result && resultsRef.current) resultsRef.current.scrollTop = 0; }, [result]);

  const runTool = async () => {
    let testUrl = url.trim();
    if (!testUrl) { setError('Enter a URL'); return; }
    if (!testUrl.startsWith('http://') && !testUrl.startsWith('https://')) testUrl = 'https://' + testUrl;
    try { new URL(testUrl); } catch { setError('Invalid URL format'); return; }

    setError(''); setLoading(true); setResult(null); setProgress('Initialising...');

    const agentTimers = [];
    if (onAgentState) {
      agentTimers.push(setTimeout(() => { onAgentState('mike', 'thinking'); if (onAgentSpeech) onAgentSpeech('mike', `${tool.label} request...`); if (addActivity) addActivity('mike', 'Mike', `Triaging: ${tool.label}`, 'agent_working'); }, 500));
      agentTimers.push(setTimeout(() => { onAgentState('mike', 'idle'); onAgentState(agent, 'thinking'); if (onAgentSpeech) onAgentSpeech(agent, 'Picking this up...'); if (addActivity) addActivity('mike', 'Mike', `Delegated to ${agentName}`, 'agent_assigned'); }, 3000));
      agentTimers.push(setTimeout(() => { onAgentState(agent, 'working'); if (onAgentSpeech) onAgentSpeech(agent, 'Crawling the page...'); }, 7000));
      agentTimers.push(setTimeout(() => { if (onAgentSpeech) onAgentSpeech(agent, 'Deep in analysis...'); }, 18000));
      agentTimers.push(setTimeout(() => { if (onAgentSpeech) onAgentSpeech(agent, 'Compiling results...'); }, 35000));
    }
    const progressTimers = [
      setTimeout(() => setProgress('Searching for page...'), 2000),
      setTimeout(() => setProgress('Crawling content...'), 6000),
      setTimeout(() => setProgress(`Running ${tool.label}...`), 12000),
      setTimeout(() => setProgress('Analysing data...'), 20000),
      setTimeout(() => setProgress('Generating results...'), 30000),
      setTimeout(() => setProgress('Finalising...'), 42000),
      setTimeout(() => setProgress('Almost there...'), 55000),
    ];
    const allTimers = [...progressTimers, ...agentTimers];

    const retryDelays = [0, 15000, 25000, 35000]; // immediate, then 15s, 25s, 35s
    
    for (let attempt = 0; attempt < retryDelays.length; attempt++) {
      if (attempt > 0) {
        const waitSec = retryDelays[attempt] / 1000;
        for (let sec = waitSec; sec > 0; sec--) {
          setProgress(`Request failed — auto-retrying in ${sec}s (attempt ${attempt + 1}/3)...`);
          if (onAgentSpeech) onAgentSpeech(agent, `Retrying in ${sec}s...`);
          await new Promise(r => setTimeout(r, 1000));
        }
        setProgress(`Retrying (attempt ${attempt + 1}/3)...`);
      }

      try {
        const res = await fetch('/api/seo-tool', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ command: tool.command, url: testUrl }),
        });
        const data = await res.json();

        // Rate limited or server busy — retry
        if (data.error && (data.error.toLowerCase().includes('rate limit') || data.error.includes('429') || data.error.includes('busy') || data.error.includes('503') || data.error.includes('overloaded'))) {
          if (attempt < retryDelays.length - 1) continue;
          allTimers.forEach(clearTimeout);
          setError('Service busy after 3 retries. Please wait a minute and try again.');
          setLoading(false);
          if (onAgentState) { onAgentState(agent, 'idle'); onAgentState('mike', 'idle'); }
          return;
        }

        // Other API error — don't retry
        if (data.error) {
          allTimers.forEach(clearTimeout);
          setError(data.error); setLoading(false);
          if (onAgentState) { onAgentState(agent, 'idle'); onAgentState('mike', 'idle'); }
          return;
        }

        // Success
        allTimers.forEach(clearTimeout);
        setResult(data);
        if (onComplete) onComplete(data);
        if (onAgentComplete) onAgentComplete(agent);
        if (onAgentSpeech) onAgentSpeech(agent, `${tool.label} done! ✓`);
        if (addActivity) addActivity(agent, agentName, `Completed: ${tool.label} for ${testUrl}`, 'task_completed');
        setLoading(false); setProgress('');
        return;
      } catch (e) {
        // Network error (timeout, connection refused, function crash) — retry
        console.error(`Attempt ${attempt + 1} failed:`, e.message);
        if (attempt < retryDelays.length - 1) continue;
        // All retries exhausted
        allTimers.forEach(clearTimeout);
        setError('Unable to reach the service after 3 attempts. The server may be overloaded — please try again shortly.');
        setLoading(false);
        if (onAgentState) { onAgentState(agent, 'idle'); onAgentState('mike', 'idle'); }
        return;
      }
    }
    setLoading(false); setProgress('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !loading) { e.preventDefault(); runTool(); }
    if (e.key === 'Escape' && !loading) onClose();
  };

  const exportAs = (format) => {
    if (!result) return;
    const domain = (() => { try { return new URL(result.url || url).hostname.replace('www.', ''); } catch { return 'audit'; } })();
    const date = new Date().toISOString().split('T')[0];
    const filename = `seo-${tool.command}-${domain}-${date}`;

    if (format === 'json') {
      dl(new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' }), filename + '.json');
    } else if (format === 'html' || format === 'pdf' || format === 'doc') {
      const pc = (s) => s >= 70 ? '#20C997' : s >= 50 ? '#F7CC76' : s >= 30 ? '#F08D34' : '#D34F2D';
      const issueRows = (result.issues || []).map(raw => { const i = normaliseIssue(raw); return `<tr><td style="color:${PRIORITY_COLORS[i.priority]||'#999'};font-weight:bold">${i.priority}</td><td>${i.issue}</td><td>${i.category}</td></tr>`; }).join('');
      const recRows = (result.recommendations || []).map(raw => { const r = normaliseRec(raw); return `<tr><td style="color:${PRIORITY_COLORS[r.priority]||'#999'};font-weight:bold">${r.priority}</td><td><strong>${r.title}</strong>${r.description ? '<br>'+r.description : ''}</td></tr>`; }).join('');
      const scoreHtml = Object.entries(result).filter(([k,v]) => typeof v === 'number' && k.includes('Score') || k.includes('Readiness') || k === 'overallScore').map(([k,v]) => `<div class="score-box"><div class="score-num" style="color:${pc(v)}">${v}</div><div class="score-label">${k.replace(/([A-Z])/g,' $1').trim()}</div></div>`).join('');
      const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${tool.label} - ${domain}</title><style>*{margin:0;padding:0;box-sizing:border-box}body{background:#070D18;color:#FAF9F5;font-family:'Courier New',monospace;font-size:11px;padding:40px}h1{color:#0DCAF0;font-size:20px;margin-bottom:4px}h2{color:#0047AB;font-size:14px;margin:20px 0 8px;border-bottom:1px solid #222;padding-bottom:4px}.meta{color:#999;font-size:10px;margin-bottom:16px}.scores{display:flex;gap:20px;margin:12px 0 20px;flex-wrap:wrap}.score-box{text-align:center}.score-num{font-size:24px;font-weight:bold}.score-label{font-size:8px;color:#999}table{width:100%;border-collapse:collapse;margin:6px 0 14px;font-size:10px}th{background:#0047AB;color:#fff;text-align:left;padding:5px 7px;font-size:9px}td{padding:4px 7px;border-bottom:1px solid #222;vertical-align:top}tr:nth-child(even) td{background:#0C1526}.summary{background:#0C1526;border:1px solid #222;border-radius:4px;padding:10px;margin:12px 0;line-height:1.5}@media print{body{padding:15px}@page{size:A4;margin:15mm}}</style></head><body><h1>${tool.label.toUpperCase()}</h1><div class="meta">URL: ${result.url||url} · ${date} · /seo ${tool.command}</div><div class="scores">${scoreHtml}</div>${result.summary ? `<h2>// SUMMARY</h2><div class="summary">${result.summary}</div>` : ''}${issueRows ? `<h2>// ISSUES (${(result.issues||[]).length})</h2><table><tr><th>Priority</th><th>Issue</th><th>Category</th></tr>${issueRows}</table>` : ''}${recRows ? `<h2>// RECOMMENDATIONS</h2><table><tr><th>Priority</th><th>Recommendation</th></tr>${recRows}</table>` : ''}</body></html>`;
      if (format === 'pdf') {
        const w = window.open('', '_blank');
        if (w) { w.document.write(html); w.document.close(); setTimeout(() => w.print(), 500); }
      } else if (format === 'doc') {
        const docHtml = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><style>body{font-family:'Courier New',monospace;font-size:11px;padding:20px}h1{color:#0047AB;font-size:20px}h2{color:#0047AB;font-size:14px;border-bottom:1px solid #ccc;padding-bottom:4px;margin-top:16px}table{width:100%;border-collapse:collapse;font-size:10px;margin:8px 0}th{background:#0047AB;color:#fff;text-align:left;padding:5px 7px}td{padding:4px 7px;border:1px solid #ddd;vertical-align:top}.summary{background:#f5f5f5;padding:10px;border-radius:4px;margin:10px 0}</style></head><body><h1>${tool.label.toUpperCase()}</h1><p>URL: ${result.url||url} · ${date} · /seo ${tool.command}</p>${scoreHtml ? '<div>'+scoreHtml+'</div>' : ''}${result.summary ? '<h2>SUMMARY</h2><div class="summary">'+result.summary+'</div>' : ''}${issueRows ? '<h2>ISSUES ('+((result.issues||[]).length)+')</h2><table><tr><th>Priority</th><th>Issue</th><th>Category</th></tr>'+issueRows+'</table>' : ''}${recRows ? '<h2>RECOMMENDATIONS</h2><table><tr><th>Priority</th><th>Recommendation</th></tr>'+recRows+'</table>' : ''}</body></html>`;
        dl(new Blob([docHtml], { type: 'application/msword' }), filename + '.doc');
      } else {
        dl(new Blob([html], { type: 'text/html' }), filename + '.html');
      }
    } else if (format === 'md') {
      let md = `# ${tool.label}\n\n**URL:** ${result.url || url}\n**Date:** ${date}\n**Command:** /seo ${tool.command}\n\n`;
      if (result.summary) md += `## Summary\n\n${result.summary}\n\n`;
      if (result.issues?.length) {
        md += `## Issues (${result.issues.length})\n\n| Priority | Issue | Category |\n|---|---|---|\n`;
        result.issues.forEach(raw => { const i = normaliseIssue(raw); md += `| ${i.priority} | ${i.issue} | ${i.category} |\n`; });
        md += '\n';
      }
      if (result.recommendations?.length) {
        md += `## Recommendations\n\n`;
        result.recommendations.forEach((raw, idx) => { const r = normaliseRec(raw); md += `### ${idx+1}. [${r.priority}] ${r.title}\n\n${r.description || 'No additional details.'}\n\n`; });
      }
      if (result._meta) md += `---\n*${result._meta.model} · ${result._meta.inputTokens} in / ${result._meta.outputTokens} out*\n`;
      const blob = new Blob([md], { type: 'text/markdown' });
      dl(blob, filename + '.md');
    }
    setShowExport(false);
  };

  const dl = (blob, name) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  // Render scores from result
  const renderScores = () => {
    const scores = [];
    const scoreKeys = ['overallScore', 'technicalScore', 'contentQualityScore', 'aiCitationReadiness', 'schemaScore', 'imageScore', 'sitemapScore', 'geoScore', 'hreflangScore'];
    const labels = { overallScore: 'Overall', technicalScore: 'Technical', contentQualityScore: 'Content', aiCitationReadiness: 'AI Citation', schemaScore: 'Schema', imageScore: 'Images', sitemapScore: 'Sitemap', geoScore: 'GEO', hreflangScore: 'Hreflang' };
    scoreKeys.forEach(k => { if (typeof result[k] === 'number') scores.push({ label: labels[k] || k, value: result[k] }); });
    if (result.eeat?.overall) scores.push({ label: 'E-E-A-T', value: result.eeat.overall });
    if (result.scores) Object.entries(result.scores).forEach(([k, v]) => { if (typeof v === 'number') scores.push({ label: k, value: v }); });
    return scores;
  };

  return (
    <div style={{ position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.88)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999 }}
      onClick={(e) => { if (e.target === e.currentTarget && !loading) onClose(); }}>
      <div style={{ background:'#091E2A', border:'2px solid #144B63', borderRadius:'4px', width: result ? '800px' : '540px', maxWidth:'95vw', maxHeight:'90vh', display:'flex', flexDirection:'column', fontFamily:pf, transition:'width 0.3s' }}
        onClick={(e) => e.stopPropagation()}>

        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 16px 10px', borderBottom:'1px solid #144B63' }}>
          <div style={{ fontSize:'13px', color:'#2EC4F3', display:'flex', alignItems:'center', gap:'6px' }}>
            <span style={{ fontSize:'16px' }}>🔍</span> {tool.label.toUpperCase()}
          </div>
          <button onClick={onClose} style={{ background:'none', border:'1px solid #444', color:'#999', fontFamily:pf, fontSize:'10px', cursor:'pointer', padding:'5px 10px', borderRadius:'2px' }}>ESC</button>
        </div>

        <div style={{ padding:'16px', overflowY:'auto', flex:1 }} ref={resultsRef}>
          {!result && (<>
            <div style={{ fontSize:'9px', color:'#999', lineHeight:'1.8', marginBottom:'14px' }}>
              {tool.desc}<br/>Powered by Claude AI · Agent: {agentName}
            </div>
            <label style={{ fontSize:'9px', color:'#2EC4F3', display:'block', marginBottom:'6px' }}>TARGET URL</label>
            <div style={{ display:'flex', alignItems:'center', background:'#0A1E2A', border:'1.6px solid #1A4B63', borderRadius:'3px', padding:'2px' }}>
              <span style={{ fontSize:'10px', color:'#2EC4F3', padding:'4px 6px', opacity:0.6 }}>{'>'}</span>
              <input ref={inputRef} style={{ flex:1, background:'transparent', border:'none', outline:'none', color:'#F0F4F7', fontFamily:pf, fontSize:'10px', padding:'6px 4px' }}
                type="text" value={url} onChange={(e) => { setUrl(e.target.value); setError(''); }} onKeyDown={handleKeyDown}
                placeholder="https://example.com/page" disabled={loading} />
            </div>
            {error && <div style={{ fontSize:'9px', color:'#D34F2D', marginTop:'8px' }}>⚠ {error}</div>}
            {loading ? (
              <div style={{ fontSize:'9px', color:'#2EC4F3', textAlign:'center', padding:'24px 0' }}>
                <div style={{ marginBottom:'8px' }}>⏳ {progress}</div>
                <div style={{ height:'3px', background:'#144B63', borderRadius:'2px', overflow:'hidden' }}>
                  <div style={{ height:'100%', background:'#2EC4F3', borderRadius:'2px', animation:'auditPulse 2s ease-in-out infinite', width:'60%' }} />
                </div>
                <style>{`@keyframes auditPulse{0%,100%{opacity:.4;width:30%}50%{opacity:1;width:80%}}`}</style>
                <div style={{ marginTop:'8px', fontSize:'16px', color:'#666' }}>{agentName} is working on this...</div>
              </div>
            ) : (
              <button onClick={runTool} disabled={!url.trim()} style={{ fontFamily:pf, fontSize:'10px', padding:'8px 16px', border:'none', borderRadius:'3px', cursor:'pointer', marginTop:'12px', background:'#2EC4F3', color:'#0A1E2A', width:'100%', opacity: url.trim() ? 1 : 0.4, fontWeight:'bold' }}>RUN /SEO {tool.command.toUpperCase()}</button>
            )}
          </>)}

          {result && (
            <div style={{ fontSize:'9px', color:'#F0F4F7', lineHeight:'1.7' }}>
              {/* Actions bar */}
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'14px' }}>
                <button onClick={() => setResult(null)} style={{ background:'none', border:'1px solid #144B63', color:'#2EC4F3', fontFamily:pf, fontSize:'9px', cursor:'pointer', padding:'5px 12px', borderRadius:'2px' }}>← NEW</button>
                <div style={{ position:'relative' }}>
                  <button onClick={() => setShowExport(!showExport)} style={{ background:'none', border:'1px solid #7a4520', color:'#F08D34', fontFamily:pf, fontSize:'9px', cursor:'pointer', padding:'5px 12px', borderRadius:'2px' }}>⬇ EXPORT ▾</button>
                  {showExport && (
                    <div style={{ position:'absolute', right:0, top:'100%', marginTop:'4px', background:'#091E2A', border:'1px solid #144B63', borderRadius:'3px', zIndex:100, minWidth:'100px', overflow:'hidden' }}>
                      {[{ label:'📄 PDF (Print)', fn:() => exportAs('pdf') }, { label:'📝 Word (.doc)', fn:() => exportAs('doc') }, { label:'🌐 HTML', fn:() => exportAs('html') }, { label:'📋 Markdown', fn:() => exportAs('md') }, { label:'🔧 JSON', fn:() => exportAs('json') }].map(opt => (
                        <button key={opt.label} onClick={opt.fn} style={{ display:'block', width:'100%', textAlign:'left', background:'none', border:'none', borderBottom:'1px solid #0C1526', color:'#F0F4F7', fontFamily:pf, fontSize:'9px', cursor:'pointer', padding:'8px 14px' }}
                          onMouseOver={e => e.target.style.background='#162240'} onMouseOut={e => e.target.style.background='none'}>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Meta */}
              <div style={{ color:'#999', marginBottom:'4px' }}>URL: <span style={{ color:'#2EC4F3' }}>{result.url || url}</span></div>
              <div style={{ color:'#999', marginBottom:'12px' }}>{result.pageType || ''} {result.industry ? `· ${result.industry}` : ''}</div>

              {/* Scores */}
              {renderScores().length > 0 && (<>
                <div style={{ color:'#0047AB', fontSize:'16px', fontWeight:'bold', margin:'12px 0 8px' }}>// SCORES</div>
                {renderScores().map(s => <ScoreBar key={s.label} label={s.label} value={s.value} />)}
              </>)}

              {/* Issues */}
              {result.issues?.length > 0 && (<>
                <div style={{ color:'#0047AB', fontSize:'14px', fontWeight:'bold', margin:'16px 0 8px' }}>// ISSUES ({result.issues.length})</div>
                {result.issues.map((raw, i) => {
                  const issue = normaliseIssue(raw);
                  return (
                  <div key={i} style={{ display:'flex', gap:'8px', padding:'5px 0', borderBottom:'1px solid #162240', alignItems:'baseline' }}>
                    <span style={{ color: PRIORITY_COLORS[issue.priority] || '#999', fontWeight:'bold', minWidth:'50px', fontSize:'10px' }}>{issue.priority}</span>
                    <span style={{ color:'#ccc', flex:1, fontSize:'10px', lineHeight:'1.5' }}>{issue.issue}</span>
                    <span style={{ color:'#555', fontSize:'9px', whiteSpace:'nowrap' }}>{issue.category}</span>
                  </div>
                  );
                })}
              </>)}

              {/* Recommendations */}
              {result.recommendations?.length > 0 && (<>
                <div style={{ color:'#0047AB', fontSize:'14px', fontWeight:'bold', margin:'16px 0 8px' }}>// RECOMMENDATIONS</div>
                {result.recommendations.map((raw, i) => {
                  const rec = normaliseRec(raw);
                  return (
                  <div key={i} style={{ padding:'8px 12px', marginBottom:'5px', background:'#0C1526', borderLeft:`2px solid ${PRIORITY_COLORS[rec.priority]||'#444'}`, borderRadius:'3px' }}>
                    <div style={{ fontSize:'10px' }}><span style={{ color:PRIORITY_COLORS[rec.priority], fontWeight:'bold' }}>{rec.priority}</span> <span style={{ color:'#F0F4F7', fontWeight:'bold' }}>{rec.title}</span></div>
                    {rec.description && <div style={{ color:'#999', fontSize:'9px', marginTop:'3px', lineHeight:'1.6' }}>{rec.description}</div>}
                  </div>
                  );
                })}
              </>)}

              {/* Auto-render any additional data arrays from the result */}
              {Object.entries(result).filter(([key, val]) => {
                if (key.startsWith('_') || key === 'url' || key === 'pageType' || key === 'industry' || key === 'summary' || key === 'issues' || key === 'recommendations') return false;
                if (typeof val === 'number' || typeof val === 'boolean' || typeof val === 'string') return false;
                if (key.toLowerCase().includes('score')) return false;
                return Array.isArray(val) && val.length > 0;
              }).map(([key, val]) => (
                <div key={key}>
                  <div style={{ color:'#0047AB', fontSize:'14px', fontWeight:'bold', margin:'16px 0 8px' }}>// {key.replace(/([A-Z])/g, ' $1').toUpperCase()}</div>
                  {val.map((item, i) => {
                    const n = normaliseListItem(item);
                    return (
                      <div key={i} style={{ padding:'5px 10px', marginBottom:'2px', background: i % 2 === 0 ? '#0C1526' : 'transparent', borderRadius:'2px', fontSize:'10px', lineHeight:'1.6' }}>
                        <span style={{ color:'#2EC4F3', fontWeight:'bold' }}>{n.label}</span>
                        {n.detail && <div style={{ color:'#888', marginTop:'2px', fontSize:'9px' }}>{n.detail}</div>}
                      </div>
                    );
                  })}
                </div>
              ))}

              {/* Separate simple field-objects (title, h1, canonical etc.) from complex ones (eeat, contentMetrics) */}
              {(() => {
                const objectEntries = Object.entries(result).filter(([key, val]) => {
                  if (key.startsWith('_') || key === 'url' || key === 'pageType' || key === 'industry' || key === 'summary' || key === 'issues' || key === 'recommendations') return false;
                  return val && typeof val === 'object' && !Array.isArray(val);
                });

                // Simple objects: all values are primitives (string/number/boolean) - render as compact table
                const simpleObjects = objectEntries.filter(([, val]) => {
                  const vals = Object.values(val).filter(v => v !== null && v !== undefined);
                  return vals.length > 0 && vals.every(v => typeof v !== 'object');
                });

                // Complex objects: have sub-objects, arrays, or score fields - render as section cards
                const complexObjects = objectEntries.filter(([, val]) => {
                  const vals = Object.values(val).filter(v => v !== null && v !== undefined);
                  return vals.some(v => typeof v === 'object');
                });

                const renderValue = (v) => {
                  if (v === null || v === undefined) return '—';
                  if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') return String(v);
                  if (Array.isArray(v)) return v.map(item => typeof item === 'object' ? Object.values(item).join(', ') : String(item)).join(', ') || '—';
                  if (typeof v === 'object') return Object.entries(v).map(([k2, v2]) => `${k2}: ${Array.isArray(v2) ? v2.join(', ') : String(v2)}`).join(' · ');
                  return String(v);
                };

                const statusColor = (s) => {
                  if (!s || typeof s !== 'string') return '#ccc';
                  const sl = s.toLowerCase();
                  if (sl === 'pass' || sl === 'good' || sl === 'present' || sl === 'true') return '#20C997';
                  if (sl === 'fail' || sl === 'missing' || sl === 'false' || sl === 'bad') return '#D34F2D';
                  if (sl.includes('need') || sl === 'mismatch' || sl === 'warning') return '#F08D34';
                  return '#F7CC76';
                };

                return (
                  <>
                    {/* Simple objects as compact On-Page SEO style table */}
                    {simpleObjects.length > 0 && (
                      <div>
                        <div style={{ color:'#0047AB', fontSize:'14px', fontWeight:'bold', margin:'16px 0 8px' }}>// ON-PAGE ELEMENTS</div>
                        {simpleObjects.map(([key, val]) => {
                          const mainVal = val.value || val.url || val.href || '';
                          const status = val.status || val.valid || '';
                          const note = val.note || val.description || '';
                          const extras = Object.entries(val).filter(([k]) => !['value','status','note','description','url','href','valid'].includes(k));

                          return (
                            <div key={key} style={{ display:'flex', gap:'10px', padding:'6px 10px', borderBottom:'1px solid #162240', alignItems:'baseline', fontSize:'9px' }}>
                              <span style={{ color:'#2EC4F3', minWidth:'90px', fontWeight:'bold', textTransform:'capitalize', fontSize:'9px' }}>
                                {key.replace(/([A-Z])/g, ' $1')}
                              </span>
                              <div style={{ flex:1, minWidth:0 }}>
                                {mainVal && <span style={{ color:'#ccc', wordBreak:'break-word' }}>{String(mainVal)}</span>}
                                {extras.map(([ek, ev]) => (
                                  <span key={ek} style={{ color:'#666', marginLeft:'8px' }}>{ek}: {String(ev)}</span>
                                ))}
                                {note && <div style={{ color:'#666', fontSize:'8px', marginTop:'2px' }}>{note}</div>}
                              </div>
                              {status && (
                                <span style={{ color: statusColor(status), fontWeight:'bold', fontSize:'8px', whiteSpace:'nowrap', textTransform:'uppercase' }}>
                                  {String(status)}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Complex objects as visual section cards */}
                    {complexObjects.map(([key, val]) => {
                      const entries = Object.entries(val).filter(([, v]) => v !== null && v !== undefined);
                      if (entries.length === 0) return null;

                      return (
                        <div key={key}>
                          <div style={{ color:'#0047AB', fontSize:'14px', fontWeight:'bold', margin:'16px 0 8px' }}>// {key.replace(/([A-Z])/g, ' $1').toUpperCase()}</div>
                          {entries.map(([k, v]) => {
                            // Score card
                            if (v && typeof v === 'object' && !Array.isArray(v) && 'score' in v) {
                              const score = Number(v.score) || 0;
                              const maxScore = (key === 'eeat' || key === 'e_e_a_t') ? 25 : 100;
                              const pct = Math.min((score / maxScore) * 100, 100);
                              const barColor = pct >= 70 ? '#20C997' : pct >= 50 ? '#F7CC76' : pct >= 30 ? '#F08D34' : '#D34F2D';
                              const descFields = Object.entries(v).filter(([fk]) => fk !== 'score');
                              const descText = descFields.map(([, fv]) => Array.isArray(fv) ? fv.join(' · ') : String(fv)).join(' — ');
                              return (
                                <div key={k} style={{ padding:'8px 12px', marginBottom:'6px', background:'#0C1526', borderRadius:'4px', borderLeft:`3px solid ${barColor}` }}>
                                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'4px' }}>
                                    <span style={{ color:'#F0F4F7', fontSize:'10px', fontWeight:'bold', textTransform:'capitalize' }}>{k.replace(/([A-Z])/g, ' $1')}</span>
                                    <span style={{ color: barColor, fontSize:'10px', fontWeight:'bold' }}>{score}/{maxScore}</span>
                                  </div>
                                  <div style={{ height:'5px', background:'#162240', borderRadius:'3px', overflow:'hidden', marginBottom: descText ? '5px' : '0' }}>
                                    <div style={{ height:'100%', width:`${pct}%`, background: barColor, borderRadius:'3px' }} />
                                  </div>
                                  {descText && <div style={{ color:'#888', fontSize:'8px', lineHeight:'1.6' }}>{descText}</div>}
                                </div>
                              );
                            }
                            // Sub-object without score
                            if (v && typeof v === 'object' && !Array.isArray(v)) {
                              return (
                                <div key={k} style={{ padding:'5px 12px', marginBottom:'3px', background:'#0C1526', borderRadius:'3px', fontSize:'9px' }}>
                                  <span style={{ color:'#2EC4F3', fontWeight:'bold', textTransform:'capitalize' }}>{k.replace(/([A-Z])/g, ' $1')}: </span>
                                  <span style={{ color:'#ccc' }}>{Object.entries(v).map(([sk, sv]) => `${sk}: ${renderValue(sv)}`).join(' · ')}</span>
                                </div>
                              );
                            }
                            // Number
                            if (typeof v === 'number' && v <= 100) {
                              const barColor = v >= 70 ? '#20C997' : v >= 50 ? '#F7CC76' : v >= 30 ? '#F08D34' : '#D34F2D';
                              return (
                                <div key={k} style={{ display:'flex', gap:'10px', padding:'3px 12px', fontSize:'9px' }}>
                                  <span style={{ color:'#2EC4F3', minWidth:'80px', textTransform:'capitalize' }}>{k.replace(/([A-Z])/g, ' $1')}</span>
                                  <span style={{ color: barColor, fontWeight:'bold' }}>{v}/100</span>
                                </div>
                              );
                            }
                            // Array or primitive
                            return (
                              <div key={k} style={{ display:'flex', gap:'10px', padding:'3px 12px', fontSize:'9px' }}>
                                <span style={{ color:'#2EC4F3', minWidth:'80px', textTransform:'capitalize' }}>{k.replace(/([A-Z])/g, ' $1')}</span>
                                <span style={{ color: typeof v === 'string' && (v === 'Strong' || v === 'Good') ? '#F7CC76' : '#ccc', fontWeight: typeof v === 'string' && v.length < 20 ? 'bold' : 'normal' }}>{renderValue(v)}</span>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </>
                );
              })()}

              {/* Summary */}
              {result.summary && (<>
                <div style={{ color:'#0047AB', fontSize:'14px', fontWeight:'bold', margin:'16px 0 8px' }}>// SUMMARY</div>
                <div style={{ background:'#0C1526', border:'1px solid #222', borderRadius:'4px', padding:'10px 12px', color:'#ccc', lineHeight:'1.8', fontSize:'10px' }}>{result.summary}</div>
              </>)}

              {/* Full data viewer */}
              <details style={{ marginTop:'16px' }}>
                <summary style={{ color:'#666', fontSize:'10px', cursor:'pointer' }}>View raw data</summary>
                <div style={{ marginTop:'6px', padding:'8px', background:'#0C1526', borderRadius:'3px', fontSize:'9px', maxHeight:'300px', overflowY:'auto' }}>
                  <JsonViewer data={result} />
                </div>
              </details>

              {/* Meta */}
              {result._meta && <div style={{ color:'#444', fontSize:'16px', marginTop:'12px', textAlign:'right' }}>{result._meta.model} · {result._meta.inputTokens?.toLocaleString()} in / {result._meta.outputTokens?.toLocaleString()} out · {result._meta.turns} turns · {result._meta.analysedAt?.split('T')[0]}</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
