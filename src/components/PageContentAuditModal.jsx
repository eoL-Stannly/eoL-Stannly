import React, { useState, useRef, useEffect } from 'react';

const PRIORITY_COLORS = { Critical: '#D34F2D', High: '#F08D34', Medium: '#F7CC76', Low: '#20C997' };
const STATUS_COLORS = { PASS: '#20C997', FAIL: '#D34F2D', MISSING: '#F7CC76', MISMATCH: '#F7CC76', 'NEEDS WORK': '#F08D34' };

function ScoreGauge({ score, label }) {
  const color = score >= 70 ? '#20C997' : score >= 50 ? '#F7CC76' : score >= 30 ? '#F08D34' : '#D34F2D';
  const rating = score >= 70 ? 'STRONG' : score >= 50 ? 'MODERATE' : score >= 30 ? 'WEAK' : 'VERY LOW';
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ width: 64, height: 64, borderRadius: '50%', border: `3px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px', background: `${color}11` }}>
        <span style={{ fontSize: '10px', fontWeight: 'bold', color, fontFamily: 'var(--pixel-font)' }}>{score}</span>
      </div>
      <div style={{ fontSize: '4.5px', color: '#999', fontFamily: 'var(--pixel-font)' }}>{label}</div>
      <div style={{ fontSize: '4px', color, fontFamily: 'var(--pixel-font)', marginTop: '1px' }}>{rating}</div>
    </div>
  );
}

function StatusBadge({ status }) {
  const color = STATUS_COLORS[status] || '#999';
  return <span style={{ fontSize: '4.5px', color, fontFamily: 'var(--pixel-font)', border: `1px solid ${color}44`, borderRadius: '2px', padding: '1px 4px', background: `${color}11` }}>{status}</span>;
}

function PriorityBadge({ priority }) {
  const color = PRIORITY_COLORS[priority] || '#999';
  return <span style={{ fontSize: '4.5px', color, fontFamily: 'var(--pixel-font)', fontWeight: 'bold' }}>{priority.toUpperCase()}</span>;
}

function generateReportHtml(audit) {
  const pc = (s) => s >= 70 ? '#20C997' : s >= 50 ? '#F7CC76' : s >= 30 ? '#F08D34' : '#D34F2D';
  const issueRows = (audit.issues || []).map(i => `<tr><td style="color:${PRIORITY_COLORS[i.priority]||'#999'};font-weight:bold;width:80px">${i.priority}</td><td>${i.issue}</td><td style="width:70px">${i.category}</td></tr>`).join('');
  const recRows = (audit.recommendations || []).map(r => `<tr><td style="color:${PRIORITY_COLORS[r.priority]||'#999'};font-weight:bold;width:80px">${r.priority}</td><td><strong>${r.title}</strong><br>${r.description}</td></tr>`).join('');
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>SEO Audit - ${audit.url}</title><style>*{margin:0;padding:0;box-sizing:border-box}body{background:#070D18;color:#FAF9F5;font-family:'Courier New',monospace;font-size:11px;padding:40px}h1{color:#0DCAF0;font-size:22px;margin-bottom:6px}h2{color:#0047AB;font-size:15px;margin:24px 0 10px;border-bottom:1px solid #222;padding-bottom:4px}.meta{color:#999;font-size:10px;margin-bottom:20px}.meta span{margin-right:16px}.scores{display:flex;gap:24px;margin:16px 0 24px}.score-box{text-align:center}.score-num{font-size:28px;font-weight:bold}.score-label{font-size:9px;color:#999;margin-top:2px}table{width:100%;border-collapse:collapse;margin:8px 0 16px;font-size:10px}th{background:#0047AB;color:#fff;text-align:left;padding:6px 8px;font-size:9px}td{padding:5px 8px;border-bottom:1px solid #222;vertical-align:top}tr:nth-child(even) td{background:#0C1526}.summary{background:#0C1526;border:1px solid #222;border-radius:4px;padding:12px;margin:16px 0;line-height:1.6}@media print{body{padding:20px}}</style></head><body><h1>SEO CONTENT & E-E-A-T ANALYSIS</h1><div class="meta"><span>URL: ${audit.url}</span><span>Date: ${new Date().toISOString().split('T')[0]}</span><span>Type: ${audit.pageType||''}</span></div><div class="scores"><div class="score-box"><div class="score-num" style="color:${pc(audit.contentQualityScore)}">${audit.contentQualityScore}</div><div class="score-label">Content Quality</div></div><div class="score-box"><div class="score-num" style="color:${pc(audit.aiCitationReadiness)}">${audit.aiCitationReadiness}</div><div class="score-label">AI Citation</div></div><div class="score-box"><div class="score-num" style="color:${pc(audit.eeat?.overall||0)}">${audit.eeat?.overall||0}</div><div class="score-label">E-E-A-T</div></div></div><h2>// E-E-A-T BREAKDOWN</h2><table><tr><th>Factor</th><th>Score</th><th>Signals</th></tr><tr><td>Experience</td><td style="color:${pc((audit.eeat?.experience?.score||0)*4)}">${audit.eeat?.experience?.score||0}/25</td><td>${audit.eeat?.experience?.signals||''}</td></tr><tr><td>Expertise</td><td style="color:${pc((audit.eeat?.expertise?.score||0)*4)}">${audit.eeat?.expertise?.score||0}/25</td><td>${audit.eeat?.expertise?.signals||''}</td></tr><tr><td>Authoritativeness</td><td style="color:${pc((audit.eeat?.authoritativeness?.score||0)*4)}">${audit.eeat?.authoritativeness?.score||0}/25</td><td>${audit.eeat?.authoritativeness?.signals||''}</td></tr><tr><td>Trustworthiness</td><td style="color:${pc((audit.eeat?.trustworthiness?.score||0)*4)}">${audit.eeat?.trustworthiness?.score||0}/25</td><td>${audit.eeat?.trustworthiness?.signals||''}</td></tr></table><h2>// ON-PAGE SEO</h2><table><tr><th>Element</th><th>Value</th><th>Status</th></tr><tr><td>Title</td><td>${audit.title?.value||''} (${audit.title?.length||0}c)</td><td>${audit.title?.status||''}</td></tr><tr><td>Meta Desc</td><td>${(audit.metaDescription?.value||'').substring(0,80)}... (${audit.metaDescription?.length||0}c)</td><td>${audit.metaDescription?.status||''}</td></tr><tr><td>H1</td><td>${audit.h1?.value||''}</td><td>${audit.h1?.status||''}</td></tr><tr><td>Canonical</td><td>${audit.canonical?.value||''}</td><td>${audit.canonical?.status||''}</td></tr><tr><td>Schema</td><td>${audit.schema?.count||0} blocks</td><td>${audit.schema?.status||''}</td></tr><tr><td>Hreflang</td><td>${audit.hreflang?.count||0} tags</td><td>${audit.hreflang?.status||''}</td></tr><tr><td>OG Tags</td><td>${audit.ogUrl?.note||''}</td><td>${audit.ogUrl?.status||''}</td></tr></table><h2>// ISSUES FOUND</h2><table><tr><th>Priority</th><th>Issue</th><th>Category</th></tr>${issueRows}</table><h2>// RECOMMENDATIONS</h2><table><tr><th>Priority</th><th>Recommendation</th></tr>${recRows}</table><h2>// SUMMARY</h2><div class="summary">${audit.summary||''}</div></body></html>`;
}

export default function PageContentAuditModal({ onClose }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [audit, setAudit] = useState(null);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);

  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 100); }, []);
  useEffect(() => { if (audit && resultsRef.current) resultsRef.current.scrollTop = 0; }, [audit]);

  const runAudit = async () => {
    let testUrl = url.trim();
    if (!testUrl) { setError('Enter a URL'); return; }
    if (!testUrl.startsWith('http://') && !testUrl.startsWith('https://')) testUrl = 'https://' + testUrl;
    try { new URL(testUrl); } catch { setError('Invalid URL format'); return; }

    setError(''); setLoading(true); setAudit(null); setProgress('Searching for page...');
    const timers = [
      setTimeout(() => setProgress('Crawling page content...'), 3000),
      setTimeout(() => setProgress('Analysing HTML structure...'), 8000),
      setTimeout(() => setProgress('Evaluating E-E-A-T signals...'), 15000),
      setTimeout(() => setProgress('Scoring content quality...'), 22000),
      setTimeout(() => setProgress('Generating recommendations...'), 30000),
      setTimeout(() => setProgress('Finalising audit...'), 40000),
      setTimeout(() => setProgress('Almost there...'), 50000),
    ];

    try {
      const res = await fetch('/api/content-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: testUrl }),
      });
      const data = await res.json();
      timers.forEach(clearTimeout);
      if (data.error) { setError(data.error); setLoading(false); return; }
      setAudit(data);
    } catch {
      timers.forEach(clearTimeout);
      setError('Network error. Check your connection.');
    }
    setLoading(false); setProgress('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !loading) { e.preventDefault(); runAudit(); }
    if (e.key === 'Escape') onClose();
  };

  const downloadReport = () => {
    if (!audit) return;
    const html = generateReportHtml(audit);
    const blob = new Blob([html], { type: 'text/html' });
    const a = document.createElement('a');
    const domain = new URL(audit.url).hostname.replace('www.', '');
    a.href = URL.createObjectURL(blob);
    a.download = `seo-audit-${domain}-${new Date().toISOString().split('T')[0]}.html`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  const pf = '"Press Start 2P", monospace';

  return (
    <div style={{ position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.88)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999 }}
      onClick={(e) => { if (e.target === e.currentTarget && !loading) onClose(); }}>
      <div style={{ background:'#091E2A', border:'2px solid #144B63', borderRadius:'4px', width: audit ? '680px' : '480px', maxWidth:'95vw', maxHeight:'90vh', display:'flex', flexDirection:'column', fontFamily: pf, transition:'width 0.3s' }}
        onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 16px 10px', borderBottom:'1px solid #144B63' }}>
          <div style={{ fontSize:'8px', color:'#F08D34', display:'flex', alignItems:'center', gap:'6px' }}>
            <span style={{ fontSize:'12px' }}>📊</span> PAGE CONTENT AUDIT
          </div>
          <button onClick={onClose} style={{ background:'none', border:'1px solid #444', color:'#999', fontFamily:pf, fontSize:'6px', cursor:'pointer', padding:'3px 6px', borderRadius:'2px' }}>ESC</button>
        </div>

        <div style={{ padding:'16px', overflowY:'auto', flex:1 }} ref={resultsRef}>
          {/* Input Form */}
          {!audit && (<>
            <div style={{ fontSize:'5px', color:'#999', lineHeight:'1.8', marginBottom:'14px' }}>
              Run a full E-E-A-T content quality analysis on any URL.<br/>Powered by Claude AI. Results in ~15-25 seconds.
            </div>
            <label style={{ fontSize:'5px', color:'#2EC4F3', display:'block', marginBottom:'6px' }}>TARGET URL</label>
            <div style={{ display:'flex', alignItems:'center', background:'#0A1E2A', border:'1.6px solid #1A4B63', borderRadius:'3px', padding:'2px' }}>
              <span style={{ fontSize:'6px', color:'#2EC4F3', padding:'4px 6px', opacity:0.6 }}>{'>'}</span>
              <input ref={inputRef} style={{ flex:1, background:'transparent', border:'none', outline:'none', color:'#F0F4F7', fontFamily:pf, fontSize:'6px', padding:'6px 4px' }}
                type="text" value={url} onChange={(e) => { setUrl(e.target.value); setError(''); }} onKeyDown={handleKeyDown}
                placeholder="https://example.com/page" disabled={loading} />
            </div>
            {error && <div style={{ fontSize:'5px', color:'#D34F2D', marginTop:'8px' }}>⚠ {error}</div>}
            {loading ? (
              <div style={{ fontSize:'5px', color:'#2EC4F3', textAlign:'center', padding:'24px 0' }}>
                <div style={{ marginBottom:'8px' }}>⏳ {progress}</div>
                <div style={{ height:'3px', background:'#144B63', borderRadius:'2px', overflow:'hidden' }}>
                  <div style={{ height:'100%', background:'#2EC4F3', borderRadius:'2px', animation:'auditPulse 2s ease-in-out infinite', width:'60%' }} />
                </div>
                <style>{`@keyframes auditPulse{0%,100%{opacity:.4;width:30%}50%{opacity:1;width:80%}}`}</style>
              </div>
            ) : (
              <button onClick={runAudit} disabled={!url.trim()} style={{ fontFamily:pf, fontSize:'6px', padding:'8px 16px', border:'none', borderRadius:'3px', cursor:'pointer', marginTop:'12px', background:'#F08D34', color:'#1a1a1a', width:'100%', opacity: url.trim() ? 1 : 0.4 }}>RUN AUDIT</button>
            )}
            {!loading && (
              <div style={{ background:'rgba(46,196,243,0.05)', border:'1px solid rgba(46,196,243,0.15)', borderRadius:'3px', padding:'10px 12px', marginTop:'14px' }}>
                <div style={{ fontSize:'5px', color:'#2EC4F3', marginBottom:'6px' }}>AUDIT INCLUDES:</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'3px 12px', fontSize:'4.5px', color:'rgba(240,244,247,0.5)' }}>
                  {['E-E-A-T scoring','Content metrics','On-page SEO','AI citation readiness','Image alt analysis','Heading hierarchy','Structured data','Priority actions'].map(item =>
                    <span key={item}><span style={{ color:'rgba(46,196,243,0.3)', marginRight:'3px' }}>{'>'}</span>{item}</span>
                  )}
                </div>
              </div>
            )}
          </>)}

          {/* Results */}
          {audit && (
            <div style={{ fontSize:'5px', color:'#F0F4F7', lineHeight:'1.7' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'14px' }}>
                <button onClick={() => setAudit(null)} style={{ background:'none', border:'1px solid #144B63', color:'#2EC4F3', fontFamily:pf, fontSize:'5px', cursor:'pointer', padding:'3px 8px', borderRadius:'2px' }}>← NEW AUDIT</button>
                <button onClick={downloadReport} style={{ background:'none', border:'1px solid #7a4520', color:'#F08D34', fontFamily:pf, fontSize:'5px', cursor:'pointer', padding:'3px 8px', borderRadius:'2px' }}>⬇ DOWNLOAD REPORT</button>
              </div>
              <div style={{ color:'#999', marginBottom:'4px' }}>URL: <span style={{ color:'#2EC4F3' }}>{audit.url}</span></div>
              <div style={{ color:'#999', marginBottom:'12px' }}>{audit.pageType} · {audit.industry}</div>

              <div style={{ display:'flex', justifyContent:'center', gap:'20px', margin:'16px 0 20px' }}>
                <ScoreGauge score={audit.contentQualityScore} label="CONTENT" />
                <ScoreGauge score={audit.aiCitationReadiness} label="AI CITATION" />
                <ScoreGauge score={audit.eeat?.overall||0} label="E-E-A-T" />
              </div>

              <div style={{ color:'#0047AB', fontSize:'7px', fontWeight:'bold', margin:'16px 0 8px' }}>// E-E-A-T BREAKDOWN</div>
              {['experience','expertise','authoritativeness','trustworthiness'].map(factor => {
                const d = audit.eeat?.[factor]; if (!d) return null;
                const pct = (d.score/25)*100;
                const color = pct>=70?'#20C997':pct>=50?'#F7CC76':pct>=30?'#F08D34':'#D34F2D';
                return (<div key={factor} style={{ marginBottom:'8px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'2px' }}><span style={{ textTransform:'capitalize' }}>{factor}</span><span style={{ color }}>{d.score}/25</span></div>
                  <div style={{ height:'4px', background:'#162240', borderRadius:'2px', overflow:'hidden', marginBottom:'2px' }}><div style={{ height:'100%', width:`${pct}%`, background:color, borderRadius:'2px' }} /></div>
                  <div style={{ color:'#777', fontSize:'4.5px' }}>{d.signals}</div>
                </div>);
              })}

              <div style={{ color:'#0047AB', fontSize:'7px', fontWeight:'bold', margin:'16px 0 8px' }}>// ON-PAGE SEO</div>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'5px' }}>
                <thead><tr style={{ background:'#0047AB' }}><th style={{ padding:'4px 6px', textAlign:'left', color:'#fff' }}>Element</th><th style={{ padding:'4px 6px', textAlign:'left', color:'#fff' }}>Value</th><th style={{ padding:'4px 6px', textAlign:'left', color:'#fff' }}>Status</th></tr></thead>
                <tbody>
                  {[['Title',`${(audit.title?.value||'').substring(0,50)}... (${audit.title?.length||0}c)`,audit.title?.status],['Meta Desc',`${(audit.metaDescription?.value||'').substring(0,50)}... (${audit.metaDescription?.length||0}c)`,audit.metaDescription?.status],['H1',audit.h1?.value,audit.h1?.status],['Canonical',(audit.canonical?.value||'').substring(0,50),audit.canonical?.status],['Schema',`${audit.schema?.count||0} LD+JSON`,audit.schema?.status],['Hreflang',`${audit.hreflang?.count||0} tags`,audit.hreflang?.status],['OG Tags',audit.ogUrl?.note||'',audit.ogUrl?.status]].map(([el,val,status],i) =>
                    <tr key={el} style={{ background:i%2===0?'#0C1526':'transparent' }}><td style={{ padding:'4px 6px', fontWeight:'bold' }}>{el}</td><td style={{ padding:'4px 6px', color:'#ccc' }}>{val}</td><td style={{ padding:'4px 6px' }}>{status && <StatusBadge status={status}/>}</td></tr>
                  )}
                </tbody>
              </table>

              <div style={{ color:'#0047AB', fontSize:'7px', fontWeight:'bold', margin:'16px 0 8px' }}>// ISSUES ({(audit.issues||[]).length})</div>
              {(audit.issues||[]).map((issue,i) => <div key={i} style={{ display:'flex', gap:'8px', padding:'5px 0', borderBottom:'1px solid #162240', alignItems:'flex-start' }}>
                <div style={{ minWidth:'50px' }}><PriorityBadge priority={issue.priority}/></div>
                <div style={{ flex:1, color:'#ccc' }}>{issue.issue}</div>
                <div style={{ color:'#666', minWidth:'45px', textAlign:'right' }}>{issue.category}</div>
              </div>)}

              <div style={{ color:'#0047AB', fontSize:'7px', fontWeight:'bold', margin:'16px 0 8px' }}>// RECOMMENDATIONS</div>
              {(audit.recommendations||[]).map((rec,i) => <div key={i} style={{ padding:'8px', marginBottom:'6px', background:'#0C1526', borderLeft:`2px solid ${PRIORITY_COLORS[rec.priority]||'#444'}`, borderRadius:'2px' }}>
                <div style={{ display:'flex', gap:'6px', alignItems:'center', marginBottom:'3px' }}><PriorityBadge priority={rec.priority}/><span style={{ color:'#F0F4F7', fontWeight:'bold' }}>{rec.title}</span></div>
                <div style={{ color:'#999' }}>{rec.description}</div>
              </div>)}

              <div style={{ color:'#0047AB', fontSize:'7px', fontWeight:'bold', margin:'16px 0 8px' }}>// SUMMARY</div>
              <div style={{ background:'#0C1526', border:'1px solid #222', borderRadius:'3px', padding:'10px', color:'#ccc', lineHeight:'2' }}>{audit.summary}</div>

              {audit._meta && <div style={{ color:'#444', fontSize:'4px', marginTop:'12px', textAlign:'right' }}>{audit._meta.model} · {audit._meta.inputTokens?.toLocaleString()} in / {audit._meta.outputTokens?.toLocaleString()} out · {audit._meta.analysedAt?.split('T')[0]}</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
