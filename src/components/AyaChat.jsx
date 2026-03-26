import React, { useState, useRef, useEffect } from 'react';

export default function AyaChat({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const messagesRef = useRef(null);
  const pf = '"Press Start 2P", monospace';

  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 100); }, []);
  useEffect(() => {
    if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messages, loading]);

  const ask = async () => {
    const q = input.trim();
    if (!q || loading) return;

    const userMsg = { role: 'user', text: q, time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Build context from last 3 Q&A pairs
    const recent = messages.slice(-6);
    const context = recent.map(m => `${m.role === 'user' ? 'Q' : 'A'}: ${m.text}`).join('\n');

    const retryDelays = [0, 15000, 25000, 35000];

    for (let attempt = 0; attempt < retryDelays.length; attempt++) {
      if (attempt > 0) {
        const waitSec = retryDelays[attempt] / 1000;
        const retryMsgId = Date.now();
        setMessages(prev => [...prev, { role: 'aya', text: `Request failed — auto-retrying in ${waitSec}s (attempt ${attempt + 1}/3)...`, time: new Date(), id: retryMsgId, retrying: true }]);
        for (let sec = waitSec; sec > 0; sec--) {
          setMessages(prev => prev.map(m => m.id === retryMsgId ? { ...m, text: `Request failed — auto-retrying in ${sec}s (attempt ${attempt + 1}/3)...` } : m));
          await new Promise(r => setTimeout(r, 1000));
        }
        setMessages(prev => prev.filter(m => m.id !== retryMsgId));
      }

      try {
        const { backendFetch } = await import('../backendConfig.js');
        const res = await backendFetch('/api/aya/chat', {
          body: { message: q, history: messages.slice(-20).map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text })) },
        });
        const data = await res.json();

        // Rate limited / server busy — retry
        if (data.error && (data.error.toLowerCase().includes('rate limit') || data.error.includes('429') || data.error.includes('busy') || data.error.includes('503') || data.error.includes('unavailable'))) {
          if (attempt < retryDelays.length - 1) continue;
          setMessages(prev => [...prev, { role: 'aya', text: 'Service busy after 3 retries. Please wait a minute and try again.', time: new Date(), error: true }]);
          break;
        }

        // Other error — show it, don't retry
        if (data.error) {
          setMessages(prev => [...prev, { role: 'aya', text: `Error: ${data.error}`, time: new Date(), error: true }]);
        } else {
          setMessages(prev => [...prev, { role: 'aya', text: data.reply || data.answer, time: new Date(), meta: data._meta || data.usage }]);
        }
        break;
      } catch (e) {
        // Network error (timeout, crash) — retry
        console.error(`AYA attempt ${attempt + 1} failed:`, e.message);
        if (attempt < retryDelays.length - 1) continue;
        setMessages(prev => [...prev, { role: 'aya', text: 'Unable to reach AAA after 3 attempts. The server may be overloaded — please try again shortly.', time: new Date(), error: true }]);
        break;
      }
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !loading) { e.preventDefault(); ask(); }
    if (e.key === 'Escape') onClose();
  };

  // Simple markdown-ish rendering: bold, code, line breaks
  const renderText = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => {
      const parts = line.split(/(\*\*.*?\*\*|`[^`]+`)/g).map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j} style={{ color: '#2EC4F3' }}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return <code key={j} style={{ background: '#162240', padding: '1px 4px', borderRadius: '3px', color: '#F7CC76', fontSize: '11px' }}>{part.slice(1, -1)}</code>;
        }
        return part;
      });
      return <div key={i} style={{ minHeight: line === '' ? '8px' : 'auto' }}>{parts}</div>;
    });
  };

  // Export helpers
  const exportResponse = (text, format) => {
    const timestamp = new Date().toISOString().slice(0, 10);
    const title = `AAA-response-${timestamp}`;
    let content, mimeType, ext;

    switch (format) {
      case 'txt':
        content = text;
        mimeType = 'text/plain';
        ext = 'txt';
        break;
      case 'md':
        content = `# AAA Response\n\n_Generated ${new Date().toLocaleString()}_\n\n---\n\n${text}`;
        mimeType = 'text/markdown';
        ext = 'md';
        break;
      case 'html':
        content = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title><style>body{font-family:'Segoe UI',sans-serif;max-width:800px;margin:40px auto;padding:20px;line-height:1.7;color:#222}h1{color:#0047AB;border-bottom:2px solid #0047AB;padding-bottom:8px}pre,code{background:#f4f4f4;padding:2px 6px;border-radius:3px;font-size:14px}.meta{color:#888;font-size:12px;margin-bottom:20px}</style></head><body><h1>AAA Response</h1><div class="meta">Generated ${new Date().toLocaleString()}</div><div>${text.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code>$1</code>')}</div></body></html>`;
        mimeType = 'text/html';
        ext = 'html';
        break;
      case 'pdf': {
        // Generate a printable HTML and trigger print-to-PDF
        const printWin = window.open('', '_blank');
        printWin.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title><style>body{font-family:'Segoe UI',sans-serif;max-width:700px;margin:30px auto;padding:20px;line-height:1.7;color:#222;font-size:13px}h1{color:#0047AB;font-size:18px;border-bottom:2px solid #0047AB;padding-bottom:6px}pre,code{background:#f4f4f4;padding:2px 6px;border-radius:3px}.meta{color:#888;font-size:11px;margin-bottom:16px}@media print{body{margin:0;padding:15px}}</style></head><body><h1>AAA Response</h1><div class="meta">Generated ${new Date().toLocaleString()}</div><div>${text.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code>$1</code>')}</div></body></html>`);
        printWin.document.close();
        setTimeout(() => printWin.print(), 500);
        return;
      }
      case 'docx': {
        // Create a simple DOCX-compatible HTML blob that Word can open
        const docHtml = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><style>body{font-family:'Calibri',sans-serif;font-size:11pt;line-height:1.6}h1{color:#0047AB;font-size:16pt;border-bottom:1pt solid #0047AB;padding-bottom:4pt}</style></head><body><h1>AAA Response</h1><p style="color:gray;font-size:9pt">Generated ${new Date().toLocaleString()}</p><hr/>${text.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code>$1</code>')}</body></html>`;
        content = docHtml;
        mimeType = 'application/vnd.ms-word';
        ext = 'doc';
        break;
      }
      default: return;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const ExportBar = ({ text }) => {
    const formats = [
      { label: 'PDF', fmt: 'pdf' },
      { label: 'DOCX', fmt: 'docx' },
      { label: 'MD', fmt: 'md' },
      { label: 'HTML', fmt: 'html' },
      { label: 'TXT', fmt: 'txt' },
    ];
    return (
      <div style={{ display: 'flex', gap: '4px', marginTop: '6px', flexWrap: 'wrap' }}>
        {formats.map(f => (
          <button key={f.fmt} onClick={() => exportResponse(text, f.fmt)} style={{
            fontFamily: pf, fontSize: '6px', padding: '3px 8px', border: '1px solid #1A4B63',
            background: '#0A1628', color: '#2EC4F3', borderRadius: '3px', cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseOver={e => { e.target.style.background = '#144B63'; e.target.style.borderColor = '#2EC4F3'; }}
          onMouseOut={e => { e.target.style.background = '#0A1628'; e.target.style.borderColor = '#1A4B63'; }}
          >{f.label}</button>
        ))}
      </div>
    );
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
    }} onClick={(e) => { if (e.target === e.currentTarget && !loading) onClose(); }}>
      <div style={{
        background: '#091E2A', border: '2px solid #144B63', borderRadius: '12px',
        width: '680px', maxWidth: '95vw', height: '80vh', maxHeight: '700px',
        display: 'flex', flexDirection: 'column', fontFamily: pf,
      }} onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '16px 20px 14px', borderBottom: '1px solid #144B63',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>💬</span>
            <div>
              <div style={{ fontSize: '12px', color: '#2EC4F3', letterSpacing: '2px' }}>AAA</div>
              <div style={{ fontSize: '7px', color: '#666', marginTop: '2px' }}>Ask Ayima Anything</div>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: '1px solid #444', color: '#999',
            fontFamily: pf, fontSize: '8px', cursor: 'pointer', padding: '4px 8px', borderRadius: '4px',
          }}>ESC</button>
        </div>

        {/* Messages */}
        <div ref={messagesRef} style={{
          flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px',
        }}>
          {messages.length === 0 && !loading && (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: '28px', marginBottom: '12px' }}>💬</div>
              <div style={{ fontSize: '10px', color: '#2EC4F3', marginBottom: '8px' }}>Ask Ayima Anything</div>
              <div style={{ fontSize: '8px', color: '#666', lineHeight: '2', maxWidth: '360px', margin: '0 auto' }}>
                Ask any SEO question — technical, strategy, content, schema, international, AI search, algorithm updates, or anything else.
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center', marginTop: '16px' }}>
                {[
                  'How do I fix crawl budget waste?',
                  'What changed in the March 2025 core update?',
                  'Best hreflang implementation method?',
                  'How to optimise for AI Overviews?',
                ].map(q => (
                  <button key={q} onClick={() => { setInput(q); setTimeout(() => inputRef.current?.focus(), 50); }}
                    style={{
                      fontFamily: pf, fontSize: '7px', padding: '6px 10px', background: '#0C1526',
                      border: '1px solid #1A2A3A', color: '#888', borderRadius: '4px', cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseOver={e => { e.target.style.borderColor = '#2EC4F3'; e.target.style.color = '#2EC4F3'; }}
                    onMouseOut={e => { e.target.style.borderColor = '#1A2A3A'; e.target.style.color = '#888'; }}
                  >{q}</button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} style={{
              display: 'flex', flexDirection: 'column',
              alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
            }}>
              <div style={{
                maxWidth: '85%', padding: '10px 14px', borderRadius: '8px',
                background: msg.role === 'user' ? '#0047AB' : msg.error ? '#2a1015' : '#0C1526',
                border: `1px solid ${msg.role === 'user' ? '#0055CC' : msg.error ? '#D34F2D33' : '#1A2A3A'}`,
                color: msg.error ? '#D34F2D' : '#ddd',
                fontSize: '11px', lineHeight: '1.8',
                fontFamily: msg.role === 'user' ? pf : "'Consolas', 'Courier New', monospace",
              }}>
                {msg.role === 'user' ? msg.text : renderText(msg.text)}
              </div>
              <div style={{ fontSize: '6px', color: '#444', marginTop: '3px', fontFamily: pf }}>
                {msg.role === 'user' ? 'You' : 'AAA'}
                {' · '}
                {msg.time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </div>
              {msg.role === 'aya' && !msg.error && !msg.retrying && <ExportBar text={msg.text} />}
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <div style={{
                padding: '10px 14px', borderRadius: '8px', background: '#0C1526',
                border: '1px solid #1A2A3A', display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                <span style={{ fontSize: '10px', animation: 'ayaDot 1s ease-in-out infinite' }}>●</span>
                <span style={{ fontSize: '10px', animation: 'ayaDot 1s ease-in-out 0.2s infinite' }}>●</span>
                <span style={{ fontSize: '10px', animation: 'ayaDot 1s ease-in-out 0.4s infinite' }}>●</span>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div style={{
          padding: '12px 16px', borderTop: '1px solid #144B63',
          display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center',
            background: '#0A1628', border: '1.5px solid #1A4B63', borderRadius: '6px', padding: '2px',
          }}>
            <span style={{ fontSize: '10px', color: '#2EC4F3', padding: '6px 8px', opacity: 0.5 }}>{'>'}</span>
            <input
              ref={inputRef}
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                color: '#F0F4F7', fontFamily: pf, fontSize: '10px', padding: '10px 6px',
              }}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask any SEO question..."
              disabled={loading}
            />
          </div>
          <button
            onClick={ask}
            disabled={!input.trim() || loading}
            style={{
              fontFamily: pf, fontSize: '9px', padding: '12px 16px', border: 'none', borderRadius: '6px',
              cursor: 'pointer', background: '#2EC4F3', color: '#0A1E2A', fontWeight: 'bold',
              opacity: input.trim() && !loading ? 1 : 0.4,
              transition: 'opacity 0.2s',
            }}
          >ASK</button>
        </div>

        <style>{`
          @keyframes ayaDot {
            0%, 100% { opacity: 0.2; color: #555; }
            50% { opacity: 1; color: #2EC4F3; }
          }
        `}</style>
      </div>
    </div>
  );
}
